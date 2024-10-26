import { Instance, types as t } from 'mobx-state-tree'

// TODO: document behavior and add example usage
export const EventListenerModel = <T extends string>() =>
  t.model('EventListenerModel', {}).volatile(() => {
    const listeners = new Map<T, Set<() => void>>()

    function on(event: T, listener: () => void) {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event)?.add(listener)
    }

    function fire(event: T) {
      listeners.get(event)?.forEach((listener) => listener())
    }

    function off(event: T, listener: () => void) {
      listeners.get(event)?.delete(listener)
    }
    return {
      on,
      fire,
      off,
    }
  })

export interface EventListenerModelInstance<T extends string>
  extends Instance<ReturnType<typeof EventListenerModel<T>>> {}
