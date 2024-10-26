import { isNil } from 'lodash-es'

export async function measurePromiseTime<T>(
  promise: Promise<T>
): Promise<{ time: number; result: T }> {
  const start = Date.now()
  const result = await promise
  const end = Date.now()
  return { time: end - start, result }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cacheAsyncResult<T extends (...args: any[]) => Promise<any>>(
  fetchFn: T
): T {
  const cache = new Map<string, ReturnType<Awaited<T>>>()

  const cachedFn = async function (...args: Parameters<T>) {
    const key = JSON.stringify(args)
    if (!cache.has(key) || isNil(cache.get(key))) {
      const result = await fetchFn(...args)
      cache.set(key, result)
    }

    return cache.get(key)
  }

  return cachedFn as T
}
