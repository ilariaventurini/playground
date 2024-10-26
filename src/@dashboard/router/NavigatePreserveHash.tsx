import { Navigate, NavigateProps } from 'react-router-dom'

export const NavigatePreserveHash = (props: NavigateProps) => {
  return <Navigate {...props} to={props.to + window.location.hash} />
}
