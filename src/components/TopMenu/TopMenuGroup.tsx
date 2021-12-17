import React from 'react';
import {Separator} from './Separator';

export const TopMenuGroup: React.FC = (props) => {
  const { children } = props;

  if (React.Children.toArray(children).length > 0) {
    return (
      <>
        {children}
        <Separator />
      </>
    );
  }

  return null;
};
