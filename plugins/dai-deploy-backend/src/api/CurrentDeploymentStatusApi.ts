import {Logger} from "winston";
import {Config} from "@backstage/config";
import {
    CURRENT_DEPLOYMENT_STATUS_API_PATH,
    getCredentials,
    getCurrentTaskDetailsRedirectUri,
    getDeployApiHost,
} from "./apiConfig";
import {
    CurrentDeploymentStatus,
    CurrentDeploymentStatusResponse
} from "@digital-ai/plugin-dai-deploy-common";

export class CurrentDeploymentStatusApi {
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
        return new CurrentDeploymentStatusApi(
            logger,
            config,
        );
    }

    async getCurrentDeploymentStatus(appName: string, beginDate: string, endDate: string, order: string, pageNumber: string,
                                     resultsPerPage: string, taskSet: string): Promise<CurrentDeploymentStatusResponse> {
        this.logger?.debug(
            `Calling Current deployment status api, start from: ${beginDate} to: ${endDate}, in order of ${order}`,
        );
        const authCredentials = getCredentials(this.config);
        const apiUrl = getDeployApiHost(this.config);

        const requestBody = [{
            "type"  : "udm.Application",
            "id"    : appName
        }];
        const response = await fetch(`${apiUrl}${CURRENT_DEPLOYMENT_STATUS_API_PATH}?begin=${beginDate}&end=${endDate}
        &order=${order}&page=${pageNumber}&resultsPerPage=${resultsPerPage}&taskSet=${taskSet}`, {
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
        const data: CurrentDeploymentStatus[] = await response.json();
        data.forEach(d => d.detailsRedirectUri = getCurrentTaskDetailsRedirectUri(this.config, d.id));
        return { currentDeploymentStatus: data, totalCount: Number(response.headers.get('X-Total-Count'))};
    }
}