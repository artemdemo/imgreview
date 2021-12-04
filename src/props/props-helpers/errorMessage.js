/**
 * General error message for custom props
 * @param props
 * @param propName
 * @param componentName
 * @returns {string}
 */
const errorMessage = (props, propName, componentName) => {
  return `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Received \`${typeof props[
    propName
  ]}\``;
};

export default errorMessage;
