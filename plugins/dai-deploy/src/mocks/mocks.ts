import { Entity } from '@backstage/catalog-model';
import { CurrentDeploymentStatus } from '@digital-ai/plugin-dai-deploy-common';

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
  
  export const currentDeploymentResponse: CurrentDeploymentStatus[] = 
  [
        {
            "id": "f851134a-020f-42fc-ae30-daf58cf34ea4",
            "failures": 0,
            "owner": "admin",
            "state": "QUEUED",
            "description": "Initial deployment of cmd-app",
            "metadata": {
                "environment_id": "Environments\/localhost-env-1",
                "environment_reference_id": "f2b25e18-d602-40c2-b88c-db8f8dc37b73",
                "version": "1.0",
                "environment_secured_ci": "0",
                "environment": "localhost-env-1",
                "version_id": "Applications\/cmd-app\/1.0",
                "satellite_ids": "",
                "environment_internal_id": "6",
                "enableCopyArtifactRetry": "false",
                "application": "cmd-app",
                "application_reference_id": "d085f94a-d093-4d15-9f8d-d289a6789510",
                "application_directory_ref": "73806b03-8a19-4807-9d8b-6797598c911f",
                "taskType": "INITIAL",
                "application_secured_ci": "0",
                "environment_directory_ref": "f21fb964-cc2f-4331-969c-3d7117820e5d",
                "application_internal_id": "7"
            },
            "workerId": null
        },
        {
            "id": "5473142b-5234-43ce-a083-e3dcfc929d72",
            "failures": 0,
            "owner": "doe",
            "state": "EXECUTED",
            "description": "Initial deployment of D-32171",
            "startDate": "2024-02-15T05:19:41.897+0000",
            "completionDate": "2024-02-15T06:19:42.552+0000",
            "metadata": {
                "environment_id": "Environments\/localhost-env",
                "worker_name": "In-process worker",
                "version_id": "Applications\/D-32171\/1.0",
                "version": "1.0",
                "application_secured_ci": "0",
                "environment_secured_ci": "0",
                "enableCopyArtifactRetry": "false",
                "environment": "localhost-env",
                "application_internal_id": "191",
                "taskType": "UPDATE",
                "environment_directory_ref": "f21fb964-cc2f-4331-969c-3d7117820e5d",
                "satellite_ids": "",
                "environment_internal_id": "6",
                "application": "D-32171",
                "application_directory_ref": "73806b03-8a19-4807-9d8b-6797598c911f",
                "application_reference_id": "e193ff0e-3774-44c7-9da5-e419b5b769de",
                "environment_reference_id": "f2b25e18-d602-40c2-b88c-db8f8dc37b73"
            },
            "workerId": 11
        }
    ];