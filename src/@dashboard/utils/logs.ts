import { Fetchable } from '../state/Fetchable'
import { LoadingOption } from '../state/Loading'

export function formattedLoading(loading: LoadingOption) {
  return loading === 'success'
    ? '\x1b[32m%s\x1b[0m'
    : loading === 'error'
    ? '\x1b[31m%s\x1b[0m'
    : '\x1b[33m%s\x1b[0m'
}

export function log(label: string, f: Fetchable<unknown>) {
  console.log(formattedLoading(f.loading), f.loading, label, f.value)
}
