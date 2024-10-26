import { observer } from 'mobx-react-lite'
import { World } from '../@composable-maps-examples/World'
import { Italy } from '../@composable-maps-examples/Italy'
import { SpinningWorld } from '../@composable-maps-examples/SpinningWorld'
import { Filters } from '../components/Filters'
import { Charts } from '../components/Charts'
import { Screen } from '@dashboard/ui/Screen'
import { Grid } from '@dashboard/ui/Grid'
import { translate } from '../i18n'

export const MainPage = observer(() => {
  return (
    <Screen className="flex flex-column">
      <div style={{ backgroundColor: '#2D32AA', color: '#ffffff' }}>
        <p>{translate('demo.logo')}</p>
      </div>
      <div style={{ backgroundColor: '#E4E4E4' }}>
        <Filters />
      </div>
      <Grid columns="1fr 1fr" className="h-full overflow-hidden">
        <div className="overflow-auto">
          <div>
            <World />
          </div>
          <div>
            <Italy />
          </div>
          <div>
            <SpinningWorld />
          </div>
        </div>

        <div className="overflow-auto">
          <Charts />
        </div>
      </Grid>
    </Screen>
  )
})
