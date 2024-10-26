import { Instance, types as t } from 'mobx-state-tree'
import { afterCreate } from '../utils/mst'
import { updateHashParams } from '../utils/updateHashParams'

export const BooleanModel = (opts: { hash?: string; initial?: boolean }) =>
  t
    .model('BooleanModel', {
      value: opts.initial ?? false,
    })

    .actions((self) => ({
      set(value: boolean) {
        self.value = value
      },

      toggle() {
        self.value = !self.value
      },

      reset() {
        self.value = opts.initial ?? false
      },
    }))
    .actions(
      afterCreate((self) => {
        if (!opts.hash) return
        return updateHashParams({
          param: opts.hash,
          type: 'boolean',
          get: () => self.value || null,
          set: (v) => self.set(v || false),
        })
      })
    )

export interface BooleanModelInstance
  extends Instance<ReturnType<typeof BooleanModel>> {}
