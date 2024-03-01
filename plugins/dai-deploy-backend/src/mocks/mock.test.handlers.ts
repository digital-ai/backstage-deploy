import { HttpResponse, http } from 'msw';
import {
  currentDeploymentsDeployApiResponse,
  deploymentHistoryDeployApiResponse,
} from './mockData';

export const mockTestHandlers = [
  http.post('http://localhost/deployit/report/tasks', () => {
    return new HttpResponse(
      JSON.stringify(deploymentHistoryDeployApiResponse),
      {
        headers: {
          'X-Total-Count': '2',
        },
      },
    );
  }),
  http.post('http://localhost/deployit/taskmonitor/deployment', () => {
    return new HttpResponse(
      JSON.stringify(currentDeploymentsDeployApiResponse),
      {
        headers: {
          'X-Total-Count': '2',
        },
      },
    );
  }),
];

export const error404ResponseHandler = [
  http.post('http://localhost/deployit/report/tasks', () => {
    return new HttpResponse(JSON.stringify('[]'), {
      status: 404,
      statusText: 'Not found',
    });
  }),
  http.post('http://localhost/deployit/taskmonitor/deployment', () => {
    return new HttpResponse(JSON.stringify('[]'), {
      status: 404,
      statusText: 'Not found',
    });
  }),
];

export const error403ResponseHandler = [
  http.post('http://localhost/deployit/report/tasks', () => {
    return new HttpResponse(null, {
      status: 403,
      statusText: 'Unauthorized',
    });
  }),
  http.post('http://localhost/deployit/taskmonitor/deployment', () => {
    return new HttpResponse(null, {
      status: 403,
      statusText: 'Unauthorized',
    });
  }),
];

export const error500ResponseHandler = [
  http.post('http://localhost/deployit/report/tasks', () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Unexpected error',
    });
  }),
  http.post('http://localhost/deployit/taskmonitor/deployment', () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Unexpected error',
    });
  }),
];
