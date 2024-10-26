import { IStateTreeNode, getParent } from 'mobx-state-tree'

type Unsubscribe = () => void
type Subscribe<T> = (self: T) => Unsubscribe | void

export const subscribe = <T>(fn: Subscribe<T>) => {
  return (self: T) => {
    let disposer: Unsubscribe | undefined
    return {
      afterCreate() {
        const res = fn(self)
        if (res) disposer = res
      },

      beforeDestroy() {
        disposer?.()
      },
    }
  }
}

export const afterCreate = <T>(fn: (self: T) => void) => {
  return (self: T) => ({
    afterCreate() {
      fn(self)
    },
  })
}

/**
 * Adds a parent property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withParentStore =
  <T>() =>
  (self: IStateTreeNode) => ({
    views: {
      /**
       * The root store.
       * @private
       */
      get parent(): T {
        // @ts-expect-error we know that the parent is of type T
        return getParent(self)
      },
    },
  })
