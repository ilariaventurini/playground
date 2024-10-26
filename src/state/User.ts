import { Instance, types as t } from 'mobx-state-tree'
import { fetchPaymentDataset, Payment } from '../lib/api'
import { groupBy, sumBy, uniq, zipObject } from 'lodash-es'
import { addYears } from '../lib/date'
import { FetchableModel, deriveFetchable } from '@dashboard/state/Fetchable'
import { MultiSelectModel } from '@dashboard/state/MultiSelect'
import { DateRangeModel } from '@dashboard/state/DateRange'
import { subscribe } from '@dashboard/utils/mst'
import {
  OVER_RANGE,
  STEP_RANGE,
  RANDOM_COLORS,
  computePaymentsByCity,
  computePaymentsByCityByMethod,
  computePaymentsBySpendingRange,
  computePaymentsByTimeSlot,
  computePaymentsByTypeAndMethodSum,
  computePaymentsByWeekDay,
  createAllSpendingRanges,
} from '../lib/data'

export const UserModel = t
  .model('UserModel', {
    payments: t.optional(FetchableModel<Payment[]>([]), {}),
    selectedMethods: t.optional(
      MultiSelectModel<string>({ hash: 'methods' }),
      {}
    ),
    dateRange: t.optional(DateRangeModel({ hash: 'date-range' }), {
      value: [addYears(new Date(), -1), new Date()],
    }),
  })
  .views((self) => ({
    get allMethods() {
      return deriveFetchable(self, (self) =>
        uniq(self.payments.value.map((payment) => payment.paymentMethod))
      )
    },
  }))
  .views((self) => ({
    get paymentsByMethod() {
      return deriveFetchable(self, (self) => {
        return groupBy(self.payments.value, (item) => item.paymentMethod)
      })
    },
  }))
  .views((self) => ({
    get filteredPaymentsByDateRange() {
      return deriveFetchable(self, (self) => {
        const paymentData = self.payments.value
        return paymentData.filter((item) => {
          const [start, end] = self.dateRange.value
          return (
            new Date(item.date).getTime() >= start.getTime() &&
            new Date(item.date).getTime() <= end.getTime()
          )
        })
      })
    },
  }))
  .views((self) => ({
    get filteredPayments() {
      return deriveFetchable(self, (self) => {
        const selectedMethods = self.selectedMethods.value

        return self.filteredPaymentsByDateRange.value.filter(
          (item) =>
            selectedMethods.length === 0 ||
            selectedMethods.includes(item.paymentMethod)
        )
      })
    },
  }))
  .views((self) => ({
    get paymentsByWeekDay() {
      return deriveFetchable(self, (self) =>
        computePaymentsByWeekDay(self.payments.value)
      )
    },
    get filteredPaymentsByWeekDay() {
      return deriveFetchable(self, (self) =>
        computePaymentsByWeekDay(self.filteredPayments.value)
      )
    },

    get paymentsByTimeSlot() {
      return deriveFetchable(self, (self) =>
        computePaymentsByTimeSlot(self.payments.value)
      )
    },

    get filteredPaymentsByTimeSlot() {
      return deriveFetchable(self, (self) =>
        computePaymentsByTimeSlot(self.filteredPayments.value)
      )
    },

    get paymentsByCity() {
      return deriveFetchable(self, (self) =>
        computePaymentsByCity(self.payments.value)
      )
    },

    get filteredPaymentsByCityByMethod() {
      return deriveFetchable(self, (self) =>
        computePaymentsByCityByMethod(self.filteredPayments.value)
      )
    },
    get filteredPaymentsByTypeAndMethodSum() {
      return deriveFetchable(self, (self) =>
        computePaymentsByTypeAndMethodSum(self.filteredPayments.value)
      )
    },
    get filteredPaymentsBySpendingRange() {
      return deriveFetchable(self, (self) =>
        computePaymentsBySpendingRange(self.filteredPayments.value)
      )
    },
    get paymentsByTypeAndMethodSum() {
      return deriveFetchable(self, (self) => {
        const dataByMethods = computePaymentsByTypeAndMethodSum(
          self.filteredPaymentsByDateRange.value
        )
        return Object.entries(groupBy(dataByMethods, (d) => d.type)).map(
          ([type, data]) => ({
            type,
            amounts: sumBy(data, (d) => d.amounts),
            transactions: sumBy(data, (d) => d.transactions),
          })
        )
      })
    },
    get paymentsBySpendingRange() {
      return deriveFetchable(self, (self) => {
        const dataBySpendingRange = computePaymentsBySpendingRange(
          self.filteredPaymentsByDateRange.value
        )
        const payments = groupBy(dataBySpendingRange, (d) => d.spendingRange)

        return createAllSpendingRanges(STEP_RANGE, OVER_RANGE).map(
          (spendingRange) => {
            const paymentBySpendingRange = payments[spendingRange]
            return {
              spendingRange,
              transactions: sumBy(
                paymentBySpendingRange,
                (d) => d.transactions
              ),
              amounts: sumBy(paymentBySpendingRange, (d) => d.amounts),
            }
          }
        )
      })
    },
  }))

  .views((self) => ({
    get methodsColors() {
      return deriveFetchable(self, (self) => {
        const methods = Object.keys(self.paymentsByMethod.value)
        return zipObject(methods, RANDOM_COLORS)
      })
    },
  }))
  .actions(
    subscribe((self) => {
      self.payments.fetch(fetchPaymentDataset)
    })
  )

export interface UserInstance extends Instance<typeof UserModel> {}
