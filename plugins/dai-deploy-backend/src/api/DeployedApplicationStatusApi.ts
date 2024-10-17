import {
  DEPLOYED_APPLICATION_API_PATH,
  getCredentials,
  getDeployApiHost,
} from './apiConfig';
import { Config } from '@backstage/config';
import { DeployedApplicationStatus } from '@digital-ai/plugin-dai-deploy-common';
import { RootLoggerService } from "@backstage/backend-plugin-api";

/** @public */
export class DeployedApplicationStatusApi {
  private readonly logger: RootLoggerService;
  private readonly config: Config;

  private constructor(logger: RootLoggerService, config: Config) {
    this.logger = logger;
    this.config = config;
  }

  static fromConfig(config: Config, logger: RootLoggerService) {
    return new DeployedApplicationStatusApi(logger, config);
  }

  async getApplicationDeploymentInfo(
    appName?: string,
  ): Promise<DeployedApplicationStatus[]> {
    const authCredentials = getCredentials(this.config);
    const apiUrl = getDeployApiHost(this.config);

    const response = await fetch(
      `${apiUrl}${DEPLOYED_APPLICATION_API_PATH}?deployedAppName=${appName}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${authCredentials}`,
          'Content-Type': 'application/json',
        },
      },
    );
    this.logger?.info(`deploy api url ${apiUrl}`);
    if (!response.ok) {
      if (response.status === 404) {
        return await response.json();
      }
      throw new Error(
        `failed to fetch data, status ${response.status}: ${response.statusText}`,
      );
    }
    return response.json();
  }
}
