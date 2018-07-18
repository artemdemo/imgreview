import React from 'react';
import MainMenu from '../components/MainMenu/MainMenu';
import CanvasEl from '../components/CanvasEl/CanvasEl';

const AppView = () => {
    return (
        <React.Fragment>
            <MainMenu />
            <CanvasEl />
        </React.Fragment>
    );
};

export default AppView;
