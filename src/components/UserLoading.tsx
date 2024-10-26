import { observer } from 'mobx-react-lite'
import { useMst } from '../state'
import { Loader } from './ui/Loader'
import React from 'react'
import { Screen } from '@dashboard/ui/Screen'

export const UserLoading = observer(
  ({ children }: { children: React.ReactNode }) => {
    const state = useMst()

    if (state.loading.pending)
      return (
        <Screen className="flex flex-center">
          <Loader width={36} height={36} />
        </Screen>
      )

    if (state.loading.error) return <div>Error</div>
    return <> {children}</>
  }
)
