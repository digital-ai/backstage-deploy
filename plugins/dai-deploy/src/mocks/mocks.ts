import {
  DeploymentActiveData,
  DeploymentArchiveData,
} from '@digital-ai/plugin-dai-deploy-common';
import { Entity } from '@backstage/catalog-model';
import { ErrorResponseBody } from "@backstage/errors";

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
      id: 'f851134a-020f-42fc-ae30-daf58cf34ea4',
      owner: 'admin',
      state: 'QUEUED',
      description: 'Initial deployment of cmd-app',
      metadata: {
        environment_id: 'Environments/localhost-env-1',
        environment_reference_id: 'f2b25e18-d602-40c2-b88c-db8f8dc37b73',
        version: '1.0',
        environment: 'localhost-env-1',
        satellite_ids: '',
        application: 'cmd-app',
        taskType: 'INITIAL',
      },
      detailsRedirectUri:
        'http://localhost:4516/#/explorer?taskId=f851134a-020f-42fc-ae30-daf58cf34ea4',
      environmentRedirectUri:
          'http://localhost:4516/#/explorer?ciId=Environments/localhost-env-1'
    },
    {
      id: '5473142b-5234-43ce-a083-e3dcfc929d72',
      owner: 'doe',
      state: 'EXECUTED',
      description: 'Initial deployment of D-32171',
      startDate: '2024-02-15T05:19:41.897+0000',
      completionDate: '2024-02-15T06:19:42.552+0000',
      metadata: {
        environment_id: 'Environments/localhost-env',
        environment_reference_id: 'f2b25e18-d602-40c2-b88c-db8f8dc37b73',
        worker_name: 'In-process worker',
        version: '1.0',
        environment: 'localhost-env',
        taskType: 'UPDATE',
        satellite_ids: '',
        application: 'D-32171',
      },
      detailsRedirectUri:
        'http://localhost:4516/#/explorer?taskId=5473142b-5234-43ce-a083-e3dcfc929d72',
      environmentRedirectUri:
          'http://localhost:4516/#/explorer?ciId=Environments/localhost-env'
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
      environmentId: 'Environments/My/test/testenv',
      environmentIdWithoutRoot: 'My/test/testenv',
      rolledBack: false,
      worker_name: 'In-process worker',
      detailsRedirectUri:
        'http://localhost:4516/#/reports/deployments?taskId=d140e4e0-7051-42bf-b39e-7e1f18e73f7b',
      environmentRedirectUri:
        'http://localhost:4516/#/explorer?ciId=Environments%2FMy%2Fstage%2Ftestenv'
    },
  ],
  totalCount: 100,
};

export const connectionErrorBody: ErrorResponseBody = {
  error: {
    name: "TypeError",
    message: "fetch failed",
    cause: {
      errno: -111,
      code: "ECONNREFUSED",
      syscall: "connect",
      address: "127.0.0.1",
      port: 4516,
      name: "Error",
      message: "connect ECONNREFUSED 127.0.0.1:4516",
      stack: "Error: connect ECONNREFUSED 127.0.0.1:4516\n "
    },
    stack: "TypeError: fetch failed\n"
  },
  request: { method: 'GET', url: '/deployment-status?appName=Commandls&beginDate=2024-02-19T00%3A00%3A00.000%2B0530&endDate=2024-02-26T23%3A59%3A59.999%2B0530&order=end%3Adesc&pageNumber=1&resultsPerPage=5&taskSet=ALL' },
  response: { statusCode: 500 },
};
export const connectionErrorResponse: Partial<Response> = {
  status: 500,
  statusText: 'connect ECONNREFUSED 127.0.0.1:4516',
  text: async () => JSON.stringify(connectionErrorBody),
  headers: new Headers({ 'Content-Type': 'application/json' }),
};



export const unAuthorizedErrorBody: ErrorResponseBody = {
  "error": {
    "name": "Error",
    "message": "failed to fetch data, status 401: Unauthorized",
    "stack": "Error: failed to fetch data, status 401: Unauthorized\n    at CurrentDeploymentStatusApi.getCurrentDeploymentStatus"
  },
  "request": {
    "method": "GET",
    "url": "/deployment-status?appName=Commandls&beginDate=2024-02-19T00%3A00%3A00.000%2B0530&endDate=2024-02-26T23%3A59%3A59.999%2B0530&order=end%3Adesc&pageNumber=1&resultsPerPage=5&taskSet=ALL"
  },
  "response": {
    "statusCode": 500
  }
};
export const unAuthorizedErrorResponse: Partial<Response> = {
  status: 500,
  statusText: '"failed to fetch data, status 401: Unauthorized',
  text: async () => JSON.stringify(unAuthorizedErrorBody),
  headers: new Headers({ 'Content-Type': 'application/json' }),
};

export const permissionErrorBody: ErrorResponseBody = {
  "error": {
    "name": "Error",
    "message": "failed to fetch data, status 403: You do not have report#view permission",
    "stack": "Error: failed to fetch data, status 403: You do not have report#view permission\n    at DeploymentHistoryStatusApi.getDeploymentHistoryStatus "
  },
  "request": {
    "method": "GET",
    "url": "/deployment-history?appName=Commandls1&beginDate=2024-02-21T00%3A00%3A00.000%2B0530&endDate=2024-02-28T23%3A59%3A59.999%2B0530&order=startDate%3Adesc&pageNumber=1&resultsPerPage=5"
  },
  "response": {
    "statusCode": 403
  }
};
export const permissionErorResponse: Partial<Response> = {
  status: 500,
  statusText: 'failed to fetch data, status 403: You do not have report#view permission',
  text: async () => JSON.stringify(permissionErrorBody),
  headers: new Headers({ 'Content-Type': 'application/json' }),
};


