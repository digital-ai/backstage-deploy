# Changelog

## [v0.1.5](https://github.com/digital-ai/backstage-deploy/tree/dai-deploy-backend/v0.1.5) (17/10/2024)

### Library upgrade

- Replaced winston logger with LoggerService
- Replaced PermissionEvaluator to PermissionService
- Removed permission support for old backend system
- Updated dependencies
  - @backstage/backend-common@^0.25.0
  - @backstage/backend-plugin-api@^1.0.1
  - @backstage/catalog-model@^1.7.0
  - @backstage/config@^1.2.0
  - @backstage/errors@^1.2.4
  - @backstage/plugin-auth-node@^0.5.3
  - @backstage/plugin-permission-common@^0.8.1
  - @backstage/plugin-permission-node@^0.8.4
  - @backstage/test-utils@^1.5.10
  - @backstage/backend-test-utils@^1.0.1
  - @backstage/backend-defaults@^0.5.1
  - @digital-ai/plugin-dai-deploy-common@0.1.2
  - express@^4.21.1
  - express-promise-router@^4.1.1
  - node-fetch@^3.3.2
  - yn@^5.0.0
  - @backstage/cli@^0.28.0
  - @spotify/prettier-config@^15.0.0
  - @types/supertest@^6.0.2
  - husky@^9.1.6
  - lint-staged@^15.2.10
  - msw@^2.4.11
  - prettier@3.3.3
  - supertest@^7.0.0