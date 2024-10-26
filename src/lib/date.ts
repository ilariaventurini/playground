import { capitalize, range } from 'lodash-es'

export function formatDatetimeLocal(date: Date) {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('.')[0].split(':').slice(0, -1).join(':')
}

export function formatShortDay(date: Date | string) {
  return capitalize(
    new Date(date).toLocaleString('it-IT', { weekday: 'short' })
  )
}

export function getWeekDaysFromMonday() {
  return range(7)
    .map((i) => (i + 1) % 7)
    .map(String)
}

export function formatWeekDay(weekDay: string) {
  const date = new Date()
  date.setDate(Number(weekDay))
  return formatShortDay(date)
}

export function getDay(date: Date | string) {
  return new Date(date).getDay()
}

export function addYears(date: Date, years: number) {
  const newDate = new Date(date)
  newDate.setFullYear(newDate.getFullYear() + years)
  return newDate
}
