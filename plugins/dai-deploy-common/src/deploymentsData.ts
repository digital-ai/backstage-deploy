export interface DeploymentData {
  owner: string;
  state: string;
  startDate?: string;
  completionDate?: string;
  detailsRedirectUri: string;
}

export interface DeploymentActiveData extends DeploymentData {
  id: string;
  description: string;
  scheduledDate?: string;
  metadata: MetaData;
}

export interface MetaData {
  worker_name?: string;
  environment_id: string;
  environment_reference_id: string;
  version: string;
  environment: string;
  satellite_ids: string;
  application: string;
  taskType: string;
}

export interface DeploymentArchiveData extends DeploymentData {
  type: string;
  environment: string;
  environmentId: string;
  environmentIdWithoutRoot: string;
  package: string;
  rolledBack: boolean;
  worker_name: string | null;
}
