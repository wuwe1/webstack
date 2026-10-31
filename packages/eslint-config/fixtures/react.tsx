import { useEffect, useState } from "react"
import type { ReactNode } from "react"

export const constant = 1 // expect: react-refresh/only-export-components

export function ConditionalHook({ flag }: { flag: boolean }) {
  if (flag) {
    useEffect(() => {}, []) // expect: react/rules-of-hooks
  }
  return <div />
}

export function Effects({ value }: { value: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(value) // expect: react/set-state-in-effect
  }, []) // expect: react/exhaustive-deps
  return <div>{count}</div>
}

export function Lists({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => <li>{item}</li>)} {/* expect: react/no-missing-key */}
      {items.map((item, index) => <li key={index}>{item}</li>)} {/* expect: react/no-array-index-key */}
    </ul>
  )
}

export function Timer({ children }: { children: ReactNode }) {
  useEffect(() => {
    setTimeout(() => {}, 100) // expect: react/web-api-no-leaked-timeout
  }, [])
  return <div>{children}</div>
}

export function AsyncHandler({ go }: { go: () => Promise<void> }) {
  return (
    <>
      <button type="button" onClick={go} /> {/* expect: ts/no-misused-promises */}
      <button
        type="button"
        onClick={() => {
          void go()
        }}
      />
    </>
  )
}
