import { DaiDeployApiClient, daiDeployApiRef } from './api';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { daiDeployEntityDeploymentsContentRouteRef } from './routes';

export const daiDeployPlugin = createPlugin({
  id: 'dai-deploy',
  apis: [
    createApiFactory({
      api: daiDeployApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new DaiDeployApiClient({ discoveryApi, identityApi }),
    }),
  ],
});

export const DaiDeployEntityDeploymentsContent = daiDeployPlugin.provide(
  createRoutableExtension({
    name: 'DaiDeployEntityDeploymentsContent',
    component: () =>
      import('./components/DaiDeployEntityDeploymentsContent').then(
        m => m.DaiDeployEntityDeploymentsContent,
      ),
    mountPoint: daiDeployEntityDeploymentsContentRouteRef,
  }),
);
