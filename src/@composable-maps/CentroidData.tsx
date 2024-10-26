import { Geographies } from 'react-simple-maps'
import { useGeoId, useMap } from './mapContext'
import { keyBy } from 'lodash-es'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'

export function CentroidData<T>({
  data,
  dataId,
  geoId: childrenGeoId,
  marker,
}: {
  data: T[]
  dataId: (d: T) => string
  geoId?: (geo: Feature<Geometry, GeoJsonProperties>) => string
  marker: (d: T) => JSX.Element
}): JSX.Element {
  const geography = useMap()
  const geoId = useGeoId(childrenGeoId)

  const keyedData = keyBy(data, dataId)

  return (
    <Geographies geography={geography}>
      {(geography) => {
        return geography.geographies.map((geo) => {
          const centroid = geography.path.centroid(geo)
          const datum = keyedData[geoId(geo)]

          return (
            datum && (
              <g transform={`translate(${centroid[0]}, ${centroid[1]})`}>
                {marker(datum)}
              </g>
            )
          )
        })
      }}
    </Geographies>
  )
}
