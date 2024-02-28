# Dai Deploy Backend

Simple plugin that will make API requests to [Digital.ai](https://digital.ai/products/deploy/) Deploy

## Setup

The following sections will help you get the (Digital.ai) Dai Deploy Backend plugin setup and running.

### Configuration

The Dai Deploy plugin requires the following YAML to be added to your `app-config.yaml`:

```yaml
daiDeploy:
  host: { HOST } #http://xl-deploy-nightly.xebialabs.com:4516
  username: ${username}
  password: ${password}
```

Configuration Details:

- `host` will be your deploy application host.
- `username` and `password` environment variable must be set, that is your deploy application login. Create an account with read permission and use that.

### Up and Running

Here's how to get the backend up and running:

1. First we need to add the `@digital-ai/plugin-dai-deploy-backend` package to your backend:

   ```sh
   # From your Backstage root directory
   yarn --cwd packages/backend add @digital-ai/plugin-dai-deploy-backend
   ```

2. Then we will create a new file named `packages/backend/src/plugins/dai-deploy.ts`, and add the
   following to it:

   ```ts
   import { createRouter } from '@digital-ai/plugin-dai-deploy-backend';
   import { Router } from 'express';
   import type { PluginEnvironment } from '../types';

   export default function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return createRouter({
       logger: env.logger,
       config: env.config,
     });
   }
   ```

3. Next we wire this into the overall backend router, edit `packages/backend/src/index.ts`:

   ```ts
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

4. Now run `yarn start-backend` from the repo root
5. Finally open `http://localhost:7007/api/dai-deploy/health` in a browser and it should return `{"status":"ok"}`

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
