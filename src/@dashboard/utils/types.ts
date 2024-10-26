import { isNil } from 'lodash-es'

export const tuple = <T extends unknown[]>(...args: T): T => args
export const stringTuple = <T extends string[]>(...args: T): T => args

export const isNotNil = <T>(value: T | null | undefined): value is T =>
  !isNil(value)

export const isNumber = (v: unknown): v is number => {
  return typeof v === 'number'
}

export const isString = (v: unknown): v is string => {
  return typeof v === 'string'
}

export type NonOptional<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>

export type Tail<T extends unknown[]> = T extends [unknown, ...infer U]
  ? U
  : never

export type RecursiveKeyOf<TObj extends Record<string, unknown>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, unknown>
    ? `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`
}[keyof TObj & string]
