// eslint-disable-next-line
//@ts-ignore
import { useMapContext } from 'react-simple-maps'
import { keyBy, uniqBy } from 'lodash-es'
import rawCoordinatesWorld from './data/raw-coordinates.json'
import countryIso3Coordinates from './data/country-coordinates.json'
import countryIso3Distances from './data/country-distances.json'

export function HeatmapData<T>({
  data,
  dataId,
  rawCoordinates = rawCoordinatesWorld as [number, number][],
  idCoordinates = countryIso3Coordinates,
  distancesCoordinates = countryIso3Distances,
  marker,
  gridSize,
  keyFn,
}: {
  data: T[]
  dataId?: (d: T) => string | number
  rawCoordinates: [number, number][]
  idCoordinates: (string | number | null)[]
  distancesCoordinates: (number | null)[]
  marker: (
    d?: T,
    id?: string | number,
    distance?: number,
    projectedQuantisedCoordinates?: [number, number],
    index?: number
  ) => JSX.Element
  gridSize: number
  keyFn?: (
    d?: T,
    id?: string | number,
    distance?: number,
    projectedQuantisedCoordinates?: [number, number],
    index?: number
  ) => string
}) {
  const { projection } = useMapContext() as {
    projection: (coordinate: [number, number]) => [number, number]
  }

  if (
    !(
      rawCoordinates.length === idCoordinates.length &&
      rawCoordinates.length === distancesCoordinates.length
    )
  ) {
    console.error(
      'rawCoordinates, idCoordinates and distancesCoordinates must all have the same length.'
    )
    return null
  }

  const projectedCoordinates = rawCoordinates.map((c) =>
    projection([c[0] - 360, c[1]])
  )
  const quantisedProjectedCoordinates = projectedCoordinates.map(
    (c) =>
      [c[0] - (c[0] % gridSize), c[1] - (c[1] % gridSize)] as [number, number]
  )

  const uniqGridData = uniqBy(
    quantisedProjectedCoordinates.map((c, i) => ({
      coordinates: c,
      id: idCoordinates[i],
      distance: distancesCoordinates?.[i],
    })),
    (c) => `${c.coordinates[0]}-${c.coordinates[1]}`
  )

  const uniqQuantisedProjectedCoordinates = uniqGridData.map(
    (d) => d.coordinates
  )
  const uniqIdCoordinates = uniqGridData.map((d) => d.id)
  const uniqDistances = uniqGridData.map((d) => d.distance)

  const keyedData = keyBy(data, dataId)

  return (
    <g transform={`translate(${gridSize / 4} ${gridSize / 2})`}>
      {uniqQuantisedProjectedCoordinates.map(
        (projectedQuantisedCoordinates, coordinatesIndex) => {
          const id = uniqIdCoordinates[coordinatesIndex] ?? undefined

          const distance = uniqDistances[coordinatesIndex] ?? undefined

          const datum = id ? keyedData[id] : undefined

          return (
            <g
              key={
                keyFn?.(
                  datum,
                  id,
                  distance,
                  projectedQuantisedCoordinates,
                  coordinatesIndex
                ) ??
                `${projectedQuantisedCoordinates[0]}-${projectedQuantisedCoordinates[1]}`
              }
              transform={`translate(${projectedQuantisedCoordinates[0]} ${projectedQuantisedCoordinates[1]})`}
            >
              {marker(
                datum,
                id,
                distance,
                projectedQuantisedCoordinates,
                coordinatesIndex
              )}
            </g>
          )
        }
      )}
    </g>
  )
}
