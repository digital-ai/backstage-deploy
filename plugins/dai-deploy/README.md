# Digital.ai Deploy Plugin

## Setup

The following sections will help you get the (Digital.ai) Dai Deploy plugin setup and running.

### Dai Deploy Backend

You need to setup the [Dai Deploy backend plugin](https://github.com/digital-ai/backstage-deploy/tree/main/plugins/dai-deploy-backend) before you move forward with any of these steps if you haven't already

### Entity Annotation

To be able to use the Dai Deploy plugin you need to add the following annotation to any entities you want to use it with:

```yaml
dai-deploy/ci-id: <ci-name>
```

`<ci-name>` will be the name of your Application name in deploy.

Here's what that will look like in action:

```yaml
# Example catalog-info.yaml entity definition file
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    dai-deploy/ci-id: 'SatelliteApp'
spec:
  type: service
  # ...
```

### Dai Deploy - Deployment Status Component

To get the Dai Deploy - Deployment Status component working you'll need to do the following two steps:

1. First we need to add the `@digital-ai/plugin-dai-deploy` package to your frontend app:

   ```bash
   # From your Backstage root directory
   yarn --cwd packages/app add @digital-ai/plugin-dai-deploy
   ```

2. Second we need to add the `DaiDeployEntityDeploymentsContent` extension to the entity page in your app. How to do this will depend on which annotation you are using in your entities:

   1. Add the DaiDeployEntityDeploymentsContent in EntityPage:

      ```tsx
      // In packages/app/src/components/catalog/EntityPage.tsx
      import {
        DaiDeployEntityDeploymentsContent
      } from '@digital-ai/plugin-dai-deploy';

      // For example in the CI/CD section
      const cicdContent = (
        <EntitySwitch>
          // ...
          <EntitySwitch.Case>
              <DaiDeployEntityDeploymentsContent />
          </EntitySwitch.Case>
          // ...
        </EntitySwitch>
      ```

**Notes:**

- The `if` prop is optional on the `EntitySwitch.Case`, you can add it if you want to hide deploy content in cicd.
