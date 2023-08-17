import {
  createPullRequest,
  deleteGitBranch,
  makeCommit
} from './helpers/index.js'
import inquirer from 'inquirer'
import fs from 'fs'

const transformFileName = (name) => `${name.replace(/(.json)$/gm, '')}.json`

;(async () => {
  // Grabbing initial users data
  const { name, version } = await inquirer.prompt([
    {
      name: 'name',
      message: 'what is package.json name?',
      validate: async (input) => {
        try {
          const fileName = transformFileName(input)
          fs.readFileSync(fileName)
          return true
        } catch (err) {
          return `${input} file not exist`
        }
      }
    },

    {
      name: 'version',
      message: 'what is new package version?',
      // TODO need implement version validation to restrict entering just letters
      validate: () => true
    }
  ])
  const fileName = transformFileName(name)

  const fileData = JSON.parse(fs.readFileSync(fileName))

  const branchName = `package-update-${version}`

  // Update package file locally
  try {
    fileData.version = version
    fs.writeFileSync(fileName, JSON.stringify(fileData, null, 2))
  } catch (e) {
    console.log('Error, while writing package file', e)
    return
  }

  try {
    await makeCommit({
      fileName,
      // TODO collect user's commit message
      commitMessage: `updated package version to ${version}`,
      branchName
    })
  } catch (e) {
    console.log('Error while working with git', e)
    return
  }

  try {
    let result = await createPullRequest({
      // TODO collect user's commit message
      title: `updated package version to ${version}`,
      source: {
        branch: {
          name: branchName
        }
      }
      // TODO Probably need to ask about destination branch. By default will be merget to bitbucket repo main
    })

    console.log(
      `Succesfully created PR to ${
        result?.source?.branch?.name || 'no name'
      }, \nstatus:${result.state || 'no status'}`
    )
  } catch (error) {
    console.log('Error while making PR', error)
    return
  }

  // TODO Potential side effects when branch will be deleted locally and by someone remotely - will lose
  const { isDelete } = await inquirer.prompt([
    {
      name: 'isDelete',
      message: `Do you want to delete ${branchName} branch?(y/n)`,
      validate: async (input) =>
        input !== 'y' && input !== 'n' ? 'type just "y" or "n"' : true
    }
  ])

  if (isDelete === 'y') {
    await deleteGitBranch(branchName)
  }
})()
