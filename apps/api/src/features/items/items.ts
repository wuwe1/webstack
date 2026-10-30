import type { Item } from "@webstack/shared"

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
