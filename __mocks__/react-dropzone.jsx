import React from 'react';

const DropzonePkg = (props) => {
    const {
        className,
        activeClassName,
        disableClick,
        onDrop,
    } = props;
    return (
        <div
            onClick={() => {
                const files = [
                    {data: 'mock file'},
                ];
                onDrop(files);
            }}
            className={className}
            data-active-class-name={activeClassName}
            data-disable-click={disableClick}
        >
            {props.children}
        </div>
    );
};

export default DropzonePkg;
