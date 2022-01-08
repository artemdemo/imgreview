import React, { useContext, useEffect, useRef } from 'react';
import _ from 'lodash';
import loadImage, { LoadImageResult } from '../../services/loadImage';
import { AppStateContext } from '../../model/AppStateContext';

type Props = {
  open: boolean;
};

export const OpenImageDialog: React.FC<Props> = (props) => {
  const { open } = props;
  const {
    state: {
      canvas: { canvasApi },
    },
  } = useContext(AppStateContext);
  const inputFile = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputFile.current?.click();
    }
  }, [open]);

  return (
    <input
      type="file"
      onChange={() => {
        const file = _.get(inputFile, 'current.files[0]', null);

        if (file) {
          loadImage(file).then((data: LoadImageResult) => {
            canvasApi?.setImage({
              image: data.image,
              name: data.name,
            });
            if (inputFile.current) {
              inputFile.current.value = '';
            }
          });
        }
      }}
      ref={inputFile}
      style={{ display: 'none' }}
    />
  );
};
