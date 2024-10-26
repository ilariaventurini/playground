import { observer } from 'mobx-react-lite'
import {
  Chart,
  Cartesian,
  Grid,
  LineData,
  RectData,
  Style,
} from 'react-composable-charts'
import { makeLayout } from 'yogurt-layout'
import { extent } from 'd3'
import { withMeasure } from './withMeasure'
import { DebugLayout } from './DebugLayout'
import { tuple } from '@dashboard/utils/types'
type Datum = {
  x: string
  y: number
}

interface LinechartProps {
  width: number
  height: number
  data: Datum[]
  meanData?: Datum[]
  categories: string[]
  formatLabelsX?: (label: string) => string
  formatLabelsY?: (label: number) => string
}

function geYDomain(data: Datum[]) {
  const ys = data.map((d) => d.y)
  const [min = 0, max = 10] = extent(ys)
  return tuple(min, max)
}

export const Linechart = withMeasure(
  observer(
    ({
      data,
      meanData = [],
      categories,
      width,
      height,
      formatLabelsX = (d) => d,
      formatLabelsY = (d) => String(d),
    }: LinechartProps) => {
      const layout = makeLayout({
        id: 'root',
        width,
        height,
        padding: {
          left: 60,
          top: 5,
          bottom: 30,
          right: 30,
        },
        children: [{ id: 'chart' }],
      })

      const xDomain = categories
      const yDomain = geYDomain(data.length ? data : meanData)

      return (
        <svg width={layout.root.width} height={layout.root.height}>
          <Chart {...layout.chart}>
            <Cartesian
              x={{ scale: 'point', domain: xDomain }}
              y={{ scale: 'linear', domain: yDomain }}
              nice
            >
              <Grid>
                <Grid.XLabels
                  padding={10}
                  format={() => (d) => formatLabelsX(d as string)}
                />
                <Grid.YLabels
                  padding={10}
                  format={() => (d) => formatLabelsY(d as number)}
                />
                <Style stroke="#C5C5C5">
                  <Grid.XLines />
                  <Grid.YLines />
                  <Grid xAnchor="top">
                    <Grid.XAxes />
                  </Grid>
                </Style>

                <Grid.XAxes stroke="#000000" />
                <Grid.YAxes stroke="#000000" />
              </Grid>

              <RectData
                data={meanData}
                x={(d) => d.x}
                y={(d) => d.y}
                width={10}
                height={10}
                stroke="#B783F9"
                fill="none"
                opacity={1}
                enter={{ opacity: 0 }}
              />
              <LineData
                data={data}
                x={(d) => d.x}
                y={(d) => d.y}
                stroke="#B783F9"
                strokeWidth={3}
                opacity={1}
                enter={{ opacity: 0 }}
              />

              <RectData
                data={data}
                x={(d) => d.x}
                y={(d) => d.y}
                width={10}
                height={10}
                fill="#B783F9"
                opacity={1}
                enter={{ opacity: 0 }}
              />
            </Cartesian>
          </Chart>

          <DebugLayout layout={layout} />
        </svg>
      )
    }
  )
)
