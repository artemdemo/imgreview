import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { t } from '../../services/i18n';
import { AppStateContext } from '../../model/AppStateContext';

type Props = {};

export const MIBlankCanvas: React.FC<Props> = (props) => {
  const {
    state: {
      canvas: { canvasApi },
    },
  } = useContext(AppStateContext);

  const onClick = () => {
    const config = {
      width: 800,
      height: 500,
    };
    canvasApi?.initBlankCanvas(config);
  };

  return (
    <TopMenuItem onClick={onClick} stopPropagation={false}>
      {t('menu.blank')}
    </TopMenuItem>
  );
};
