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
import {AuthService} from "@backstage/backend-plugin-api";

async function getLatestCommitShaFromGitHub(owner: string, repo: string, path: string,branch: string): Promise<string | undefined> {

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${path}&sha=${branch}`;
    console.log(apiUrl)
    const response = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            // Optional: Add Authorization header for higher rate limit
            'Authorization': `Bearer <github_token>`, // Replace with your GitHub token
        },
    });

    if (!response.ok) {
        console.error('Failed to fetch commits', await response.text());
        return undefined;
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
        return data[0].sha; // Most recent commit SHA
    }

    return undefined;
}

export class DeployGitOpsProcessor implements CatalogProcessor {
    private readonly discoveryApi: DiscoveryApi;
    private readonly auth: AuthService;

    public constructor(options: {
        discoveryApi: DiscoveryApi;
        auth: AuthService;
    }) {
        console.log("Inside the constructor of DeployGitOpsProcessor");
        this.discoveryApi = options.discoveryApi;
        this.auth = options.auth;
    }
    getProcessorName(): string {
        return 'DeployGitOpsProcessor';
    }

    async preProcessEntity(
        _entity: Entity,
        _location: LocationSpec,
    ): Promise<Entity> {

        // Log only for kind 'Component' AND location type 'url'
        if (_entity.kind === 'Component' && _location.type === 'url') {
            console.log('🔍 GitOps Candidate Component Entity:', JSON.stringify(_entity, null, 2));
            console.log('🌍 Source Location:', JSON.stringify(_location, null, 2));

            const annotations = _entity.metadata?.annotations;
            if (annotations) {
                const deployYamlUrl = annotations['dai-deploy-yaml/managed-by-location'];
                if (deployYamlUrl) {
                    console.log(`Found deploy YAML annotation: ${deployYamlUrl}`);
                    const [type, value] = deployYamlUrl.split(/:(.+)/);
                    console.log("Type:", type);   // => 'url'
                    console.log("Value:", value); // => 'https://github.com
                    const url = value
                    const repoMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/);
                    if (repoMatch) {
                        const [ ,owner, repo, branch, path] = repoMatch;
                        const latestSha = await getLatestCommitShaFromGitHub(owner, repo, path,branch);

                        if (latestSha) {
                            console.log(`🔢 Latest commit SHA for ${path}: ${latestSha}`);
                            await this.post(`trigger-deploy`, latestSha, _entity.metadata.name, url)
                        }
                    }
                }
            }
        }

        return _entity;
    }


    private async post<T>(path: string, latestSha: string, componentName: string, deployAppUrl: string): Promise<T> {
        const baseUrl = `${await this.discoveryApi.getBaseUrl('dai-deploy')}/`;
        console.log("baseUrl", baseUrl)
        const url = new URL(path, baseUrl);
        console.log("url", url.toString())
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
                throw new ServiceUnavailableError(`Deploy Service Unavailable`);
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
                catalog: catalogProcessingExtensionPoint,
                logger: coreServices.logger,
                discovery: coreServices.discovery,
                auth: coreServices.auth,
            },
            async init({ catalog,logger, discovery, auth }) {               // Check for Azure Blob Storage provider configuration and register it
                logger.info('🔧 Registering DeployGitOpsProcessor...');
                //catalog.addProcessor(new DeployGitOpsProcessor(discovery));
                catalog.addProcessor(new DeployGitOpsProcessor({ discoveryApi: discovery, auth }));

            },
        });
    },
});
backend.add(catalogModuleDaiDeployGitops)


 **/
