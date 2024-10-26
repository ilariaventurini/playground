import { Instance, types as t } from 'mobx-state-tree'
import { afterCreate } from '../utils/mst'
import { updateHashParams } from '../utils/updateHashParams'

export const NumberModel = (opts: { hash?: string; initial?: number } = {}) =>
  t
    .model('NumberModel', {
      value: opts.initial ?? 0,
    })

    .actions((self) => ({
      set(value: number) {
        self.value = value
      },

      incrementBy(amount: number) {
        self.value += amount
      },
      decrementBy(amount: number) {
        self.value -= amount
      },

      reset() {
        self.value = opts.initial ?? 0
      },
    }))
    .actions(
      afterCreate((self) => {
        if (!opts.hash) return
        return updateHashParams({
          param: opts.hash,
          type: 'float',
          get: () => self.value,
          set: (v) => self.set(v || 0),
        })
      })
    )

export interface NumberModelInstance
  extends Instance<ReturnType<typeof NumberModel>> {}
