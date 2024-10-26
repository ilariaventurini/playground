import { CSSProperties } from 'react'
import { Measure, MeasureProps } from './Measure'

interface MeasureAbsoluteProps extends MeasureProps {}

const MESURE_STYLE: CSSProperties = {
  width: '100%',
  height: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
}

const CHILD_RELATIVE_STYLE: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
}

const CHILD_ABSOLUTE_STYLE: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
}

/**
 * A component that measures its size and passes it to its children.
 * The children are rendered in an absolutely positioned div, so their
 * size do not modify the parent size.
 *
 * If the children should not be constrained to the parent size, use `Measure`.
 *
 * example:
 *
 * ```tsx
 * <MeasureAbsolute>
 *  {(bounds) => (
 *   <Component
 *    width={bounds.width}
 *    height={bounds.height}
 *   />
 *  )}
 * </MeasureAbsolute>
 * ```
 */
export const MeasureAbsolute = ({
  children,
  options,
  className,
  style,
}: MeasureAbsoluteProps) => {
  return (
    <Measure
      className={className}
      style={{ ...MESURE_STYLE, ...style }}
      options={options}
    >
      {(bounds) => (
        <div style={CHILD_RELATIVE_STYLE}>
          <div style={CHILD_ABSOLUTE_STYLE}>
            <>{typeof children === 'function' ? children(bounds) : children}</>
          </div>
        </div>
      )}
    </Measure>
  )
}
