import { inRange } from 'lodash-es'

export function inRangeInclusive(value: number, min: number, max: number) {
  return inRange(value, min, max) || value === min || value === max
}
