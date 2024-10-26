import { observer } from 'mobx-react-lite'
import {
  BarData,
  Cartesian,
  Chart,
  LabelsData,
  stackNarrow,
} from 'react-composable-charts'
import { makeLayout } from 'yogurt-layout'
import { withMeasure } from './withMeasure'
import { groupBy, keyBy, max, sumBy, uniq, zipObject } from 'lodash-es'
import { DebugLayout } from './DebugLayout'

type Datum = {
  group: string
  value: number
  category: string
}

type GlobalDatum = {
  group: string
  value: number
}

interface StackedBarchartProps {
  width: number
  data: Datum[]
  globalData: GlobalDatum[]
  categories: string[]
  colors: Record<string, string>
  primaryColor: string
}

export const StackedBarchart = withMeasure(
  observer(
    ({
      width,
      categories,
      data,
      globalData,
      colors,
      primaryColor,
    }: StackedBarchartProps) => {
      const stackedData = stackNarrow({
        data,
        categories,
        getCategory: (d) => d.category,
        getGroup: (d) => d.group,
        getValue: (d) => d.value,
      })

      const maxValue = max(globalData.map((d) => d.value)) ?? 1
      const xDomain = [0, maxValue]
      const groups = uniq(globalData.map((d) => d.group))
      const yDomain = groups.map((_, i) => i.toString())

      const yDomainIndexes = zipObject(
        groups,
        yDomain.map((_, i) => i.toString())
      )

      const sortedStackedData = stackedData.map((d) => ({
        ...d,
        index: yDomainIndexes[d.group] ?? '0',
      }))

      const sortedGlobalData = globalData.map((d) => ({
        ...d,
        index: yDomainIndexes[d.group] ?? '0',
      }))

      const sumData = Object.entries(groupBy(data, (d) => d.group)).map(
        ([group, payments]) => {
          return {
            group,
            value: sumBy(payments, (d) => d.value),
          }
        }
      )

      const groupedByGroup = keyBy(sumData, ({ group }) => group)
      const sumDataGlobal = groups.map((group) => ({
        group,
        value: groupedByGroup[group]?.value ?? 0,
        index: yDomainIndexes[group],
      }))

      const BAR_HEIGHT = 15
      const height = BAR_HEIGHT * 3 * yDomain.length
      const layout = makeLayout({
        id: 'root',
        width,
        height,
        padding: {
          left: 0,
          top: 0,
          bottom: 0,
          right: 30,
        },
        children: [
          { id: 'groupLabels', width: 120 },
          { id: 'valueLabels', width: 60 },
          { id: 'stackedBarchart' },
        ],
      })

      return (
        <svg width={layout.root.width} height={layout.root.height}>
          <Chart {...layout.stackedBarchart}>
            <Cartesian
              x={{ scale: 'linear', domain: xDomain }}
              y={{ scale: 'band', padding: 0.63, domain: yDomain }}
              color={{
                scale: 'ordinal',
                domain: categories,
                range: categories.map((cat) => colors[cat]),
              }}
              nice
            >
              <LabelsData
                data={sumDataGlobal}
                dataY={(d) => d.index}
                positionX={layout.groupLabels.left}
                text={(d) => d.group}
                fill="#000"
                dominantBaseline="middle"
              />
              <LabelsData
                data={sumDataGlobal}
                dataY={(d) => d.index}
                positionX={layout.valueLabels.left}
                text={(d) => d.value}
                fill={primaryColor}
                dominantBaseline="middle"
              />
              <BarData
                data={sortedGlobalData}
                x={{ to: (d) => d.value }}
                y={(d) => d.index}
                stroke={primaryColor}
                fill="transparent"
                dataKey={(d) => d.index}
              />
              {categories
                .slice()
                .reverse()
                .map((cat, i) => (
                  <BarData
                    key={i}
                    data={sortedStackedData.filter((d) => d.category === cat)}
                    x={{ to: (d) => d.to, base: (d) => d.base }}
                    y={(d) => d.index}
                    fill={(d) => d.category as string}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    enter={{ width: 0, x: layout.stackedBarchart.left } as any}
                    dataKey={(d) => d.index}
                  />
                ))}
            </Cartesian>
          </Chart>
          <DebugLayout layout={layout} />
        </svg>
      )
    }
  )
)
