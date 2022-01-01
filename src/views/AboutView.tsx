import React from 'react';
import { Link } from 'react-router-dom';
import { t } from '../services/i18n';
import { Markdown } from '../components/Markdown/Markdown';
import aboutContent from './about.md';
import './AboutView.less';

export const AboutView = () => {
  return (
    <div className="container">
      <Markdown content={aboutContent} />
      <Link to="/">{t('back')}</Link>
    </div>
  );
};
