import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import { LinkButton, Table, TableColumn } from '@backstage/core-components';

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
      field: 'type',
      width: 'auto',
    },
    {
      title: 'User',
      field: 'user',
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
      field: 'endDate',
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

    const items = [
        {
            "package": "app/1.0",
            "environment": "Environments/test/localhost",
            "type": "INITIAL",
            "user": "admin",
            "state": "Done",
            "scheduledDate": "",
            "startDate": "2024-02-01T08:43:44.480+0000",
            "endDate": "2024-02-01T08:46:16.915+0000",
            "taskId": "fe62430f-6ce6-41fc-a5e0-191ad48fa8c1"
        },
        {
          "package": "D-32171/2.0",
          "environment": "Environments/localhost-env",
          "type": "UPDATE",
          "user": "admin",
          "state": "Done",
          "scheduledDate": "",
          "startDate": "2024-01-31T06:43:44.480+0000",
          "endDate": "2024-01-31T08:46:16.915+0000",
          "taskId": "1b1cfecb-3e81-499d-b415-dbd11dfe248c"
      }
    ]
    return (<Table 
        title="Deployment Status"
        columns={columns}
        options={{
            paging: true,
            pageSize: 5,
            search: false
        }}
        data={items}
    />);
  }