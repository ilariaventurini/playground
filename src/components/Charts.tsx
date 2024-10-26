import { observer } from 'mobx-react-lite'
import { useUser } from '../state'
import { Linechart } from './chart/Linechart'
import { Loader } from './ui/Loader'
import { formatWeekDay, getWeekDaysFromMonday } from '../lib/date'
import { StackedBarchart } from './chart/StackedBarchart'
import { mapValues } from 'lodash-es'
import { combineLoading } from '@dashboard/state/Loading'
import { formatTimeSlot, getAllTimeSlots, ALL_METHODS_COLOR } from '../lib/data'
import { translate } from '../i18n'

export const Charts = observer(() => {
  const {
    allMethods,
    filteredPayments,
    filteredPaymentsByWeekDay,
    filteredPaymentsBySpendingRange,
    filteredPaymentsByTimeSlot,
    filteredPaymentsByTypeAndMethodSum,
    methodsColors,
    paymentsByWeekDay,
    paymentsByTimeSlot,
    paymentsByTypeAndMethodSum,
    paymentsBySpendingRange,
    selectedMethods,
  } = useUser()

  const loading = combineLoading([
    filteredPayments.loading,
    filteredPaymentsByWeekDay.loading,
    filteredPaymentsByTimeSlot.loading,
    paymentsByWeekDay.loading,
    paymentsByTimeSlot.loading,
  ])

  if (loading === 'pending') {
    return (
      <div className="flex flex-center h-full">
        <Loader width={36} height={36} />
      </div>
    )
  }

  return (
    <div>
      <p>CHARTS</p>

      <p>
        {translate('demo.filtered')}: #{filteredPayments.value.length}
      </p>

      <h3>{translate('demo.tipologia-esercente')}</h3>

      <StackedBarchart
        data={filteredPaymentsByTypeAndMethodSum.value.map(
          ({ method, type, transactions }) => ({
            category: method,
            group: type,
            value: transactions,
          })
        )}
        globalData={paymentsByTypeAndMethodSum.value.map((d) => ({
          group: d.type,
          value: d.transactions,
        }))}
        categories={allMethods.value}
        colors={
          selectedMethods.value.length > 0
            ? methodsColors.value
            : mapValues(methodsColors.value, () => ALL_METHODS_COLOR)
        }
        primaryColor={ALL_METHODS_COLOR}
      />

      <h3>{translate('demo.fascia-di-spesa')}</h3>

      <StackedBarchart
        data={filteredPaymentsBySpendingRange.value.map(
          ({ method, spendingRange, transactions }) => ({
            category: method,
            group: spendingRange,
            value: transactions,
          })
        )}
        globalData={paymentsBySpendingRange.value.map((d) => ({
          group: d.spendingRange,
          value: d.transactions,
        }))}
        categories={allMethods.value}
        colors={
          selectedMethods.value.length > 0
            ? methodsColors.value
            : mapValues(methodsColors.value, () => ALL_METHODS_COLOR)
        }
        primaryColor={ALL_METHODS_COLOR}
      />

      <h3>{translate('demo.media-per-giorni-settimana')}</h3>

      <Linechart
        height={200}
        data={filteredPaymentsByWeekDay.value.map((d) => ({
          x: String(d.weekDay),
          y: d.mean,
        }))}
        meanData={paymentsByWeekDay.value.map((d) => ({
          x: String(d.weekDay),
          y: d.mean,
        }))}
        categories={getWeekDaysFromMonday()}
        formatLabelsX={formatWeekDay}
      />

      <h3>{translate('demo.media-per-orario')}</h3>

      <Linechart
        height={200}
        data={filteredPaymentsByTimeSlot.value.map((d) => ({
          x: String(d.timeSlot),
          y: d.mean,
        }))}
        meanData={paymentsByTimeSlot.value.map((d) => ({
          x: String(d.timeSlot),
          y: d.mean,
        }))}
        categories={getAllTimeSlots().map((d) => String(d))}
        formatLabelsX={(d) => formatTimeSlot(d)}
      />

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum expedita
        voluptatum voluptate accusamus perferendis? Dolore recusandae omnis quos
        quibusdam nulla asperiores ea ullam, veritatis iure nemo id quae quas
        reiciendis quis quod tenetur numquam labore libero pariatur nisi
        accusamus. Quisquam ducimus cum architecto in culpa neque, mollitia
        illum possimus! Animi assumenda laudantium provident corrupti quod
        quidem beatae, ipsam eaque tempore fuga minus, inventore qui dolor
        commodi optio quia soluta, fugit ea? Beatae facilis at perspiciatis
        aspernatur corrupti facere vitae vero, possimus obcaecati officiis
        recusandae soluta quod maxime nam nisi nihil itaque commodi nemo autem
        optio quis iure dicta temporibus quos?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum expedita
        voluptatum voluptate accusamus perferendis? Dolore recusandae omnis quos
        quibusdam nulla asperiores ea ullam, veritatis iure nemo id quae quas
        reiciendis quis quod tenetur numquam labore libero pariatur nisi
        accusamus. Quisquam ducimus cum architecto in culpa neque, mollitia
        illum possimus! Animi assumenda laudantium provident corrupti quod
        quidem beatae, ipsam eaque tempore fuga minus, inventore qui dolor
        commodi optio quia soluta, fugit ea? Beatae facilis at perspiciatis
        aspernatur corrupti facere vitae vero, possimus obcaecati officiis
        recusandae soluta quod maxime nam nisi nihil itaque commodi nemo autem
        optio quis iure dicta temporibus quos?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum expedita
        voluptatum voluptate accusamus perferendis? Dolore recusandae omnis quos
        quibusdam nulla asperiores ea ullam, veritatis iure nemo id quae quas
        reiciendis quis quod tenetur numquam labore libero pariatur nisi
        accusamus. Quisquam ducimus cum architecto in culpa neque, mollitia
        illum possimus! Animi assumenda laudantium provident corrupti quod
        quidem beatae, ipsam eaque tempore fuga minus, inventore qui dolor
        commodi optio quia soluta, fugit ea? Beatae facilis at perspiciatis
        aspernatur corrupti facere vitae vero, possimus obcaecati officiis
        recusandae soluta quod maxime nam nisi nihil itaque commodi nemo autem
        optio quis iure dicta temporibus quos?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum expedita
        voluptatum voluptate accusamus perferendis? Dolore recusandae omnis quos
        quibusdam nulla asperiores ea ullam, veritatis iure nemo id quae quas
        reiciendis quis quod tenetur numquam labore libero pariatur nisi
        accusamus. Quisquam ducimus cum architecto in culpa neque, mollitia
        illum possimus! Animi assumenda laudantium provident corrupti quod
        quidem beatae, ipsam eaque tempore fuga minus, inventore qui dolor
        commodi optio quia soluta, fugit ea? Beatae facilis at perspiciatis
        aspernatur corrupti facere vitae vero, possimus obcaecati officiis
        recusandae soluta quod maxime nam nisi nihil itaque commodi nemo autem
        optio quis iure dicta temporibus quos?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum expedita
        voluptatum voluptate accusamus perferendis? Dolore recusandae omnis quos
        quibusdam nulla asperiores ea ullam, veritatis iure nemo id quae quas
        reiciendis quis quod tenetur numquam labore libero pariatur nisi
        accusamus. Quisquam ducimus cum architecto in culpa neque, mollitia
        illum possimus! Animi assumenda laudantium provident corrupti quod
        quidem beatae, ipsam eaque tempore fuga minus, inventore qui dolor
        commodi optio quia soluta, fugit ea? Beatae facilis at perspiciatis
        aspernatur corrupti facere vitae vero, possimus obcaecati officiis
        recusandae soluta quod maxime nam nisi nihil itaque commodi nemo autem
        optio quis iure dicta temporibus quos?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum expedita
        voluptatum voluptate accusamus perferendis? Dolore recusandae omnis quos
        quibusdam nulla asperiores ea ullam, veritatis iure nemo id quae quas
        reiciendis quis quod tenetur numquam labore libero pariatur nisi
        accusamus. Quisquam ducimus cum architecto in culpa neque, mollitia
        illum possimus! Animi assumenda laudantium provident corrupti quod
        quidem beatae, ipsam eaque tempore fuga minus, inventore qui dolor
        commodi optio quia soluta, fugit ea? Beatae facilis at perspiciatis
        aspernatur corrupti facere vitae vero, possimus obcaecati officiis
        recusandae soluta quod maxime nam nisi nihil itaque commodi nemo autem
        optio quis iure dicta temporibus quos?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum expedita
        voluptatum voluptate accusamus perferendis? Dolore recusandae omnis quos
        quibusdam nulla asperiores ea ullam, veritatis iure nemo id quae quas
        reiciendis quis quod tenetur numquam labore libero pariatur nisi
        accusamus. Quisquam ducimus cum architecto in culpa neque, mollitia
        illum possimus! Animi assumenda laudantium provident corrupti quod
        quidem beatae, ipsam eaque tempore fuga minus, inventore qui dolor
        commodi optio quia soluta, fugit ea? Beatae facilis at perspiciatis
        aspernatur corrupti facere vitae vero, possimus obcaecati officiis
        recusandae soluta quod maxime nam nisi nihil itaque commodi nemo autem
        optio quis iure dicta temporibus quos?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum expedita
        voluptatum voluptate accusamus perferendis? Dolore recusandae omnis quos
        quibusdam nulla asperiores ea ullam, veritatis iure nemo id quae quas
        reiciendis quis quod tenetur numquam labore libero pariatur nisi
        accusamus. Quisquam ducimus cum architecto in culpa neque, mollitia
        illum possimus! Animi assumenda laudantium provident corrupti quod
        quidem beatae, ipsam eaque tempore fuga minus, inventore qui dolor
        commodi optio quia soluta, fugit ea? Beatae facilis at perspiciatis
        aspernatur corrupti facere vitae vero, possimus obcaecati officiis
        recusandae soluta quod maxime nam nisi nihil itaque commodi nemo autem
        optio quis iure dicta temporibus quos?
      </p>
      <p>THE END</p>
    </div>
  )
})
