import { observer } from 'mobx-react-lite'
import {
  ComposableMap as RSMComposableMap,
  ProjectionConfig,
} from 'react-simple-maps'
import { bbox as topojsonBbox } from 'topojson'
import { compact, keyBy, maxBy, mean } from 'lodash-es'
import { polygon, bbox as turfBbox } from 'turf'
import { MapProvider } from './mapContext'
import { ZoomableGroup } from './ZoomableGroup'
import { CSSProperties, ReactNode } from 'react'
import { Topology } from 'topojson-specification'
import {
  BBox,
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from 'geojson'

import worldGeographyNotCasted from './data/topo.json'
import { range, sum } from 'd3'
import { AnimationConfig } from '@react-spring/web'
import { topo2geo } from './utils'

const worldGeography = worldGeographyNotCasted as unknown as Topology

function sumArrays(...arrays: number[][]) {
  if (arrays.length === 0) return
  const length = maxBy(arrays, (array) => array.length)?.length
  if (!length) return

  return range(length).map((_, i) => sum(arrays.map((array) => array[i])))
}

function bbox(
  box:
    | Feature<Geometry, GeoJsonProperties>
    | FeatureCollection<Geometry, GeoJsonProperties>
) {
  return turfBbox(box).slice(0, 4) as BBox
}

function computeBBCenter(selectedBbox: GeoJSON.BBox): [number, number] {
  const boundingBox = selectedBbox
  const lonRange = [boundingBox[0], boundingBox[2]]
  const latRange = [boundingBox[1], boundingBox[3]]

  return [mean(lonRange), mean(latRange)]
}

function computeBBScale(
  selectedBbox: GeoJSON.BBox,
  worldTopoJson: Topology
): number {
  const magicNumber = 200

  const boundingBox = selectedBbox
  const worldBoundingBox = topojsonBbox(worldTopoJson)

  const worldHorizontalSize = Math.abs(
    worldBoundingBox[0] - worldBoundingBox[2]
  )
  const worldVerticalSize = Math.abs(worldBoundingBox[1] - worldBoundingBox[3])

  const horizontalSize = Math.abs(boundingBox[0] - boundingBox[2])
  const verticalSize = Math.abs(boundingBox[1] - boundingBox[3])

  const horizontalScale = (magicNumber * worldHorizontalSize) / horizontalSize
  const verticalScale = (magicNumber * worldVerticalSize) / verticalSize

  return Math.min(verticalScale, horizontalScale)
}

export const ComposableMap = observer(function ComposableMap({
  geography: geographyNotCasted = worldGeography as unknown as Topology,
  children,
  geoId,
  topologyKey,
  style,
  projectionConfig,
  width,
  height,
  autoscaleConfig = {
    animated: false,
  },
  zoomConfig = {
    zoomable: false,
    pannable: false,
  },
}: {
  width?: number
  height?: number
  geography?: any
  children?: ReactNode
  geoId: (geo: Feature<Geometry, GeoJsonProperties>) => string
  topologyKey: string
  style?: CSSProperties
  projectionConfig?: ProjectionConfig & { projection?: string }
  autoscaleConfig?: {
    selectedId?: string
    animated?: boolean
    springConfig?: AnimationConfig
  }
  zoomConfig?: {
    zoomable?: boolean
    pannable?: boolean
    center?: [number, number]
    zoom?: number
    scaleExtent?: [number, number]
  }
}) {
  const geography = geographyNotCasted as unknown as Topology

  const selectedId = autoscaleConfig?.selectedId
  const geoJson = topo2geo(geography, topologyKey)

  const globalBoundingBox = topojsonBbox(geography)

  const idsBoundingBoxes = selectedId
    ? compact(
        geoJson.features.map((geo) => {
          if (geo.geometry.type === 'Polygon') {
            const poly = polygon(geo.geometry.coordinates)
            return {
              geo,
              scale: computeBBScale(bbox(poly), worldGeography),
              center: computeBBCenter(bbox(poly)),
            }
          }
          if (geo.geometry.type === 'MultiPolygon') {
            const poly = polygon(geo.geometry.coordinates.flat())
            return {
              geo,
              scale: computeBBScale(
                bbox(poly).slice(0, 4) as BBox,
                worldGeography
              ),
              center: computeBBCenter(bbox(poly)),
            }
          }

          return
        })
      )
    : []

  const smallestScale = selectedId
    ? maxBy(idsBoundingBoxes, (d) => d.scale)?.scale ?? 1
    : 1

  const keyedIdsBoundingBoxes = selectedId
    ? keyBy(idsBoundingBoxes, (d) => geoId(d.geo))
    : {}

  const globalScale = selectedId
    ? smallestScale
    : computeBBScale(globalBoundingBox, worldGeography)

  const center = selectedId
    ? keyedIdsBoundingBoxes[selectedId].center
    : computeBBCenter(globalBoundingBox)

  const selectedIdScale = selectedId
    ? keyedIdsBoundingBoxes[selectedId].scale
    : computeBBScale(globalBoundingBox, worldGeography)

  return (
    <RSMComposableMap
      width={width}
      height={height}
      projection={projectionConfig?.projection}
      style={{
        height: '100%',
        width: '100%',
        ...style,
      }}
      projectionConfig={{ scale: globalScale, ...projectionConfig }}
    >
      <MapProvider value={{ geography, geoId }}>
        <ZoomableGroup
          center={
            sumArrays(zoomConfig.center ?? [0, 0], center) as [number, number]
          }
          zoom={
            ((zoomConfig.zoom ?? 1) * selectedIdScale) /
            (projectionConfig?.scale ?? globalScale)
          }
          zoomable={zoomConfig.zoomable}
          pannable={zoomConfig.pannable}
          animated={autoscaleConfig?.animated}
          springConfig={autoscaleConfig?.springConfig}
          scaleExtent={zoomConfig?.scaleExtent}
        >
          {children}
        </ZoomableGroup>
      </MapProvider>
    </RSMComposableMap>
  )
})
