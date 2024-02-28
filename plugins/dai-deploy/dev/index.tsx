import {
  DaiDeployEntityDeploymentsContent,
  daiDeployPlugin,
} from '../src/plugin';
import React from 'react';
import { createDevApp } from '@backstage/dev-utils';

createDevApp()
  .registerPlugin(daiDeployPlugin)
  .addPage({
    element: <DaiDeployEntityDeploymentsContent />,
    title: 'Root Page',
    path: '/dai-deploy',
  })
  .render();
