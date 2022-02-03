const git = require('simple-git');
const { readdir } = require('fs/promises');

const getCurrentBranch = async () => {
  const result = await git('./').raw(['rev-parse', '--abbrev-ref', 'HEAD']);

  const branchRegex = /[\S]+/;
  const match = branchRegex.exec(result);
  return match ? match[0] : null;
};

const getVersionFromLastCommit = async () => {
  const lastCommitMsg = await git('./').raw([
    'log',
    '-1',
    '--oneline',
    "--format=format:'%s'",
  ]);
  const versionRegex = /v\.(\d+\.\d+\.\d+)/;
  const match = versionRegex.exec(lastCommitMsg);
  return match ? match[1] : '';
};

const getDirectoriesNames = async (source) => {
  return (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

module.exports = {
  getCurrentBranch,
  getVersionFromLastCommit,
  getDirectoriesNames,
};
