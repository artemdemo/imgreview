/* eslint-disable max-len */

const isRequiredFactory = (propFunc) => {
  propFunc.isRequired = (props, propName, componentName) => {
    if (props[propName] === null) {
      return new Error(
        `The prop \`${propName}\` is marked as required (in \`${componentName}\`), but its value is \`null\``
      );
    }
    if (props[propName] === undefined) {
      return new Error(
        `The prop \`${propName}\` is marked as required (in \`${componentName}\`), but its value is \`undefined\``
      );
    }
    return propFunc(props, propName, componentName);
  };
  return propFunc;
};

export default isRequiredFactory;
