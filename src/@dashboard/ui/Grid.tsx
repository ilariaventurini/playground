import { CSSProperties, ReactNode } from 'react'

export const Grid = ({
  children,
  gap,
  columns,
  rows,
  flow: gridAutoFlow,
  style,
  className = '',
}: {
  children?: ReactNode
  gap?: number | string
  style?: CSSProperties
  columns?: string | number
  rows?: string | number
  className?: string
  flow?: CSSProperties['gridAutoFlow']
}) => {
  const gridTemplateColumns =
    typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns

  const gridTemplateRows =
    typeof rows === 'number' ? `repeat(${rows}, 1fr)` : rows
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'grid',
        gridTemplateColumns,
        gridTemplateRows,
        gridAutoFlow,
        gap,
      }}
    >
      {children}
    </div>
  )
}
