import { formatTimestamp } from '../../utils/dateTimeUtils';
import capitalize from 'lodash/capitalize';
import Typography from "@mui/material/Typography";
import {makeStyles} from "@material-ui/core";
import React from "react";
import LaunchIcon from "@material-ui/icons/Launch";
import {LinkButton, Table, TableColumn} from "@backstage/core-components";
import {DeploymentActiveData, DeploymentArchiveData} from "@digital-ai/plugin-dai-deploy-common";

type DenseTableProps = {
    tableData:  DeploymentArchiveData[] | DeploymentActiveData[] ;
    loading: boolean;
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    columns: TableColumn[]
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

export const userColumns: TableColumn[] = [
    {
        title: 'User',
        field: 'user',
        cellStyle: cellStyle,
        headerStyle: headerStyle,
        render: (row: Partial<any>) => (
            ` ${row.owner}`
        ),
    },
 ]
export const stateColumns: TableColumn[] = [
    {
        title: 'State',
        field: 'state',
        cellStyle: cellStyle,
        headerStyle: headerStyle,
        render: (row: Partial<any>) => (
            capitalize(row.state)
        ),
    },
]
export const startAndEndDateColumns: TableColumn[] = [
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
]

export const packageColumns: TableColumn[] = [
    {
        title: 'Package',
        field: 'package',
        cellStyle: cellStyle,
        headerStyle: headerStyle,
        render: (row: Partial<any>) => (
            row.metadata ? `${row?.metadata?.application}/${row?.metadata?.version}` : row.package
        ),
    },
]
export const environmentColumns: TableColumn[] = [
    {
        title: 'Environment',
        field: 'environment',
        cellStyle: cellStyle,
        headerStyle: headerStyle,
        render: (row: Partial<any>) => (
            row.metadata ?  row.metadata.environment : row.environment
        ),
    },
    ]
export const typeColumns: TableColumn[] = [
    {
        title: 'Type',
        field: 'type',
        cellStyle: cellStyle,
        headerStyle: headerStyle,
        render: (row: Partial<any>) => (
            row.metadata ?  capitalize(row.metadata.taskType) : capitalize(row.type)
        ),
    },
];

export const scheduledDateColumns: TableColumn[] = [
    {
        title: 'Scheduled Date',
        field: 'scheduledDate',
        cellStyle: cellStyle,
        headerStyle: headerStyle,
        render: (row: Partial<any>) => (
            formatTimestamp(row.scheduledDate)
        ),
    },
]

export const redirectionColumns: TableColumn[] = [
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
]

export const activeDeploymentColumns: TableColumn[] = [
    ...packageColumns,
    ...environmentColumns,
    ...typeColumns,
    ...userColumns,
    ...stateColumns,
    ...scheduledDateColumns,
    ...startAndEndDateColumns,
    ...redirectionColumns
]
export const archiveDeploymentColumns: TableColumn[] = [
    ...packageColumns,
    ...environmentColumns,
    ...typeColumns,
    ...userColumns,
    ...stateColumns,
    ...startAndEndDateColumns,
    ...redirectionColumns
]

export const DenseTable = ({tableData, loading, page, pageSize, totalCount, onPageChange, onRowsPerPageChange,columns}: DenseTableProps) => {
    const classes = useStyles();
    return (
        <Table
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
                showEmptyDataSourceMessage: !loading,
                toolbar: false
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