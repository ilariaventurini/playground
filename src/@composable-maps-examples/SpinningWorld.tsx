import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Line } from 'react-simple-maps'
import { ComposableMap, MapGeography } from '@composable-maps'
import worldGeography from '@composable-maps/data/small.topo.json'

export const SpinningWorld = observer(function SpinningWorld() {
  const [angle, setAngle] = useState<number>(0)

  useEffect(() => {
    setTimeout(() => {
      setAngle((angle + 0.5) % 360)
    }, 2)
  })

  return (
    <ComposableMap
      geography={worldGeography}
      geoId={(geo) => geo.id?.toString() ?? ''}
      topologyKey="countries"
      projectionConfig={{
        projection: 'geoOrthographic',
        rotate: [angle, 0, 0],
      }}
    >
      <Line
        coordinates={[
          [-angle - 90, -90],
          [-angle - 90, 90],
          [-angle + 90, 90],
          [-angle + 90, -90],
        ]}
        fill="#4E4E4E"
        strokeWidth={0}
        stroke="transparent"
      />
      <MapGeography fill={'maroon'} />
    </ComposableMap>
  )
})
