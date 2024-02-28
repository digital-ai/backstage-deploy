import {WarningPanel} from "@backstage/core-components";
import React from "react";
import {ResponseError} from "@backstage/errors";

type DeployErrorPanelProps = {
    error: Error;
};
export function DeployResponseErrorPanel(props: DeployErrorPanelProps) {
    const {error} = props;
    if (error.name == 'ResponseError') {
        const { body, cause } = error as ResponseError;
        const messageString = cause.message.replace(/\\n/g, '\n');
        const jsonString = JSON.stringify(body, undefined, 2);
        let title = undefined;
        if (jsonString.includes("ECONNREFUSED")) {
         title = "Connection Failed: Unable to Connect to Digital.ai Deploy";
        } else if(messageString.includes("Unauthorized")){
         title = ("Access Denied: Unauthorized to Use Digital.ai Deploy")
        }
        return (
            <WarningPanel
                title={title ?? messageString}
            />
        );
    } else {
        return (
            <WarningPanel
                title={error.message}
            />
        );
    }



}