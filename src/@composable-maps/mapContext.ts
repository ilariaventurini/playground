import { createSafeContext } from '@dashboard/utils/react'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { Topology } from 'topojson-specification'

const [Provider, createHook] = createSafeContext<{
  geography: Topology
  geoId: (geo: Feature<Geometry, GeoJsonProperties>) => string
}>('MapContext')

export const MapProvider = Provider
export const useMap = createHook((state) => state.geography)
const useContextGeoId = createHook((state) => state.geoId)
export const useGeoId = (
  geoId?: (geo: Feature<Geometry, GeoJsonProperties>) => string
) => {
  const contextGeoId = useContextGeoId()
  return geoId ?? contextGeoId
}
