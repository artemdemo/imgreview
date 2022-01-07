import React from 'react';
import { t } from '../../services/i18n';
import './HowToStart.less';

export const HowToStart: React.FC = () => {
  return (
    <div className="HowToStart">
      {t('how-to-start')}
    </div>
  );
};
