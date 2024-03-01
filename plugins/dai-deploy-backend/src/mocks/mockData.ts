import {
  CurrentDeploymentStatus,
  DeploymentActiveData,
  DeploymentArchiveData,
  DeploymentHistoryStatus,
} from '@digital-ai/plugin-dai-deploy-common';
import { ConfigReader } from '@backstage/config';

export const config = new ConfigReader({
  daiDeploy: {
    host: 'http://localhost',
    username: 'admin',
    password: 'admin',
  },
});

export const configWithEmptyHost = new ConfigReader({
  daiDeploy: {
    host: '',
    username: 'admin',
    password: 'admin',
  },
});

export const configWithEmptyUsername = new ConfigReader({
  daiDeploy: {
    host: 'http://localhost',
    username: '',
    password: 'admin',
  },
});

export const configWithEmptyPassword = new ConfigReader({
  daiDeploy: {
    host: 'http://localhost',
    username: 'admin',
    password: '',
  },
});

export const deploymentHistoryDeployApiResponse: DeploymentHistoryStatus[] = [
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
  {
    taskId: '4d7eedeb-2481-4024-af22-e84c593ec4e1',
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
      environmentRedirectUri:
        'http://localhost/#/explorer?ciId=Environments/Placeholders/Croatia',
    },
    {
      completionDate: '2024-02-23T02:03:07.974+0000',
      detailsRedirectUri:
        'http://localhost/#/reports/deployments?taskId=4d7eedeb-2481-4024-af22-e84c593ec4e1',
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
      environmentRedirectUri:
        'http://localhost/#/explorer?ciId=Environments/Placeholders/Croatia',
    },
  ],
  totalCount: 2,
};

export const currentDeploymentsDeployApiResponse: CurrentDeploymentStatus[] = [
  {
    id: 'd2506244-ce3a-46b1-bfad-80c373a2feb9',
    owner: 'admin',
    state: 'EXECUTED',
    description: 'Initial deployment of AppToDeploy6',
    startDate: '2024-02-28T01:57:10.697+0000',
    completionDate: '2024-02-28T01:57:11.828+0000',
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
    workerId: 1,
  },
  {
    id: '0d899fa2-fe1a-49a8-a70c-a7151f2ac272',
    owner: 'admin',
    state: 'EXECUTED',
    description: 'Initial deployment of AppToDeploy6',
    startDate: '2024-02-28T01:57:06.127+0000',
    completionDate: '2024-02-28T01:57:07.255+0000',
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
    workerId: 1,
  },
];

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
      environmentRedirectUri:
        'http://localhost/#/explorer?ciId=Environments/EnvsWithSameHost/EnvWithSameHost6',
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
      environmentRedirectUri:
        'http://localhost/#/explorer?ciId=Environments/Staging',
    },
  ],
  totalCount: 2,
};
