import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
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
const permissionApi = {
  authorize: jest.fn(),
  authorizeConditional: jest.fn(),
} as unknown as PermissionEvaluator;

function configureMockServer(permission: boolean) {
  const server = setupServer();

  beforeAll(async () => {
    if (permission) {
      const router = await createRouter({
        config,
        logger: getVoidLogger(),
        permissions: permissionApi,
      });
      app = express().use(router);
    } else {
      const router = await createRouter({
        config,
        logger: getVoidLogger(),
      });
      app = express().use(router);
    }
    // Start the interception.
    server.listen();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    if (permission) {
      jest.spyOn(permissionApi, 'authorize').mockImplementation(async () => [
        {
          result: AuthorizeResult.ALLOW,
        },
      ]);
    }
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

describe('router api tests with permissions ALLOW', () => {
  const server = configureMockServer(true);
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
      const response = await request(app)
        .get('/deployment-status/:namespace/:kind/:name')
        .set('authorization', 'Bearer someauthtoken');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(currentDeploymentBackendApiResponse);
    });

    it('GET 404 from deploy for /deployment-status', async () => {
      server.resetHandlers(...error404ResponseHandler);
      const response = await request(app).get(
        '/deployment-status/:namespace/:kind/:name',
      );
      console.log(response.body.error.message);
      expect(response.body.error.message).toEqual(
        'Deploy service request not found',
      );
    });

    it('GET 403 from deploy for /deployment-status', async () => {
      server.resetHandlers(...error403ResponseHandler);
      const response = await request(app).get(
        '/deployment-status/:namespace/:kind/:name',
      );
      expect(response.status).toEqual(403);
      expect(response.body.error.message).toContain(
        'Permission Denied: The configured Deploy User lacks necessary permission in Digital.ai Deploy',
      );
    });

    it('GET 500 from deploy for /deployment-status', async () => {
      server.resetHandlers(...error500ResponseHandler);
      const response = await request(app).get(
        '/deployment-status/:namespace/:kind/:name',
      );
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
      expect(response.body.error.message).toEqual(
        'Deploy service request not found',
      );
    });

    it('GET 403 from deploy for  /deployment-history', async () => {
      server.resetHandlers(...error403ResponseHandler);
      const response = await request(app).get('/deployment-history');
      expect(response.status).toEqual(403);
      expect(response.body.error.message).toContain(
        'Permission Denied: The configured Deploy User lacks necessary permission in Digital.ai Deploy',
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

describe('router api tests - with permissions DENY', () => {
  const server = configureMockServer(true);
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(permissionApi, 'authorize').mockImplementation(async () => [
      {
        result: AuthorizeResult.DENY,
      },
    ]);
  });
  server.resetHandlers(...mockTestHandlers);
  describe('GET /deployment-status', () => {
    it('GET 403 from deploy for /deployment-status', async () => {
      server.resetHandlers(...error403ResponseHandler);
      const response = await request(app).get(
        '/deployment-status/:namespace/:kind/:name',
      );
      expect(response.status).toEqual(403);
      expect(response.body.error.message).toContain(
        'Access Denied: Unauthorized to access the Backstage Deploy plugin',
      );
    });
  });
  describe('GET /deployment-history', () => {
    it('GET 403 from deploy for /deployment-history', async () => {
      server.resetHandlers(...error403ResponseHandler);
      const response = await request(app).get('/deployment-history');
      expect(response.status).toEqual(403);
      expect(response.body.error.message).toContain(
        'Access Denied: Unauthorized to access the Backstage Deploy plugin',
      );
    });
  });
});
describe('router api tests - without permissions', () => {
  const server = configureMockServer(false);
  server.resetHandlers(...mockTestHandlers);
  describe('GET /deployment-status', () => {
    it('returns ok', async () => {
      const response = await request(app)
        .get('/deployment-status/:namespace/:kind/:name')
        .set('authorization', 'Bearer someauthtoken');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(currentDeploymentBackendApiResponse);
    });
  });
  describe('GET /deployment-history', () => {
    it('returns ok', async () => {
      server.resetHandlers(...mockTestHandlers);
      const response = await request(app).get('/deployment-history');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(deploymentHistoryBackendApiResponse);
    });
  });
});
