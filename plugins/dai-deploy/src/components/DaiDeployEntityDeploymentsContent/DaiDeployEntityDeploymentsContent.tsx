import { Box, makeStyles } from '@material-ui/core';
import { CardTab, TabbedCard } from '@backstage/core-components';
import {
  MissingAnnotationEmptyState,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import { DAI_DEPLOY_CI_ID_ANNOTATION } from '@digital-ai/plugin-dai-deploy-common';
import { DeploymentsHistoryTable } from '../DeploymentsHistoryTable';
import { DeploymentsTable } from '../DeploymentsTable';
import { Paper } from '@material-ui/core';
import React from 'react';
import deployLogoBlack from '../../assets/deployLogoBlack.svg';
import deployLogoWhite from '../../assets/deployLogoWhite.svg';
import { isCiCdAvailable } from '../isCiCdAvailable';
import { useObservable } from 'react-use';

const useStyles = makeStyles(theme => ({
  cardTabHeaderSpacing: {
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
}));
export const DaiDeployEntityDeploymentsContent = () => {
  const { entity } = useEntity();
  const classes = useStyles();
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );
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
            {themeId === 'dark' ? (
              <div>
                <img src={deployLogoWhite} alt="Deploy logo" />
              </div>
            ) : (
              <div>
                <img src={deployLogoBlack} alt="Deploy logo" />
              </div>
            )}
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
