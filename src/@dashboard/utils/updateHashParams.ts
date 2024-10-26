import { reaction } from 'mobx'

import { isNil } from 'lodash-es'
import { Tail } from './types'

export type HashValueType = 'string' | 'int' | 'float' | 'boolean' | 'array'

const getHashValue = (
  hash: string,
  param: string,
  type = 'string' as HashValueType,
  defaultValue = undefined as string | number | string[] | undefined
) => {
  const regexp = `${param}=([0-9a-z.%()\\-,/'";_\\[\\]]+)`
  const t = hash.match(new RegExp(regexp, 'i'))
  if (!t) {
    return defaultValue
  }
  const value = t[1]

  if (type === 'int') {
    return parseInt(value)
  }
  if (type === 'float') {
    return parseFloat(value)
  }
  if (type === 'boolean') {
    return Boolean(parseInt(value)) || value === 'true'
  }

  if (type === 'array') {
    return value.split(',').map(decodeURIComponent)
  }

  return decodeURIComponent(value)
}

const getUrlHashParam = (
  paramName: string,
  paramValue: string | number | string[] | boolean
) => {
  if (Array.isArray(paramValue)) {
    return `${paramName}=${paramValue
      .map((v) => encodeURIComponent(v))
      .join(',')}`
  }

  return `${paramName}=${encodeURIComponent(paramValue)}`
}

const pushState = (hash: string) => {
  const fullHash = hash ? `#${hash}` : ''

  if (window.history.pushState && fullHash) {
    window.history.pushState(null, '', fullHash)
  } else {
    window.location.hash = fullHash
  }
}

export const readHashParam = (
  ...params: Tail<Parameters<typeof getHashValue>>
) => {
  return getHashValue(window.location.hash, ...params)
}

export const writeHashParam = (
  param: string,
  value: string | number | string[] | null | boolean
) => {
  const regex = new RegExp(`(${param}=)([0-9a-z.%()\\-,/'";_\\[\\]]+)`, 'i')
  const hash = window.location.hash.slice(1)
  const match = hash.match(regex)

  if (isNil(value) || (Array.isArray(value) && value.length === 0)) {
    const newHash = hash.replace(regex, '').split('&').filter(Boolean).join('&')
    pushState(newHash)
  } else if (match) {
    const newHash = hash.replace(regex, getUrlHashParam(param, value))
    pushState(newHash)
  } else {
    const newHash = [...hash.split('&'), getUrlHashParam(param, value)]
      .filter(Boolean)
      .join('&')
    pushState(newHash)
  }
}

type HashParamOptions = {
  string: string | null
  array: string[]
  int: number
  float: number
  boolean: boolean | null
}
export function updateHashParams<
  T extends HashValueType = 'string',
  V extends HashParamOptions[T] = HashParamOptions[T]
>(options: { param: string; type?: T; get: () => V; set: (value: V) => void }) {
  const { param, type, get, set } = options

  const initial = readHashParam(param, type) as V
  if (initial) set(initial)
  return reaction(get, () => writeHashParam(param, get()))
}
