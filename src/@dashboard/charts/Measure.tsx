import React, { CSSProperties } from 'react'
import useMeasure, { Options, RectReadOnly } from 'react-use-measure'

export interface MeasureProps {
  className?: string
  style?: CSSProperties
  options?: Options
  children: ((bounds: RectReadOnly) => React.ReactNode) | React.ReactNode
}

/**
 * A component that measures its size and passes it to its children.
 * If the children should not modify the parent size, use `MeasureAbsolute`.
 *
 * example:
 *
 * ```tsx
 * <Measure>
 *  {(bounds) => (
 *   <Component
 *    width={bounds.width}
 *    height={bounds.height}
 *   />
 *  )}
 * </Measure>
 * ```
 */
export const Measure = ({
  options,
  children,
  className = '',
  style = {},
}: MeasureProps) => {
  const [ref, bounds] = useMeasure(options)
  return (
    <div ref={ref} className={className} style={style}>
      {(bounds.width > 0 || bounds.height > 0) && (
        <>{typeof children === 'function' ? children(bounds) : children}</>
      )}
    </div>
  )
}
