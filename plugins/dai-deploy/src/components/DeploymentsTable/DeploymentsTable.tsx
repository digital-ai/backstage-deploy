import React, {useState} from 'react';
import {
    ResponseErrorPanel,
} from '@backstage/core-components';

import { useEntity } from '@backstage/plugin-catalog-react';
import {useCurrentDeployments} from '../../hooks';
import {defaultActiveColumns, DenseTable} from "../DenseTable/DenseTable";


export const DeploymentsTable = () => {
    const { entity } = useEntity();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

        const {items, loading, error} =
            useCurrentDeployments(entity, page, rowsPerPage)

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
            columns={defaultActiveColumns}
        />
    );
}