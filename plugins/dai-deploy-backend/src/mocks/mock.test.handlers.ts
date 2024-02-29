import { HttpResponse, http } from 'msw';
import {
  currentDeploymentsDeployApiResponse,
  deploymentHistoryDeployApiResponse,
} from './mockData';

export const mockTestHandlers = [
  http.post('http://localhost/deployit/report/tasks', () => {
    return new HttpResponse(JSON.stringify(deploymentHistoryDeployApiResponse), {
      headers: {
        'X-Total-Count': '2',
      },
    });
  }),
  http.post('http://localhost/deployit/taskmonitor/deployment', () => {
    return new HttpResponse(JSON.stringify(currentDeploymentsDeployApiResponse), {
      headers: {
        'X-Total-Count': '2',
      },
    });
  }),
];
