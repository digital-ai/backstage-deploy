import React from 'react';
import {DeploymentsTable} from "../DeploymentsTable";
// @ts-ignore
import deployLogo from '../../assets/deployLogo.svg';
import {CardTab, TabbedCard} from '@backstage/core-components';
import {MissingAnnotationEmptyState, useEntity} from "@backstage/plugin-catalog-react";
import {DAI_DEPLOY_CI_ID_ANNOTATION} from "@digital-ai/plugin-dai-deploy-common";
import {isCiCdAvailable} from "../isCiCdAvailable";
import {Box, Paper} from "@material-ui/core";
import Typography from "@mui/material/Typography";

export const DaiDeployEntityDeploymentsContent = () => {
    const { entity } = useEntity();
    if(isCiCdAvailable(entity)){
        return (
            <Paper elevation={1} >
            <div>
                <Box display="inline-flex" alignItems="center" paddingTop={3} paddingLeft={2} paddingBottom={2}>
                    <img src={deployLogo} alt="Deploy logo" height="30px"/>
                    <Box mr={2}/>
                    <Typography variant="h5">Digital ai Deploy</Typography>
                </Box>
            <TabbedCard
                title="">
                <CardTab label="Deployment Status">
                    <DeploymentsTable api={"current"} />
                </CardTab>
                <CardTab label="Deployment Reports">
                    <DeploymentsTable api={"report"}/>
                </CardTab>
            </TabbedCard>
            </div>
            </Paper>
        );

    } else {
       return (<MissingAnnotationEmptyState annotation={DAI_DEPLOY_CI_ID_ANNOTATION} />);
    }

};