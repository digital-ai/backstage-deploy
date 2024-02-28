import { Box, Paper } from '@material-ui/core';
import { CardTab, TabbedCard } from '@backstage/core-components';
import {
  MissingAnnotationEmptyState,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { DAI_DEPLOY_CI_ID_ANNOTATION } from '@digital-ai/plugin-dai-deploy-common';
import { DeploymentsHistoryTable } from '../DeploymentsHistoryTable';
import { DeploymentsTable } from '../DeploymentsTable';
import React from 'react';
import Typography from '@mui/material/Typography';
import deployLogo from '../../assets/deployLogo.svg';
import { isCiCdAvailable } from '../isCiCdAvailable';

export const DaiDeployEntityDeploymentsContent = () => {
  const { entity } = useEntity();
  if (isCiCdAvailable(entity)) {
    return (
      <Paper elevation={1}>
        <div>
          <Box
            display="inline-flex"
            alignItems="center"
            paddingTop={3}
            paddingLeft={2}
            paddingBottom={2}
          >
            <img src={deployLogo} alt="Deploy logo" height="30px" />
            <Box mr={2} />
            <Typography variant="h5">Digital ai Deploy</Typography>
          </Box>
          <TabbedCard title="">
            <CardTab label="Active">
              <DeploymentsTable />
            </CardTab>
            <CardTab label="Archived">
              <DeploymentsHistoryTable />
            </CardTab>
          </TabbedCard>
        </div>
      </Paper>
    );
  }
  return (
    <MissingAnnotationEmptyState annotation={DAI_DEPLOY_CI_ID_ANNOTATION} />
  );
};
