# Digital.ai Deploy Plugin

   - Welcome to the Digital.ai (Dai) Deploy plugin for Backstage!
   - With Dai Deploy Plugin you can monitor all your active and archived deployments, the status of deployments, and view the task details of various deployments.

This is a combination of 2 plugins - the frontend and the backend.

## Setup

The following section helps you add the Digital.ai Deploy frontend plugin.

### Prerequisites

You need to set up the [Dai Deploy backend plugin](https://github.com/digital-ai/backstage-deploy/tree/main/plugins/dai-deploy-backend) before you move forward with any of these steps.

### Installing and Configuring the Frontend Plugin

   The frontend plugin needs to be added to your application. To do so:

####   1. Run the following command from the Backstage root directory:
```shell
yarn --cwd packages/app add @digital-ai/plugin-dai-deploy
```

####   2. Add the DaiDeployEntityDeploymentsContent extension to your entity pages:
```tsx
// For example in the CI/CD section
// packages/app/src/components/catalog/EntityPage.tsx
import {
  DaiDeployEntityDeploymentsContent
} from '@digital-ai/plugin-dai-deploy';

const cicdContent = (
  <EntitySwitch>
    // ...
    <EntitySwitch.Case>
        <DaiDeployEntityDeploymentsContent />
    </EntitySwitch.Case>
    // ...
  </EntitySwitch>

// For example to create a new section "Deploy" in entity page
// packages/app/src/components/catalog/EntityPage.tsx
import {
  DaiDeployEntityDeploymentsContent
} from '@digital-ai/plugin-dai-deploy';

const serviceEntityPage = (
  <EntityLayout>
// ...
<EntityLayout.Route path="/deploy" title="Deploy">
      	<DaiDeployEntityDeploymentsContent />
               </EntityLayout.Route>
// ...
  </EntityLayout>

const websiteEntityPage = (
  <EntityLayout>
// ...
<EntityLayout.Route path="/deploy" title="Deploy">
      <DaiDeployEntityDeploymentsContent />
    </EntityLayout.Route>
// ...
  </EntityLayout>
```

####   3. Add an annotation to your catalog-info.yaml files. For example
```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
     dai-deploy/ci-id: '<ci-name>'
spec:
  type: service
  # ...
```
Note: ci-name is your application name in Deploy.


## Links
For more information, see [Overview](https://docs.digital.ai/bundle/devops-deploy-version-v.24.1/page/deploy/concept/xl-deploy-backstage-overview.html) and [Adding Deploy to Your Backstage IDP](https://docs.digital.ai/bundle/devops-deploy-version-v.24.1/page/deploy/concept/xl-deploy-backstage-plugins.html)