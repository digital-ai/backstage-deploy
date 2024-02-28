import { HttpResponse, http } from 'msw';
import {
  currentDeploymentsDeployApiResponse,
  deploymentHistoryDeployApiResponse,
} from './mockData';

export const handlers = [
  http.post('http://localhost/deployit/report/tasks', () => {
    return new HttpResponse(deploymentHistoryDeployApiResponse, {
      headers: {
        'X-Total-Count': '1',
      },
    });
  }),
  http.post('http://localhost/deployit/taskmonitor/deployment', () => {
    return new HttpResponse(currentDeploymentsDeployApiResponse, {
      headers: {
        'X-Total-Count': '2',
      },
    });
  }),
];
