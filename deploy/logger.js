const colors = require('colors/safe');

const logger = (fileName, ...args) => {
  let hasErr = false;
  const argsColored = args.reduce((acc, item) => {
    if (item instanceof Error) {
      hasErr = true;
      return [
        ...acc,
        '\n',
        colors.red(item),
      ];
    }
    return [
      ...acc,
      item,
    ];
  }, []);
  const fileKey = `[${fileName}]`;
  const fileKeyColored = hasErr
    ? colors.red.bold(fileKey)
    : colors.green(fileKey);

  console.log(fileKeyColored, ...argsColored);
};

module.exports = (fileKey) => {
  return logger.bind(null, fileKey);
};
