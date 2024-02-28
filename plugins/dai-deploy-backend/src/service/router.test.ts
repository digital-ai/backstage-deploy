import {
  currentDeploymentBackendApiResponse,
  deploymentHistoryBackendApiResponse,
} from '../mocks/mockData';
import { ConfigReader } from '@backstage/config';
import { createRouter } from './router';
import express from 'express';
import { getVoidLogger } from '@backstage/backend-common';
import { handlers } from '../mocks/handlers';
import request from 'supertest';
import { setupServer } from 'msw/node';

describe('createRouter', () => {
  let app: express.Express;

  const server = setupServer(...handlers);

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
    // Remove any handlers you may have added
    // in individual tests (runtime handlers).
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
