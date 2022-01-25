const git = require('simple-git/promise');
const shell = require('shelljs');
const logger = require('./logger')('deployGhPages.js');
const packageFile = require('../package.json');

/**
 *
 * @param {object} options
 * @param {string} options.ghPagesBranchName
 * @param {string} options.masterBranchName
 * @return {Promise<void>}
 */
const deployGhPages = async (options) => {
  const { ghPagesBranchName, masterBranchName } = options;

  try {
    logger(`Checking out to: ${ghPagesBranchName}`);
    await git('./').raw(['checkout', ghPagesBranchName]);

    const rebaseBranch = `${masterBranchName}`;
    logger(`Rebasing on: ${rebaseBranch}`);
    await git('./').raw(['rebase', '-Xtheirs', rebaseBranch]);

    logger('Building app');
    const result = shell.exec('npm run export && rm -rf _next images about && mv -v ./out/* ./');
    if (result.code === 0) {
      await git('./').raw(['add', '--all', ':!src/*', ':!srcCanvas/*']);
    } else {
      throw new Error(result);
    }

    const commitMsg = `Build v.${packageFile.version}`;
    logger('Commit:', `"${commitMsg}"`);
    await git('./').raw(['commit', '-m', commitMsg]);

    logger(`Pushing to the ${ghPagesBranchName}`);
    await git('./').raw(['push', 'origin', ghPagesBranchName, '--force']);

    logger('Deployment is finished');
    logger('Clearing');
    await git('./')
      .raw(['add', '--all'])
      .then(() => git('./').raw(['reset', '--hard']));
  } catch (err) {
    logger('An error occurred, while deploying', err);
    logger('Aborting rebase');
    logger('Resetting');
    await git('./').raw(['reset', '--hard']);
  }

  logger(`Checking out to: ${masterBranchName}`);
  await git('./').raw(['checkout', masterBranchName]);
};

module.exports = deployGhPages;
