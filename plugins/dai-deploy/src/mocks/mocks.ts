import {
  DeploymentActiveData,
  DeploymentArchiveData,
} from '@digital-ai/plugin-dai-deploy-common';
import { Entity } from '@backstage/catalog-model';

export const entityStub: { entity: Entity } = {
  entity: {
    metadata: {
      namespace: 'default',
      annotations: {},
      name: 'sample-service',
      description: 'Sample service',
      uid: 'g0h33dd9-56h7-835b-b63v-7x5da3j64851',
    },
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    spec: {
      type: 'service',
      lifecycle: 'experimental',
    },
    relations: [],
  },
};

export const currentDeploymentResponse: {
  deploymentStatus: DeploymentActiveData[];
  totalCount: number;
} = {
  deploymentStatus: [
    {
      owner: 'admin',
      state: 'QUEUED',
      metadata: {
        version: '1.0',
        environment: 'localhost-env-1',
        application: 'cmd-app',
        taskType: 'INITIAL',
      },
      detailsRedirectUri:
        'http://localhost:4516/#/explorer?taskId=f851134a-020f-42fc-ae30-daf58cf34ea4',
      environmentRedirectUri:
        'http://localhost:4516/#/explorer?ciId=Environments/localhost-env-1',
    },
    {
      owner: 'doe',
      state: 'EXECUTED',
      startDate: '2024-02-15T05:19:41.897+0000',
      completionDate: '2024-02-15T06:19:42.552+0000',
      metadata: {
        version: '1.0',
        environment: 'localhost-env',
        taskType: 'UPDATE',
        application: 'D-32171',
      },
      detailsRedirectUri:
        'http://localhost:4516/#/explorer?taskId=5473142b-5234-43ce-a083-e3dcfc929d72',
      environmentRedirectUri:
        'http://localhost:4516/#/explorer?ciId=Environments/localhost-env',
    },
  ],
  totalCount: 100,
};

export const deploymentHistoryResponse: {
  deploymentStatus: DeploymentArchiveData[];
  totalCount: number;
} = {
  deploymentStatus: [
    {
      package: 'Commandls/1.0',
      environment: 'My/test/testenv',
      type: 'Undeployment',
      owner: 'admin',
      state: 'DONE',
      startDate: '2024-02-23T09:27:14.277+0000',
      completionDate: '2024-02-24T09:27:14.414+0000',
      detailsRedirectUri:
        'http://localhost:4516/#/reports/deployments?taskId=d140e4e0-7051-42bf-b39e-7e1f18e73f7b',
      environmentRedirectUri:
        'http://localhost:4516/#/explorer?ciId=Environments%2FMy%2Fstage%2Ftestenv',
    },
  ],
  totalCount: 100,
};
