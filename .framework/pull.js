const simpleGit = require('simple-git')
const path = require('path')
const fs = require('fs-extra')
const { rm, copy, readRecursiveFileToSync } = require('./utils/utils')

const { exitIfHasUncommittedChanges } = require('./utils/git')
const { DASHBOARD_FRAMEWORK_URL } = require('./utils/constants')

const { 'from-branch': fromBranch } = require('args-parser')(process.argv)

const LOCAL_ROOT = path.resolve(__dirname, '..')
const TMP_ROOT = path.resolve(__dirname, '../tmp')

;(async () => {
  rm(TMP_ROOT)

  const currentGit = simpleGit()

  await exitIfHasUncommittedChanges(currentGit)

  console.log(`\nCloning ${DASHBOARD_FRAMEWORK_URL}...`)
  await currentGit.clone(DASHBOARD_FRAMEWORK_URL, TMP_ROOT)

  if (fromBranch) {
    const frameworkGit = simpleGit(TMP_ROOT)
    console.log(`\nChecking out branch "${fromBranch}"...`)
    await frameworkGit.checkout(fromBranch)
  }
  console.log("\nCopying framework's code to local...")

  readRecursiveFileToSync(
    LOCAL_ROOT,
    [path.relative(LOCAL_ROOT, TMP_ROOT)],
    (file) => {
      console.log(`- REMOVING: ${file}...`)
      rm(path.resolve(LOCAL_ROOT, file))
    }
  )

  readRecursiveFileToSync(TMP_ROOT, [], (file) => {
    console.log(`- COPYING: ${file}...`)
    copy(path.resolve(TMP_ROOT, file), path.resolve(LOCAL_ROOT, file))
  })

  console.log('\nCleaning up...')
  fs.rmSync(TMP_ROOT, { recursive: true })
})()
