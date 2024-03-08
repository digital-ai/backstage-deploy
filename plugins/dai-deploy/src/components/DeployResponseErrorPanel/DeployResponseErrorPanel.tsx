import React from 'react';
import { WarningPanel } from '@backstage/core-components';

type DeployErrorPanelProps = {
  error: Error;
};
export function DeployResponseErrorPanel(props: DeployErrorPanelProps) {
  const { error } = props;
  return <WarningPanel title={error.message} />;
}
