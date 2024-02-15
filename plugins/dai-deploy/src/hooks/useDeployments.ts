import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { CurrentDeploymentStatus, DAI_DEPLOY_CI_ID_ANNOTATION } from '@digital-ai/plugin-dai-deploy-common';
import { daiDeployApiRef } from '../api';

export function useDeployments(
    entity: Entity
): {
    items?: CurrentDeploymentStatus[];
    loading: boolean;
    error?: Error;
} {
    const api = useApi(daiDeployApiRef);
    const ciId = entity.metadata.annotations?.[DAI_DEPLOY_CI_ID_ANNOTATION];

    if (!ciId) {
        throw new Error(`Value for annotation "${DAI_DEPLOY_CI_ID_ANNOTATION}" was not found`);
    }
    
    const { value, loading, error } = useAsync(() => {
        return api.getDeployments(ciId)
    }, [api]);

    return {
        items: value?.items,
        loading,
        error,
    };
}