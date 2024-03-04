import { Box, makeStyles } from '@material-ui/core';
import { CardTab, TabbedCard } from '@backstage/core-components';
import {
  MissingAnnotationEmptyState,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { DAI_DEPLOY_CI_ID_ANNOTATION } from '@digital-ai/plugin-dai-deploy-common';
import { DeploymentsHistoryTable } from '../DeploymentsHistoryTable';
import { DeploymentsTable } from '../DeploymentsTable';
import { Paper } from '@material-ui/core';
import React from 'react';
import Typography from '@mui/material/Typography';
import deployLogo from '../../assets/deployLogo.svg';
import { isCiCdAvailable } from '../isCiCdAvailable';

const useStyles = makeStyles(theme => ({
  cardTabHeaderSpacing: {
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
}));
export const DaiDeployEntityDeploymentsContent = () => {
  const { entity } = useEntity();
  const classes = useStyles();
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
            <CardTab label="Active" className={classes.cardTabHeaderSpacing}>
              <DeploymentsTable />
            </CardTab>
            <CardTab label="Archived" className={classes.cardTabHeaderSpacing}>
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
