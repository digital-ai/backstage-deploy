import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import {
  CurrentDeploymentStatusApi,
  DeployedApplicationStatusApi,
} from '../api';
import { InputError, NotAllowedError } from '@backstage/errors';
import {
  daiDeployPermissions,
  daiDeployViewPermission,
} from '@digital-ai/plugin-dai-deploy-common';
import {getDecodedQueryVal, getEncodedQueryVal} from '../api/apiConfig';
import { Config } from '@backstage/config';
import { DeploymentHistoryStatusApi } from '../api';
import { Logger } from 'winston';
import Router from 'express-promise-router';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { stringifyEntityRef } from '@backstage/catalog-model';

export interface RouterOptions {
  config: Config;
  logger: Logger;
  permissions?: PermissionEvaluator;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, permissions } = options;
  const deployedApplicationStatusApi = DeployedApplicationStatusApi.fromConfig(
    config,
    logger,
  );
  const currentDeploymentStatusApi = CurrentDeploymentStatusApi.fromConfig(
    config,
    logger,
  );
  const deploymentHistoryStatusApi = DeploymentHistoryStatusApi.fromConfig(
    config,
    logger,
  );
  const permissionIntegrationRouter = createPermissionIntegrationRouter({
    permissions: daiDeployPermissions,
  });

  const router = Router();
  router.use(express.json());
  router.use(permissionIntegrationRouter);

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/application-status/:appName', async (req, res) => {
    const { appName } = req.params;
    const status =
      await deployedApplicationStatusApi.getApplicationDeploymentInfo(appName);
    res.status(200).json(status);
  });

  router.get('/deployment-status/:namespace/:kind/:name', async (req, res) => {
    const { namespace, kind, name } = req.params;
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    const entityRef = stringifyEntityRef({
      kind,
      namespace,
      name,
    });
    if (typeof entityRef !== 'string') {
      throw new InputError('Invalid entityRef, not a string');
    }

    if (permissions) {
      const decision = await permissions.authorize(
        [{ permission: daiDeployViewPermission, resourceRef: entityRef }],
        { token },
      );
      const { result } = decision[0];
      if (result === AuthorizeResult.DENY) {
        throw new NotAllowedError(
          'Access Denied: Unauthorized to access the Backstage Deploy plugin',
        );
      }
    }

    const appName = getDecodedQueryVal(req.query.appName?.toString());
    const beginDate = getEncodedQueryVal(req.query.beginDate?.toString());
    const endDate = getEncodedQueryVal(req.query.endDate?.toString());
    const order = getEncodedQueryVal(req.query.order?.toString());
    const pageNumber = getEncodedQueryVal(req.query.pageNumber?.toString());
    const resultsPerPage = getEncodedQueryVal(
      req.query.resultsPerPage?.toString(),
    );
    const taskSet = getEncodedQueryVal(req.query.taskSet?.toString());
    const currentDeploymentStatus =
      await currentDeploymentStatusApi.getCurrentDeploymentStatus(
        appName,
        beginDate,
        endDate,
        order,
        pageNumber,
        resultsPerPage,
        taskSet,
      );
    res.status(200).json(currentDeploymentStatus);
  });

  router.get('/deployment-history/:namespace/:kind/:name', async (req, res) => {
    const { namespace, kind, name } = req.params;
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    const entityRef = stringifyEntityRef({
      kind,
      namespace,
      name,
    });
    if (typeof entityRef !== 'string') {
      throw new InputError('Invalid entityRef, not a string');
    }
    if (permissions) {
      const decision = await permissions.authorize(
        [{ permission: daiDeployViewPermission, resourceRef: entityRef }],
        { token },
      );
      const { result } = decision[0];
      if (result === AuthorizeResult.DENY) {
        throw new NotAllowedError(
          'Access Denied: Unauthorized to access the Backstage Deploy plugin',
        );
      }
    }
    const appName = getDecodedQueryVal(req.query.appName?.toString());
    const beginDate = getEncodedQueryVal(req.query.beginDate?.toString());
    const endDate = getEncodedQueryVal(req.query.endDate?.toString());
    const order = getEncodedQueryVal(req.query.order?.toString());
    const pageNumber = getEncodedQueryVal(req.query.pageNumber?.toString());
    const resultsPerPage = getEncodedQueryVal(
      req.query.resultsPerPage?.toString(),
    );
    const taskId = getEncodedQueryVal(req.query.taskId?.toString());
    const deploymentHistoryStatus =
      await deploymentHistoryStatusApi.getDeploymentHistoryStatus(
        appName,
        beginDate,
        endDate,
        order,
        pageNumber,
        resultsPerPage,
        taskId,
      );
    res.status(200).json(deploymentHistoryStatus);
  });

  router.use(errorHandler());
  return router;
}
