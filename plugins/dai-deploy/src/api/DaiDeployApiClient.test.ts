/* eslint-disable jest/no-conditional-expect */

import {
  currentDeploymentResponse,
  deploymentHistoryResponse,
} from '../mocks/mocks';
import { DaiDeployApiClient } from './DaiDeployApiClient';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { rest } from 'msw';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';

const discoveryApi: DiscoveryApi = {
  getBaseUrl: async () => 'http://example.com/api/dai-deploy',
};

const identityApi = {
  getCredentials: jest.fn().mockResolvedValue({ token: 'token' }),
} as unknown as IdentityApi;

function checkParam(
  params: URLSearchParams,
  key: string,
  value: string,
): boolean {
  return params.get(key) === value;
}

describe('DeployApiClient', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);
  const client = new DaiDeployApiClient({ discoveryApi, identityApi });
  const entity = stringifyEntityRef({
    kind: 'Component',
    name: 'test',
    namespace: DEFAULT_NAMESPACE,
  });

  describe('getCurrentDeployments', () => {
    it('should return valid reponse', async () => {
      const ciId = 'test';
      worker.use(
        rest.get(
          'http://example.com/api/dai-deploy/deployment-status',
          (req, res, ctx) => {
            if (
              checkParam(req.url.searchParams, 'appName', ciId) &&
              checkParam(req.url.searchParams, 'order', 'end:desc') &&
              checkParam(req.url.searchParams, 'pageNumber', '1') &&
              checkParam(req.url.searchParams, 'resultsPerPage', '1') &&
              checkParam(req.url.searchParams, 'taskSet', 'ALL')
            ) {
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.json(currentDeploymentResponse),
              );
            }
            return res(
              ctx.status(400),
              ctx.set('Content-Type', 'application/json'),
            );
          },
        ),
      );

      const response = await client.getCurrentDeployments(
        ciId,
        0,
        1,
        'end',
        'desc',
        entity,
      );
      expect(response.items.deploymentStatus.length === 2).toBeTruthy();
    });
    it('should return error', async () => {
      const ciId = 'test';
      worker.use(
        rest.get(
          'http://example.com/api/dai-deploy/deployment-status',
          (_, res, ctx) => {
            res(ctx.status(401), ctx.set('Content-Type', 'application/json'));
          },
        ),
      );
      try {
        await client.getCurrentDeployments(ciId, 0, 1, '5', 'desc', entity);
      } catch (e) {
        expect(e instanceof ResponseError).toBeTruthy();
      }
    });
  });

  describe('getDeploymentsReports', () => {
    it('should return valid reponse', async () => {
      const ciId = 'test';
      worker.use(
        rest.get(
          'http://example.com/api/dai-deploy/deployment-history',
          (req, res, ctx) => {
            if (
              checkParam(req.url.searchParams, 'appName', ciId) &&
              checkParam(req.url.searchParams, 'order', 'startDate:desc') &&
              checkParam(req.url.searchParams, 'pageNumber', '1') &&
              checkParam(req.url.searchParams, 'resultsPerPage', '1')
            ) {
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.json(deploymentHistoryResponse),
              );
            }
            return res(
              ctx.status(400),
              ctx.set('Content-Type', 'application/json'),
            );
          },
        ),
      );

      const response = await client.getDeploymentsReports(
        ciId,
        0,
        1,
        'startDate',
        'desc',
        entity,
      );
      expect(response.items.deploymentStatus.length === 1).toBeTruthy();
    });

    it('should return error', async () => {
      const ciId = 'test';
      worker.use(
        rest.get(
          'http://example.com/api/dai-deploy/deployment-history',
          (_, res, ctx) =>
            res(ctx.status(401),
                ctx.set('Content-Type', 'application/json')),
        ),
      );
      try {
        await client.getDeploymentsReports(ciId, 0, 1, '5', 'desc', entity);
      } catch (e) {
        expect(e instanceof ResponseError).toBeTruthy();
      }
    });
  });
});
