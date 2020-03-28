const colors = require('colors/safe');

const logger = (fileName, ...args) => {
    let hasErr = false;
    const argsColored = args.map((item) => {
        if (item instanceof Error) {
            hasErr = true;
            return colors.red(item);
        }
        return item;
    });
    const fileKey = `[${fileName}]`;
    const fileKeyColored = hasErr ? colors.red.bold(fileKey) : colors.green(fileKey);

    console.log(fileKeyColored, ...argsColored);
};

module.exports = (fileKey) => {
    return logger.bind(null, fileKey);
};
