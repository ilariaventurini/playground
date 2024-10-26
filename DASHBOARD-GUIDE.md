# Dashboard Framework - Guide

## `@dashboard`

## `@dashboard-examples`

> 🚨🚨 DON'T USE THIS FILES IN PRODUCTION, USE IT AS A REFERENCE.

## `@composable-maps`

## Syncronize changes

It is possible to syncronize code that is part of dashboard framework at any time.

### Pull changes

To pull updates run:

```
yarn framework:pull
```

This will download all changes. Note that there might be some conflicts with local codebase. Make sure to resolve this conflics before committing.

### Push changes

To push changes to template repository run:

```
yarn framework:create-pr
```

This will create a PR in [acc-dashboard-framework](https://github.com/accurat/acc-dashboard-framework) with local updates of dashboard files.

Before creating a PR is recommended to run `yarn pull` to fetch possible changes and fix conflicts locally. Make sure to follow this steps:

- `yarn framework:pull`
- Resolve conflics locally
- Commit pulled content
- `yarn framework:create-pr`

### Ignore changes or customize syncronization

For more info about syncronization works and how it can be customized relay on [framework README](.framework/README.md)
