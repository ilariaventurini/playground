import { Measure } from '@dashboard/charts/Measure'
import { Options } from 'react-use-measure'
type Dimensions = {
  width: number
  height: number
}

type Id<P> = { [K in keyof P]: P[K] }

type WithMeasureProps<P extends object> = Id<
  Partial<Pick<P, Extract<keyof P, keyof Dimensions>>> &
    Omit<P, keyof Dimensions> & { measureOptions?: Options }
>

/**
 * A HOC that passes the measured size of the component to its props.
 *
 * example:
 *
 * ```tsx
 * const Component = withMeasure(({ width, height }) => (
 *  <div style={{ width, height }} />
 * ))
 *
 *
 * const App = () => (
 * <>
 *  <Component />
 *  <Component
 *    height={200} // this prop will override the measured height
 *  />
 * </>
 * )
 *
 * ```
 *
 * The HOC also accepts an optional `measureOptions` prop that is passed to the
 * underlying `react-use-measure` hook.
 *
 *
 */
export const withMeasure =
  <Props extends object>(
    Component: React.ComponentType<Props>
  ): React.ComponentType<WithMeasureProps<Props>> =>
  ({ measureOptions, ...props }) =>
    (
      <Measure options={measureOptions}>
        {(bounds) => {
          const componentProps = { ...bounds, ...props } as Props
          return <Component {...componentProps} />
        }}
      </Measure>
    )
