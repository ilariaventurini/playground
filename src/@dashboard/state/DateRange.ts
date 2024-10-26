import { Instance, types as t } from 'mobx-state-tree'
import { afterCreate } from '../utils/mst'
import { updateHashParams } from '../utils/updateHashParams'

function yesterday() {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date
}

export const DateRangeModel = (opts: { hash?: string } = {}) =>
  t
    .model('DateRangeModel', {
      value: t.frozen<[Date, Date]>([yesterday(), new Date()]),
    })
    .views((self) => ({
      get start() {
        return self.value[0]
      },

      get end() {
        return self.value[1]
      },
    }))
    .actions((self) => ({
      set(date: [Date, Date]) {
        self.value = date
      },

      setStart(date: Date) {
        self.value = [date, self.value[1]]
      },

      setEnd(date: Date) {
        self.value = [self.value[0], date]
      },
    }))
    .actions(
      afterCreate((self) => {
        if (!opts.hash) return
        return updateHashParams({
          param: opts.hash,
          type: 'array',
          get: () => self.value.map((d) => d.toISOString()),
          set: (value: string[]) =>
            self.set(value.map((d) => new Date(d)) as [Date, Date]),
        })
      })
    )

export interface DateRangeModelInstance
  extends Instance<typeof DateRangeModel> {}
