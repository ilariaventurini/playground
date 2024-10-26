import { Instance, t } from 'mobx-state-tree'
import { JsonModel } from './Json'
import { omit } from 'lodash-es'

export const HashMapModel = <T>(opts: {
  hash?: string
  initial?: Record<string, T>
}) =>
  t
    .model('HashMap', {
      __raw: t.optional(
        JsonModel<Record<string, T>>({
          initial: opts.initial ?? {},
          hash: opts.hash,
        }),
        {}
      ),
    })
    .views((self) => ({
      get value() {
        return self.__raw.value
      },

      get(key: string) {
        return self.__raw.value[key]
      },
    }))
    .actions((self) => ({
      reset() {
        self.__raw.reset()
      },
      set(key: string, value: T) {
        self.__raw.set({ ...self.__raw.value, [key]: value })
      },

      remove(key: string) {
        self.__raw.set(omit(self.__raw.value, key))
      },
    }))

export interface HashMapInstance<T>
  extends Instance<ReturnType<typeof HashMapModel<T>>> {}
