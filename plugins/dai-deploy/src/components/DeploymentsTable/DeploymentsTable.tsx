import React, {useState} from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import { LinkButton, ResponseErrorPanel, Table, TableColumn } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useCurrentDeployments } from '../../hooks';
import { formatTimestamp } from '../../utils/dateTimeUtils';
import {CurrentDeploymentStatus} from "@digital-ai/plugin-dai-deploy-common";

type DenseTableProps = {
    tableData: CurrentDeploymentStatus[];
    loading: boolean;
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
};

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
        <LinkButton to={`${row.detailsRedirectUri}`}>
          <LaunchIcon />
        </LinkButton>
      ),
    },
];

export const DenseTable = ({tableData, loading, page, pageSize, totalCount, onPageChange, onRowsPerPageChange}: DenseTableProps) => {
    return (
        <Table
            title="Deployment Status"
            columns={columns}
            data={tableData}
            page={page}
            totalCount={totalCount}
            isLoading={loading}
            options={{
                paging: true,
                search: false,
                pageSize: pageSize,
                padding: 'dense',
                showFirstLastPageButtons: true,
            }}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
        />
    );
};

  export const DeploymentsTable = () => {
    const { entity } = useEntity();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { items, loading, error} = useCurrentDeployments(entity, page, rowsPerPage);

    if (error) {
      return <ResponseErrorPanel error={error} />;
    }

    return (
        <DenseTable
        page={page}
        pageSize={rowsPerPage}
        loading={loading}
        totalCount={items?.totalCount ?? 100}
        tableData={items?.currentDeploymentStatus || []}
        onRowsPerPageChange={setRowsPerPage}
        onPageChange={setPage}
    />);
  }