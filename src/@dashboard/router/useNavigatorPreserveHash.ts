import { NavigateOptions, useNavigate } from 'react-router-dom'

export type NavigatorPreserveHash = (
  to: string,
  options?: NavigateOptions
) => void

export const useNavigatorPreserveHash = () => {
  const navigator = useNavigate()
  const newNavigator: NavigatorPreserveHash = (to, options) =>
    navigator(to + window.location.hash, options)
  return newNavigator
}
