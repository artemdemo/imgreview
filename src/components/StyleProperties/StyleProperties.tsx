import React, { useEffect, useRef } from 'react';

type Props = {
  properties: { [key: string]: string | number };
};

export const StyleProperties: React.FC<Props> = (props) => {
  const { properties, children } = props;
  const childRef = useRef<HTMLElement>();

  useEffect(() => {
    Object.keys(properties).forEach((key) => {
      childRef.current?.style.setProperty(key, String(properties[key]));
    });
    return () => {
      Object.keys(properties).forEach((key) => {
        childRef.current?.style.removeProperty(key);
      });
    };
  }, [properties]);

  return (
    <>
      {React.Children.map(
        React.Children.only(children),
        (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ref: (ref: HTMLElement) => childRef.current = ref
            })
          }
          throw new Error('Given child is not valid React element');
        }
      )}
    </>
  );
};
