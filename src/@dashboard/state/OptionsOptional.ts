import { Instance, types as t } from 'mobx-state-tree'
import { OptionsModel } from './Options'
import { BooleanModel } from './Boolean'
import { afterCreate } from '@dashboard/utils/mst'
import { updateHashParams } from '@dashboard/utils/updateHashParams'
import { isNil } from 'lodash-es'

export const OptionsOptionalModel = <T extends string[]>({
  options,
  hash,
  initial = undefined,
}: {
  hash?: string
  options: T
  initial?: T[number] | undefined
}) => {
  const initialOption: T[number] = initial ?? options[0]
  const initialIsUndefined = isNil(initial)
  return t
    .model('OptionsOptionalModel', {
      __options: t.optional(
        OptionsModel<T>({ options: options, initial: initialOption }),
        { options: options, __raw: { value: initialOption } }
      ),

      __isUndefined: t.optional(
        BooleanModel({ initial: initialIsUndefined }),
        () => ({})
      ),
    })
    .views((self) => ({
      get value() {
        if (self.__isUndefined.value) return undefined
        return self.__options.value
      },
    }))
    .actions((self) => ({
      set(v: T[number] | undefined) {
        if (isNil(v)) {
          self.__isUndefined.set(true)
        } else {
          self.__isUndefined.set(false)
          self.__options.set(v)
        }
      },
      reset() {
        self.__isUndefined.set(initialIsUndefined)
        self.__options.set(initialOption)
      },
    }))
    .actions(
      afterCreate((self) => {
        if (!hash) return
        return updateHashParams({
          param: hash,
          type: 'string',
          get: () => {
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

export interface OptionsOptionalModelInstance<T extends string[]>
  extends Instance<ReturnType<typeof OptionsOptionalModel<T>>> {}
