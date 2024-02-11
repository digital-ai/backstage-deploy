import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {Config} from "@backstage/config";
import {ApplicationStatusApi} from "../api";

export interface RouterOptions {
  config: Config;
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const  applicationStatusApi = ApplicationStatusApi.fromConfig(config, logger);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });
  router.get('/application-status/:appName', async (req, res) => {
    const { appName } = req.params;
    const deploymentAppInfo = await applicationStatusApi.getApplicationDeploymentInfo(appName);
    res.status(200).json(deploymentAppInfo);
  });
  router.use(errorHandler());
  return router;
}
