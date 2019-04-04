import React from 'react';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';

class MIStrokeSize extends React.PureComponent {
    handleSubMenuClick = (item) => {
        console.log(item);
    };

    render() {
        return (
            <MainMenuItem
                subMenu={[
                    {text: '3px', onClick: this.handleSubMenuClick},
                    {text: '5px', onClick: this.handleSubMenuClick},
                ]}
            >
                <Icon
                    name='pencil'
                    title='Size'
                />
            </MainMenuItem>
        );
    }
}

export default MIStrokeSize;
