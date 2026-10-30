import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { ItemsTable } from "./items-table"

afterEach(cleanup)

describe("ItemsTable", () => {
  it("shows each item", () => {
    render(<ItemsTable items={[{ id: "1", name: "Keyboard", stock: 12 }]} />)

    expect(screen.getByRole("cell", { name: "Keyboard" })).toBeTruthy()
    expect(screen.getByRole("cell", { name: "12" })).toBeTruthy()
  })

  it("shows an empty state", () => {
    render(<ItemsTable items={[]} />)

    expect(screen.getByText("No items yet.")).toBeTruthy()
  })
})
