#!/bin/bash

# This are pre-commit hooks for soc-ui environment
# in order to run it you need to add following string to .git/hooks/pre-commit:
# /bin/bash ./PATH_TO_THIS_FILE/pre-commit.sh

YELLOW='\033[1;33m'
GREEN='\033[1;32m'
BLUE='\033[1;34m'
RED='\033[1;31m'
NC='\033[0m'

# --cached      - difference of staged files
# --name-only   - list of file names that changed
# --diff-filter - filter staged files.
#   Select only files that are:
#     A - Added
#     C - Copied
#     M - Modified
#     R - Renamed
# More about `git diff`:
# https://git-scm.com/docs/git-diff
files=$(git diff --cached --name-only --diff-filter=ACMR | egrep '^source\/.+\.js[x]?$')

function print_error() {
    printf "${RED} 📛 ${BLUE}Commit aborted, please fix the problems in order to continue${NC} \n"
    printf "    (You can use --no-verify to bypass it) \n"
}

if [ -n "$files" ]; then
    printf "\n${GREEN} 🚴 ${YELLOW}Running unit tests${NC} \n\n"

    node ./node_modules/jest-cli/bin/jest.js --config ./jest/jest-config.json
    TEST_RESULT=$?

    if [ $TEST_RESULT -ne 0 ]
    then
        print_error
        exit 1
    fi

    printf "\n${GREEN} 🚴 ${YELLOW}Running eslint${NC} \n\n"
    node ./node_modules/eslint/bin/eslint.js $files
    ESLINT_RESULT=$?

    if [ $ESLINT_RESULT -ne 0 ]
    then
        print_error
        exit 1
    fi

    printf "\n${GREEN} 👍 ${YELLOW}Proceeding to commit${NC} \n\n"

    exit 0
fi
