import React from 'react';
import { Link } from 'react-router-dom';
import { t } from '../services/i18n';
import { Markdown } from '../components/Markdown/Markdown';
import aboutContent from './about.md';
import functionalityImg from './images/imgreview_functionality.gif';
import './AboutView.css';

const AboutView = () => {
  return (
    <div className="container">
      <Markdown content={aboutContent} />
      <img alt="ImgReview - How it works" src={functionalityImg} />
      <br />
      <br />
      <Link to="/">&lt;&lt; {t('back')}</Link>
    </div>
  );
};

export default AboutView;
