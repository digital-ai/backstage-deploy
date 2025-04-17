import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import {applyDatabaseMigrations} from "./migrations/run";
/**
 * Digital.ai Deploy backend plugin
 *
 * @public
 */
export const daiDeployPlugin = createBackendPlugin({
  pluginId: 'dai-deploy',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.rootLogger,
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
        permissions: coreServices.permissions,
        database: coreServices.database,

      },
      async init({ config, logger, httpRouter, httpAuth, permissions, database }) {
        httpRouter.use(
          await createRouter({
            config,
            logger: logger,
            httpAuth,
            permissions,
            database
          }),
        );
        logger.info('✅ DB migrations in daiDeployPlugin.');
        const knex = await database.getClient();
        logger.info('⏳ Running DB migrations in  ', knex.client.config.connection);
        await applyDatabaseMigrations(knex);
        logger.info('✅ DB migrations applied.');
      },
    });
  },
});
