import React from 'react';
import { useSelector } from 'react-redux';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import { MsgBubble } from './MsgBubble';
import './Notifications.less';

export const Notifications: React.FC = () => {
  const menu = useSelector<TReduxState, TStateMenu>((state) => state.menu);

  return (
    <div className="Notifications" style={{ top: `${menu.menuHeight}px` }}>
      <MsgBubble>aaa</MsgBubble>
    </div>
  );
};
