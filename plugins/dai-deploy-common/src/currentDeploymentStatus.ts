/***/
/**
 * Common functionalities for the dai-deploy plugin.
 *
 * @packageDocumentation
 */

/** @public */
export type CurrentDeploymentStatusResponse = {
    currentDeploymentStatus: CurrentDeploymentStatus[];
    totalCount?: number;
}

export type CurrentDeploymentStatus = {
    id: string;
    owner: string;
    state: string;
    description: string;
    scheduledDate?: string;
    startDate?: string;
    completionDate?: string;
    metadata: metaData;
    workerId: number | null;
    detailsRedirectUri: string;
}

export type metaData = {
    worker_name?: string;
    environment_id: string;
    environment_reference_id: string;
    version: string;
    environment: string;
    satellite_ids: string;
    application: string;
    taskType: string;
}