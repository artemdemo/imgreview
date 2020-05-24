import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import TopMenuItem from "../../components/TopMenu/TopMenuItem";

type TProps = {
    disabled: boolean;
};

class MISquare extends React.PureComponent<TProps> {
    render() {
        const { disabled } = this.props;
        return (
            <TopMenuItem
                disabled={disabled}
            >
                <FontAwesomeIcon icon={faSquare} />
            </TopMenuItem>
        );
    }
}

export default MISquare;
