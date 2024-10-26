import { Instance, types as t } from 'mobx-state-tree'
import { afterCreate } from '../utils/mst'
import { updateHashParams } from '../utils/updateHashParams'
import { isValidDate } from '../utils/date'

export const DateModel = (opts: { hash?: string; initial?: Date }) =>
  t
    .model('DateModel', {
      __raw: t.optional(t.Date, opts.initial ?? new Date()),
    })
    .views((self) => ({
      get value(): Date {
        return self.__raw
      },
    }))
    .actions((self) => ({
      set(value: Date) {
        self.__raw = value
      },
    }))
    .actions(
      afterCreate((self) => {
        if (!opts.hash) return
        return updateHashParams({
          param: opts.hash,
          type: 'string',
          get: () => {
            const d = self.value
            const t = d.getDate().toString().padStart(2, '0')
            const m = (d.getMonth() + 1).toString().padStart(2, '0')
            const y = d.getFullYear().toString().padStart(4, '0')
            const formatted = `${y}-${m}-${t}`
            return formatted
          },
          set: (v) => {
            const date = new Date(v)
            if (!isValidDate(date)) return
            self.set(date)
          },
        })
      })
    )

export interface DateModelInstance
  extends Instance<ReturnType<typeof DateModel>> {}
