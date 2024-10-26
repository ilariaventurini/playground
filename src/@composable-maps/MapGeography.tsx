import { Geographies, Geography } from 'react-simple-maps'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { useGeoId, useMap } from './mapContext'
import { keyBy } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { topo2geo } from './utils'

export const MapGeography = observer(function MapGeography<T>({
  geography: inputGeography,
  topologyKey,
  data,
  dataId,
  geoId: childrenGeoId,
  fill = '#cccccc',
  stroke = 'white',
  strokeWidth = 1,
  strokeDasharray = '',
  opacity = 1,
  onClick,
}: {
  geography?: any
  topologyKey?: string
  data?: T[]
  dataId?: (d: T) => string
  geoId?: (geo: Feature<Geometry, GeoJsonProperties>) => string
  fill?: string | ((d?: T) => string)
  stroke?: string | ((d?: T) => string)
  strokeDasharray?: string | ((d?: T) => string)
  strokeWidth?: number | ((d?: T) => number)
  opacity?: number | ((d?: T) => number)
  onClick?: (d?: T) => void
}): JSX.Element {
  const contextGeography = useMap()

  if (inputGeography && !topologyKey)
    console.warn(
      'MapGeography: topologyKey is not set, using context geography'
    )

  const geography =
    inputGeography && topologyKey
      ? topo2geo(inputGeography, topologyKey)
      : contextGeography

  const geoId = useGeoId(childrenGeoId)

  const keyedData = keyBy(data, dataId)

  return (
    <Geographies geography={geography}>
      {({ geographies }) => {
        return geographies.map((geo) => {
          const datum = keyedData[geoId(geo)]

          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={typeof fill === 'function' ? fill(datum) : fill}
              stroke={typeof stroke === 'function' ? stroke(datum) : stroke}
              strokeDasharray={
                typeof strokeDasharray === 'function'
                  ? strokeDasharray(datum)
                  : strokeDasharray
              }
              strokeWidth={
                typeof strokeWidth === 'function'
                  ? strokeWidth(datum)
                  : strokeWidth
              }
              opacity={typeof opacity === 'function' ? opacity(datum) : opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={() => onClick?.(datum)}
            />
          )
        })
      }}
    </Geographies>
  )
})
