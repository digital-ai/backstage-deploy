/***/
/**
 * Common functionalities for the dai-deploy plugin.
 *
 * @packageDocumentation
 */

/** @public */
export type DeployedApplicationStatusTypes = {
    applicationName: string;
    applicationUid: string;
    applicationPath: string;
    state: applicationState;
};

export type versionTag = {
    label?: string;
    state?: string;
}

export type applicationState = {
    destination?: string;
    destinationUid?: string;
    namespace?: string;
    versionTag?: versionTag;
    deploymentStatus?: string;
    deploymentType?: string;
    user?: string;
}