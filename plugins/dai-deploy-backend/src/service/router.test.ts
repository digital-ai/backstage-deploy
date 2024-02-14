import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import {ConfigReader} from "@backstage/config";
import {CurrentDeploymentStatusApi} from "../api";

describe('createRouter', () => {
  let currentDeploymentStatusApi: jest.Mocked<CurrentDeploymentStatusApi>;
  let app: express.Express;

  beforeAll(async () => {
    currentDeploymentStatusApi = {
      getCurrentDeploymentStatus: jest.fn()
    } as any;

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

  describe('POST /deployment-status', () => {
    it('returns ok', async () => {
      const response = await request(app).post('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
