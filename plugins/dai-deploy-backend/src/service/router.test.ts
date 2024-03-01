import {
  currentDeploymentBackendApiResponse,
  deploymentHistoryBackendApiResponse,
} from '../mocks/mockData';
import {
  error403ResponseHandler,
  error404ResponseHandler,
  error500ResponseHandler,
  mockTestHandlers,
} from '../mocks/mock.test.handlers';
import { ConfigReader } from '@backstage/config';
import { createRouter } from './router';
import express from 'express';
import { getVoidLogger } from '@backstage/backend-common';
import request from 'supertest';
import { setupServer } from 'msw/node';

describe('router api tests', () => {
  let app: express.Express;

  const server = setupServer(...mockTestHandlers);

  beforeAll(async () => {
    const config = new ConfigReader({
      daiDeploy: {
        host: 'http://localhost',
        username: 'admin',
        password: 'admin',
      },
    });
    const router = await createRouter({
      config,
      logger: getVoidLogger(),
    });
    app = express().use(router);

    // Start the interception.
    server.listen();
  });

  beforeEach(() => {
    jest.resetAllMocks();
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

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /deployment-status', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/deployment-status');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(currentDeploymentBackendApiResponse);
    });
  });

  describe('GET /deployment-history', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/deployment-history');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(deploymentHistoryBackendApiResponse);
    });
  });
});

describe('router api tests with 404 response', () => {
  let app: express.Express;

  const server = setupServer(...error404ResponseHandler);

  beforeAll(async () => {
    const config = new ConfigReader({
      daiDeploy: {
        host: 'http://localhost',
        username: 'admin',
        password: 'admin',
      },
    });
    const router = await createRouter({
      config,
      logger: getVoidLogger(),
    });
    app = express().use(router);

    // Start the interception.
    server.listen();
  });

  beforeEach(() => {
    jest.resetAllMocks();
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

  describe('GET 404 from deploy for /deployment-status', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/deployment-status');
      expect(response.body).toEqual('[]');
    });
  });

  describe('GET 404 from deploy for  /deployment-history', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/deployment-history');
      expect(response.body).toEqual('[]');
    });
  });
});
describe('router api tests with 403 response', () => {
  let app: express.Express;

  const server = setupServer(...error403ResponseHandler);

  beforeAll(async () => {
    const config = new ConfigReader({
      daiDeploy: {
        host: 'http://localhost',
        username: 'admin',
        password: 'admin',
      },
    });
    const router = await createRouter({
      config,
      logger: getVoidLogger(),
    });
    app = express().use(router);

    // Start the interception.
    server.listen();
  });

  beforeEach(() => {
    jest.resetAllMocks();
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

  describe('GET 403 from deploy for /deployment-status', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/deployment-status');
      expect(response.status).toEqual(500);
      expect(response.body.error.message).toContain(
        'failed to fetch data, status 403',
      );
    });
  });

  describe('GET 403 from deploy for  /deployment-history', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/deployment-history');
      expect(response.status).toEqual(500);
      expect(response.body.error.message).toContain(
        'failed to fetch data, status 403',
      );
    });
  });
});

describe('router api tests with 500 response', () => {
  let app: express.Express;

  const server = setupServer(...error500ResponseHandler);

  beforeAll(async () => {
    const config = new ConfigReader({
      daiDeploy: {
        host: 'http://localhost',
        username: 'admin',
        password: 'admin',
      },
    });
    const router = await createRouter({
      config,
      logger: getVoidLogger(),
    });
    app = express().use(router);

    // Start the interception.
    server.listen();
  });

  beforeEach(() => {
    jest.resetAllMocks();
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

  describe('GET 500 from deploy for /deployment-status', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/deployment-status');
      expect(response.status).toEqual(500);
      expect(response.body.error.message).toContain(
        'failed to fetch data, status 500',
      );
    });
  });

  describe('GET 500 from deploy for  /deployment-history', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/deployment-history');
      expect(response.status).toEqual(500);
      expect(response.body.error.message).toContain(
        'failed to fetch data, status 500',
      );
    });
  });
});
