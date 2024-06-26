/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DAI_DEPLOY_CI_ID_ANNOTATION } from '@digital-ai/plugin-dai-deploy-common';
import { Entity } from '@backstage/catalog-model';

/**
 * Utility function to determine if the given entity has an Airbrake ID set in the repos catalog-info.yml .
 * @public
 */
export const isCiCdAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[DAI_DEPLOY_CI_ID_ANNOTATION]);
