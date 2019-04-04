import React from 'react';
import Icon from '../Icon/Icon';

import './SubMenu.less';

export type TSubmenuData = Array<{
    text: string,
    value?: any,
    selected?: boolean,
    onClick: (TSubMenuItem) => void;
}>;

type Props = {
    data: TSubmenuData;
};

class SubMenu extends React.PureComponent<Props> {
    static readonly defaultProps = {
        data: [],
    };

    static renderCheck(item) {
        if (item.selected) {
            return (
                <div className='submenu-item__icon'>
                    <Icon name='check' />
                </div>
            );
        }
        return null;
    }

    render() {
        const { data } = this.props;

        return (
            <div className='submenu'>
                {data.map(item => (
                    <div
                        onClick={() => {
                            item.onClick(item);
                        }}
                        className='submenu-item'
                        key={`submenu-item-${item.text}`}
                    >
                        <div className='submenu-item__content'>
                            {item.text}
                        </div>
                        {SubMenu.renderCheck(item)}
                    </div>
                ))}
            </div>
        );
    }
}

export default SubMenu;
