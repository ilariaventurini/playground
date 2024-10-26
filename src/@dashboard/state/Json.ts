import { Instance, types as t } from 'mobx-state-tree'
import { subscribe } from '../utils/mst'
import { updateHashParams } from '../utils/updateHashParams'

const serialize = (value: unknown) => btoa(JSON.stringify(value))
const deserialize = (value: string) => JSON.parse(atob(value))

export const JsonModel = <T extends object>(opts: {
  initial: T
  hash?: string
}) =>
  t
    .model('JsonModel', {
      __raw: t.frozen({ value: opts.initial }),
    })
    .views((self) => ({
      get value() {
        return self.__raw.value
      },
    }))
    .actions((self) => ({
      reset() {
        self.__raw = { value: opts.initial }
      },

      set(value: T) {
        self.__raw = { value }
      },
    }))
    .actions(
      subscribe((self) => {
        if (!opts.hash) return
        return updateHashParams({
          param: opts.hash,
          type: 'string',
          get: () => {
            const seriaized = serialize(self.value)
            if (seriaized === serialize(opts.initial)) return null
            return seriaized
          },
          set: (str) => {
            if (str) self.set(deserialize(str))
          },
        })
      })
    )

export interface JsonModelInstance<T extends object>
  extends Instance<ReturnType<typeof JsonModel<T>>> {}
