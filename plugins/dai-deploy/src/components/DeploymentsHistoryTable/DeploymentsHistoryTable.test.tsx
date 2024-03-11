/* eslint-disable jest/no-conditional-expect */

import {
  AuthenticationError,
  NotAllowedError,
  ServiceUnavailableError,
} from '@backstage/errors';
import { DaiDeployApi, DaiDeployApiClient, daiDeployApiRef } from '../../api';
import {
  DiscoveryApi,
  discoveryApiRef,
  IdentityApi, identityApiRef,
} from '@backstage/core-plugin-api';
import {
  TestApiProvider,
  renderInTestApp,
  setupRequestMockHandlers,
} from '@backstage/test-utils';
import { deploymentHistoryResponse, entityStub } from '../../mocks/mocks';
import { DAI_DEPLOY_CI_ID_ANNOTATION } from '@digital-ai/plugin-dai-deploy-common';
import { DeploymentsHistoryTable } from './DeploymentsHistoryTable';
import { Entity } from '@backstage/catalog-model';
import React from 'react';
import capitalize from 'lodash/capitalize';
import { formatTimestamp } from '../../utils/dateTimeUtils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

let entity: { entity: Entity };

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return entity;
  },
}));

const discoveryApi: DiscoveryApi = {
  getBaseUrl: async () => 'http://example.com/api/dai-deploy',
};

const identityApi: IdentityApi = {
  getCredentials: async () => 'token'
} as unknown as IdentityApi;

