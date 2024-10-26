import { useConst } from './useConst'

export function useId() {
  return useConst(() => Math.random().toString(36).slice(2))
}
