import React from 'react';
import PropTypes from 'prop-types';

import './MainMenu.less';

const MainMenu = (props) => {
    return (
        <div
            className='main-menu'
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
};

MainMenu.propTypes = {
    onClick: PropTypes.func,
};

MainMenu.defaultProps = {
    onClick: null,
};

export default MainMenu;
