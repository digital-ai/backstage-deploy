import {
  DeploymentActiveData,
  DeploymentArchiveData,
} from '@digital-ai/plugin-dai-deploy-common';
import {Link, LinkButton, Table, TableColumn} from '@backstage/core-components';
import LaunchIcon from '@material-ui/icons/Launch';
import React from 'react';
import SyncIcon from '@material-ui/icons/Sync';
import Typography from '@mui/material/Typography';
import capitalize from 'lodash/capitalize';
import { formatTimestamp } from '../../utils/dateTimeUtils';
import { makeStyles } from '@material-ui/core';



type DenseTableProps = {
  tableData: DeploymentArchiveData[] | DeploymentActiveData[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  columns: TableColumn[];
  retry: () => void;
};
const headerStyle: React.CSSProperties = {
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
};
const cellStyle: React.CSSProperties = { width: 'auto', whiteSpace: 'nowrap' };

const useStyles = makeStyles(theme => ({
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const columnFactories = Object.freeze({
  createUserColumns(): TableColumn {
    return {
      title: 'User',
      field: 'owner',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => ` ${row.owner}`,
      searchable: true,
      sorting: true
    };
  },
  createStateColumns(): TableColumn {
    return {
      title: 'State',
      field: 'state',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => capitalize(row.state),
      searchable: true,
      sorting: true
    };
  },
  createStartDateColumns(): TableColumn {
    return {
      title: 'Start Date',
      field: 'startDate',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => formatTimestamp(row.startDate),
      searchable: true,
      sorting: true
    };
  },

  createEndDateColumns(): TableColumn {
    return {
      title: 'End Date',
      field: 'completionDate',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => formatTimestamp(row.completionDate),
      searchable: true,
      sorting: true
    };
  },

  createPackageColumns(): TableColumn {
    return {
      title: 'Package',
      field: 'package',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => row.package,
      searchable: true,
      sorting: true
    };
  },

  createActivePackageColumns(): TableColumn {
    return {
      title: 'Package',
      field: 'metadata.application',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      customFilterAndSearch: (query, row: any) =>
          `${row.metadata.application} ${row.metadata.version}`
              .toLocaleUpperCase('en-US')
              .includes(query.toLocaleUpperCase('en-US')),
      render: (row: Partial<any>) => `${row.metadata.application}/${row.metadata.version}`,
      customSort: (a: any, b: any) => {
        const packageA = `${a.metadata.application} ${a.metadata.version}`
        const packageB = `${b.metadata.application} ${b.metadata.version}`
        return packageA.localeCompare(packageB);
      },
      searchable: true,
      sorting: true
    };
  },

  createEnvironmentColumns(): TableColumn {
    return {
      title: 'Environment',
      field: 'environment',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
        <Link to={row.environmentRedirectUri}>
          {row.environment}
        </Link>
      ),
      searchable: true,
      sorting: true
    };
  },

  createActiveEnvironmentColumns(): TableColumn {
    return {
      title: 'Environment',
      field: 'metadata.environment',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
          <Link to={row.environmentRedirectUri}>
            {row.metadata.environment}
          </Link>
      ),
      searchable: true,
      sorting: true
    };
  },
  createScheduledDateColumns(): TableColumn {
    return {
      title: 'Scheduled Date',
      field: 'scheduledDate',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => formatTimestamp(row.scheduledDate),
      searchable: true,
      sorting: true
    };
  },
  createTypeColumns(): TableColumn {
    return {
      title: 'Type',
      field: 'type',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => capitalize(row.type),
      searchable: true,
      sorting: true
    };
  },

  createActiveTypeColumns(): TableColumn {
    return {
      title: 'Type',
      field: 'metadata.taskType',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => capitalize(row.metadata.taskType),
      searchable: true,
      sorting: true
    };
  },

  createRedirectionColumns(): TableColumn {
    return {
      title: 'View',
      field: 'taskId',
      cellStyle: cellStyle,
      headerStyle: headerStyle,
      render: (row: Partial<any>) => (
        <LinkButton to={`${row.detailsRedirectUri}`}>
          <LaunchIcon />
        </LinkButton>
      ),
      searchable: true,
      sorting: true
    };
  },
});

export const defaultActiveColumns: TableColumn[] = [
  columnFactories.createActivePackageColumns(),
  columnFactories.createActiveEnvironmentColumns(),
  columnFactories.createActiveTypeColumns(),
  columnFactories.createUserColumns(),
  columnFactories.createStateColumns(),
  columnFactories.createScheduledDateColumns(),
  columnFactories.createStartDateColumns(),
  columnFactories.createEndDateColumns(),
  columnFactories.createRedirectionColumns(),
];

export const defaultArchivedColumns: TableColumn[] = [
  columnFactories.createPackageColumns(),
  columnFactories.createEnvironmentColumns(),
  columnFactories.createTypeColumns(),
  columnFactories.createUserColumns(),
  columnFactories.createStateColumns(),
  columnFactories.createStartDateColumns(),
  columnFactories.createEndDateColumns(),
  columnFactories.createRedirectionColumns(),
];

export const DenseTable = ({
  tableData,
  loading,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  columns,
  retry
}: DenseTableProps) => {
  const classes = useStyles();
  return (
    <Table
      columns={columns}
      data={tableData}
      page={page}
      totalCount={totalCount}
      isLoading={loading}
      actions={[
        {
          icon: () => <SyncIcon fontSize="default"/>,
          tooltip: 'Refresh Data',
          isFreeAction: true,
          onClick: () => retry(),
        },
      ]}
      options={{
        paging: true,
        search: true,
        showTitle: false,
        pageSize: pageSize,
        pageSizeOptions: [5, 10, 20, 50],
        padding: 'dense',
        showFirstLastPageButtons: true,
        showEmptyDataSourceMessage: !loading,
        toolbar: true,
        toolbarButtonAlignment: "left"
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
