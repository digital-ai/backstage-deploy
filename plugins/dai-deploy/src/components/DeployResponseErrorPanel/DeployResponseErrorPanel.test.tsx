import {
  AuthenticationError,
  NotAllowedError,
  NotFoundError,
  ServiceUnavailableError,
} from '@backstage/errors';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { DeployResponseErrorPanel } from './DeployResponseErrorPanel';
import React from 'react';

describe('DeployResponseErrorPanel', () => {
  it('should render the error panel with message', async () => {
    const error = new Error('test error');
    const rendered = renderContent(error);
    expect(
      (await rendered).getByText(`Warning: ${error.message}`),
    ).toBeInTheDocument();
  });

  it('should render the error panel for connection refused', async () => {
    const error = new ServiceUnavailableError(`Deploy Service Unavailable`);
    const rendered = renderContent(error);
    expect(
      (await rendered).getByText(`Warning: Deploy Service Unavailable`),
    ).toBeInTheDocument();
  });

  it('should render the error panel for unauthorized', async () => {
    const error = new AuthenticationError(
      `Access Denied: Missing or invalid deploy Token. Unauthorized to Use Digital.ai Deploy`,
    );

    const rendered = renderContent(error);
    expect(
      (await rendered).getByText(
        `Warning: Access Denied: Missing or invalid deploy Token. Unauthorized to Use Digital.ai Deploy`,
      ),
    ).toBeInTheDocument();
  });

  it('should render the error panel for reports permission denied', async () => {
    const error = new NotAllowedError(
      'Permission Denied: The configured Deploy User lacks necessary permission in Digital.ai Deploy',
    );
    const rendered = renderContent(error);
    expect(
      (await rendered).getByText(
        `Warning: Permission Denied: The configured Deploy User lacks necessary permission in Digital.ai Deploy`,
      ),
    ).toBeInTheDocument();
  });

  it('should render the error panel for not found', async () => {
    const error = new NotFoundError('Deploy service request not found');
    const rendered = renderContent(error);
    expect(
      (await rendered).getByText(`Warning: Deploy service request not found`),
    ).toBeInTheDocument();
  });
});

async function renderContent(error: Error) {
  return await renderInTestApp(
    <TestApiProvider apis={[]}>
      <DeployResponseErrorPanel error={error} />
    </TestApiProvider>,
  );
}
