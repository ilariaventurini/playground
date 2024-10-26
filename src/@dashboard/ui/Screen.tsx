import { CSSProperties, ReactNode } from 'react'

export interface Screen {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export const Screen = ({ children, className, style }: Screen) => {
  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
