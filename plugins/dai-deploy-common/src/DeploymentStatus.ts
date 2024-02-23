/***/
/**
 * Common functionalities for the dai-deploy plugin.
 *
 * @packageDocumentation
 */

export type DeploymentStatusResponse = {
    deploymentStatus: DeploymentStatus[];
    totalCount?: number;
}

export type DeploymentStatus = {
    package: string;
    environment: string;
    type: string;
    user: string;
    state: string;
    scheduledDate?: string;
    startDate?: string;
    completionDate?: string;
    detailsRedirectUri: string;
}
