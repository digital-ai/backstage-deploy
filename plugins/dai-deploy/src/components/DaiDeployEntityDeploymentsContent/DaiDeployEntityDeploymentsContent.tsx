import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {DeploymentsTable} from "../DeploymentsTable";
// @ts-ignore
import deployLogo from '../../assets/deployLogo.svg';
import { CardTab, TabbedCard } from '@backstage/core-components';
import {MissingAnnotationEmptyState, useEntity} from "@backstage/plugin-catalog-react";
import {DAI_DEPLOY_CI_ID_ANNOTATION} from "@digital-ai/plugin-dai-deploy-common";
import {isCiCdAvailable} from "../isCiCdAvailable";

export const DaiDeployEntityDeploymentsContent = () => {
    // @ts-ignore
    const { entity } = useEntity();
    if(isCiCdAvailable(entity)){
        return (
            <TabbedCard
                title={
                    <Box display="flex" alignItems="center">
                        <img src={deployLogo} alt="Deploy logo" height="30px" />
                        <Box mr={2} />
                        <Typography variant="h5">Digital ai Deploy1</Typography>
                    </Box>}
            >
                <CardTab label="Deployment Status">
                    <DeploymentsTable api={"current"} />
                </CardTab>
                <CardTab label="Deployment Reports">
                    <DeploymentsTable api={"report"}/>
                </CardTab>
            </TabbedCard>
        );
    } else {
       return (<MissingAnnotationEmptyState annotation={DAI_DEPLOY_CI_ID_ANNOTATION} />);
    }

};