import React, { useState } from 'react';
import OpenImageDialog from '../OpenImageDialog/OpenImageDialog';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';

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
