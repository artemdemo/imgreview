import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import canvasStore from '../store';
import { setStageSize } from '../model/stage/stageActions';
import { ECursorTypes } from '../model/shapes/shapesModelTypes';
import './CanvasWrapper.css';

export const CanvasWrapper: React.FC = (props) => {
  const { children } = props;
  const [cursor, setCursor] = useState<ECursorTypes>(ECursorTypes.AUTO);

  const handleWindowSize = useRef(
    _.throttle(() => {
      canvasStore.dispatch(
        setStageSize({
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      );
    }, 80),
  );

  const handleStoreChange = useRef(() => {
    const { shapes } = canvasStore.getState();
    setCursor(shapes.cursor);
  });

  useEffect(() => {
    window.addEventListener('resize', handleWindowSize.current);
    const storeUnsubscribe = canvasStore.subscribe(handleStoreChange.current);
    return () => {
      window.removeEventListener('resize', handleWindowSize.current);
      storeUnsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        cursor,
      }}
      className="CanvasWrapper"
    >
      {children}
    </div>
  );
};
