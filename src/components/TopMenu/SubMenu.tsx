import React from 'react';
import { EIcon, ImgIcon } from '../ImgIcon/ImgIcon';
import s from './SubMenu.module.css';

export type TSubmenuData = Array<{
  text: string;
  value?: any;
  selected?: boolean;
  onClick: (item: any, event: any) => void;
}>;

type Props = {
  data?: TSubmenuData;
};

export const SubMenu: React.FC<Props> = (props) => {
  const { data = [] } = props;

  return (
    <div className={s.SubMenu}>
      {data.map((item) => (
        <div
          className={s.SubMenuItem}
          onClick={(e: any) => {
            item.onClick(item, e);
          }}
          key={`submenu-item-${item.text}`}
        >
          <div className={s.SubMenuItem__Content}>{item.text}</div>
          {item.selected ? (
            <div className={s.SubMenuItem__Icon}>
              <ImgIcon icon={EIcon.check} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
