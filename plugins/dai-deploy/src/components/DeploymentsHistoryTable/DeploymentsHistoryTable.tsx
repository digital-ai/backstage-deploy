import React, {useState} from 'react';
import {
    ResponseErrorPanel,
} from '@backstage/core-components';

import { useEntity } from '@backstage/plugin-catalog-react';
import {useDeploymentsReports} from '../../hooks';
import {archiveDeploymentColumns, DenseTable} from "../DenseTable/DenseTable";

export const DeploymentsHistoryTable = () => {
    const { entity } = useEntity();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

        const {items, loading, error} =
             useDeploymentsReports(entity, page, rowsPerPage);

    if (error) {
      return <ResponseErrorPanel error={error} />;
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
            columns={archiveDeploymentColumns}
        />
    );
}