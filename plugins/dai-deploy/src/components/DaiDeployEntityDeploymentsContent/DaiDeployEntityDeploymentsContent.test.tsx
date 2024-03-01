import { DaiDeployApiClient, daiDeployApiRef } from '../../api';
import { DiscoveryApi, discoveryApiRef } from '@backstage/core-plugin-api';
import { SetupServer, setupServer } from 'msw/node';
import {
  TestApiProvider,
  renderInTestApp,
  setupRequestMockHandlers,
} from '@backstage/test-utils';
import {
  currentDeploymentResponse,
  deploymentHistoryResponse,
  entityStub,
} from '../../mocks/mocks';
import { DAI_DEPLOY_CI_ID_ANNOTATION } from '@digital-ai/plugin-dai-deploy-common';
import { DaiDeployEntityDeploymentsContent } from '../DaiDeployEntityDeploymentsContent';
import { Entity } from '@backstage/catalog-model';
import React from 'react';
import { rest } from 'msw';

let entity: { entity: Entity };

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return entity;
  },
}));

const discoveryApi: DiscoveryApi = {
  getBaseUrl: async () => 'http://example.com/api/dai-deploy',
};

describe('DaiDeployEntityDeploymentsContent', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    jest.resetAllMocks();
    entity = entityStub;
    setupResponseMocks(worker);
  });

  it('should display the active and archived tabs', async () => {
    if (entity.entity.metadata.annotations) {
      entity.entity.metadata.annotations[`${DAI_DEPLOY_CI_ID_ANNOTATION}`] =
        'test-app';
    }
    const rendered = await renderContent();
    expect(rendered.getByAltText('Deploy logo')).toBeInTheDocument();
    expect(rendered.getByText('Digital.ai Deploy')).toBeInTheDocument();
    expect(rendered.getByText('Active')).toBeInTheDocument();
    expect(rendered.getByText('Archived')).toBeInTheDocument();
  });
});

function setupResponseMocks(worker: SetupServer) {
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

  worker.use(
    rest.get(
      'http://example.com/api/dai-deploy/deployment-status',
      (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.set('Content-Type', 'application/json'),
          ctx.json(currentDeploymentResponse),
        ),
    ),
  );
}

async function renderContent() {
  return await renderInTestApp(
    <TestApiProvider
      apis={[
        [discoveryApiRef, discoveryApi],
        [daiDeployApiRef, new DaiDeployApiClient({ discoveryApi })],
      ]}
    >
      <DaiDeployEntityDeploymentsContent />
    </TestApiProvider>,
  );
}
