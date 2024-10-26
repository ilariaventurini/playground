import { useEffect, useState } from 'react'

export interface DelayedProps {
  children: React.ReactNode
  delay: number
  fallback?: React.ReactNode
}

export const Delayed = ({ children, delay, fallback = null }: DelayedProps) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])
  return visible ? <>{children}</> : fallback
}
