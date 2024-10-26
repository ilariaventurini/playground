import { observer } from 'mobx-react-lite'
import classnames from 'classnames'
import { useUser } from '../state'

import style from './FiltersMethodsSelect.module.css'

export const FiltersMethodsSelect = observer(() => {
  const { payments, paymentsByMethod, selectedMethods, methodsColors } =
    useUser()
  return (
    <div className={style.buttonsWrapper}>
      <FilterButton
        active={selectedMethods.value.length === 0}
        onClick={() => selectedMethods.resetAll()}
      >
        All ({payments.value.length})
      </FilterButton>
      {Object.entries(paymentsByMethod.value).map(([cat, data]) => (
        <FilterButton
          key={cat}
          onClick={() => selectedMethods.toggle(cat)}
          active={selectedMethods.value.includes(cat)}
          color={methodsColors.value[cat]}
        >
          {cat} ({data.length})
        </FilterButton>
      ))}
    </div>
  )
})

function FilterButton({
  active,
  children,
  onClick,
  color = 'black',
}: {
  active?: boolean
  onClick?: () => void
  children?: React.ReactNode
  color?: string
}) {
  return (
    <button
      className={classnames(style.button, active && style.active)}
      onClick={onClick}
    >
      <div className={style.square} style={{ backgroundColor: color }}></div>
      {children}
    </button>
  )
}
