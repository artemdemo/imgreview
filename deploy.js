const deployGhPages = require('./deploy/deployGhPages');
const getCurrentBranch = require('./deploy/getCurrentBranch');
const logger = require('./deploy/logger')('deploy.js');

const ghPagesBranchName = 'gh-pages';
const masterBranchName = 'master';

getCurrentBranch()
  .then((branchName) => {
    if (branchName === masterBranchName) {
      return deployGhPages({
        ghPagesBranchName,
        masterBranchName,
      });
    } else {
      throw new Error(
        `Given branch "${branchName}" should be equal to "${masterBranchName}"`,
      );
    }
  })
  .catch((err) => {
    logger(err);
  });
