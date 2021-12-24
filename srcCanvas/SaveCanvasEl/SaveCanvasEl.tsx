import React, { useRef, useEffect } from 'react';
import canvasStore from '../store';
import {setSaveStage} from '../model/saveCanvas/saveCanvasActions';
import {SaveStage} from '../CanvasEl/SaveStage';

export const SaveCanvasEl: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    canvasStore.dispatch(setSaveStage(new SaveStage(canvasRef.current!)));
  }, [])

  return (
    <div ref={canvasRef} className="save-canvas-el" />
  );
};
