import React, { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { MIAbout } from '../MenuItems/MIAbout';
import { setMenuHeight } from '../../model/menu/menuActions';
import { AppStateContext } from '../../model/AppStateContext';
import s from './Menu.module.css';
import { CanvasMenu } from './CanvasMenu';
import { MImgReview } from '../MenuItems/MImgReview';
import { MIFeatures } from '../MenuItems/MIFeatures';

export const Menu: React.FC = () => {
  const {
    state: {
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!menuRef.current) {
      throw new Error('Menu element is not found');
    }
    dispatch(setMenuHeight(menuRef.current.offsetHeight));
  }, []);

  return (
    <div
      className={s.Menu}
      ref={menuRef}
      onClick={() => {
        canvasApi?.blurShapes();
      }}
    >
      {router.asPath === '/' ? <CanvasMenu /> : <MImgReview />}
      <div className={s.Menu__RightGroup}>
        <MIFeatures />
        <MIAbout />
      </div>
    </div>
  );
};
