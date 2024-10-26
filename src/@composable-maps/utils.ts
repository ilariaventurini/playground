import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { feature } from 'topojson'
import { Topology } from 'topojson-specification'

export function topo2geo<T extends Topology>(
  geography: T,
  topologyKey: keyof T['objects']
) {
  return feature(
    geography,
    geography.objects[topologyKey as string]
  ) as FeatureCollection<Geometry, GeoJsonProperties>
}
