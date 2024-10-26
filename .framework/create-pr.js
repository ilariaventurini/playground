const simpleGit = require('simple-git')
const path = require('path')
const fs = require('fs-extra')
const { openUrl, rm, copy, readRecursiveFileToSync } = require('./utils/utils')
const { exitIfHasUncommittedChanges } = require('./utils/git')
const { DASHBOARD_FRAMEWORK_URL, DASHBOARD_REPO } = require('./utils/constants')

const LOCAL_PROJECT_NAME = fs.readJsonSync(__dirname + '/../package.json').name
const LOCAL_ROOT = path.resolve(__dirname, '..')
const TMP_ROOT = path.resolve(__dirname, '../tmp')

;(async () => {
  rm(TMP_ROOT)

  const currentGit = simpleGit()
  await exitIfHasUncommittedChanges(currentGit)

  console.log(`\nCloning ${DASHBOARD_FRAMEWORK_URL}...`)
  await currentGit.clone(DASHBOARD_FRAMEWORK_URL, TMP_ROOT)

  console.log("\nCopying local code to framework's code folder...")

  readRecursiveFileToSync(TMP_ROOT, [], (file) => {
    console.log(`- REMOVING: ${file}...`)
    rm(path.resolve(TMP_ROOT, file))
  })

  readRecursiveFileToSync(
    LOCAL_ROOT,
    [path.relative(LOCAL_ROOT, TMP_ROOT)],
    (file) => {
      console.log(`- COPYING: ${file}...`)
      copy(path.resolve(LOCAL_ROOT, file), path.resolve(TMP_ROOT, file))
    }
  )

  process.chdir(TMP_ROOT)

  const frameworkGit = simpleGit()

  const partialBranchName = `update/${LOCAL_PROJECT_NAME}`
  const separator = '-'
  const branchIndex =
    (await frameworkGit.branch()).all
      .map((b) => b.trim().replace('remotes/origin/', ''))
      .filter((b) => b.startsWith(partialBranchName))
      .map((b) => b.replace(partialBranchName + separator, ''))
      .map((b) => parseInt(b))
      .reduce((acc, b) => Math.max(acc, Number.isNaN(b) ? 0 : b), 0) + 1

  const branchName = `update/${LOCAL_PROJECT_NAME}${separator}${branchIndex}`
  console.log(`\nCreating branch "${branchName}"...`)
  await frameworkGit.checkout('-b' + branchName)

  console.log('\nCommitting changes...')
  await frameworkGit.add(process.cwd() + '/*')
  await frameworkGit.commit(`Update framework code`)

  console.log(
    `\nPushing branch "${branchName}" to ${DASHBOARD_FRAMEWORK_URL}...`
  )
  await frameworkGit.push('origin', branchName)

  const prUrl = `https://github.com/${DASHBOARD_REPO}/compare/main...${branchName}?expand=1`
  console.log(`\nOpening PR ${prUrl}...`)
  await openUrl(prUrl)

  console.log('\nCleaning up...')
  fs.rmSync(TMP_ROOT, { recursive: true })
})()
