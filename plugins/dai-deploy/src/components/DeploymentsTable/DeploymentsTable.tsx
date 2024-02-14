import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import { LinkButton, ResponseErrorPanel, Table, TableColumn } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useDeployments } from '../../hooks';

const columns: TableColumn[] = [
    {
      title: 'Package',
      field: 'package',
      width: 'auto',
    },
    {
      title: 'Environment',
      field: 'environment',
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
      width: 'auto',
      type: 'datetime',
    },
    {
      title: 'Start Date',
      field: 'startDate',
      width: 'auto',
      type: 'datetime',
    },
    {
      title: 'End Date',
      field: 'completionDate',
      width: 'auto',
      type: 'datetime',
    },
    {
      title: 'View',
      field: 'taskId',
      width: 'auto',
      render: (row: Partial<any>) => (
        <LinkButton to={`http://localhost:4516/#/reports/deployments?taskId=${row.taskId}`}>
          <LaunchIcon />
        </LinkButton>
      ),
    },
  ];
  
  export const DeploymentsTable = () => {
    const { entity } = useEntity();
    const { loading, error, items } = useDeployments(entity)

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