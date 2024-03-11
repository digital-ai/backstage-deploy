import {
  DAI_DEPLOY_CI_ID_ANNOTATION,
  DeploymentStatusResponse,
} from '@digital-ai/plugin-dai-deploy-common';
import { Entity } from '@backstage/catalog-model';
import { daiDeployApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { useAsyncRetry } from 'react-use';
import { useState } from 'react';

enum activeDeploymentOrderBy {
  'package' = 0,
  'environment' = 1,
  'type' = 2,
  'user' = 3,
  'state' = 4,
  'scheduled' = 5,
  'begin' = 6,
  'end' = 7,
}

enum archivedDeploymentOrderBy {
  'application' = 0,
  'environment_id' = 1,
  'taskType' = 2,
  'owner' = 3,
  'state' = 4,
  'startDate' = 5,
  'completionDate' = 6,
}

export function useCurrentDeployments(entity: Entity): {
  loading: boolean | false | true;
  error: undefined | Error;
  items: DeploymentStatusResponse | undefined;
  retry: () => void;
  page: any;
  setPage: (page: number) => void;
  rowsPerPage: any;
  setRowsPerPage: (pageSize: number) => void;
  setOrderDirection: (order: string) => void;
  setOrderBy: (orderBy: number) => void;
} {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState(7);
  const [orderDirection, setOrderDirection] = useState('desc');
  const api = useApi(daiDeployApiRef);
  const ciId = entity.metadata.annotations?.[DAI_DEPLOY_CI_ID_ANNOTATION];
  const direction = orderDirection === '' ? 'desc' : orderDirection;
  const sortColumn =
    orderBy !== -1 ? activeDeploymentOrderBy[orderBy] : 'begin';
  if (!ciId) {
    throw new Error(
      `Value for annotation "${DAI_DEPLOY_CI_ID_ANNOTATION}" was not found`,
    );
  }

  const { value, loading, error, retry } = useAsyncRetry(async () => {
    return api.getCurrentDeployments(
      ciId,
      page,
      rowsPerPage,
      sortColumn,
      direction,
    );
  }, [api, page, rowsPerPage, orderBy, orderDirection]);

  return {
    items: value?.items,
    loading,
    error,
    retry,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    setOrderDirection,
    setOrderBy,
  };
}

export function useDeploymentsReports(entity: Entity): {
  items?: DeploymentStatusResponse;
  loading: boolean;
  error?: Error;
  retry: () => void;
  page: any;
  setPage: (page: number) => void;
  rowsPerPage: any;
  setRowsPerPage: (pageSize: number) => void;
  setOrderDirection: (order: string) => void;
  setOrderBy: (orderBy: number) => void;
} {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState(5);
  const [orderDirection, setOrderDirection] = useState('desc');

  const api = useApi(daiDeployApiRef);
  const ciId = entity.metadata.annotations?.[DAI_DEPLOY_CI_ID_ANNOTATION];
  const direction = orderDirection === '' ? 'desc' : orderDirection;
  const sortColumn =
    orderBy !== -1 ? archivedDeploymentOrderBy[orderBy] : 'startDate';

  if (!ciId) {
    throw new Error(
      `Value for annotation "${DAI_DEPLOY_CI_ID_ANNOTATION}" was not found`,
    );
  }

  const { value, loading, error, retry } = useAsyncRetry(async () => {
    return api.getDeploymentsReports(
      ciId,
      page,
      rowsPerPage,
      sortColumn,
      direction,
    );
  }, [api, page, rowsPerPage, orderBy, orderDirection]);

  return {
    items: value?.items,
    loading,
    error,
    retry,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    setOrderDirection,
    setOrderBy,
  };
}
