import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const daiDeployPlugin = createPlugin({
  id: 'dai-deploy',
  routes: {
    root: rootRouteRef,
  },
});

export const DaiDeployPage = daiDeployPlugin.provide(
  createRoutableExtension({
    name: 'DaiDeployPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
