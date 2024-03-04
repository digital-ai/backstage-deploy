import { ErrorResponseBody, ResponseError } from '@backstage/errors';
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
    const body: ErrorResponseBody = {
      error: {
        name: 'Connection refused',
        message: 'ECONNREFUSED',
        stack: 'lines',
      },
      request: { method: 'GET', url: '/' },
      response: { statusCode: 500 },
    };
    const response: Partial<Response> = {
      status: 500,
      statusText: 'Connection refused',
      text: async () => JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };
    const error = await ResponseError.fromResponse(response as Response);
    const rendered = renderContent(error);
    expect(
      (await rendered).getByText(
        `Warning: Connection Failed: Unable to Connect to Digital.ai Deploy`,
      ),
    ).toBeInTheDocument();
  });

  it('should render the error panel for unauthorized', async () => {
    const body: ErrorResponseBody = {
      error: { name: 'Unauthorized', message: 'Unauthorized', stack: 'lines' },
      request: { method: 'GET', url: '/' },
      response: { statusCode: 401 },
    };
    const response: Partial<Response> = {
      status: 401,
      statusText: 'Unauthorized',
      text: async () => JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };
    const error = await ResponseError.fromResponse(response as Response);
    const rendered = renderContent(error);
    expect(
      (await rendered).getByText(
        `Warning: Access Denied: Unauthorized to Use Digital.ai Deploy`,
      ),
    ).toBeInTheDocument();
  });

  it('should render the error panel for reports permission denied', async () => {
    const body: ErrorResponseBody = {
      error: {
        name: 'Permission denied',
        message: 'report#view permission denied',
        stack: 'lines',
      },
      request: { method: 'GET', url: '/' },
      response: { statusCode: 403 },
    };
    const response: Partial<Response> = {
      status: 403,
      statusText: 'Permission denied',
      text: async () => JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };
    const error = await ResponseError.fromResponse(response as Response);
    const rendered = renderContent(error);
    expect(
      (await rendered).getByText(
        `Warning: Permission Denied: The configured Deploy User lacks necessary permission for report#view in Digital.ai Deploy`,
      ),
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
