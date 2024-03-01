import {
    DEPLOYMENT_HISTORY_STATUS_API_PATH,
    getCredentials,
    getDeployApiHost,
    getDeploymentHistoryRedirectUri, getEnvironmentRedirectUri,
} from './apiConfig';
import {
  DeploymentArchiveData,
  DeploymentHistoryStatus,
  DeploymentStatusResponse,
} from '@digital-ai/plugin-dai-deploy-common';
import { Config } from '@backstage/config';
import { Logger } from 'winston';

export class DeploymentHistoryStatusApi {
  private readonly logger: Logger;
  private readonly config: Config;

  private constructor(logger: Logger, config: Config) {
    this.logger = logger;
    this.config = config;
  }

  static fromConfig(config: Config, logger: Logger) {
    return new DeploymentHistoryStatusApi(logger, config);
  }

  async getDeploymentHistoryStatus(
    appName: string,
    beginDate: string,
    endDate: string,
    order: string,
    pageNumber: string,
    resultsPerPage: string,
    taskId: string,
  ): Promise<DeploymentStatusResponse> {
    this.logger?.debug(
      `Calling Deployment History status api, start from: ${beginDate} to: ${endDate}, in order of ${order}`,
    );
    const authCredentials = getCredentials(this.config);
    const apiUrl = getDeployApiHost(this.config);

    const requestBody = [
      {
        type: 'udm.Application',
        id: appName,
      },
    ];
    const response = await fetch(
      `${apiUrl}${DEPLOYMENT_HISTORY_STATUS_API_PATH}?begin=${beginDate}&end=${endDate}
        &order=${order}&page=${pageNumber}&resultsPerPage=${resultsPerPage}&taskId=${taskId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authCredentials}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    );
    if (!response.ok) {
      if (response.status === 404) {
        return await response.json();
      } else if (response.status === 403) {
          throw new Error(
              `failed to fetch data, status ${response.status}: ${await response.text()}`,
          );
        }
      throw new Error(
        `failed to fetch data, status ${response.status}: ${response.statusText}`,
      );
    }
    const data: DeploymentHistoryStatus[] = await response.json();

    const deploymentArchiveData: DeploymentArchiveData[] = [];
    data.forEach(d =>
      deploymentArchiveData.push({
        package: d.package,
        environment: d.environmentIdWithoutRoot,
        type: d.type,
        owner: d.user,
        state: d.status,
        startDate: d.startDate,
        completionDate: d.completionDate,
        environmentId: d.environmentId,
        environmentIdWithoutRoot: d.environmentIdWithoutRoot,
        rolledBack: d.rolledBack,
        worker_name: d.worker_name,
        detailsRedirectUri: getDeploymentHistoryRedirectUri(
          this.config,
          d.taskId,
        ),
        environmentRedirectUri: getEnvironmentRedirectUri(
            this.config,
            d.environmentId)
      }),
    );

    return {
      deploymentStatus: deploymentArchiveData,
      totalCount: Number(response.headers.get('X-Total-Count')),
    };
  }
}
