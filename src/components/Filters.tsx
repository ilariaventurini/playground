import { observer } from 'mobx-react-lite'
import style from './Filters.module.css'
import { FiltersMethodsSelect } from './FiltersMethodsSelect'
import { FiltersDateRange } from './FiltersDateRange'
import { translate } from '../i18n'

export const Filters = observer(() => {
  return (
    <div className={style.wrapper}>
      <div>{translate('demo.payment-channel')}</div>
      <div className={style.methods}>
        <FiltersMethodsSelect />
      </div>
      <div className={style.dateRange}>
        <FiltersDateRange />
      </div>
    </div>
  )
})
