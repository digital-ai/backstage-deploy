import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { loggerToWinstonLogger } from '@backstage/backend-common';

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
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
      },
      async init({ config, logger, httpRouter }) {
        httpRouter.use(
          await createRouter({
            config,
            logger: loggerToWinstonLogger(logger),
          }),
        );
      },
    });
  },
});
