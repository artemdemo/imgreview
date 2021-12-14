import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import OpenImageDialog from '../OpenImageDialog/OpenImageDialog';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';

type Props = {
  disabled?: boolean;
};

const MIOpenImage: React.FC<Props> = (props) => {
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
        <FontAwesomeIcon icon={faFileImage} />
      </TopMenuItem>
      <OpenImageDialog open={open} />
    </>
  );
};

export default MIOpenImage;
