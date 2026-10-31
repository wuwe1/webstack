import process from "node:process"

import { expect, it, vi } from "vitest"

vi.mock("./clean") // expect: no-restricted-syntax

it("has no assertion", () => {}) // expect: test/expect-expect

it.only("is focused", () => { // expect: no-only-tests/no-only-tests
  expect(process.cwd()).toBeTruthy()
})

it.skip("is disabled", () => { // expect: test/no-disabled-tests
  expect(1).toBe(1)
})

it("is focused", () => { // expect: test/no-identical-title
  expect(1).toBe(1)
})
