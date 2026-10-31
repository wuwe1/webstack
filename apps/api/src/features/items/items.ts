import * as v from "valibot"

export const itemQuerySchema = v.object({
  q: v.optional(v.pipe(v.string(), v.trim())),
})

interface Item {
  id: string
  name: string
  stock: number
}

const ITEMS: Item[] = [
  { id: "1", name: "Keyboard", stock: 12 },
  { id: "2", name: "Mouse", stock: 0 },
  { id: "3", name: "Monitor", stock: 4 },
]

export function findItems(q?: string): Item[] {
  if (!q) return ITEMS
  const needle = q.toLowerCase()
  return ITEMS.filter((item) => item.name.toLowerCase().includes(needle))
}

export function findItem(id: string): Item | undefined {
  return ITEMS.find((item) => item.id === id)
}
