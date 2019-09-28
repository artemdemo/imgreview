import _isElement from 'lodash/isElement';
import isRequiredFactory from './props-helpers/isRequiredFactory';
import errorMessage from './props-helpers/errorMessage';

const isElement = isRequiredFactory((props, propName, componentName) => {
    if (!_isElement(props[propName]) && props[propName] !== undefined && props[propName] !== null) {
        return new Error(errorMessage(props, propName, componentName));
    }
    return undefined;
});

export default isElement;
