import { runCommand } from '../utils.js'
import { USUAL_GIT_BRANCHES } from '../constants.js'

export const checkoutToBranch = ({ branchName, withCreate = false }) =>
  runCommand(`git checkout ${withCreate ? '-b' : ''} ${branchName}`)

export const makeCommit = async ({ fileName, commitMessage, branchName }) => {
  // Add package file to git
  const addFileCommand = `git add ${fileName}`
  const addFileResult = await runCommand(addFileCommand)
  console.log(addFileResult)

  // Checking if we not in "master" branches
  let currentBranchName = await runCommand('git rev-parse --abbrev-ref HEAD')
  currentBranchName = currentBranchName.trim()

  if (
    USUAL_GIT_BRANCHES.includes(currentBranchName) ||
    currentBranchName !== branchName
  ) {
    await checkoutToBranch({ branchName, withCreate: true })
    currentBranchName = branchName
  }

  // Making local commit
  const commiteCommand = `git commit -m "${commitMessage}"`
  const commitResult = await runCommand(commiteCommand)
  console.log(commitResult)

  // Pushing
  const pushCommand = `git push origin ${currentBranchName}`
  const pushResult = await runCommand(pushCommand)
  console.log(pushResult)
}

export const deleteGitBranch = async (branchName) => {
  // Checkout to some of main branch
  const branchListCommand = `git branch -l`
  const branchListResult = await runCommand(branchListCommand)
  const mainBranch = branchListResult
    .split('\n')
    .find((branch) => USUAL_GIT_BRANCHES.includes(branch.trim()))
  await checkoutToBranch({ branchName: mainBranch })

  // Deleting branch
  const deleteCommand = `git branch -D ${branchName}`
  const deleteBranchResult = await runCommand(deleteCommand)

  console.log(deleteBranchResult)
}
