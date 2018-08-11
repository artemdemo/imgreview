import React from 'react';
import MainMenu from '../components/MainMenu/MainMenu';
import DropImage from '../containers/DropImage/DropImage';
import CanvasEl from '../containers/CanvasEl/CanvasEl';

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
