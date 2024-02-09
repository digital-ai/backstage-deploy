import { createApiRef } from '@backstage/core-plugin-api';

/** @public */
export const daiDeployApiRef = createApiRef<DaiDeployApi>({
    id: 'plugin.dai-deploy.service',
  });

/** @public */  
export interface DaiDeployApi {
    getDeployments(
        ciId: string
    ): Promise<any>;
}  