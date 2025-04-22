import {CatalogProcessor} from '@backstage/plugin-catalog-node';
import {LocationSpec} from '@backstage/plugin-catalog-common';
import {Entity} from "@backstage/catalog-model";
import { DiscoveryApi } from '@backstage/core-plugin-api';
import {
    AuthenticationError,
    NotAllowedError,
    NotFoundError,
    parseErrorResponseBody,
    ServiceUnavailableError
} from "@backstage/errors";
import {AuthService, LoggerService} from "@backstage/backend-plugin-api";
import {Config} from "@backstage/config";

export class DeployGitOpsProcessor implements CatalogProcessor {
    private readonly discoveryApi: DiscoveryApi;
    private readonly auth: AuthService;
    private readonly logger: LoggerService;
    private readonly config: Config

    public constructor(options: {
        discoveryApi: DiscoveryApi;
        auth: AuthService;
        logger: LoggerService
        config: Config
    }) {
        this.discoveryApi = options.discoveryApi;
        this.auth = options.auth;
        this.logger = options.logger
        this.config = options.config
    }
    getProcessorName(): string {
        return 'DeployGitOpsProcessor';
    }

    getGithubToken = () => {
        try {
            return this.config.getConfigArray('integrations.github')[0].getString('token');
        } catch (error: unknown) {
            throw new Error(`Error: ${(error as Error).message}`);
        }
    };

    async preProcessEntity(
        _entity: Entity,
        _location: LocationSpec,
    ): Promise<Entity> {

        // Log only for kind 'Component' AND location type 'url'
        if (_entity.kind === 'Component' && _location.type === 'url') {
            this.logger.debug(`🔍 GitOps Candidate Component Entity: ${JSON.stringify(_entity, null, 2)}`);
            this.logger.debug(`🌍 Source Location: ${JSON.stringify(_location, null, 2)}`);

            const annotations = _entity.metadata?.annotations;
            if (annotations) {
                const deployYamlUrl = annotations['dai-deploy-yaml/managed-by-location'];
                if (deployYamlUrl) {
                    const [, deployUrl] = deployYamlUrl.split(/:(.+)/);
                    this.logger.debug(`Found deploy YAML annotation: ${deployUrl}`);// => 'url'
                    const repoMatch = deployUrl.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/);
                    if (repoMatch) {
                        const [ ,owner, repo, branch, path] = repoMatch;
                        const latestSha = await this.getLatestCommitShaFromGitHub(owner, repo, path,branch);
                        if (latestSha) {
                            this.logger.debug(`🔢 Latest commit SHA for ${path}: ${latestSha}`);
                            this.logger.info("Triggering deployment for latest commit SHA using xl-cli scaffolder action");
                            await this.post(`trigger-deploy`, latestSha, _entity.metadata.name, deployUrl)
                        }
                    } else {
                        this.logger.error(`Invalid GitHub URL format: ${deployUrl}`);
                    }
                } else {
                    this.logger.debug("No deploy YAML annotation found - skipping GitOps processing");
                }
            }
        }

        return _entity;
    }

    private async getLatestCommitShaFromGitHub(owner: string, repo: string, path: string, branch: string): Promise<string | undefined> {

        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${path}&sha=${branch}`;
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                // Optional: Add Authorization header for higher rate limit
                'Authorization': `Bearer ${this.getGithubToken()}`, // Replace with your GitHub token
            },
        });

        if (!response.ok) {
            this.logger.error(`Failed to fetch commits, ${await response.text()}`);
            return undefined;
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            return data[0].sha; // Most recent commit SHA
        }
        return undefined;
    }

    private async post<T>(path: string, latestSha: string, componentName: string, deployAppUrl: string): Promise<T> {
        const baseUrl = `${await this.discoveryApi.getBaseUrl('dai-deploy')}/`;
        const url = new URL(path, baseUrl);
        const { token } = await this.auth.getPluginRequestToken({
            onBehalfOf: await this.auth.getOwnServiceCredentials(),
            targetPluginId: 'dai-deploy',
        });
       // const idToken = await this.getToken();
        const body = JSON.stringify({
            ...(latestSha && { latestSha }),
            ...(componentName && { componentName }),
            ...(deployAppUrl && { deployAppUrl }),
        });
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: body
        });

        if (!response.ok) {
            const data = await parseErrorResponseBody(response);
            if (response.status === 401) {
                throw new AuthenticationError(data.error.message);
            } else if (response.status === 403) {
                throw new NotAllowedError(data.error.message);
            } else if (response.status === 404) {
                throw new NotFoundError(data.error.message);
            } else if (response.status === 500) {
                throw new ServiceUnavailableError(`Service Unavailable`);
            }
            throw new Error(
                `Unexpected error: failed to fetch data, status ${response.status}: ${response.statusText}`,
            );
        }

        return (await response.json()) as Promise<T>;
    }

}

/*
packages/backend/src/index.ts
export const catalogModuleDaiDeployGitops = createBackendModule({
    pluginId: 'catalog',
    moduleId: 'dai-deploy-gitops',
    register(env) {
        env.registerInit({
            deps: {
                config: coreServices.rootConfig,
                logger: coreServices.rootLogger,
                catalog: catalogProcessingExtensionPoint,
                logger: coreServices.logger,
                discovery: coreServices.discovery,
                auth: coreServices.auth,
            },
            async init({ catalog,logger, discovery, auth,logger, config }) {
                logger.info('🔧 Registering DeployGitOpsProcessor...');
                //catalog.addProcessor(new DeployGitOpsProcessor(discovery));
                catalog.addProcessor(new DeployGitOpsProcessor({ discoveryApi: discovery, auth, logger, config }));

            },
        });
    },
});
backend.add(catalogModuleDaiDeployGitops)
**/
