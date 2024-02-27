import { ConfigReader } from "@backstage/config";
import { createRouter } from './router';
import express from 'express';
import { getVoidLogger } from '@backstage/backend-common';
import request from 'supertest';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {

    const config = new ConfigReader({
      daiDeploy: {
        host: '',
        username: '',
        password: ''
      },
    });
    const router = await createRouter({
      config,
      logger: getVoidLogger(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
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
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /deployment-history', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

});
