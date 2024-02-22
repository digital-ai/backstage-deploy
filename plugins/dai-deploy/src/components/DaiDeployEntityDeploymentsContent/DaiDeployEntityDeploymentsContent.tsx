import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {DeploymentsTable} from "../DeploymentsTable";
// @ts-ignore
import deployLogo from '../../assets/deployLogo.svg';
import { CardTab, TabbedCard } from '@backstage/core-components';

export const DaiDeployEntityDeploymentsContent = () => {
    return (
        <TabbedCard
            title={
                <Box display="flex" alignItems="center">
                <img src={deployLogo} alt="Deploy logo" height="30px" />
                <Box mr={2} />
                <Typography variant="h6">Digital ai Deploy</Typography>
                </Box>}
        >
            <CardTab label="Status">
                <DeploymentsTable />
            </CardTab>
            <CardTab label="Reports">
                <div>Some content 2</div>
            </CardTab>
        </TabbedCard>
    );
};