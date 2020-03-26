import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-light-svg-icons';
import * as styleVars from '../../styles/variables';

export type TSubmenuData = Array<{
    text: string,
    value?: any,
    selected?: boolean,
    onClick: (TSubMenuItem, event: any) => void;
}>;

type TProps = {
    data: TSubmenuData;
};

const SubmenuSty = styled.div`
    background-color: ${styleVars.mainMenuColor};
    border: 1px solid ${styleVars.mainMenuItemBorderColor};
    border-radius: 3px;
    padding: 3px;
`;

const SubmenuItemSty = styled.div`
    padding: 4px 10px;
    border-bottom: 1px dashed ${styleVars.mainMenuItemBorderColor};
    display: flex;
    text-align: left;

    &:last-child {
        border-bottom: none;
    }
`;

const SubmenuItemSty__Content = styled.div`
    flex-grow: 1;
`;

const SubmenuItemSty__Icon = styled.div`
    flex-grow: 0;
    padding-left: 10px;
`;

class SubMenu extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        data: [],
    };

    static renderCheck(item) {
        if (item.selected) {
            return (
                <SubmenuItemSty__Icon>
                    <FontAwesomeIcon icon={faCheck} />
                </SubmenuItemSty__Icon>
            );
        }
        return null;
    }

    render() {
        const { data } = this.props;

        return (
            <SubmenuSty>
                {data.map(item => (
                    <SubmenuItemSty
                        onClick={(e) => {
                            item.onClick(item, e);
                        }}
                        key={`submenu-item-${item.text}`}
                    >
                        <SubmenuItemSty__Content>
                            {item.text}
                        </SubmenuItemSty__Content>
                        {SubMenu.renderCheck(item)}
                    </SubmenuItemSty>
                ))}
            </SubmenuSty>
        );
    }
}

export default SubMenu;
