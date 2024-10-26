import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { ComposableMap, MapGeography } from '@composable-maps'
import italy from '@composable-maps/data/regioni-con-province-autonome.topo.json'

export const Italy = observer(function Italy() {
  const [selectedId, setSelectedId] = useState<'Lombardia' | "Valle d'Aosta">(
    'Lombardia'
  )

  useEffect(() => {
    setTimeout(() => {
      setSelectedId(selectedId === 'Lombardia' ? "Valle d'Aosta" : 'Lombardia')
    }, 10000)
  })

  return (
    <ComposableMap
      geography={italy}
      geoId={(geo) => geo?.properties?.DEN_REG}
      topologyKey="regioni-con-province-autonome.geo"
      autoscaleConfig={{ selectedId, animated: true }}
      zoomConfig={{ zoomable: true, center: [1, 0], zoom: 0.5 }}
      projectionConfig={{
        projection: 'geoOrthographic',
        scale: 1000000,
        rotate: [40, 4, 6],
        center: [40, 40],
      }}
    >
      <MapGeography fill={'olive'} />
    </ComposableMap>
  )
})
