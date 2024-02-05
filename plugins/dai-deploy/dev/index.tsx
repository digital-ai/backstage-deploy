import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { daiDeployPlugin, DaiDeployPage } from '../src/plugin';

createDevApp()
  .registerPlugin(daiDeployPlugin)
  .addPage({
    element: <DaiDeployPage />,
    title: 'Root Page',
    path: '/dai-deploy'
  })
  .render();
