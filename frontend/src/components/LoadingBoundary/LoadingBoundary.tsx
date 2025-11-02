import { ReactNode } from 'react';
import {
  NonIdealState,
  NonIdealStateIconSize,
  Spinner,
} from '@blueprintjs/core';
import { Issue } from '@blueprintjs/icons';

interface LoadingBoundaryProps {
  isLoading: boolean;
  error?: Error | null;
  children: ReactNode;
}

export function LoadingBoundary({
  isLoading,
  error,
  children,
}: LoadingBoundaryProps) {
  if (isLoading) {
    return (
      <NonIdealState
        layout={'vertical'}
        icon={<Spinner />}
        iconSize={NonIdealStateIconSize.STANDARD}
        title="Loading ..."
        description="Fetching data from the server"
      />
    );
  }

  if (error) {
    return (
      <NonIdealState
        layout={'vertical'}
        icon={<Issue size={NonIdealStateIconSize.STANDARD} />}
        title="Error"
        description={error.message}
      />
    );
  }

  return <>{children}</>;
}
