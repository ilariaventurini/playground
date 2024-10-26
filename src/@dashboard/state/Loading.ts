import { Instance, types as t } from 'mobx-state-tree'
import { stringTuple } from '../utils/types'

const LOADING_OPTIONS = stringTuple('initial', 'pending', 'error', 'success')
export type LoadingOption = (typeof LOADING_OPTIONS)[number]

export const LoadingModel = t
  .model('LoadingStatus', {
    status: t.optional(
      t.enumeration<LoadingOption[]>(LOADING_OPTIONS),
      LOADING_OPTIONS[0]
    ),
  })
  .actions((self) => ({
    set(status: LoadingOption) {
      self.status = status
    },
  }))
  .views((self) => ({
    get pending() {
      return self.status === 'pending'
    },

    get success() {
      return self.status === 'success'
    },

    get error() {
      return self.status === 'error'
    },
  }))

export interface LoadingInstance extends Instance<typeof LoadingModel> {}

export function combineLoading(statuses: LoadingOption[]): LoadingOption {
  if (statuses.includes('error')) return 'error'
  if (statuses.includes('initial')) return 'initial'
  if (statuses.includes('pending')) return 'pending'
  return 'success'
}
