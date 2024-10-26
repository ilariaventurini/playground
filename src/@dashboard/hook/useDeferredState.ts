import { useCallback, useEffect, useState } from 'react'
import { tuple } from '../utils/types'

export function useDeferredState<T>(state: T, setState: (v: T) => void) {
  const [internalState, setInternalState] = useState(state)

  const setStateDeferred = useCallback(
    (v: T) => {
      setInternalState(v)
      setTimeout(() => setState(v), 0)
    },
    [setState, setInternalState]
  )

  useEffect(() => {
    setInternalState(state)
  }, [state])

  return tuple(internalState, setStateDeferred)
}
