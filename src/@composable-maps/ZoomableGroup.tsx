import { ReactNode } from 'react'
// eslint-disable-next-line
//@ts-ignore
import { useZoomPan } from 'react-simple-maps'
// eslint-disable-next-line
//@ts-ignore
import {
  AnimationConfig,
  animated as animatedSpring,
  useSpring,
} from '@react-spring/web'
import { observer } from 'mobx-react-lite'

export const ZoomableGroup = observer(function ZoomableGroup({
  center,
  zoom,
  children,
  springConfig,
  animated = false,
  zoomable = false,
  pannable = false,
  scaleExtent = [0, zoom * 100],
  translateExtent,
}: {
  center: [number, number]
  zoom: number
  children?: ReactNode
  springConfig?: AnimationConfig
  animated?: boolean
  zoomable?: boolean
  pannable?: boolean
  scaleExtent?: [number, number]
  translateExtent?: [[number, number], [number, number]]
}) {
  const { transformString, mapRef } = useZoomPan({
    center,
    zoom,
    scaleExtent,
    translateExtent,
    filterZoomEvent: (evt: Event) => {
      const eventType = evt.type
      if (zoomable && !pannable) return eventType === 'wheel'
      if (!zoomable && pannable) return eventType !== 'wheel'
      return false
    },
  })

  const springs = useSpring({
    to: { transform: transformString },
    config: {
      mass: 5,
      friction: 120,
      ...springConfig,
    },
  })

  return (
    <g ref={zoomable || pannable ? mapRef : undefined}>
      {animated ? (
        <animatedSpring.g transform={springs.transform}>
          {children}
        </animatedSpring.g>
      ) : (
        <g transform={transformString}>{children}</g>
      )}
    </g>
  )
})
