import React, { useState } from 'react';
import * as gaService from '../../services/ganalytics';
import { OpenImageDialog } from '../OpenImageDialog/OpenImageDialog';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { t } from '../../services/i18n';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';

type Props = {
  disabled?: boolean;
};

export const MIOpenImage: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TopMenuItem
        onClick={() => {
          setOpen(true);

          // Since I can only know if user select an image, and
          // I don't know if user click on "cancel" of the system selection window.
          // I'm just changing `open` status here.
          setTimeout(() => {
            setOpen(false);
          }, 100);

          gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.OpenImage,
          });
        }}
        disabled={disabled}
        title={t('menu.openImage')}
        stopPropagation={false}
      >
        <ImgIcon icon={EIcon.load} />
      </TopMenuItem>
      <OpenImageDialog open={open} />
    </>
  );
};
