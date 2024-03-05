import { beginDateFormat, endDateFormat } from './utils';
import { DaiDeployApi } from './DaiDeployApi';
import { DeploymentStatusResponse } from '@digital-ai/plugin-dai-deploy-common';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import moment from 'moment';

export class DaiDeployApiClient implements DaiDeployApi {
  private readonly discoveryApi: DiscoveryApi;

  public constructor(options: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = options.discoveryApi;
  }

  async getCurrentDeployments(
    ciId: string,
    page: number,
    rowsPerPage: number,
    orderBy: string,
    orderDirection:string
  ): Promise<{ items: DeploymentStatusResponse }> {
    const queryString = new URLSearchParams();
    const now = new Date();
    queryString.append('appName', ciId);
    queryString.append(
      'beginDate',
      moment(now).subtract(7, 'days').format(beginDateFormat),
    );
    queryString.append('endDate', moment(now).format(endDateFormat));
    queryString.append('order', orderBy+':'+orderDirection);
    queryString.append('pageNumber', (page + 1).toString());
    queryString.append('resultsPerPage', rowsPerPage.toString());
    queryString.append('taskSet', 'ALL');

    const urlSegment = `deployment-status?${queryString}`;
    const items = await this.get<DeploymentStatusResponse>(urlSegment);
    return { items };
  }

  async getDeploymentsReports(
    ciId: string,
    page: number,
    rowsPerPage: number,
    orderBy: string,
    orderDirection:string
  ): Promise<{ items: DeploymentStatusResponse }> {
    const queryString = new URLSearchParams();
    const now = new Date();
    queryString.append('appName', ciId);
    queryString.append(
      'beginDate',
      moment(now).subtract(7, 'days').format(beginDateFormat),
    );
    queryString.append('endDate', moment(now).format(endDateFormat));
    queryString.append('order', orderBy+':'+orderDirection);
    queryString.append('pageNumber', (page + 1).toString());
    queryString.append('resultsPerPage', rowsPerPage.toString());

    const urlSegment = `deployment-history?${queryString}`;
    const items = await this.get<DeploymentStatusResponse>(urlSegment);
    return { items };
  }

  private async get<T>(path: string): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('dai-deploy')}/`;
    const url = new URL(path, baseUrl);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return (await response.json()) as Promise<T>;
  }
}
