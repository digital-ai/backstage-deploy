import {Config} from "@backstage/config";

export const DEPLOYED_APPLICATION_API_PATH = '/deployit/application-status/deployed-applications';

export const getCredentials = (config: Config) => {
    try {
        const username = config.getString('daiDeploy.username');
        const password = config.getString('daiDeploy.password');

        return btoa(`${username}:${password}`);
    } catch (error) {
        throw new Error(`${error.message} - Set username and password`);
    }
}

export const getDeployApiHost = (config: Config): string => {
    try {
        const validHost = config.getString('daiDeploy.host');
        return `${validHost}`;
    } catch (error) {
        throw new Error(`${error.message} - Set deploy host`);
    }
}