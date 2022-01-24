import React from 'react';
import { t } from '../../services/i18n';
import s from './HowToStart.module.css';

export const HowToStart: React.FC = () => {
  return <div className={s.HowToStart}>{t('how-to-start')}</div>;
};
