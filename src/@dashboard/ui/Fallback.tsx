import { ReactNode } from 'react'

export const Fallback = ({
  children,
  loaded,
  fallback,
  error,
}: {
  children?: ReactNode
  loaded: boolean
  fallback?: ReactNode
  error?: unknown
}) => {
  if (error) {
    console.error('error: ', error)
    return <div>ERROR</div>
  }
  if (!loaded) return <>{fallback}</>
  return <>{children}</>
}
