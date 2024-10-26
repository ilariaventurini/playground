import { groupBy } from 'lodash-es'

export const groupedEntriesBy = <T>(
  arr: T[],
  by: (t: T) => string
): [string, T[]][] => {
  const res = Object.entries(groupBy(arr, by))
  return res
}

export const castToArray = <T>(arr: T | T[]): T[] => {
  return Array.isArray(arr) ? arr : [arr]
}
