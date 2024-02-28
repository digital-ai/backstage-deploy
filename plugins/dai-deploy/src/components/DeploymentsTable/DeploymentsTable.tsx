import { DenseTable, defaultActiveColumns } from '../DenseTable/DenseTable';
import React, { useState } from 'react';
import { useCurrentDeployments } from '../../hooks';
import { useEntity } from '@backstage/plugin-catalog-react';
import {DeployResponseErrorPanel} from "../DeployResponseErrorPanel";

export const DeploymentsTable = () => {
  const { entity } = useEntity();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { items, loading, error } = useCurrentDeployments(
    entity,
    page,
    rowsPerPage,
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
      columns={defaultActiveColumns}
    />
  );
};
