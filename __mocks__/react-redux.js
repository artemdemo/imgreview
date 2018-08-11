let lastMapStateToProp = null;
let lastMapActionsToProps = null;

export const connect = (mapStateToProps, mapActionsToProps) => {
    lastMapStateToProp = mapStateToProps;
    lastMapActionsToProps = mapActionsToProps;
    return Component => Component;
};

export const __getLastMaps = () => ({
    mapStateToProps: lastMapStateToProp,
    mapActionsToProps: lastMapActionsToProps,
});
