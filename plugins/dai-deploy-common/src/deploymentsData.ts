export interface DeploymentData {
  owner: string;
  state: string;
  startDate?: string;
  completionDate?: string;
  detailsRedirectUri: string;
  environmentRedirectUri: string;
}

export interface DeploymentActiveData extends DeploymentData {
  scheduledDate?: string;
  metadata: MetaData;
}

export interface MetaData {
  version: string;
  environment: string;
  application: string;
  taskType: string;
}

export interface DeploymentArchiveData extends DeploymentData {
  type: string;
  environment: string;
  package: string;
}
