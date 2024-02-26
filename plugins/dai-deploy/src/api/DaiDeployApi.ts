import { createApiRef } from '@backstage/core-plugin-api';
import { DeploymentStatusResponse } from '@digital-ai/plugin-dai-deploy-common';

/** @public */
export const daiDeployApiRef = createApiRef<DaiDeployApi>({
    id: 'plugin.dai-deploy.service',
  });

/** @public */
export interface DaiDeployApi {
    getCurrentDeployments(
        ciId: string,
        page: number,
        rowsPerPage: number
    ): Promise<{ items: DeploymentStatusResponse }>;

    getDeploymentsReports(
        ciId: string,
        page: number,
        rowsPerPage: number
    ): Promise<{ items: DeploymentStatusResponse }>;

}