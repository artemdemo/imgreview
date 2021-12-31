import React from 'react';
import Markdown from 'markdown-to-jsx';
import { Link } from 'react-router-dom';
import { t } from '../services/i18n';
import aboutContent from './about.md';
import './AboutView.less';

export const AboutView = () => {
  return (
    <div className="container">
      <Markdown>{aboutContent}</Markdown>
      <Link to="/">{t('back')}</Link>
    </div>
  );
};
