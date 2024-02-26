import { Entity } from '@backstage/catalog-model';
import {
    DeploymentActiveData,
} from '@digital-ai/plugin-dai-deploy-common';

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

  export const currentDeploymentResponse: { deploymentStatus: DeploymentActiveData[],totalCount: number } =
      {
          deploymentStatus: [
        {
            "id": "f851134a-020f-42fc-ae30-daf58cf34ea4",
            "owner": "admin",
            "state": "QUEUED",
            "description": "Initial deployment of cmd-app",
            "metadata": {
                "environment_id": "Environments\/localhost-env-1",
                "environment_reference_id": "f2b25e18-d602-40c2-b88c-db8f8dc37b73",
                "version": "1.0",
                "environment": "localhost-env-1",
                "satellite_ids": "",
                "application": "cmd-app",
                "taskType": "INITIAL"
            },
            "detailsRedirectUri": "http://localhost:4516/#/explorer?taskId=f851134a-020f-42fc-ae30-daf58cf34ea4"
        },
        {
            "id": "5473142b-5234-43ce-a083-e3dcfc929d72",
            "owner": "doe",
            "state": "EXECUTED",
            "description": "Initial deployment of D-32171",
            "startDate": "2024-02-15T05:19:41.897+0000",
            "completionDate": "2024-02-15T06:19:42.552+0000",
            "metadata": {
                "environment_id": "Environments\/localhost-env",
                "environment_reference_id": "f2b25e18-d602-40c2-b88c-db8f8dc37b73",
                "worker_name": "In-process worker",
                "version": "1.0",
                "environment": "localhost-env",
                "taskType": "UPDATE",
                "satellite_ids": "",
                "application": "D-32171"
            },
            "detailsRedirectUri": "http://localhost:4516/#/explorer?taskId=5473142b-5234-43ce-a083-e3dcfc929d72"
        }
    ],
          totalCount: 100
  };