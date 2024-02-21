import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { DiscoveryApi, discoveryApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp, setupRequestMockHandlers, TestApiProvider } from '@backstage/test-utils';
import { DeploymentsTable } from './DeploymentsTable';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { currentDeploymentResponse, entityStub } from '../../mocks/mocks';
import { DAI_DEPLOY_CI_ID_ANNOTATION } from '@digital-ai/plugin-dai-deploy-common';
import { daiDeployApiRef, DaiDeployApiClient } from '../../api';
import { formatTimestamp } from '../../utils/dateTimeUtils';
import capitalize from "lodash/capitalize";

let entity: { entity: Entity };

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return entity;
  },
}));

const discoveryApi: DiscoveryApi = {
  getBaseUrl: async () => 'http://example.com/api/dai-deploy',
}

describe('DeploymentsTable', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    jest.resetAllMocks();

    entity = entityStub;
      entity.entity.metadata.annotations ?
        entity.entity.metadata.annotations[`${DAI_DEPLOY_CI_ID_ANNOTATION}`] = 'test-app' : '';
  });

  const expectedColumns = [
        'Package',
        'Environment',
        'Type',
        'User',
        'State',
        'Scheduled Date',
        'Start Date',
        'End Date',
        'View'
    ];

  it('should render content with rows and columns', async () => {
    worker.use(
      rest.get('http://example.com/api/dai-deploy/deployment-status', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.set('Content-Type', 'application/json'),
          ctx.json(currentDeploymentResponse),
        ),
      ),
    );
    const rendered = await renderContent();
    const currentDeploymentStatus = currentDeploymentResponse.currentDeploymentStatus;
    expect(rendered.getByText('Deployment Status')).toBeInTheDocument();
    expectedColumns.forEach(
        c => expect(rendered.getByText(c)).toBeInTheDocument()
        );
      currentDeploymentStatus.forEach(
      e => {
        expect(rendered.getByText(e.metadata.application + '/' + e.metadata.version)).toBeInTheDocument()
        expect(rendered.getByText(e.metadata.environment)).toBeInTheDocument()
        expect(rendered.getByText(capitalize(e.metadata.taskType))).toBeInTheDocument()
        expect(rendered.getByText(e.owner)).toBeInTheDocument()
        expect(rendered.getByText(capitalize(e.state))).toBeInTheDocument()
        if (e.scheduledDate)  {
          expect(rendered.getByText(formatTimestamp(e.scheduledDate))).toBeInTheDocument()
        }
        if (e.startDate) {
          expect(rendered.getByText(formatTimestamp(e.startDate))).toBeInTheDocument()
        }
        if (e.completionDate) {
          expect(rendered.getByText(formatTimestamp(e.completionDate))).toBeInTheDocument()
        }
      }
    );
  });

  it('should render content with no rows', async () => {
    worker.use(
      rest.get('http://example.com/api/dai-deploy/deployment-status', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        ),
      ),
    );
    const currentDeploymentStatus = currentDeploymentResponse.currentDeploymentStatus;
    const rendered = await renderContent();
    expect(rendered.getByText('Deployment Status')).toBeInTheDocument();
    expectedColumns.forEach(
        c => expect(rendered.getByText(c)).toBeInTheDocument()
        );
      currentDeploymentStatus.forEach(
      e => {
        expect(rendered.queryByText(e.metadata.application + '/' + e.metadata.version)).not.toBeInTheDocument()
        expect(rendered.queryByText(e.metadata.environment)).not.toBeInTheDocument()
        expect(rendered.queryByText(e.metadata.taskType)).not.toBeInTheDocument()
        expect(rendered.queryByText(e.owner)).not.toBeInTheDocument()
        expect(rendered.queryByText(e.state)).not.toBeInTheDocument()
        if (e.scheduledDate)  {
          expect(rendered.queryByText(formatTimestamp(e.scheduledDate))).not.toBeInTheDocument()
        }
        if (e.startDate) {
          expect(rendered.queryByText(formatTimestamp(e.startDate))).not.toBeInTheDocument()
        }
        if (e.completionDate) {
          expect(rendered.queryByText(formatTimestamp(e.completionDate))).not.toBeInTheDocument()
        }
      }
    );
  });

});

async function renderContent() {
  return await renderInTestApp(
    <TestApiProvider apis={
        [
          [discoveryApiRef, discoveryApi],
          [
            daiDeployApiRef,
            new DaiDeployApiClient({ discoveryApi })
          ]
        ]
      }>
      <DeploymentsTable />
    </TestApiProvider>
  );
}