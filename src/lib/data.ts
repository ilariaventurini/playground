import { groupBy, meanBy, range, sumBy, times, uniqBy } from 'lodash-es'
import { stackNarrow } from 'react-composable-charts'
import { Payment } from './api'
import { getDay, getWeekDaysFromMonday } from './date'

export const ALL_METHODS_COLOR = '#2D32AA'
export const RANDOM_COLORS = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
]
export const OVER_RANGE = 200
export const STEP_RANGE = 25

export function getAllTimeSlots(slotSize = 3) {
  return range(24 / slotSize).map((i) => i * slotSize)
}

export function getTimeSlot(date: Date | string, slotSize = 3) {
  const hours = new Date(date).getHours()
  return Math.floor(hours / slotSize) * slotSize
}

export function formatTimeSlot(timeSlot: string, slotSize = 3) {
  return `${timeSlot}-${Number(timeSlot) + slotSize}`
}
export function computePaymentsByWeekDay(payments: Payment[]) {
  const groupedData = groupBy(payments, (item) => getDay(item.date))

  return getWeekDaysFromMonday()
    .map((weekDay) => ({
      weekDay,
      mean: meanBy(groupedData[weekDay], 'amount'),
    }))
    .filter((item) => !isNaN(item.mean))
}

export function computePaymentsByTimeSlot(payments: Payment[]) {
  const groupedData = groupBy(payments, (item) => getTimeSlot(item.date))

  return getAllTimeSlots()
    .map((timeSlot) => ({
      timeSlot,
      mean: meanBy(groupedData[timeSlot], 'amount'),
    }))
    .filter((item) => !isNaN(item.mean))
}

export function computePaymentsByCity(payments: Payment[]) {
  const groupedData = groupBy(payments, 'location')
  const cities = uniqBy(payments, 'location').map((item) => ({
    location: item.location,
    coordinates: item.coordinates,
  }))

  return cities.map((city) => ({
    location: city.location,
    coordinates: city.coordinates,
    amount: sumBy(groupedData[city.location], 'amount'),
  }))
}

export function computePaymentsByCityByMethod(payments: Payment[]) {
  const groupedData = groupBy(
    payments,
    (p) => `${p.location}-${p.paymentMethod}`
  )
  const cities = uniqBy(payments, 'location').map((item) => ({
    location: item.location,
    coordinates: item.coordinates,
  }))
  const paymentMethods = uniqBy(payments, 'paymentMethod').map(
    (item) => item.paymentMethod
  )

  const paymentsByCityByMethod = cities.flatMap((city) =>
    paymentMethods.map((method) => ({
      location: city.location,
      coordinates: city.coordinates,
      amount: sumBy(groupedData[`${city.location}-${method}`], 'amount'),
      paymentMethod: method,
    }))
  )

  return stackNarrow({
    data: paymentsByCityByMethod,
    categories: paymentMethods,
    getGroup: (p) => p.location,
    getCategory: (p) => p.paymentMethod,
    getValue: (p) => p.amount,
  })
}

export function computePaymentsByTypeAndMethodSum(payments: Payment[]) {
  const paymentsByType = groupBy(payments, 'type')
  return Object.entries(paymentsByType).flatMap(([type, payments]) => {
    const paymentsMethod = groupBy(payments, 'paymentMethod')
    return Object.entries(paymentsMethod).map(([method, payments]) => ({
      method,
      amounts: sumBy(payments, 'amount'),
      transactions: payments.length,
      type,
    }))
  })
}

export function createAllSpendingRanges(stepRange: number, overRange: number) {
  return times(overRange / stepRange + 1).map((d) =>
    computeSpendingRange(d * stepRange, stepRange, overRange)
  )
}

export function computeSpendingRange(
  amount: number,
  stepRange: number,
  overRange: number
) {
  const amountByStepRange = Math.floor(amount / stepRange)
  return amountByStepRange * stepRange < overRange
    ? `${amountByStepRange * stepRange} € - ${
        amountByStepRange * stepRange + stepRange - 0.01
      }`
    : `${overRange}+ €`
}

export function computePaymentsBySpendingRange(payments: Payment[]) {
  const paymentsBySpendingRange = groupBy(payments, (d) =>
    computeSpendingRange(d.amount, STEP_RANGE, OVER_RANGE)
  )
  return createAllSpendingRanges(STEP_RANGE, OVER_RANGE).flatMap(
    (spendingRange) => {
      const payments = paymentsBySpendingRange[spendingRange] ?? []
      const paymentsMethod = groupBy(payments, 'paymentMethod')
      return Object.entries(paymentsMethod).map(([method, payments]) => ({
        method,
        amounts: sumBy(payments, 'amount'),
        transactions: payments.length,
        spendingRange,
      }))
    }
  )
}
