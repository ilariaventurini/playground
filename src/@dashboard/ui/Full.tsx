import { ReactNode } from 'react'

export interface FullProps {
  children: ReactNode
}

export const Full = ({ children }: FullProps) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
