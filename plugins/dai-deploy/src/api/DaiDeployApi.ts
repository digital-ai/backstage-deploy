import { createApiRef } from '@backstage/core-plugin-api';
import { CurrentDeploymentStatusResponse } from '@digital-ai/plugin-dai-deploy-common';

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
    ): Promise<{ items: CurrentDeploymentStatusResponse }>;
}