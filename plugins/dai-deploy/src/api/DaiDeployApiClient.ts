import { DiscoveryApi } from "@backstage/core-plugin-api";
import { DaiDeployApi } from "./DaiDeployApi";
import { ResponseError } from '@backstage/errors';
import {CurrentDeploymentStatusResponse} from '@digital-ai/plugin-dai-deploy-common';
import moment from "moment";
import { beginDateFormat, endDateFormat } from './utils';

export class DaiDeployApiClient implements DaiDeployApi {

    private readonly discoveryApi: DiscoveryApi;

    public constructor(options: {
        discoveryApi: DiscoveryApi;
    }) {
        this.discoveryApi = options.discoveryApi;
    }

    async getCurrentDeployments(ciId: string, page: number, rowsPerPage: number): Promise<{ items: CurrentDeploymentStatusResponse}> {
        const queryString = new URLSearchParams();
        const now = new Date();
        queryString.append('appName', ciId);
        queryString.append('beginDate', moment(now).subtract(7, 'days').format(beginDateFormat));
        queryString.append('endDate', moment(now).format(endDateFormat));
        queryString.append('order', 'end:desc');
        queryString.append('pageNumber', page === 0 ? '1' : page.toString());
        queryString.append('resultsPerPage', rowsPerPage.toString());
        queryString.append('taskSet', 'ALL');

        const urlSegment = `deployment-status?${queryString}`;
        const items = await this.get<CurrentDeploymentStatusResponse>(urlSegment);
        return {items};
    }

    private async get<T>(path: string): Promise<T> {
        const baseUrl = `${await this.discoveryApi.getBaseUrl('dai-deploy')}/`;
        const url = new URL(path, baseUrl);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
          throw await ResponseError.fromResponse(response);
        }

        return await response.json() as Promise<T>;
    }
}
