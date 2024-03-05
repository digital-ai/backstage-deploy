import { SetupServerApi, setupServer } from 'msw/node';
import {
  config,
  configWithEmptyHost,
  configWithEmptyPassword,
  configWithEmptyUsername,
  currentDeploymentBackendApiResponse,
  deploymentHistoryBackendApiResponse,
} from '../mocks/mockData';
import {
  error401ResponseHandler,
  error403ResponseHandler,
  error404ResponseHandler,
  error500ResponseHandler,
  mockTestHandlers,
} from '../mocks/mock.test.handlers';
import { CurrentDeploymentStatusApi } from './CurrentDeploymentStatusApi';
import { DeploymentHistoryStatusApi } from './DeploymentHistoryStatusApi';
import { DeploymentStatusResponse } from '@digital-ai/plugin-dai-deploy-common';
import { getVoidLogger } from '@backstage/backend-common';

function configureMockServer(): SetupServerApi {
  const server = setupServer();

  beforeAll(() => {
    // Start the interception.
    server.listen();
  });

  afterEach(() => {
    // Remove any mockTestHandlers you may have added
    // in individual tests (runtime mockTestHandlers).
    server.resetHandlers();
  });

  afterAll(() => {
    // Disable request interception and clean up.
    server.close();
  });

  return server;
}

