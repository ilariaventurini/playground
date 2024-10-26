module.exports.exitIfHasUncommittedChanges =
  async function exitIfHasUncommittedChanges(git) {
    const hasChanges = (await git.status()).files.length > 0
    if (hasChanges) {
      console.error(
        '\n🚨🚨 You have uncommitted changes. Please commit or stash them before proceeding. 🚨🚨\n'
      )
      process.exit(1)
    }
  }
