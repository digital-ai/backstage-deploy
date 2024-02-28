import {
  currentDeploymentBackendApiResponse,
  deploymentHistoryBackendApiResponse,
} from '../mocks/mockData';
import { ConfigReader } from '@backstage/config';
import { CurrentDeploymentStatusApi } from './CurrentDeploymentStatusApi';
import { DeploymentHistoryStatusApi } from './DeploymentHistoryStatusApi';
import { DeploymentStatusResponse } from '@digital-ai/plugin-dai-deploy-common';
import { getVoidLogger } from '@backstage/backend-common';
import { handlers } from '../mocks/handlers';
import { setupServer } from 'msw/node';

describe('DeploymentHistoryStatusApi', () => {
  const server = setupServer(...handlers);

  const config = new ConfigReader({
    daiDeploy: {
      host: 'http://localhost',
      username: 'admin',
      password: 'admin',
    },
  });

  beforeAll(() => {
    // Start the interception.
    server.listen();
  });

  afterEach(() => {
    // Remove any handlers you may have added
    // in individual tests (runtime handlers).
    server.resetHandlers();
  });

  afterAll(() => {
    // Disable request interception and clean up.
    server.close();
  });

  it('Get current deployment status from Deploy API', async () => {
    const currentDeploymentStatusApi = CurrentDeploymentStatusApi.fromConfig(
      config,
      getVoidLogger(),
    );

    const deploymentStatusResponse: DeploymentStatusResponse =
      await currentDeploymentStatusApi.getCurrentDeploymentStatus(
        'app',
        '2024-02-16T02:03:07.953+0000',
        '2024-02-23T02:03:07.974+0000',
        'startDate:desc',
        '1',
        '5',
        'ALL',
      );

    expect(deploymentStatusResponse.totalCount).toEqual(
      currentDeploymentBackendApiResponse.totalCount,
    );
    expect(deploymentStatusResponse.deploymentStatus).toEqual(
      currentDeploymentBackendApiResponse.deploymentStatus,
    );
  });

  it('Get deployment History from Deploy API', async () => {
    const deploymentHistoryStatusApi = DeploymentHistoryStatusApi.fromConfig(
      config,
      getVoidLogger(),
    );

    const deploymentStatusResponse: DeploymentStatusResponse =
      await deploymentHistoryStatusApi.getDeploymentHistoryStatus(
        'app',
        '2024-02-16T02:03:07.953+0000',
        '2024-02-23T02:03:07.974+0000',
        'startDate:desc',
        '1',
        '5',
        '',
      );

    expect(deploymentStatusResponse.totalCount).toEqual(
      deploymentHistoryBackendApiResponse.totalCount,
    );
    expect(deploymentStatusResponse.deploymentStatus).toEqual(
      deploymentHistoryBackendApiResponse.deploymentStatus,
    );
  });
});
