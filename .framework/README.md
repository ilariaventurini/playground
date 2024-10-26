# Acc Dashboard Framework Scripts

The provided scripts serve the purpose of ensuring consistent framework updates across all associated projects.

The synchronized files are:

- `.framework`
- `src/@dashboard`
- `src/@dashboard-examples`
- `src/@composable-maps`
- `src/@composable-maps-examples`
- `src/vite-env.d.ts`
- `vite.config.ts`
- `tsconfig.json`
- `DASHBOARD-GUIDE.md`

## Pulling Changes with `yarn pull`

Run this script to pull changes from [acc-dashboard-framework](https://github.com/accurat/acc-dashboard-framework).

```sh
yarn pull
```

By default, changes are pulled from `main` branch. To pull from a differen branch use `--from-branch`:

```sh
yarn pull --from-branch=new-feature
```

## Creating a Pull Request with `yarn create-pr`

Run this script to create a PR to the [acc-dashboard-framework](https://github.com/accurat/acc-dashboard-framework) repository with local changes.

```sh
yarn create-pr
```

# Exclude specific files

To exclude certain files during the pull or create-pr process, incorporate a `.frameworkignore`` file at the project root. This file should list the paths of files and directories that are intended to be ignored.

For example, if the project uses a custom tsconfig or does not utilize composable-maps, include the following entries in `.frameworkignore`:

```
tsconfig.json
src/@composable-maps
```

To override the exclusion for a specific file or directory, prepend a `!` before the path. For instance, if you want to exclude all topo json files except for "usa.topo.json," the `.frameworkignore` file should look like this:

```
src/@composable-maps/data
!src/@composable-maps/data/usa.topo.json
```

**🚨 Note**: When a file or directory is listed in `.frameworkignore`, it is excluded from synchronization but remains in the project. Remember to delete it if it is no longer needed.
