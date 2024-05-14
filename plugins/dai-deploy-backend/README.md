# Dai Deploy Backend

It is a simple plugin that makes API requests to [Digital.ai](https://digital.ai/products/deploy/) Deploy

## Setup

### Installing and Configuring the Backend Plugin

   The backend plugin needs to be added to your application. To do so:

####  1.  Run the following command from the Backstage root directory:
```shell
yarn --cwd packages/backend add @digital-ai/plugin-dai-deploy-backend
```

#### 2. Create plugin file for deploy backend in the packages/backend/src/plugins/ directory.

```ts
// packages/backend/src/plugins/dai-deploy.ts
 
import { createRouter } from '@digital-ai/plugin-dai-deploy-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return createRouter({
    logger: env.logger,
    config: env.config,
    permissions: env.permissions
  });
}
```

#### 3.  Modify your backend router to expose the APIs for deploy backend.
```ts
// packages/backend/src/index.ts

import daiDeploy from './plugins/dai-deploy';
// ...

async function main() {
   // ...
   // Add this line under the other lines that follow the useHotMemoize pattern
   const daiDeployEnv = useHotMemoize(module, () => createEnv('dai-deploy'));
   // ...
   // Insert this line under the other lines that add their routers to apiRouter in the same way
   apiRouter.use('/dai-deploy', await daiDeploy(daiDeployEnv));
```

#### 4. Configure the deploy instance by adding the following to your app-config.yaml files.
```yaml
daiDeploy:
  host: <<deploy-instance-url>> #http://deploy-hostname:4516
  username: ${username}
  password: ${password}
```
Note: username and password must be set as environment variables.

#### 5. Run yarn start-backend from the repo root directory.

#### 6. Finally open http://localhost:7007/api/dai-deploy/health in a browser and returns {"status":"ok"}.

## Links
For more information, see [Overview](https://docs.digital.ai/bundle/devops-deploy-version-v.24.1/page/deploy/concept/xl-deploy-backstage-overview.html) and [Adding Deploy to Your Backstage IDP](https://docs.digital.ai/bundle/devops-deploy-version-v.24.1/page/deploy/concept/xl-deploy-backstage-plugins.html)


#### New Backend System

The Dai Deploy backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';

  const backend = createBackend();

  // ... other feature additions

+ backend.add(import('@digital-ai/plugin-dai-deploy-backend'));

  backend.start();
```
