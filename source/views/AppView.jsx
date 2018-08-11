import React from 'react';
import MainMenu from '../components/MainMenu/MainMenu';
import DropImage from '../components/DropImage/DropImage';
import CanvasEl from '../components/CanvasEl/CanvasEl';

const AppView = () => {
    return (
        <React.Fragment>
            <MainMenu />
            <DropImage>
                <CanvasEl />
            </DropImage>
        </React.Fragment>
    );
};

export default AppView;
