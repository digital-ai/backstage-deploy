import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { daiDeployEntityDeploymentsContentRouteRef } from './routes';

export const daiDeployPlugin = createPlugin({
  id: 'dai-deploy',
});

export const DaiDeployEntityDeploymentsContent = daiDeployPlugin.provide(
  createRoutableExtension({
    name: 'DaiDeployEntityDeploymentsContent',
    component: () =>
      import('./components/EntityDeployments').then(m => m.EntityDeployments),
    mountPoint: daiDeployEntityDeploymentsContentRouteRef,
  }),
);
