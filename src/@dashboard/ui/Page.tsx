import { CSSProperties } from 'react'

/**
 * A page is a full screen container. It is used to make sure that the
 * content of the page is always at least 800px tall.
 */
export const Page = ({
  children,
  style = {},
  className = '',
}: {
  className?: string
  children?: React.ReactNode
  style?: CSSProperties
}) => {
  return (
    <div
      className={className}
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        minHeight: '700px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
