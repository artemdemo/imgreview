const git = require('simple-git/promise');
const shell = require('shelljs');
const logger = require('./logger')('deployGhPages.js');
const packageFile = require('../package.json');

const deployGhPages = (options) => {
  const { ghPagesBranchName, masterBranchName } = options;

  logger(`Checking out to: ${ghPagesBranchName}`);

  return git('./')
    .raw(['checkout', ghPagesBranchName])
    .then(() => {
      const rebaseBranch = `${masterBranchName}`;
      logger(`Rebasing on: ${rebaseBranch}`);
      return git('./').raw(['rebase', '-Xtheirs', rebaseBranch]);
    })
    .then(() => {
      logger('Building app');
      const result = shell.exec('npm run build:prod:silent');
      if (result.code === 0) {
        return git('./').raw(['add', '--all']);
      } else {
        throw new Error(result);
      }
    })
    .then(() => {
      const commitMsg = `Build v.${packageFile.version}`;
      logger('Commit:', `"${commitMsg}"`);
      return git('./').raw(['commit', '-m', commitMsg]);
    })
    .then(() => {
      logger(`Pushing to the ${ghPagesBranchName}`);
      return git('./').raw(['push', 'origin', ghPagesBranchName, '--force']);
    })
    .then(() => {
      logger('Deployment is finished');
    })
    .catch((err) => {
      logger('An error occurred, while deploying', err);
      logger('Resetting');
      return git('./').raw(['reset', '--hard']);
    })
    .then(() => {
      logger(`Checking out to: ${masterBranchName}`);
      return git('./').raw(['checkout', masterBranchName]);
    })
    .catch((err) => {
      logger('An error occurred, while trying to reset:', err);
    });
};

module.exports = deployGhPages;
