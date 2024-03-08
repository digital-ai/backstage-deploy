import { DeploymentStatusResponse } from '@digital-ai/plugin-dai-deploy-common';
import { createApiRef } from '@backstage/core-plugin-api';

/** @public */
export const daiDeployApiRef = createApiRef<DaiDeployApi>({
  id: 'plugin.dai-deploy.service',
});

/** @public */
export interface DaiDeployApi {
  getCurrentDeployments(
    ciId: string,
    page: number,
    rowsPerPage: number,
    orderBy: string,
    orderDirection: string,
  ): Promise<{ items: DeploymentStatusResponse }>;

  getDeploymentsReports(
    ciId: string,
    page: number,
    rowsPerPage: number,
    orderBy: string,
    orderDirection: string,
  ): Promise<{ items: DeploymentStatusResponse }>;
}
