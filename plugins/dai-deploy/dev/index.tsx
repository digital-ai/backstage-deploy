import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { daiDeployPlugin, DaiDeployEntityDeploymentsContent } from '../src/plugin';

createDevApp()
  .registerPlugin(daiDeployPlugin)
  .addPage({
    element: <DaiDeployEntityDeploymentsContent />,
    title: 'Root Page',
    path: '/dai-deploy'
  })
  .render();
