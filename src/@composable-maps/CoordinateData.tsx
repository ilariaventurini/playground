import { Marker } from 'react-simple-maps'

export function CoordinateData<T>({
  data,
  coordinates,
  marker,
}: {
  data: T[]
  coordinates: (d: T) => [number, number] | undefined
  marker: (d: T) => JSX.Element
}): JSX.Element {
  return (
    <>
      {data.map((d, i) => {
        const coords = coordinates(d)
        if (coords)
          return (
            <Marker key={i} coordinates={coords}>
              {marker(d)}
            </Marker>
          )
      })}
    </>
  )
}
