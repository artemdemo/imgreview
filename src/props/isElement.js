import _ from 'lodash';
import isRequiredFactory from './props-helpers/isRequiredFactory';
import errorMessage from './props-helpers/errorMessage';

const isElement = isRequiredFactory((props, propName, componentName) => {
  if (
    !_.isElement(props[propName]) &&
    props[propName] !== undefined &&
    props[propName] !== null
  ) {
    return new Error(errorMessage(props, propName, componentName));
  }
  return undefined;
});

export default isElement;
