import {
  DAI_DEPLOY_CI_ID_ANNOTATION,
  DeploymentStatusResponse,
} from '@digital-ai/plugin-dai-deploy-common';
import { Entity } from '@backstage/catalog-model';
import { daiDeployApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import {useAsyncRetry} from "react-use";

export function useCurrentDeployments(
  entity: Entity,
  page: number,
  rowsPerPage: number,
): {
  loading: boolean | false | true;
  error: undefined | Error;
  items: DeploymentStatusResponse | undefined;
  retry: () => void
} {
  const api = useApi(daiDeployApiRef);
  const ciId = entity.metadata.annotations?.[DAI_DEPLOY_CI_ID_ANNOTATION];

  if (!ciId) {
    throw new Error(
      `Value for annotation "${DAI_DEPLOY_CI_ID_ANNOTATION}" was not found`,
    );
  }

  const { value, loading, error,retry } = useAsyncRetry(async() => {
    return api.getCurrentDeployments(ciId, page, rowsPerPage);
  }, [api, page, rowsPerPage]);

  return {
    items: value?.items,
    loading,
    error,
    retry
  };
}

export function useDeploymentsReports(
  entity: Entity,
  page: number,
  rowsPerPage: number,
): {
  items?: DeploymentStatusResponse;
  loading: boolean;
  error?: Error;
  retry: () => void
} {
  const api = useApi(daiDeployApiRef);
  const ciId = entity.metadata.annotations?.[DAI_DEPLOY_CI_ID_ANNOTATION];

  if (!ciId) {
    throw new Error(
      `Value for annotation "${DAI_DEPLOY_CI_ID_ANNOTATION}" was not found`,
    );
  }

  const { value, loading, error,retry } = useAsyncRetry(async() => {
    return api.getDeploymentsReports(ciId, page, rowsPerPage);
  }, [api, page, rowsPerPage]);

  return {
    items: value?.items,
    loading,
    error,
    retry
  };
}
