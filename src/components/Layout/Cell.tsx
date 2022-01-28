import React from 'react';

type Props = {
  span?: number;
};

export const Cell: React.FC<Props> = (props) => {
  const { children, span } = props;
  return (
    <div
      style={{
        gridColumnEnd: span ? `span ${span}` : 'auto',
      }}
    >
      {children}
    </div>
  );
};
