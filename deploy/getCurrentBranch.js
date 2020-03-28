const git = require('simple-git/promise');

/**
 *
 * @return {Promise<String|null>}
 */
const getCurrentBranch = () => git('./')
    .raw(['rev-parse', '--abbrev-ref', 'HEAD'])
    .then((result) => {
        const branchRegex = /[\S]+/;
        const match = branchRegex.exec(result);
        return match ? match[0] : null;
    });

module.exports = getCurrentBranch;
