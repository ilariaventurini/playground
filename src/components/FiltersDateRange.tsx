import { observer } from 'mobx-react-lite'
import style from './FiltersDateRange.module.css'
import { useUser } from '../state'
import { formatDatetimeLocal } from '../lib/date'

export const FiltersDateRange = observer(() => {
  const { dateRange } = useUser()
  return (
    <div className={style.wrapper}>
      <div>Da</div>
      <input
        type="datetime-local"
        value={formatDatetimeLocal(dateRange.start)}
        onChange={(e) => {
          const value = e.target.value
          if (value === '') return
          dateRange.setStart(new Date(value))
        }}
        required
      />
      <div>a</div>
      <input
        type="datetime-local"
        value={formatDatetimeLocal(dateRange.end)}
        onChange={(e) => {
          const value = e.target.value
          if (value === '') return
          dateRange.setEnd(new Date(value))
        }}
        required
      />
    </div>
  )
})
