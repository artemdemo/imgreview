import React, { useContext } from 'react';
import Dropzone from 'react-dropzone';
import loadImage from '../../services/loadImage';
import * as gaService from '../../services/ganalytics';
import { AppStateContext } from '../../model/AppStateContext';
import { showNotification } from '../../model/notifications/notificationsActions';
import { t } from '../../services/i18n';
import { NotificationType } from '../../model/notifications/Notification';

// @docs https://react-dropzone.netlify.com/#proptypes
//
export const DropImage: React.FC = (props) => {
  const { children } = props;
  const {
    state: {
      menu,
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  const onDrop = async (files: File[], _: any[], e: any) => {
    if (files.length > 0) {
      for (const file of files) {
        if (!file.type.startsWith('image')) {
          dispatch(
            showNotification({
              message: t('image-type-error'),
              type: NotificationType.Error,
            }),
          );
          continue;
        }
        const data = await loadImage(file);
        canvasApi?.blurShapes();
        canvasApi?.setImage({
          image: data.image,
          name: data.name,
          pos: {
            x: e.clientX - data.image.width / 2,
            y: e.clientY - menu.menuHeight - data.image.height / 2,
          },
        });
      }
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
