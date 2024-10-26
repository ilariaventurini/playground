import { createContext, useContext } from 'react'
import { tuple } from './types'

export function createSafeContext<T>(message?: string) {
  const StateContext = createContext<T | null>(null)

  function createHook<U = T>(cb: (state: T) => U) {
    return () => {
      const state = useContext(StateContext)
      if (state === null)
        throw new Error(`Missing value. Please use ${message ?? 'a Provider'}`)
      return cb(state)
    }
  }

  return tuple(StateContext.Provider, createHook)
}
