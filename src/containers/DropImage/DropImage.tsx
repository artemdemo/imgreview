import React from 'react';
import Dropzone from 'react-dropzone';
import loadImage from '../../services/loadImage';
import * as gaService from '../../services/ganalytics';
import './DropImage.less';
import * as canvasApi from '../../../srcCanvas/api';

// @docs https://react-dropzone.netlify.com/#proptypes
//
export const DropImage: React.FC = (props) => {
  const { children } = props;

  const onDrop = async (files: File[]) => {
    const file = files[0];
    if (file) {
      const data = await loadImage(file);
      canvasApi.setImage({
        image: data.image,
        name: data.name,
      });
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
        return <div {...getRootProps()}>{children}</div>;
      }}
    </Dropzone>
  );
};
