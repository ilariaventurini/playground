import { flow, Instance, types as t } from 'mobx-state-tree'
import { combineLoading, LoadingModel, LoadingOption } from './Loading'
import { subscribe } from '@dashboard/utils/mst'

export const FetchableModel = <T>(init: T, firstFetch?: () => Promise<T>) =>
  t
    .model('FetchableModel', {
      __loading: t.optional(LoadingModel, {}),
      __raw: t.frozen<{ value: T }>({ value: init }),
      __error: t.maybeNull(t.frozen<unknown>()),
      __fetchId: 0,
    })

    .actions((self) => ({
      __setRaw(raw: T) {
        self.__raw = { value: raw }
      },

      __setError(error: unknown) {
        self.__error = error
      },

      __createFetchId() {
        return ++self.__fetchId
      },
    }))
    .views((self) => ({
      get value(): T {
        return self.__raw.value
      },

      get loading(): LoadingOption {
        return self.__loading.status as LoadingOption
      },
    }))
    .actions((self) => ({
      fetch: flow(function* (fetchData: () => Promise<T>) {
        try {
          const id = self.__createFetchId()

          if (self.__loading.status !== 'initial') self.__loading.set('pending')

          const raw: T = yield fetchData()

          // If a new fetch has been started, ignore the result of the previous one
          if (self.__fetchId !== id) return
          self.__setRaw(raw)

          self.__loading.set('success')
        } catch (error) {
          console.error(error)
          self.__setError(error)
          self.__loading.set('error')
        }
      }),
    }))
    .actions(
      subscribe((self) => {
        if (firstFetch) self.fetch(firstFetch)
      })
    )

export interface FetchableModelInstance<T>
  extends Instance<ReturnType<typeof FetchableModel<T>>> {}

export type Fetchable<T> = Pick<FetchableModelInstance<T>, 'value' | 'loading'>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProxed = <T extends Record<string | symbol | number, any>>(
  self: T
) => {
  const loadingStatuses: Record<string | symbol, LoadingOption> = {}
  const proxed = new Proxy(self, {
    get(target, key) {
      const prop = target[key]

      if (
        typeof prop === 'object' &&
        prop !== null &&
        Object.hasOwn(prop, 'loading') &&
        !Object.hasOwn(loadingStatuses, key)
      ) {
        loadingStatuses[key] = prop.loading
      }

      return prop
    },

    set() {
      throw new Error("Cannot set value when using 'derived' function")
    },
  })

  return { proxed, loadingStatuses: () => Object.values(loadingStatuses) }
}

export function deriveFetchable<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Self extends Record<string | symbol | number, any>,
  T,
>(self: Self, fn: (self: Self) => T): Fetchable<T> {
  const { loadingStatuses, proxed } = getProxed(self)

  const value = fn(proxed as Self)
  const loading = combineLoading(loadingStatuses())

  return { value, loading }
}
