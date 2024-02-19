import { createApiFactory, createPlugin, createRoutableExtension, discoveryApiRef } from '@backstage/core-plugin-api';
import { daiDeployEntityDeploymentsContentRouteRef } from './routes';
import { daiDeployApiRef, DaiDeployApiClient } from './api';

export const daiDeployPlugin = createPlugin({
  id: 'dai-deploy',
  apis: [
    createApiFactory({
      api: daiDeployApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) =>
        new DaiDeployApiClient({ discoveryApi }),
    }),
  ],
});

export const DaiDeployEntityDeploymentsContent = daiDeployPlugin.provide(
  createRoutableExtension({
    name: 'DaiDeployEntityDeploymentsContent',
    component: () =>
      import('./components/EntityDeployments').then(m => m.EntityDeployments),
    mountPoint: daiDeployEntityDeploymentsContentRouteRef,
  }),
);
