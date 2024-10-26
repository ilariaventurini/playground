export interface Pipe<T> {
  value(): T
  pipe<U>(fn: (value: T) => U): Pipe<U>
}

export function pipe<T>(value: T): Pipe<T> {
  return {
    value: () => value,
    pipe: (fn) => pipe(fn(value)),
  }
}
