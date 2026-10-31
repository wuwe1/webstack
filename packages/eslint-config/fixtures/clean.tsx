import { useState } from "react"

import type { ReactNode } from "react"

interface Props {
  children: ReactNode
  items: string[]
  onSave: () => Promise<void>
}

type Status = "idle" | "saved"

function label(status: Status) {
  switch (status) {
    case "idle":
      return "Save"
    case "saved":
      return "Saved"
  }
}

export function Clean({ children, items, onSave }: Props) {
  const [status, setStatus] = useState<Status>("idle")

  async function save() {
    await onSave()
    setStatus("saved")
  }

  return (
    <section>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {children}
      <button
        type="button"
        onClick={() => {
          void save()
        }}
      >
        {label(status)}
      </button>
    </section>
  )
}