describe('Backend API tests for Current Deployment Status', () => {
  const server = configureMockServer();
  server.resetHandlers(...mockTestHandlers);

  it('Should throw error if config hostname is empty', async () => {
    const currentDeploymentStatusApi = CurrentDeploymentStatusApi.fromConfig(
      configWithEmptyHost,
      getVoidLogger(),
    );

    await expect(
      async () =>
        await currentDeploymentStatusApi.getCurrentDeploymentStatus(
          'app',
          '2024-02-16T02:03:07.953+0000',
          '2024-02-23T02:03:07.974+0000',
          'startDate:desc',
          '1',
          '5',
          '',
        ),
    ).rejects.toThrow(
      "Error: Invalid type in config for key 'daiDeploy.host' in 'mock-config', got empty-string, wanted string",
    );
  });

  it('Should throw error if config username is empty', async () => {
    const currentDeploymentStatusApi = CurrentDeploymentStatusApi.fromConfig(
      configWithEmptyUsername,
      getVoidLogger(),
    );

    await expect(
      async () =>
        await currentDeploymentStatusApi.getCurrentDeploymentStatus(
          'app',
          '2024-02-16T02:03:07.953+0000',
          '2024-02-23T02:03:07.974+0000',
          'startDate:desc',
          '1',
          '5',
          '',
        ),
    ).rejects.toThrow(
      "Error: Invalid type in config for key 'daiDeploy.username' in 'mock-config', got empty-string, wanted string",
    );
  });

  it('Should throw error if config password is empty', async () => {
    const currentDeploymentStatusApi = CurrentDeploymentStatusApi.fromConfig(
      configWithEmptyPassword,
      getVoidLogger(),
    );

    await expect(
      async () =>
        await currentDeploymentStatusApi.getCurrentDeploymentStatus(
          'app',
          '2024-02-16T02:03:07.953+0000',
          '2024-02-23T02:03:07.974+0000',
          'startDate:desc',
          '1',
          '5',
          '',
        ),
    ).rejects.toThrow(
      "Error: Invalid type in config for key 'daiDeploy.password' in 'mock-config', got empty-string, wanted string",
    );
  });

  it('Should get current deployment status from Deploy API', async () => {
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

  it('Get 401 response from current deployment status from Deploy API', async () => {
    server.resetHandlers(...error401ResponseHandler);

    const currentDeploymentStatusApi = CurrentDeploymentStatusApi.fromConfig(
        config,
        getVoidLogger(),
    );

    await expect(
        async () =>
            await currentDeploymentStatusApi.getCurrentDeploymentStatus(
                'app',
                '2024-02-16T02:03:07.953+0000',
                '2024-02-23T02:03:07.974+0000',
                'startDate:desc',
                '1',
                '5',
                'ALL',
            ),
    ).rejects.toThrow('failed to fetch data, status 401: Unauthorized');
  });

  it('Get 403 response from current deployment status from Deploy API', async () => {
    server.resetHandlers(...error403ResponseHandler);

    const currentDeploymentStatusApi = CurrentDeploymentStatusApi.fromConfig(
      config,
      getVoidLogger(),
    );

    await expect(currentDeploymentStatusApi.getCurrentDeploymentStatus(
            'app',
            '2024-02-16T02:03:07.953+0000',
            '2024-02-23T02:03:07.974+0000',
            'startDate:desc',
            '1',
            '5',
            'ALL',
        ),
    ).rejects.toThrow('failed to fetch data, status 403: forbidden');
  });

  it('Get 500 response from current deployment status from Deploy API', async () => {
    server.resetHandlers(...error500ResponseHandler);

    const currentDeploymentStatusApi = CurrentDeploymentStatusApi.fromConfig(
      config,
      getVoidLogger(),
    );

    await expect(
      async () =>
        await currentDeploymentStatusApi.getCurrentDeploymentStatus(
          'app',
          '2024-02-16T02:03:07.953+0000',
          '2024-02-23T02:03:07.974+0000',
          'startDate:desc',
          '1',
          '5',
          'ALL',
        ),
    ).rejects.toThrow('failed to fetch data, status 500: Unexpected error');
  });

  it('Get 404 response from current deployment status from Deploy API', async () => {
    server.resetHandlers(...error404ResponseHandler);

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
        '',
      );
    expect(deploymentStatusResponse).toEqual('[]');
  });
});

describe('Backend API tests for Deployment History Status', () => {
  const server = configureMockServer();
  server.resetHandlers(...mockTestHandlers);

  it('Should throw error if config hostname is empty', async () => {
    const deploymentHistoryStatusApi = DeploymentHistoryStatusApi.fromConfig(
      configWithEmptyHost,
      getVoidLogger(),
    );

    await expect(
      async () =>
        await deploymentHistoryStatusApi.getDeploymentHistoryStatus(
          'app',
          '2024-02-16T02:03:07.953+0000',
          '2024-02-23T02:03:07.974+0000',
          'startDate:desc',
          '1',
          '5',
          '',
        ),
    ).rejects.toThrow(
      "Error: Invalid type in config for key 'daiDeploy.host' in 'mock-config', got empty-string, wanted string",
    );
  });

  it('Should throw error if config username is empty', async () => {
    const deploymentHistoryStatusApi = DeploymentHistoryStatusApi.fromConfig(
      configWithEmptyUsername,
      getVoidLogger(),
    );

    await expect(
      async () =>
        await deploymentHistoryStatusApi.getDeploymentHistoryStatus(
          'app',
          '2024-02-16T02:03:07.953+0000',
          '2024-02-23T02:03:07.974+0000',
          'startDate:desc',
          '1',
          '5',
          '',
        ),
    ).rejects.toThrow(
      "Error: Invalid type in config for key 'daiDeploy.username' in 'mock-config', got empty-string, wanted string",
    );
  });

  it('Should throw error if config password is empty', async () => {
    const deploymentHistoryStatusApi = DeploymentHistoryStatusApi.fromConfig(
      configWithEmptyPassword,
      getVoidLogger(),
    );

    await expect(
      async () =>
        await deploymentHistoryStatusApi.getDeploymentHistoryStatus(
          'app',
          '2024-02-16T02:03:07.953+0000',
          '2024-02-23T02:03:07.974+0000',
          'startDate:desc',
          '1',
          '5',
          '',
        ),
    ).rejects.toThrow(
      "Error: Invalid type in config for key 'daiDeploy.password' in 'mock-config', got empty-string, wanted string",
    );
  });

  it('Should get deployment History from Deploy API', async () => {
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

  it('Get 401 response from deployment History from Deploy API', async () => {
    server.resetHandlers(...error401ResponseHandler);

    const deploymentHistoryStatusApi = DeploymentHistoryStatusApi.fromConfig(
        config,
        getVoidLogger(),
    );

    await expect(
        async () =>
            await deploymentHistoryStatusApi.getDeploymentHistoryStatus(
                'app',
                '2024-02-16T02:03:07.953+0000',
                '2024-02-23T02:03:07.974+0000',
                'startDate:desc',
                '1',
                '5',
                '',
            ),
    ).rejects.toThrow('failed to fetch data, status 401: Unauthorized');
  });

  it('Get 403 response from deployment History from Deploy API', async () => {
    server.resetHandlers(...error403ResponseHandler);

    const deploymentHistoryStatusApi = DeploymentHistoryStatusApi.fromConfig(
      config,
      getVoidLogger(),
    );

    await expect(
      async () =>
        await deploymentHistoryStatusApi.getDeploymentHistoryStatus(
          'app',
          '2024-02-16T02:03:07.953+0000',
          '2024-02-23T02:03:07.974+0000',
          'startDate:desc',
          '1',
          '5',
          '',
        ),
    ).rejects.toThrow('failed to fetch data, status 403: You do not have report#view permission');
  });

  it('Get 500 response from deployment History from Deploy API', async () => {
    server.resetHandlers(...error500ResponseHandler);

    const deploymentHistoryStatusApi = DeploymentHistoryStatusApi.fromConfig(
      config,
      getVoidLogger(),
    );

    await expect(
      async () =>
        await deploymentHistoryStatusApi.getDeploymentHistoryStatus(
          'app',
          '2024-02-16T02:03:07.953+0000',
          '2024-02-23T02:03:07.974+0000',
          'startDate:desc',
          '1',
          '5',
          '',
        ),
    ).rejects.toThrow('failed to fetch data, status 500: Unexpected error');
  });

  it('Get 404 response from deployment History from Deploy API', async () => {
    server.resetHandlers(...error404ResponseHandler);

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
    expect(deploymentStatusResponse).toEqual('[]');
  });
});
