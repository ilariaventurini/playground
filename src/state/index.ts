import { flow, Instance, types } from 'mobx-state-tree'
import { UserModel } from './User'
import { LoadingModel } from '@dashboard/state/Loading'
import { subscribe } from '@dashboard/utils/mst'
import { createSafeContext } from '@dashboard/utils/react'

export const StateModel = types
  .model('StateModel', {
    loading: types.optional(LoadingModel, {}),
    user: types.maybe(UserModel),
  })
  .actions((self) => ({
    resetUser() {
      self.user = undefined
    },
    setUser() {
      self.user = UserModel.create()
    },
  }))
  .actions((self) => ({
    // eslint-disable-next-line require-yield
    fetchUserInfo: flow(function* () {
      try {
        self.loading.set('pending')
        self.resetUser()

        // TODO: fetch user info session when login api is ready

        self.setUser()

        self.loading.set('success')
      } catch (error) {
        console.error(error)
        self.loading.set('error')
      }
    }),
  }))
  .actions(
    subscribe((self) => {
      self.fetchUserInfo()
    })
  )

export interface StateInstance extends Instance<typeof StateModel> {}

export const globalState = StateModel.create()

if (process.env.NODE_ENV === 'development')
  Object.assign(window, { globalState })

const [Provider, createHook] = createSafeContext<StateInstance>('StateProvider')
export const StateProvider = Provider
export const useMst = createHook((state) => state)
export const useUser = createHook(({ user }) => {
  if (!user) throw new Error('User not initialized')
  return user
})
