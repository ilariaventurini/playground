import { ForwardedRef, forwardRef } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export const LinkPreserveHash = forwardRef(
  (props: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    return <Link {...props} ref={ref} to={props.to + window.location.hash} />
  }
)
