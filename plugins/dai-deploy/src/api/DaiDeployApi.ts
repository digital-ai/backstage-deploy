import { createApiRef } from '@backstage/core-plugin-api';
import { CurrentDeploymentStatus } from '@digital-ai/plugin-dai-deploy-common';

/** @public */
export const daiDeployApiRef = createApiRef<DaiDeployApi>({
    id: 'plugin.dai-deploy.service',
  });

/** @public */  
export interface DaiDeployApi {
    getDeployments(
        ciId: string
    ): Promise<{ items: CurrentDeploymentStatus[] }>;
}  