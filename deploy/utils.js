const git = require('simple-git/promise');
const { readdir } = require('fs/promises');

/**
 *
 * @return {Promise<String|null>}
 */
const getCurrentBranch = async () => {
  const result = await git('./')
    .raw(['rev-parse', '--abbrev-ref', 'HEAD']);

  const branchRegex = /[\S]+/;
  const match = branchRegex.exec(result);
  return match ? match[0] : null;
}

const getDirectories = async (source) => {
  return (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

module.exports = {
  getCurrentBranch,
  getDirectories,
};
