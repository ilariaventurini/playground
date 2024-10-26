import { ComposableMap, MapGeography } from '@composable-maps'
import worldGeography from '@composable-maps/data/topo.json'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'

export const World = observer(function World() {
  const [selectedId, setSelectedId] = useState<'ABW' | 'ITA'>('ABW')

  useEffect(() => {
    setTimeout(() => {
      setSelectedId(selectedId === 'ABW' ? 'ITA' : 'ABW')
    }, 10000)
  })

  return (
    <ComposableMap
      geography={worldGeography}
      geoId={(geo) => geo.id?.toString() ?? ''}
      topologyKey="countries"
      zoomConfig={{ pannable: true }}
      projectionConfig={{ center: [40, 40], scale: 100 }}
    >
      <MapGeography fill={'maroon'} />
    </ComposableMap>
  )
})
