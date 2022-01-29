const git = require('simple-git/promise');
const shell = require('shelljs');
const compareVersions = require('compare-versions');
const logger = require('./logger')('deployGhPages.js');
const packageFile = require('../package.json');
const { getDirectoriesNames, getVersionFromLastCommit } = require('./utils');

/**
 *
 * @param {object} options
 * @param {string} options.ghPagesBranchName
 * @param {string} options.masterBranchName
 * @return {Promise<void>}
 */
const deployGhPages = async (options) => {
  const { ghPagesBranchName, masterBranchName } = options;
  const OUTPUT_FOLDER = './out';
  const currentVersion = packageFile.version;

  let outputFolders = '';

  try {
    logger(`Checking out to: ${ghPagesBranchName}`);
    await git('./').raw(['checkout', ghPagesBranchName]);

    const lastVersion = await getVersionFromLastCommit();

    if (
      lastVersion === '' ||
      compareVersions(currentVersion, lastVersion) < 1
    ) {
      throw new Error(
        `Current version should be greater than the last one. Current=${currentVersion}, Last=${lastVersion}`,
      );
    }

    const rebaseBranch = `${masterBranchName}`;
    logger(`Rebasing on: ${rebaseBranch}`);
    await git('./').raw(['rebase', '-Xtheirs', rebaseBranch]);

    logger('Building app');
    const exportResult = shell.exec('npm run export');
    if (exportResult.code !== 0) {
      throw new Error(exportResult);
    }

    const outputFoldersList = await getDirectoriesNames(OUTPUT_FOLDER);
    outputFolders = outputFoldersList.join(' ');

    if (outputFolders === '') {
      throw new Error(`${OUTPUT_FOLDER} is empty`);
    }

    const result = shell.exec(
      `rm -rf ${outputFolders} && mv -v ${OUTPUT_FOLDER}/* ./`,
    );
    if (result.code !== 0) {
      throw new Error(result);
    }

    await git('./').raw(['add', '--all', ':!src/*', ':!srcCanvas/*']);

    const commitMsg = `Build v.${currentVersion}`;
    logger(`Commit: "${commitMsg}"`);
    await git('./').raw(['commit', '-m', commitMsg]);

    logger(`Pushing to the "${ghPagesBranchName}"`);
    await git('./').raw(['push', 'origin', ghPagesBranchName, '--force']);

    logger('Deployment is finished');
    logger('Clearing uncommited files');
    await git('./').raw(['add', '--all']);
    await git('./').raw(['reset', '--hard']);
  } catch (err) {
    logger('An error occurred, while deploying', err);
    logger('Aborting rebase');
    logger('Resetting');
    await git('./').raw(['reset', '--hard']);
  }

  logger(`Clearing output folders: ${outputFolders}`);
  shell.exec(`rm -rf ${outputFolders}`);

  logger(`Checking out to "${masterBranchName}"`);
  await git('./').raw(['checkout', masterBranchName]);
};

module.exports = deployGhPages;
