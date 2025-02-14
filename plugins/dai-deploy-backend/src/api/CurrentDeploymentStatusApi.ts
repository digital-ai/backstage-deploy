import {
  CURRENT_DEPLOYMENT_STATUS_API_PATH,
  getCredentials,
  getCurrentTaskDetailsRedirectUri,
  getDeployApiHost,
  getEnvironmentRedirectUri,
} from './apiConfig';
import {
  CurrentDeploymentStatus,
  DeploymentActiveData,
  DeploymentStatusResponse,
} from '@digital-ai/plugin-dai-deploy-common';
import { Config } from '@backstage/config';
import { RootLoggerService } from "@backstage/backend-plugin-api";
import { parseErrorResponse } from './responseUtil';

export class CurrentDeploymentStatusApi {
  private readonly logger: RootLoggerService;
  private readonly config: Config;

  private constructor(logger: RootLoggerService, config: Config) {
    this.logger = logger;
    this.config = config;
  }

  static fromConfig(config: Config, logger: RootLoggerService) {
    return new CurrentDeploymentStatusApi(logger, config);
  }

  async getCurrentDeploymentStatus(
    appName: string,
    beginDate: string,
    endDate: string,
    order: string,
    pageNumber: string,
    resultsPerPage: string,
    taskSet: string,
  ): Promise<DeploymentStatusResponse> {
    this.logger?.debug(
      `Calling Current deployment status api, start from: ${beginDate} to: ${endDate}, in order of ${order}`,
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
      `${apiUrl}${CURRENT_DEPLOYMENT_STATUS_API_PATH}?begin=${beginDate}&end=${endDate}
        &order=${order}&page=${pageNumber}&resultsPerPage=${resultsPerPage}&taskSet=${taskSet}`,
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
    const data: CurrentDeploymentStatus[] = await response.json(); // deploy api

    const deploymentActiveData: DeploymentActiveData[] = [];
    data.forEach(d =>
      deploymentActiveData.push({
        owner: d.owner,
        state: d.state,
        startDate: d.startDate,
        completionDate: d.completionDate,
        metadata: {
          version: d.metadata.version,
          environment: d.metadata.environment,
          application: d.metadata.application,
          taskType: d.metadata.taskType,
        },
        scheduledDate: d.scheduledDate,
        detailsRedirectUri: getCurrentTaskDetailsRedirectUri(this.config, d.id),
        environmentRedirectUri: getEnvironmentRedirectUri(
          this.config,
          d.metadata.environment_id,
        ),
      }),
    );
    return {
      deploymentStatus: deploymentActiveData,
      totalCount: Number(response.headers.get('X-Total-Count')),
    };
  }
}
