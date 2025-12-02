import { useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  const set = (v: T) => {
    setState(v)
    try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }

  return [state, set] as const
}
