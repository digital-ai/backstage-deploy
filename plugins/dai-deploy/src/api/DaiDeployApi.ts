import { createApiRef } from '@backstage/core-plugin-api';
import { CurrentDeploymentStatusTypes } from '@digital-ai/plugin-dai-deploy-common';

/** @public */
export const daiDeployApiRef = createApiRef<DaiDeployApi>({
    id: 'plugin.dai-deploy.service',
  });

/** @public */  
export interface DaiDeployApi {
    getDeployments(
        ciId: string
    ): Promise<{ items: CurrentDeploymentStatusTypes[] }>;
}  