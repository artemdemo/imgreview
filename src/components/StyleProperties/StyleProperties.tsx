import React, { useEffect } from 'react';

type Props = {
  el?: HTMLElement | null;
  properties: { [key: string]: string };
};

export const StyleProperties: React.FC<Props> = (props) => {
  const { properties, el = document.body, children } = props;

  useEffect(() => {
    Object.keys(properties).forEach((key) => {
      el?.style.setProperty(key, properties[key]);
    });
    return () => {
      Object.keys(properties).forEach((key) => {
        el?.style.removeProperty(key);
      });
    };
  }, [properties, el]);

  return <>{children}</>;
};
