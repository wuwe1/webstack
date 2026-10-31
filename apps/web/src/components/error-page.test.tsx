import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ErrorPage } from "./error-page"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("ErrorPage", () => {
  it("hides the cause and recovers on retry", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    let broken = true
    const routeTree = createRootRoute({
      component: () => {
        if (broken) throw new Error("database password")
        return <p>Recovered</p>
      },
    })
    const router = createRouter({
      routeTree,
      history: createMemoryHistory(),
      defaultErrorComponent: ErrorPage,
    })
    render(<RouterProvider router={router} />)

    expect(await screen.findByText("Something went wrong")).toBeTruthy()
    expect(screen.queryByText(/database password/)).toBeNull()

    broken = false
    fireEvent.click(screen.getByRole("button", { name: "Try again" }))

    expect(await screen.findByText("Recovered")).toBeTruthy()
  })
})
