import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MIGithub } from '../MenuItems/MIGithub';
import { MIAbout } from '../MenuItems/MIAbout';
import { setMenuHeight } from '../../model/menu/menuActions';
import { AppStateContext } from '../../model/AppStateContext';
import s from './Menu.module.css';
import { CanvasMenu } from './CanvasMenu';
import { MImgReview } from '../MenuItems/MImgReview';

export const Menu: React.FC = () => {
  const {
    state: {
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);
  const router = useRouter();

  useEffect(() => {
    const menuEl = document.querySelector(`.${s.Menu}`) as HTMLDivElement;
    if (!menuEl) {
      throw new Error('Menu element is not found');
    }
    dispatch(setMenuHeight(menuEl.offsetHeight));
  }, []);

  return (
    <div
      className={s.Menu}
      onClick={() => {
        canvasApi?.blurShapes();
      }}
    >
      {router.asPath === '/' ? <CanvasMenu /> : <MImgReview />}
      <div className={s.Menu__RightGroup}>
        <MIAbout />
        <MIGithub />
      </div>
    </div>
  );
};
