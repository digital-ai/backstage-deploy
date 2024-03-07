import {
  config,
  currentDeploymentBackendApiResponse,
  deploymentHistoryBackendApiResponse,
} from '../mocks/mockData';
import {
  error403ResponseHandler,
  error404ResponseHandler,
  error500ResponseHandler,
  mockTestHandlers,
} from '../mocks/mock.test.handlers';
import { createRouter } from './router';
import express from 'express';
import { getVoidLogger } from '@backstage/backend-common';
import request from 'supertest';
import { setupServer } from 'msw/node';

let app: express.Express;

function configureMockServer() {
  const server = setupServer();

  beforeAll(async () => {
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

  return server;
}

describe('router api tests', () => {
  const server = configureMockServer();
  server.resetHandlers(...mockTestHandlers);

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

    it('GET 404 from deploy for /deployment-status', async () => {
      server.resetHandlers(...error404ResponseHandler);
      const response = await request(app).get('/deployment-status');
      console.log(response.body.error.message);
      expect(response.body.error.message).toEqual('Not found');
    });

    it('GET 403 from deploy for /deployment-status', async () => {
      server.resetHandlers(...error403ResponseHandler);
      const response = await request(app).get('/deployment-status');
      expect(response.status).toEqual(403);
      expect(response.body.error.message).toContain(
        'You do not have report#view permission',
      );
    });

    it('GET 500 from deploy for /deployment-status', async () => {
      server.resetHandlers(...error500ResponseHandler);
      const response = await request(app).get('/deployment-status');
      expect(response.status).toEqual(500);
      expect(response.body.error.message).toContain(
        'failed to fetch data, status 500',
      );
    });
  });

  describe('GET /deployment-history', () => {
    it('returns ok', async () => {
      server.resetHandlers(...mockTestHandlers);
      const response = await request(app).get('/deployment-history');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(deploymentHistoryBackendApiResponse);
    });

    it('GET 404 from deploy for  /deployment-history', async () => {
      server.resetHandlers(...error404ResponseHandler);
      const response = await request(app).get('/deployment-history');
      expect(response.body.error.message).toEqual('Not found');
    });

    it('GET 403 from deploy for  /deployment-history', async () => {
      server.resetHandlers(...error403ResponseHandler);
      const response = await request(app).get('/deployment-history');
      expect(response.status).toEqual(403);
      expect(response.body.error.message).toContain(
        'You do not have report#view permission',
      );
    });

    it('GET 500 from deploy for  /deployment-history', async () => {
      server.resetHandlers(...error500ResponseHandler);
      const response = await request(app).get('/deployment-history');
      expect(response.status).toEqual(500);
      expect(response.body.error.message).toContain(
        'failed to fetch data, status 500',
      );
    });
  });
});
