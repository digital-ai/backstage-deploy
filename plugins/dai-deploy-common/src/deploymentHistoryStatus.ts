/***/
/**
 * Common functionalities for the dai-deploy plugin.
 *
 * @packageDocumentation
 */

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
    rolledBack: boolean;
    worker_name: string | null;
    detailsRedirectUri: string;
}
