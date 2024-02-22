import React, {useState} from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import { LinkButton, ResponseErrorPanel, Table, TableColumn } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useCurrentDeployments } from '../../hooks';
import { formatTimestamp } from '../../utils/dateTimeUtils';
import {CurrentDeploymentStatus} from "@digital-ai/plugin-dai-deploy-common";
import capitalize from 'lodash/capitalize';
import Typography from "@mui/material/Typography";
import {makeStyles} from "@material-ui/core";

type DenseTableProps = {
    tableData: CurrentDeploymentStatus[];
    loading: boolean;
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
};

const headerStyle: React.CSSProperties = { textTransform: "capitalize", whiteSpace: 'nowrap' };
const cellStyle: React.CSSProperties = { width: 'auto', whiteSpace: 'nowrap' };

const useStyles = makeStyles(theme => ({
    empty: {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
    }
}));

const columns: TableColumn[] = [
    {
      title: 'Package',
      field: 'package',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
        `${row.metadata.application}/${row.metadata.version}`
      ),
    },
    {
      title: 'Environment',
      field: 'metadata.environment',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
    },
    {
      title: 'Type',
      field: 'metadata.taskType',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
          capitalize(row.metadata.taskType)
      ),
    },
    {
      title: 'User',
      field: 'owner',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
    },
    {
      title: 'State',
      field: 'state',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
          capitalize(row.state)
      ),
    },
    {
      title: 'Scheduled Date',
      field: 'scheduledDate',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
        formatTimestamp(row.scheduledDate)
      ),
    },
    {
      title: 'Start Date',
      field: 'startDate',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
        formatTimestamp(row.startDate)
      ),
    },
    {
      title: 'End Date',
      field: 'completionDate',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
        formatTimestamp(row.completionDate)
      ),
    },
    {
      title: 'View',
      field: 'taskId',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
        <LinkButton to={`${row.detailsRedirectUri}`}>
          <LaunchIcon />
        </LinkButton>
      ),
    },
];

export const DenseTable = ({tableData, loading, page, pageSize, totalCount, onPageChange, onRowsPerPageChange}: DenseTableProps) => {
    const classes = useStyles();
    return (
        <Table
            title={<Typography variant="h6">Deployment tasks</Typography>}
            columns={columns}
            data={tableData}
            page={page}
            totalCount={totalCount}
            isLoading={loading}
            options={{
                paging: true,
                search: false,
                pageSize: pageSize,
                pageSizeOptions: [5, 10, 20, 50],
                padding: 'dense',
                showFirstLastPageButtons: true,
                showEmptyDataSourceMessage: !loading
            }}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            emptyContent={
                <Typography color="textSecondary" className={classes.empty}>
                    No tasks available
                </Typography>
            }
        />
    );
};

export const DeploymentsTable = () => {
    const { entity } = useEntity();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
        />
    );
}