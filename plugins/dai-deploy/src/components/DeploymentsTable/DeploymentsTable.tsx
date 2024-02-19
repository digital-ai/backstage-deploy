import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import { LinkButton, ResponseErrorPanel, Table, TableColumn } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useCurrentDeployments } from '../../hooks';
import { formatTimestamp } from '../../utils/dateTimeUtils';

const columns: TableColumn[] = [
    {
      title: 'Package',
      field: 'package',
      width: 'auto',
      render: (row: Partial<any>) => (
        `${row.metadata.application}/${row.metadata.version}`
      ),
    },
    {
      title: 'Environment',
      field: 'metadata.environment',
      width: 'auto',
    },
    {
      title: 'Type',
      field: 'metadata.taskType',
      width: 'auto',
    },
    {
      title: 'User',
      field: 'owner',
      width: 'auto',
    },
    {
      title: 'State',
      field: 'state',
      width: 'auto',
    },
    {
      title: 'Scheduled Date',
      field: 'scheduledDate',
      width: 'auto',render: (row: Partial<any>) => (
        formatTimestamp(row.scheduledDate)
      ),
    },
    {
      title: 'Start Date',
      field: 'startDate',
      width: 'auto',
      render: (row: Partial<any>) => (
        formatTimestamp(row.startDate)
      ),
    },
    {
      title: 'End Date',
      field: 'completionDate',
      width: 'auto',
      render: (row: Partial<any>) => (
        formatTimestamp(row.completionDate)
      ),
    },
    {
      title: 'View',
      field: 'taskId',
      width: 'auto',
      render: (row: Partial<any>) => (
        <LinkButton to={`http://localhost:4516/#/reports/deployments?taskId=${row.id}`}>
          <LaunchIcon />
        </LinkButton>
      ),
    },
  ];
  
  export const DeploymentsTable = () => {
    const { entity } = useEntity();
    const { loading, error, items } = useCurrentDeployments(entity)

    if (error) {
      return <ResponseErrorPanel error={error} />;
    }
   
    return (<Table 
        title="Deployment Status"
        isLoading={loading}
        columns={columns}
        options={{
            paging: true,
            pageSize: 5,
            search: false
        }}
        data={items ?? []}
    />);
  }