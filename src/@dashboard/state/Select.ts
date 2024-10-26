import { Instance, types as t } from 'mobx-state-tree'
import { afterCreate } from '../utils/mst'
import { updateHashParams } from '../utils/updateHashParams'

export const SelectModel = <T extends string>(opts: {
  hash?: string
  initial?: T
}) =>
  t
    .model('SelectModel', {
      __raw: t.frozen<{ value: T | undefined }>({ value: opts.initial }),
    })
    .views((self) => ({
      get value(): T | undefined {
        return self.__raw.value
      },
    }))
    .actions((self) => ({
      set(value: T | undefined) {
        self.__raw = { value }
      },

      reset() {
        self.__raw = { value: opts.initial }
      },
    }))
    .actions((self) => ({
      toggle(value: T) {
        if (self.value === value) self.set(undefined)
        else self.set(value)
      },
    }))
    .actions(
      afterCreate((self) => {
        if (!opts.hash) return
        return updateHashParams({
          param: opts.hash,
          type: 'string',
          get: () => (self.value === opts.initial ? null : self.value || null),
          set: (v) => self.set(v || undefined),
        })
      })
    )

export interface SelectModelInstance<T extends string>
  extends Instance<ReturnType<typeof SelectModel<T>>> {}
