import {
  DEPLOYMENT_HISTORY_STATUS_API_PATH,
  getCredentials,
  getDeployApiHost,
  getDeploymentHistoryRedirectUri,
  getEnvironmentRedirectUri,
} from './apiConfig';
import {
  DeploymentArchiveData,
  DeploymentHistoryStatus,
  DeploymentStatusResponse,
} from '@digital-ai/plugin-dai-deploy-common';
import { Config } from '@backstage/config';
import { RootLoggerService } from "@backstage/backend-plugin-api";
import { parseErrorResponse } from './responseUtil';

export class DeploymentHistoryStatusApi {
  private readonly logger: RootLoggerService;
  private readonly config: Config;

  private constructor(logger: RootLoggerService, config: Config) {
    this.logger = logger;
    this.config = config;
  }

  static fromConfig(config: Config, logger: RootLoggerService) {
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
      await parseErrorResponse(this.logger, response);
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
        detailsRedirectUri: getDeploymentHistoryRedirectUri(
          this.config,
          d.taskId,
        ),
        environmentRedirectUri: getEnvironmentRedirectUri(
          this.config,
          d.environmentId,
        ),
      }),
    );

    return {
      deploymentStatus: deploymentArchiveData,
      totalCount: Number(response.headers.get('X-Total-Count')),
    };
  }
}
