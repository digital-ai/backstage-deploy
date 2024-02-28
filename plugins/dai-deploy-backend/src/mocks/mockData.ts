import {
  DeploymentActiveData,
  DeploymentArchiveData,
  DeploymentHistoryStatus,
} from '@digital-ai/plugin-dai-deploy-common';

export const deploymentHistoryDeployApiResponse1: DeploymentHistoryStatus[] = [
  {
    taskId: '4d7eedeb-2481-4024-af22-e84c593ec4e5',
    startDate: '2024-02-23T02:03:07.953+0000',
    completionDate: '2024-02-23T02:03:07.974+0000',
    status: 'DONE',
    type: 'Initial',
    user: 'admin',
    environment: 'Croatia',
    environmentId: 'Environments/Placeholders/Croatia',
    environmentIdWithoutRoot: 'Placeholders/Croatia',
    package: 'AppForBlankPlaceholderValue/1.0',
    rolledBack: false,
    worker_name: 'In-process worker',
  },
];

export const deploymentHistoryDeployApiResponse =
  '[\n' +
  '    {\n' +
  '        "taskId": "4d7eedeb-2481-4024-af22-e84c593ec4e5",\n' +
  '        "startDate": "2024-02-23T02:03:07.953+0000",\n' +
  '        "completionDate": "2024-02-23T02:03:07.974+0000",\n' +
  '        "status": "DONE",\n' +
  '        "type": "Initial",\n' +
  '        "user": "admin",\n' +
  '        "environment": "Croatia",\n' +
  '        "environmentId": "Environments/Placeholders/Croatia",\n' +
  '        "environmentIdWithoutRoot": "Placeholders/Croatia",\n' +
  '        "package": "AppForBlankPlaceholderValue/1.0",\n' +
  '        "rolledBack": false,\n' +
  '        "worker_name": "In-process worker"\n' +
  '    }\n' +
  ']';

export const deploymentHistoryBackendApiResponse: {
  deploymentStatus: DeploymentArchiveData[];
  totalCount: number;
} = {
  deploymentStatus: [
    {
      completionDate: '2024-02-23T02:03:07.974+0000',
      detailsRedirectUri:
        'http://localhost/#/reports/deployments?taskId=4d7eedeb-2481-4024-af22-e84c593ec4e5',
      environment: 'Placeholders/Croatia',
      environmentId: 'Environments/Placeholders/Croatia',
      environmentIdWithoutRoot: 'Placeholders/Croatia',
      owner: 'admin',
      package: 'AppForBlankPlaceholderValue/1.0',
      rolledBack: false,
      startDate: '2024-02-23T02:03:07.953+0000',
      state: 'DONE',
      type: 'Initial',
      worker_name: 'In-process worker',
    },
  ],
  totalCount: 1,
};

