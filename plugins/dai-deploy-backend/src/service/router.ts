import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {Config} from "@backstage/config";
import { ApplicationStatusApi, CurrentDeploymentStatusApi } from "../api";
import {getValue} from "../api/apiConfig";

export interface RouterOptions {
  config: Config;
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const  applicationStatusApi = ApplicationStatusApi.fromConfig(config, logger);
  const currentDeploymentStatusApi = CurrentDeploymentStatusApi.fromConfig(config, logger);

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
  router.post('/deployment-status', async (req, res) => {
    const appName = getValue(req.query.appName?.toString());
    const beginDate = getValue(req.query.beginDate?.toString());
    const endDate = getValue(req.query.endDate?.toString());
    const order = getValue(req.query.order?.toString());
    const pageNumber = getValue(req.query.pageNumber?.toString());
    const resultsPerPage = getValue(req.query.resultsPerPage?.toString());
    const taskSet = getValue(req.query.taskSet?.toString());
    const currentDeploymentStatus = await currentDeploymentStatusApi.getCurrentDeploymentStatus(appName, beginDate, endDate, order, pageNumber, resultsPerPage, taskSet);
    res.status(200).json(currentDeploymentStatus);
  });
  router.use(errorHandler());
  return router;
}
