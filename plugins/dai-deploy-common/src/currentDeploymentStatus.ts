/***/
/**
 * Common functionalities for the dai-deploy plugin.
 *
 * @packageDocumentation
 */

/** @public */
export type CurrentDeploymentStatus = {
    id: string;
    failures: number;
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
    environment_secured_ci: string;
    environment: string;
    version_id: string;
    satellite_ids: string;
    environment_internal_id: string;
    enableCopyArtifactRetry: string;
    application: string;
    application_reference_id: string;
    application_directory_ref: string;
    taskType: string;
    application_secured_ci: string;
    environment_directory_ref: string;
    application_internal_id: string;
}