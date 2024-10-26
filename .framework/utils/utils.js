const cp = require('child_process')
const fs = require('fs-extra')
const path = require('path')
const { minimatch } = require('minimatch')

const FILE_TO_SYNC = path.resolve(__dirname, '../file-to-sync')
const FRAMEWORK_IGNORE = path.resolve(__dirname, '../../.frameworkignore')

const FILE_TO_SYNC_PATTERNS = readPathPatterns(FILE_TO_SYNC)
const FRAMEWORK_IGNORE_PATTERNS = readPathPatterns(FRAMEWORK_IGNORE)

module.exports.openUrl = function openUrl(url) {
  const start =
    process.platform == 'darwin'
      ? 'open'
      : process.platform == 'win32'
        ? 'start'
        : 'xdg-open'

  cp.exec(start + ' ' + url)
}

module.exports.rm = function rm(target) {
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      // delete recursively the content of the folder but not the folder itself
      for (const file of fs.readdirSync(target)) {
        fs.rmSync(path.resolve(target, file), { recursive: true })
      }
    } else {
      fs.rmSync(target, { recursive: true })
    }
  }
}

module.exports.copy = function copy(from, to) {
  if (fs.existsSync(from)) {
    fs.copySync(from, to)
  }
}

function getPathPatterns(fileContent) {
  return fileContent
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p)
    .filter((p) => !p.startsWith('#'))
}

function readPathPatterns(filePath) {
  if (!fs.existsSync(filePath)) return []
  const fileContent = fs.readFileSync(filePath, 'utf8')
  return getPathPatterns(fileContent)
}

const match = (path, pattern) => {
  return (
    minimatch(path, pattern, { matchBase: true }) ||
    minimatch(path, pattern + '/**', { matchBase: true })
  )
}

const matchAll = (path, patterns) => {
  const includes = patterns.filter((p) => !p.startsWith('!'))
  const excludes = patterns
    .filter((p) => p.startsWith('!'))
    .map((p) => p.slice(1))

  return (
    includes.some((p) => match(path, p)) &&
    (excludes.length === 0 || excludes.every((p) => !match(path, p)))
  )
}

function readRecursive(baseDir, callback) {
  const files = fs.readdirSync(baseDir)
  files.forEach((file) => {
    const filePath = path.resolve(baseDir, file)
    const isDirectory = fs.lstatSync(filePath).isDirectory()
    if (isDirectory) {
      readRecursive(filePath, callback)
    } else {
      callback(filePath)
    }
  })
}

module.exports.readRecursiveFileToSync = function (
  baseDir,
  ignorePatterns,
  callback
) {
  const currentIgnorePatterns = [
    ...ignorePatterns,
    ...FRAMEWORK_IGNORE_PATTERNS,
  ]

  readRecursive(baseDir, (filePath) => {
    const relativePath = path.relative(baseDir, filePath)

    const shouldBeIncluded = isIncluded(
      relativePath,
      FILE_TO_SYNC_PATTERNS,
      currentIgnorePatterns
    )

    if (shouldBeIncluded) {
      callback(relativePath)
    }
  })
}

function isIncluded(relativePath, includePaths, ignorePaths) {
  const shouldBeIncluded = matchAll(relativePath, includePaths)
  const shouldBeIgnored = matchAll(relativePath, ignorePaths)
  return shouldBeIncluded && !shouldBeIgnored
}
