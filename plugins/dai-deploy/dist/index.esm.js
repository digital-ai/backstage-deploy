import { createRouteRef, createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

const rootRouteRef = createRouteRef({
  id: "dai-deploy"
});

const daiDeployPlugin = createPlugin({
  id: "dai-deploy",
  routes: {
    root: rootRouteRef
  }
});
const DaiDeployPage = daiDeployPlugin.provide(
  createRoutableExtension({
    name: "DaiDeployPage",
    component: () => import('./esm/index-19e33eb5.esm.js').then((m) => m.ExampleComponent),
    mountPoint: rootRouteRef
  })
);

export { DaiDeployPage, daiDeployPlugin };
//# sourceMappingURL=index.esm.js.map
