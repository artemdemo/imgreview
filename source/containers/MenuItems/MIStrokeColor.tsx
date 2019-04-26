import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import ColorSelector from '../ColorSelector/ColorSelector.async';
import { showColorPicker } from '../../model/menu/menuActions';

const MIStrokeColor__Current = styled.div`
    display: inline-block;
    width: 20px;
    height: 18px;
    vertical-align: bottom;
`;

type Props = {
    menu: TStateMenu;
    showColorPicker: () => void;
    disabled: boolean;
};

class MIStrokeColor extends React.PureComponent<Props> {
    static readonly defaultProps = {
        disabled: false,
    };

    onClick = (e) => {
        // I need shape to stay in focus in order to change it's color
        // Therefore I'm not allowing to event to propagate up to MainMenu
        e.stopPropagation();

        const { showColorPicker } = this.props;
        showColorPicker();
    };

    render() {
        const { disabled, menu } = this.props;
        return (
            <React.Fragment>
                <TopMenuItem
                    onClick={this.onClick}
                    disabled={disabled}
                >
                    <MIStrokeColor__Current
                        style={{
                            backgroundColor: menu.strokeColor,
                        }}
                    />
                </TopMenuItem>
                <ColorSelector />
            </React.Fragment>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        menu: state.menu,
    }),
    {
        showColorPicker,
    }
)(MIStrokeColor);
