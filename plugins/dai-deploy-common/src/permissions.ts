import { createPermission } from '@backstage/plugin-permission-common';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';

/**
 * This permission is used to determine if a user is allowed to view the deploy plugin
 *
 * @public
 */
export const daiDeployViewPermission = createPermission({
  name: 'daiDeploy.view',
  attributes: {
    action: 'update',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/**
 * @public
 */
export const daiDeployViewPermissions = [daiDeployViewPermission];
