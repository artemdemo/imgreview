import React from 'react';

import './SubMenu.less';

export type TSubmenuData = Array<{
    text: string,
    value?: any,
    onClick: (TSubMenuItem) => void;
}>;

type Props = {
    data: TSubmenuData;
};

class SubMenu extends React.PureComponent<Props> {
    static readonly defaultProps = {
        data: [],
    };

    render() {
        const { data } = this.props;

        return (
            <div className='submenu'>
                {data.map(item => (
                    <div
                        onClick={() => {
                            item.onClick(item);
                        }}
                        className='submenu__item'
                        key={`submenu__item-${item.text}`}
                    >
                        {item.text}
                    </div>
                ))}
            </div>
        );
    }
}

export default SubMenu;
