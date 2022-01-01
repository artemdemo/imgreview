import React, { ReactNode } from 'react';

type Props = {
  fallback?: NonNullable<ReactNode> | null;
};

export const Suspense: React.FC<Props> = (props) => {
  const { children, fallback = 'Loading...' } = props;
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
};
