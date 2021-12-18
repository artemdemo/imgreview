import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import canvasStore from '../store';
import './CanvasWrapper.less';
import { setStageSize } from '../model/stage/stageActions';

export const CanvasWrapper: React.FC = (props) => {
  const { children } = props;

  const handleWindowSize = useRef(
    _.throttle(() => {
      canvasStore.dispatch(
        setStageSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      );
    }, 80)
  );

  useEffect(() => {
    window.addEventListener('resize', handleWindowSize.current);
    return () => {
      window.removeEventListener('resize', handleWindowSize.current);
    };
  }, []);

  return <div className="CanvasWrapper">{children}</div>;
};
