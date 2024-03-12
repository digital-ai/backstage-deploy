import { DaiDeployApiClient, daiDeployApiRef } from '../../api';
import {
  DiscoveryApi,
  IdentityApi,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
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
import { EntityProvider } from '@backstage/plugin-catalog-react';
import React from 'react';
import { rest } from 'msw';

let entity: { entity: Entity };

const discoveryApi: DiscoveryApi = {
  getBaseUrl: async () => 'http://example.com/api/dai-deploy',
};

const identityApi = {
  getCredentials: jest.fn(),
} as unknown as IdentityApi;

describe('DaiDeployEntityDeploymentsContent', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    jest.resetAllMocks();
    entity = entityStub;
    setupResponseMocks(worker);
    jest.spyOn(identityApi, 'getCredentials').mockImplementation(async () =>
        ({token: 'token'})
    );
  });

  it('should display the active and archived tabs', async () => {
    if (entity.entity.metadata.annotations) {
      entity.entity.metadata.annotations[`${DAI_DEPLOY_CI_ID_ANNOTATION}`] =
        'test-app';
    }
    const rendered = await renderContent();
    const image = rendered.getByAltText('Deploy logo') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('deployLogoBlack');
    expect(rendered.getByText('Active')).toBeInTheDocument();
    expect(rendered.getByText('Archived')).toBeInTheDocument();
  });

  it('should display error message for missing annotation', async () => {
    entity.entity.metadata.annotations = {};
    const rendered = await renderContent();
    expect(rendered.getByText('Missing Annotation')).toBeInTheDocument();
    expect(
      rendered.getByText(`${DAI_DEPLOY_CI_ID_ANNOTATION}`),
    ).toBeInTheDocument();
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
        [identityApiRef, identityApi],
        [
          daiDeployApiRef,
          new DaiDeployApiClient({ discoveryApi, identityApi }),
        ],
      ]}
    >
      <EntityProvider entity={entity.entity}>
        <DaiDeployEntityDeploymentsContent />
      </EntityProvider>
    </TestApiProvider>,
  );
}
