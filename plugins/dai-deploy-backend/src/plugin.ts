import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

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
      },
      async init({ config, logger, httpRouter, httpAuth, permissions }) {
        httpRouter.use(
          await createRouter({
            config,
            logger: loggerToWinstonLogger(logger),
            logger: logger,
            httpAuth,
            permissions,
          }),
        );
      },
    });
  },
});
