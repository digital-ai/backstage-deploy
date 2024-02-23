import {Logger} from "winston";
import {Config} from "@backstage/config";
import {
    DEPLOYMENT_HISTORY_STATUS_API_PATH,
    getCredentials,
    getDeployApiHost, getDeploymentHistoryRedirectUri,
} from "./apiConfig";
import {
    DeploymentHistoryStatus,
    DeploymentHistoryStatusResponse
} from "@digital-ai/plugin-dai-deploy-common";

export class DeploymentHistoryStatusApi {
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
        return new DeploymentHistoryStatusApi(
            logger,
            config,
        );
    }

    async getDeploymentHistoryStatus(appName: string, beginDate: string, endDate: string, order: string, pageNumber: string,
                                     resultsPerPage: string, taskId: string): Promise<DeploymentHistoryStatusResponse> {
        this.logger?.debug(
            `Calling Deployment History status api, start from: ${beginDate} to: ${endDate}, in order of ${order}`,
        );
        const authCredentials = getCredentials(this.config);
        const apiUrl = getDeployApiHost(this.config);

        const requestBody = [{
            "type"  : "udm.Application",
            "id"    : appName
        }];
        const response = await fetch(`${apiUrl}${DEPLOYMENT_HISTORY_STATUS_API_PATH}?begin=${beginDate}&end=${endDate}
        &order=${order}&page=${pageNumber}&resultsPerPage=${resultsPerPage}&taskId=${taskId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authCredentials}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            if (response.status === 404) {
                return  await response.json();
            }
            throw new Error(
                `failed to fetch data, status ${response.status}: ${response.statusText}`,
            );
        }
        const data: DeploymentHistoryStatus[] = await response.json();
        data.forEach(d => d.detailsRedirectUri = getDeploymentHistoryRedirectUri(this.config, d.taskId));
        return { deploymentHistoryStatus: data, totalCount: Number(response.headers.get('X-Total-Count'))};
    }
}
