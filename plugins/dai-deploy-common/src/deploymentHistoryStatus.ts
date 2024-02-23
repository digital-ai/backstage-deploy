/***/
/**
 * Common functionalities for the dai-deploy plugin.
 *
 * @packageDocumentation
 */

export type DeploymentHistoryStatusResponse = {
    deploymentHistoryStatus: DeploymentHistoryStatus[];
    totalCount?: number;
}

export type DeploymentHistoryStatus = {
    taskId: string;
    startDate?: string;
    completionDate?: string;
    status: string;
    type: string;
    user: string;
    environment: string;
    environmentId: string;
    environmentIdWithoutRoot: string;
    package: string;
    rolledBack: string;
    worker_name: string | null;
    detailsRedirectUri: string;
}
