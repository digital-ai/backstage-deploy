import {CurrentDeploymentStatusApi, DeployedApplicationStatusApi, DeploymentHistoryStatusApi,} from '../api';
import {
  AuthService,
  DatabaseService,
  HttpAuthService,
  LoggerService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import {InputError, NotAllowedError} from '@backstage/errors';
import {daiDeployPermissions, daiDeployViewPermission,} from '@digital-ai/plugin-dai-deploy-common';
import {getDecodedQueryVal, getEncodedQueryVal} from '../api/apiConfig';
import {AuthorizeResult} from '@backstage/plugin-permission-common';
import {Config} from '@backstage/config';
import {MiddlewareFactory} from "@backstage/backend-defaults/rootHttpRouter";
import Router from 'express-promise-router';
import {createPermissionIntegrationRouter} from '@backstage/plugin-permission-node';
import express from 'express';
import {stringifyEntityRef} from '@backstage/catalog-model';
import {DeployCommit} from "../db/deploy_commit";
import yaml from 'yaml';
import {DiscoveryApi} from "@backstage/core-plugin-api";

export interface RouterOptions {
  config: Config;
  logger: LoggerService;
  permissions?: PermissionsService;
  httpAuth?: HttpAuthService;
  database: DatabaseService;
  auth: AuthService;
  discoveryApi: DiscoveryApi;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, permissions, httpAuth, database, auth, discoveryApi } = options;
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

  const db =  await database.getClient();
  const deployCommit = new DeployCommit(db);

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
    const entityRef = stringifyEntityRef({
      kind,
      namespace,
      name,
    });
    if (typeof entityRef !== 'string') {
      throw new InputError('Invalid entityRef, not a string');
    }

    if (permissions && httpAuth) {
      const decision = await permissions.authorize(
        [{ permission: daiDeployViewPermission, resourceRef: entityRef }],
        { credentials: await httpAuth.credentials(req) },
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
    const entityRef = stringifyEntityRef({
      kind,
      namespace,
      name,
    });
    if (typeof entityRef !== 'string') {
      throw new InputError('Invalid entityRef, not a string');
    }
    if (permissions && httpAuth) {
      const decision = await permissions.authorize(
        [{ permission: daiDeployViewPermission, resourceRef: entityRef }],
        { credentials: await httpAuth.credentials(req) },
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


  router.post('/webhook', async (req, res) => {
    const payload = req.body;
    const repoFullName = payload.repository.full_name;
    const commitSha = payload.after;

    const changedFiles = [...(payload.head_commit?.modified || [])];
    if (!changedFiles.includes('dai-deploy.yaml')) {
      return res.status(200).send('No deploy file changes');
    }

    const component = await getComponentNameFromRepo(repoFullName,commitSha);
    const previousSha = await deployCommit.getCommitId(component);

    if (previousSha === commitSha) {
      return res.status(200).send('No change since last deploy');
    }

    // Trigger deploy here
    await deployCommit.setCommitId(component, commitSha);

    // Trigger deployment logic here using xl-cli scaffolder action
    console.log(`Triggering deployment for ${component} at ${commitSha}`);

    return res.status(200).send(`Triggered deployment for ${component}`);
  });

  async function isLatestCommitIdDifferent ( latestSha: string, componentName: string) {
    const previousSha = await deployCommit.getCommitId(componentName);
    if (previousSha === latestSha) {
      logger.info("skipping deployment, as commitId is same");
      return false
    }
    await deployCommit.setCommitId(componentName, latestSha);
    return true
  }

  async function triggerScaffolderTask(deployAppUrl: any, componentName: any, latestSha: any) {
    const templateName = "template:default/xl-cli-with-github"
    // Trigger deploy here
    logger.info(`CommitId is different triggering the deployment using ${templateName} tamplate`)
    const repoMatch = deployAppUrl.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/);
    const [, owner, repo, branch, path] = repoMatch;
    logger.info(`owner: ${owner}, repo: ${repo}, branch: ${branch}, path: ${path}`);

    /*
    {"templateRef":"template:default/xl-cli-with-github",
    "values":{
    "product":"xl-deploy",
    "githubHost":"github.com",
    "githubOrganization":"sishwarya",
    "repositoryName":"xl-cli-java-quarkus",
    "filePath":"./dai-deploy-application.yaml"},
    "secrets":{}}
     */

    const {token} = await auth.getPluginRequestToken({
      onBehalfOf: await auth.getOwnServiceCredentials(),
      targetPluginId: 'scaffolder',
    });

    const values = {
      "product": "xl-deploy",
      "githubHost": "github.com",
      "githubOrganization": owner,
      "repositoryName": repo,
      "filePath": path
    }

    // Trigger deployment logic here using xl-cli scaffolder action
    logger.info(`Triggering deployment for ${componentName} at ${latestSha} with ${deployAppUrl} and values ${JSON.stringify(values)}`);
    const baseUrl = `${await discoveryApi.getBaseUrl('scaffolder')}/`;
    const scaffolderTaskPath = `v2/tasks`;
    const url = new URL(scaffolderTaskPath, baseUrl);
    // Trigger a new scaffolder task
    const scaffolderResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        "templateRef": templateName,
        "values": values, // input parameters to the template
      }),
    });

    if (!scaffolderResponse.ok) {
      const errorBody = await scaffolderResponse.text();
      throw new Error(`Scaffolder failed: ${scaffolderResponse.status} - ${errorBody}`);
    }
    return await scaffolderResponse.json();
  }

  router.post('/trigger-deploy', async (req, res) => {
    const { latestSha, componentName, deployAppUrl } = req.body;
    if (!await isLatestCommitIdDifferent(latestSha, componentName)){
      return res.status(200).send({});
    }
    const responseBody = await triggerScaffolderTask(deployAppUrl, componentName, latestSha);
    logger.info(responseBody)
    return res.status(200).send(responseBody);
  });

  const middleware = MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());
  return router;
}

/**
 * Fetches the component name from the catalog-info.yaml file in the given repository.
 * @param repo
 * @param commitSha
 */
async function getComponentNameFromRepo(repo: string, commitSha: string) {
  const response = await fetch(`https://raw.githubusercontent.com/${repo}/` +
      `${commitSha}/catalog-info.yaml`);

  if (!response.ok) throw new Error('Failed to fetch catalog-info.yaml');

  const text = await response.text();
  const parsed = yaml.parse(text);

  return parsed?.metadata?.name;
}
