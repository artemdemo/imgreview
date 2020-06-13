import React from "react";
import {connect} from "react-redux";
import CanvasEl from "../../../srcCanvas/CanvasEl/CanvasEl";
import DropImage from "../DropImage/DropImage";
import * as canvasApi from "../../../srcCanvas/api";
import { TAddImage, addImage } from "../../model/canvas/canvasActions";

type TProps = {
    addImage: TAddImage,
};

class CanvasContainer extends React.PureComponent<TProps> {
    componentDidMount() {
        document.addEventListener('paste', this.onPaste);
    }

    componentWillUnmount() {
        document.removeEventListener('paste', this.onPaste);
    }

    /**
     * This paste method is only meant to be used to paste images.
     * Shape paste is handled by `CanvasEl`
     * @link https://stackoverflow.com/a/15369753
     * @param event
     */
    private onPaste = (event) => {
        // use event.originalEvent.clipboard for newer chrome versions
        // @ts-ignore
        const items = (event.clipboardData  || event.originalEvent.clipboardData).items;
        const blobRaw = Array.from(items)
            .find((item: DataTransferItem) => {
                return item.type.indexOf('image') === 0;
            });
        if (blobRaw) {
            const blob = (blobRaw as DataTransferItem).getAsFile();
            const img = new Image();
            const url = URL.createObjectURL(blob);
            const { addImage } = this.props;
            img.onload = function() {
                URL.revokeObjectURL(url);
                const name = '';
                canvasApi.setImage({
                    image: this,
                    name,
                });
                addImage({
                    name,
                });
            };
            img.onerror = (err) => {
                console.error(err);
            };
            img.src = url;
        }
    };

    render() {
        return (
            <DropImage>
                <CanvasEl />
            </DropImage>
        );
    }
}

export default connect(
    () => ({}),
    {
        addImage,
    },
)(CanvasContainer);
