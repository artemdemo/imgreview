import React from 'react';
import classnames from 'classnames';
import './MsgBubble.less';

export const MsgBubble: React.FC = (props) => {
  const { children } = props;
  return (
    <div
      className={classnames({
        MsgBubble: true,
        MsgBubble_success: true,
      })}
    >
      {children}
    </div>
  );
};
