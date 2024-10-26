import { LayoutBlock } from 'yogurt-layout'
import { useControls } from 'leva'
import { DebugLayout as DashboardDebugLayout } from '@dashboard/charts/DebugLayout'
export type DebugLayoutProps = {
  layout: Record<string, LayoutBlock>
}

export const DebugLayout = ({ layout }: DebugLayoutProps) => {
  const { debug } = useControls({
    debug: false,
  })

  if (!debug) return null

  return <DashboardDebugLayout layout={layout} />
}