export const currentDeploymentsDeployApiResponse =
  '[\n' +
  '  {\n' +
  '    "id": "d2506244-ce3a-46b1-bfad-80c373a2feb9",\n' +
  '    "failures": 0,\n' +
  '    "owner": "admin",\n' +
  '    "state": "EXECUTED",\n' +
  '    "description": "Initial deployment of AppToDeploy6",\n' +
  '    "startDate": "2024-02-28T01:57:10.697+0000",\n' +
  '    "completionDate": "2024-02-28T01:57:11.828+0000",\n' +
  '    "metadata": {\n' +
  '      "worker_name": "In-process worker",\n' +
  '      "environment_id": "Environments/EnvsWithSameHost/EnvWithSameHost6",\n' +
  '      "environment_reference_id": "8f85359d-22a3-40c1-89fc-c832b6e853fa",\n' +
  '      "version": "1.0",\n' +
  '      "environment_secured_ci": "1",\n' +
  '      "environment": "EnvWithSameHost6",\n' +
  '      "version_id": "Applications/ToDeploy/AppToDeploy6/1.0",\n' +
  '      "satellite_ids": "",\n' +
  '      "environment_internal_id": "416",\n' +
  '      "enableCopyArtifactRetry": "false",\n' +
  '      "application": "AppToDeploy6",\n' +
  '      "application_reference_id": "b974c29d-6f26-43cf-819c-4ec426867ebb",\n' +
  '      "application_directory_ref": "1fcbfe6a-f279-4976-84be-c559528684a9",\n' +
  '      "taskType": "INITIAL",\n' +
  '      "application_secured_ci": "3",\n' +
  '      "environment_directory_ref": "fb6b5cf2-84d3-428d-8362-ab4d1bb6cfc7",\n' +
  '      "application_internal_id": "303"\n' +
  '    },\n' +
  '    "workerId": 1\n' +
  '  },\n' +
  '  {\n' +
  '    "id": "0d899fa2-fe1a-49a8-a70c-a7151f2ac272",\n' +
  '    "failures": 0,\n' +
  '    "owner": "admin",\n' +
  '    "state": "EXECUTED",\n' +
  '    "description": "Initial deployment of AppToDeploy6",\n' +
  '    "startDate": "2024-02-28T01:57:06.127+0000",\n' +
  '    "completionDate": "2024-02-28T01:57:07.255+0000",\n' +
  '    "metadata": {\n' +
  '      "worker_name": "In-process worker",\n' +
  '      "environment_id": "Environments/Staging",\n' +
  '      "environment_reference_id": "46f5aaa8-8f9f-4039-9a58-9c92a057c381",\n' +
  '      "version": "1.0",\n' +
  '      "environment_secured_ci": "1",\n' +
  '      "environment": "Staging",\n' +
  '      "version_id": "Applications/ToDeploy/AppToDeploy6/1.0",\n' +
  '      "satellite_ids": "",\n' +
  '      "environment_internal_id": "210",\n' +
  '      "enableCopyArtifactRetry": "false",\n' +
  '      "application": "AppToDeploy6",\n' +
  '      "application_reference_id": "b974c29d-6f26-43cf-819c-4ec426867ebb",\n' +
  '      "application_directory_ref": "1fcbfe6a-f279-4976-84be-c559528684a9",\n' +
  '      "taskType": "INITIAL",\n' +
  '      "application_secured_ci": "3",\n' +
  '      "environment_directory_ref": "fb6b5cf2-84d3-428d-8362-ab4d1bb6cfc7",\n' +
  '      "application_internal_id": "303"\n' +
  '    },\n' +
  '    "workerId": 1\n' +
  '  }\n' +
  ']';

export const currentDeploymentBackendApiResponse: {
  deploymentStatus: DeploymentActiveData[];
  totalCount: number;
} = {
  deploymentStatus: [
    {
      owner: 'admin',
      state: 'EXECUTED',
      startDate: '2024-02-28T01:57:10.697+0000',
      completionDate: '2024-02-28T01:57:11.828+0000',
      id: 'd2506244-ce3a-46b1-bfad-80c373a2feb9',
      description: 'Initial deployment of AppToDeploy6',
      metadata: {
        worker_name: 'In-process worker',
        environment_id: 'Environments/EnvsWithSameHost/EnvWithSameHost6',
        environment_reference_id: '8f85359d-22a3-40c1-89fc-c832b6e853fa',
        version: '1.0',
        environment: 'EnvWithSameHost6',
        satellite_ids: '',
        application: 'AppToDeploy6',
        taskType: 'INITIAL',
      },
      detailsRedirectUri:
        'http://localhost/#/explorer?taskId=d2506244-ce3a-46b1-bfad-80c373a2feb9',
    },
    {
      owner: 'admin',
      state: 'EXECUTED',
      startDate: '2024-02-28T01:57:06.127+0000',
      completionDate: '2024-02-28T01:57:07.255+0000',
      id: '0d899fa2-fe1a-49a8-a70c-a7151f2ac272',
      description: 'Initial deployment of AppToDeploy6',
      metadata: {
        worker_name: 'In-process worker',
        environment_id: 'Environments/Staging',
        environment_reference_id: '46f5aaa8-8f9f-4039-9a58-9c92a057c381',
        version: '1.0',
        environment: 'Staging',
        satellite_ids: '',
        application: 'AppToDeploy6',
        taskType: 'INITIAL',
      },
      detailsRedirectUri:
        'http://localhost/#/explorer?taskId=0d899fa2-fe1a-49a8-a70c-a7151f2ac272',
    },
  ],
  totalCount: 2,
};
