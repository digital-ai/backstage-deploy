import { DaiDeployApiClient, daiDeployApiRef } from './api';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { daiDeployEntityDeploymentsContentRouteRef } from './routes';

export const daiDeployPlugin = createPlugin({
  id: 'dai-deploy',
  apis: [
    createApiFactory({
      api: daiDeployApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new DaiDeployApiClient({ discoveryApi }),
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
