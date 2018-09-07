import React from 'react';
import MainMenu from '../components/MainMenu/MainMenu';
import DropImage from '../containers/DropImage/DropImage';
import CanvasEl from '../containers/CanvasEl/CanvasEl';
import MIOpenImage from '../containers/MenuItems/MIOpenImage';
import MISave from '../containers/MenuItems/MISave';
import MIArrow from '../containers/MenuItems/MIArrow';
import MIStroke from '../containers/MenuItems/MIStroke';
import MIResize from '../containers/MenuItems/MIResize';

const AppView = () => {
    return (
        <React.Fragment>
            <MainMenu>
                <MIOpenImage />
                <MISave />
                <MIArrow />
                <MIStroke />
                <MIResize />
            </MainMenu>
            <DropImage>
                <CanvasEl />
            </DropImage>
        </React.Fragment>
    );
};

export default AppView;
