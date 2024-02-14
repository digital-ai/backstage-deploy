import { DiscoveryApi } from "@backstage/core-plugin-api";
import { DaiDeployApi } from "./DaiDeployApi";
import { ResponseError } from '@backstage/errors';
import { CurrentDeploymentStatusTypes } from '@digital-ai/plugin-dai-deploy-common';

export class DaiDeployApiClient implements DaiDeployApi {

    private readonly discoveryApi: DiscoveryApi;

    public constructor(options: {
        discoveryApi: DiscoveryApi;
    }) {
        this.discoveryApi = options.discoveryApi;
    }

    async getDeployments(ciId: string): Promise<{ items: CurrentDeploymentStatusTypes[]}> {
        const queryString = new URLSearchParams();
        queryString.append('appName', ciId);
        const urlSegment = `deployment-status?${queryString}`;
        const items = await this.get<CurrentDeploymentStatusTypes[]>(urlSegment);
        return {items};
    }

    private async get<T>(path: string): Promise<T> {
        const baseUrl = `${await this.discoveryApi.getBaseUrl('dai-deploy')}/`;
        const url = new URL(path, baseUrl);
    
        const response = await fetch(url.toString(), {
        });
    
        if (!response.ok) {
          throw await ResponseError.fromResponse(response);
        }
    
        return response.json() as Promise<T>;
      }

}