describe('DeploymentsHistoryTable', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    jest.resetAllMocks();

    entity = entityStub;
    if (entity.entity.metadata.annotations) {
      entity.entity.metadata.annotations[`${DAI_DEPLOY_CI_ID_ANNOTATION}`] =
        'test-app';
    }
  });

  const expectedColumns = [
    'Package',
    'Environment',
    'Type',
    'User',
    'State',
    'Start Date',
    'End Date',
    'View',
  ];

  it('should render content with rows and columns', async () => {
    worker.use(
      rest.get(
        'http://example.com/api/dai-deploy/deployment-history',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(deploymentHistoryResponse),
          ),
      ),
    );
    const rendered = await renderContent();

    const deploymentHistory = deploymentHistoryResponse.deploymentStatus;
    expectedColumns.forEach(c =>
      expect(rendered.getByText(c)).toBeInTheDocument(),
    );
    deploymentHistory.forEach(e => {
      expect(rendered.getByText(e.package)).toBeInTheDocument();
      expect(rendered.getByText(e.environment)).toBeInTheDocument();
      expect(rendered.getByText(capitalize(e.type))).toBeInTheDocument();
      expect(rendered.getByText(e.owner)).toBeInTheDocument();
      expect(rendered.getByText(capitalize(e.state))).toBeInTheDocument();
      if (e.startDate) {
        expect(
          rendered.getByText(formatTimestamp(e.startDate)),
        ).toBeInTheDocument();
      }
      if (e.completionDate) {
        expect(
          rendered.getByText(formatTimestamp(e.completionDate)),
        ).toBeInTheDocument();
      }
    });
  });

  it('should render content with no rows', async () => {
    worker.use(
      rest.get(
        'http://example.com/api/dai-deploy/deployment-history',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({}),
          ),
      ),
    );
    const deploymentHistory = deploymentHistoryResponse.deploymentStatus;
    const rendered = await renderContent();
    expectedColumns.forEach(c =>
      expect(rendered.getByText(c)).toBeInTheDocument(),
    );
    deploymentHistory.forEach(e => {
      expect(rendered.queryByText(e.package)).not.toBeInTheDocument();
      expect(rendered.queryByText(e.environment)).not.toBeInTheDocument();
      expect(rendered.queryByText(e.type)).not.toBeInTheDocument();
      expect(rendered.queryByText(e.owner)).not.toBeInTheDocument();
      expect(rendered.queryByText(e.state)).not.toBeInTheDocument();
      if (e.startDate) {
        expect(
          rendered.queryByText(formatTimestamp(e.startDate)),
        ).not.toBeInTheDocument();
      }
      if (e.completionDate) {
        expect(
          rendered.queryByText(formatTimestamp(e.completionDate)),
        ).not.toBeInTheDocument();
      }
    });
  });

  it('should show the error', async () => {
    const deploymentHistoryApiWithError: Partial<DaiDeployApi> = {
      getDeploymentsReports: () => Promise.reject(new Error('Failed to fetch')),
    };
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [discoveryApiRef, discoveryApi],
          [identityApiRef, identityApi],
          [daiDeployApiRef, deploymentHistoryApiWithError],
        ]}
      >
        <DeploymentsHistoryTable />
      </TestApiProvider>,
    );
    expect(getByText('Warning: Failed to fetch')).toBeInTheDocument();
  });

  it('should show the appropriate error in case of a connection error', async () => {
    const deploymentHistoryConnectionRefused = new ServiceUnavailableError(
      `Deploy Service Unavailable`,
    );
    const deploymentHistoryApiWithError: Partial<DaiDeployApi> = {
      getDeploymentsReports: () =>
        Promise.reject(deploymentHistoryConnectionRefused),
    };
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [discoveryApiRef, discoveryApi],
          [identityApiRef, identityApi],
          [daiDeployApiRef, deploymentHistoryApiWithError],
        ]}
      >
        <DeploymentsHistoryTable />
      </TestApiProvider>,
    );
    expect(
      getByText(`Warning: Deploy Service Unavailable`),
    ).toBeInTheDocument();
  });
  it('should show the appropriate error in case of a Unauthorized', async () => {
    const deploymentHistoryUnAuthorizedResponse = new AuthenticationError(
      `Access Denied: Missing or invalid deploy Token. Unauthorized to Use Digital.ai Deploy`,
    );
    const deploymentHistoryApiWithError: Partial<DaiDeployApi> = {
      getDeploymentsReports: () =>
        Promise.reject(deploymentHistoryUnAuthorizedResponse),
    };
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [discoveryApiRef, discoveryApi],
          [identityApiRef, identityApi],
          [daiDeployApiRef, deploymentHistoryApiWithError],
        ]}
      >
        <DeploymentsHistoryTable />
      </TestApiProvider>,
    );
    expect(
      getByText(
        `Warning: Access Denied: Missing or invalid deploy Token. Unauthorized to Use Digital.ai Deploy`,
      ),
    ).toBeInTheDocument();
  });

  it('should show the appropriate error in case of a permission error in deploy', async () => {
    const deploymentHistoryPermissionErorResponse = new NotAllowedError(
      'Permission Denied: The configured Deploy User lacks necessary permission in Digital.ai Deploy',
    );
    const deploymentHistoryApiWithError: Partial<DaiDeployApi> = {
      getDeploymentsReports: () =>
        Promise.reject(deploymentHistoryPermissionErorResponse),
    };
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [discoveryApiRef, discoveryApi],
          [identityApiRef, identityApi],
          [daiDeployApiRef, deploymentHistoryApiWithError],
        ]}
      >
        <DeploymentsHistoryTable />
      </TestApiProvider>,
    );
    expect(
      getByText(
        `Warning: Permission Denied: The configured Deploy User lacks necessary permission in Digital.ai Deploy`,
      ),
    ).toBeInTheDocument();
  });
});

async function renderContent() {
  return await renderInTestApp(
    <TestApiProvider
      apis={[
        [discoveryApiRef, discoveryApi],
        [identityApiRef, identityApi],
        [
          daiDeployApiRef,
          new DaiDeployApiClient({ discoveryApi, identityApi }),
        ],
      ]}
    >
      <DeploymentsHistoryTable />
    </TestApiProvider>,
  );
}
