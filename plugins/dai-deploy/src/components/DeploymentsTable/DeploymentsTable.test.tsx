import React from 'react';
import { DeploymentsTable } from './DeploymentsTable';
import { render, screen } from '@testing-library/react';

describe('ExampleComponent', () => {
  const expectedColumns = [
        'Package', 
        'Environment', 
        'Type', 
        'User', 
        'State', 
        'Scheduled Date', 
        'Start Date', 
        'End Date'
    ];

  it('should render content', async () => {
    render(<DeploymentsTable />);
    expect(screen.getByText('Deployment Status')).toBeInTheDocument();
    expectedColumns.forEach(
        c => expect(screen.getByText(c)).toBeInTheDocument()
        );
  });

});
