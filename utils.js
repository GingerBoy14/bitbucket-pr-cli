import util from 'util'
import { exec as libexec } from 'child_process'
const exec = util.promisify(libexec)

export const runCommand = async (command) => {
  const { stdout, stderr, error } = await exec(command)
  if (stderr) {
    console.error('stderr:', stderr)
  }
  if (error) {
    console.error('error:', error)
  }
  return stdout
}
