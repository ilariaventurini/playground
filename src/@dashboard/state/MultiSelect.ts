import { difference } from 'lodash-es'
import { Instance, types as t } from 'mobx-state-tree'
import { subscribe } from '../utils/mst'
import { updateHashParams } from '../utils/updateHashParams'

export const MultiSelectModel = <T extends string>(
  opts: {
    hash?: string
    initial?: T[]
  } = {}
) =>
  t
    .model('MultiSelectModel', {
      value: t.frozen<T[]>(opts.initial ?? []),
    })
    .actions((self) => ({
      toggle(option: T) {
        if (self.value.includes(option)) {
          self.value = difference(self.value, [option])
        } else {
          self.value = self.value.concat([option])
        }
      },

      resetAll() {
        self.value = []
      },

      set(options: T[]) {
        self.value = options
      },
    }))
    .actions(
      subscribe((self) => {
        if (!opts.hash) return
        return updateHashParams({
          param: opts.hash,
          type: 'array',
          get: () => self.value,
          set: self.set,
        })
      })
    )

export interface MultiSelectModelInstance<T extends string>
  extends Instance<ReturnType<typeof MultiSelectModel<T>>> {}
