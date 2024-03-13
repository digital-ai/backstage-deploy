import {
  AuthenticationError,
  NotAllowedError,
  NotFoundError,
  ServiceUnavailableError,
  parseErrorResponseBody,
} from '@backstage/errors';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { beginDateFormat, endDateFormat } from './utils';
import { DaiDeployApi } from './DaiDeployApi';
import { DeploymentStatusResponse } from '@digital-ai/plugin-dai-deploy-common';

import moment from 'moment';
import { parseEntityRef } from '@backstage/catalog-model';

export class DaiDeployApiClient implements DaiDeployApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  public constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  private async getToken() {
    const { token } = await this.identityApi.getCredentials();
    return token;
  }

  async getCurrentDeployments(
    ciId: string,
    page: number,
    rowsPerPage: number,
    orderBy: string,
    orderDirection: string,
    entity: string,
  ): Promise<{ items: DeploymentStatusResponse }> {
    const queryString = new URLSearchParams();
    const now = new Date();
    const order = `${orderBy}:${orderDirection}`;
    const entityRef = parseEntityRef(entity);
    queryString.append('appName', ciId);
    queryString.append(
      'beginDate',
      moment(now).subtract(7, 'days').format(beginDateFormat),
    );
    queryString.append('endDate', moment(now).format(endDateFormat));
    queryString.append('order', order);
    queryString.append('pageNumber', (page + 1).toString());
    queryString.append('resultsPerPage', rowsPerPage.toString());
    queryString.append('taskSet', 'ALL');

    const urlSegment = `deployment-status/${encodeURIComponent(entityRef.namespace)}/${encodeURIComponent(
      entityRef.kind,
    )}/${encodeURIComponent(entityRef.name)}?${queryString}`;
    const items = await this.get<DeploymentStatusResponse>(urlSegment);
    return { items };
  }

  async getDeploymentsReports(
    ciId: string,
    page: number,
    rowsPerPage: number,
    orderBy: string,
    orderDirection: string,
    entity: string,
  ): Promise<{ items: DeploymentStatusResponse }> {
    const queryString = new URLSearchParams();
    const order = `${orderBy}:${orderDirection}`;
    const now = new Date();
    const entityRef = parseEntityRef(entity);
    queryString.append('appName', ciId);
    queryString.append(
      'beginDate',
      moment(now).subtract(7, 'days').format(beginDateFormat),
    );
    queryString.append('endDate', moment(now).format(endDateFormat));
    queryString.append('order', order);
    queryString.append('pageNumber', (page + 1).toString());
    queryString.append('resultsPerPage', rowsPerPage.toString());

    const urlSegment = `deployment-history/${encodeURIComponent(entityRef.namespace)}/${encodeURIComponent(
      entityRef.kind,
    )}/${encodeURIComponent(entityRef.name)}?${queryString}`;
    const items = await this.get<DeploymentStatusResponse>(urlSegment);
    return { items };
  }

  private async get<T>(path: string): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('dai-deploy')}/`;
    const url = new URL(path, baseUrl);
    const idToken = await this.getToken();
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      const data = await parseErrorResponseBody(response);
      if (response.status === 401) {
        throw new AuthenticationError(data.error.message);
      } else if (response.status === 403) {
        throw new NotAllowedError(data.error.message);
      } else if (response.status === 404) {
        throw new NotFoundError(data.error.message);
      } else if (response.status === 500) {
        throw new ServiceUnavailableError(`Deploy Service Unavailable`);
      }
      throw new Error(
        `Unexpected error: failed to fetch data, status ${response.status}: ${response.statusText}`,
      );
    }

    return (await response.json()) as Promise<T>;
  }
}
