import { Instance, types as t } from 'mobx-state-tree'
import { afterCreate } from '../utils/mst'
import { updateHashParams } from '../utils/updateHashParams'
import { isNil } from 'lodash-es'

export const OptionsModel = <T extends string[]>(opts: {
  hash?: string
  options: T
  initial?: T[number]
}) => {
  const { hash, options, initial = opts.options[0] } = opts
  return t
    .model('OptionsModel', {
      options: t.frozen(options),
      __raw: t.frozen<{ value: T[number] }>({ value: initial }),
    })
    .views((self) => ({
      get value(): T[number] {
        return self.__raw.value
      },
    }))
    .actions((self) => ({
      set(value: T[number]) {
        self.__raw = { value }
      },
      reset() {
        self.__raw = { value: initial }
      },
    }))
    .actions(
      afterCreate((self) => {
        if (!hash) return
        return updateHashParams({
          param: hash,
          type: 'string',
          get: () => {
            if (self.value === initial) return null
            return self.value ?? null
          },
          set: (v) => {
            if (isNil(v) || !options.includes(v)) {
              self.set(initial)
            } else {
              self.set(v)
            }
          },
        })
      })
    )
}

export interface OptionsModelInstance<T extends string[]>
  extends Instance<ReturnType<typeof OptionsModel<T>>> {}
