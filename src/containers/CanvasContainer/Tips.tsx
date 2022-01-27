import React from 'react';
import Link from 'next/link';
import s from './Tips.module.css';

export const Tips: React.FC = () => {
  return (
    <div className={s.Tips}>
      Psst...
      <br />
      You can add as many images as you want.
      <br />
      To read more about this feature&nbsp;
      <Link href="/features" passHref>
        <a>click here</a>
      </Link>
      <br />
    </div>
  );
};
