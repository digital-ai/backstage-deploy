import {Config} from "@backstage/config";

export const DEPLOYED_APPLICATION_API_PATH = '/deployit/application-status/deployed-applications';
export const CURRENT_DEPLOYMENT_STATUS_API_PATH = '/deployit/taskmonitor/deployment';
export const CURRENT_DEPLOYMENT_TASK_DETAILS_REDIRECT_PATH = '/#/explorer?taskId=';

export const getCredentials = (config: Config) => {
    try {
        const username = config.getString('daiDeploy.username');
        const password = config.getString('daiDeploy.password');

        return btoa(`${username}:${password}`);
    } catch (error: unknown) {
        throw new Error(`Error: ${(error as Error).message}`);
    }
}

export const getDeployApiHost = (config: Config): string => {
    try {
        const validHost = config.getString('daiDeploy.host');
        return `${validHost}`;
    } catch (error: unknown) {
        throw new Error(`Error: ${(error as Error).message}`);
    }
}

export const getEncodedQueryVal = (queryString?: string): string => {
    return encodeURIComponent((queryString || queryString == 'undefined') ? queryString : '');
}

export const getCurrentTaskDetailsRedirectUri = (config: Config, taskId: string): string => {
    return `${getDeployApiHost(config)}${CURRENT_DEPLOYMENT_TASK_DETAILS_REDIRECT_PATH}${taskId}`;
}