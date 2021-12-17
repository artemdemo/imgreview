import React from 'react';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import {useDispatch, useSelector} from 'react-redux';
import loadImage, { LoadImageResult } from '../../services/loadImage';
import { TReduxState } from '../../reducers';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { addImage } from '../../model/canvas/canvasActions';
import * as gaService from '../../services/ganalytics';
import './DropImage.less';

// @docs https://react-dropzone.netlify.com/#proptypes
//
export const DropImage: React.FC = (props) => {
  const { children } = props;
  const dispatch = useDispatch();
  const canvas = useSelector<TReduxState, TStateCanvas>((state) => state.canvas);

  const onDrop = async (files: File[]) => {
    const file = files[0];
    if (file) {
      const data = await loadImage(file);
      dispatch(addImage({
        image: data.image,
        name: data.name,
      }));
    }
    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.GlobalInteraction,
      eventAction: gaService.EEventActions.DropImage,
    });
  };

  return (
    <Dropzone onDrop={onDrop}>
      {(propsZone) => {
        const { getRootProps } = propsZone;
        const dropImageClass = classnames({
          'drop-image': true,
          'drop-image_has-image': canvas.height !== 0 || canvas.width !== 0,
          'drop-image_active': propsZone.isDragActive,
        });
        return (
          <div {...getRootProps()} className={dropImageClass}>
            {children}
          </div>
        );
      }}
    </Dropzone>
  );
};
