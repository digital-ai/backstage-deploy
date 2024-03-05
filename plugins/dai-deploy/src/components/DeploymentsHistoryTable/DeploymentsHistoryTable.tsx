import { DenseTable, defaultArchivedColumns } from '../DenseTable/DenseTable';
import { DeployResponseErrorPanel } from "../DeployResponseErrorPanel";
import React from 'react';
import { useDeploymentsReports } from '../../hooks';
import { useEntity } from '@backstage/plugin-catalog-react';


export const DeploymentsHistoryTable = () => {
  const { entity } = useEntity();

  const { items, loading, error, retry, page, setPage, rowsPerPage, setRowsPerPage, setOrderDirection, setOrderBy} = useDeploymentsReports(
    entity
  );

  if (error) {
    return <DeployResponseErrorPanel error={error} />;
  }

  return (
    <DenseTable
      page={page}
      pageSize={rowsPerPage}
      loading={loading}
      totalCount={items?.totalCount ?? 100}
      tableData={items?.deploymentStatus || []}
      onRowsPerPageChange={setRowsPerPage}
      onPageChange={setPage}
      columns={defaultArchivedColumns}
      retry={retry}
      onOrderDirection={setOrderDirection}
      onOrderBy={setOrderBy}
      />
  );
};
