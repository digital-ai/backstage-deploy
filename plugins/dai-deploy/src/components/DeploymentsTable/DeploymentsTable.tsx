import React from 'react';
import { Table, TableColumn } from '@backstage/core-components';

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
            "endDate": "2024-02-01T08:46:16.915+0000"
        },
        {
          "package": "D-32171/2.0",
          "environment": "Environments/localhost-env",
          "type": "UPDATE",
          "user": "admin",
          "state": "Done",
          "scheduledDate": "",
          "startDate": "2024-01-31T06:43:44.480+0000",
          "endDate": "2024-01-31T08:46:16.915+0000"
      }
    ]
    return (<Table 
        title="Deployment Status"
        columns={columns}
        options={{
            paging: true,
            pageSize: 5
        }}
        data={items}
    />);
  }