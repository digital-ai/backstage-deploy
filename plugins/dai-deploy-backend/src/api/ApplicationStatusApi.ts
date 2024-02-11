import {Logger} from "winston";
import {Config} from "@backstage/config";
import {DEPLOYED_APPLICATION_API_PATH, getCredentials, getDeployApiHost} from "./apiConfig";
import {deploymentProps} from "@digital-ai/plugin-dai-deploy-common";

/** @public */
export class ApplicationStatusApi {
    private readonly logger: Logger;
    private readonly config: Config;

    private constructor(
        logger: Logger,
        config: Config,
    ) {
        this.logger = logger;
        this.config = config;
    }

    static fromConfig(
        config: Config,
        logger: Logger,
    ) {
        return new ApplicationStatusApi(
            logger,
            config,
        );
    }

    async getApplicationDeploymentInfo(appName?: string): Promise<deploymentProps[]> {
        const base64Credentials = getCredentials(this.config);
        const apiUrl = getDeployApiHost(this.config);

        const response = await fetch(`${apiUrl}${DEPLOYED_APPLICATION_API_PATH}?deployedAppName=${appName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            }
        });
        this.logger?.info(`deploy api url ${apiUrl}`);
        if (!response.ok) {
            if (response.status === 404) {
                return  await response.json();
            }
            throw new Error(
                `failed to fetch data, status ${response.status}: ${response.statusText}`,
            );
        }
        return response.json();
    }
}
