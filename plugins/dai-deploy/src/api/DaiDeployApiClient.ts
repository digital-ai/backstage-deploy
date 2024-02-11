import { DiscoveryApi } from "@backstage/core-plugin-api";
import { DaiDeployApi } from "./DaiDeployApi";
import { ResponseError } from '@backstage/errors';

export class DaiDeployApiClient implements DaiDeployApi {

    private readonly discoveryApi: DiscoveryApi;

    public constructor(options: {
        discoveryApi: DiscoveryApi;
    }) {
        this.discoveryApi = options.discoveryApi;
    }

    async getDeployments(ciId: string): Promise<any> {
        const urlSegment = `deployments/${encodeURIComponent(ciId)}`;
        const items = await this.get<any[]>(urlSegment);
        return { items };
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