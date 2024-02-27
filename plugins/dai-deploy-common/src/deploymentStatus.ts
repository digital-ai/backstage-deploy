/***/
import {DeploymentActiveData, DeploymentArchiveData} from "./deploymentsData";

/**
 * Common functionalities for the dai-deploy plugin.
 *
 * @packageDocumentation
 */

export type DeploymentStatusResponse = {
    deploymentStatus: DeploymentActiveData[] | DeploymentArchiveData[] ;
    totalCount?: number;
}
