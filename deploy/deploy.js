const deployGhPages = require('./deployGhPages');
const { getCurrentBranch } = require('./utils');
const logger = require('./logger')('deploy.js');

const ghPagesBranchName = 'gh-pages';
const masterBranchName = 'master';

(async () => {
  const branchName = await getCurrentBranch();
  if (branchName === masterBranchName) {
    await deployGhPages({
      ghPagesBranchName,
      masterBranchName,
    });
  } else {
    logger(
      `Given branch "${branchName}" should be equal to "${masterBranchName}"`,
    );
  }
})();
