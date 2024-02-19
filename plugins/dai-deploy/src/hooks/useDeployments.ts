import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import {
    CurrentDeploymentStatusResponse,
    DAI_DEPLOY_CI_ID_ANNOTATION
} from '@digital-ai/plugin-dai-deploy-common';
import {daiDeployApiRef} from '../api';

export function useCurrentDeployments(
    entity: Entity,
    page: number,
    rowsPerPage: number
): {
    items?: CurrentDeploymentStatusResponse;
    loading: boolean;
    error?: Error;
} {
    const api = useApi(daiDeployApiRef);
    const ciId = entity.metadata.annotations?.[DAI_DEPLOY_CI_ID_ANNOTATION];

    if (!ciId) {
        throw new Error(`Value for annotation "${DAI_DEPLOY_CI_ID_ANNOTATION}" was not found`);
    }

    const { value, loading, error } = useAsync(() => {
        return api.getCurrentDeployments(ciId, page, rowsPerPage)
    }, [api, page, rowsPerPage]);

    return {
        items: value?.items,
        loading,
        error,
    };
}