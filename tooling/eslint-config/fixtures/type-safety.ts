type Kind = { kind: "a" } | { kind: "b" }

export function explicitAny(value: any) { // expect: ts/no-explicit-any
  return value // expect: ts/no-unsafe-return
}

export const cast = "x" as unknown // expect: ts/consistent-type-assertions
export const asConstIsFine = "x" as const

export const nonNull = (list: string[]) => list[0]! // expect: ts/no-non-null-assertion
export const onlyOneReport = (x?: string) => x?.length! // expect: ts/no-non-null-assertion

export function unsafe(raw: string) {
  const data = JSON.parse(raw) // expect: ts/no-unsafe-assignment
  data.run() // expect: ts/no-unsafe-call ts/no-unsafe-member-access
}

function takesString(value: string) {
  return value
}
export const unsafeArgument = (raw: string) => takesString(JSON.parse(raw)) // expect: ts/no-unsafe-argument

async function task() {}
export function floating() {
  task() // expect: ts/no-floating-promises
}
export const misused = [1].filter(async () => true) // expect: ts/no-misused-promises

export function exhaustive(kind: Kind) {
  switch (kind.kind) { // expect: ts/switch-exhaustiveness-check
    case "a":
      return 1
  }
}

export function tooManyParams(a: string, b: string, c: string) { // expect: ts/max-params
  return a + b + c
}

export type ObjectShape = { value: string } // expect: ts/consistent-type-definitions

// expect-next: eslint-comments/require-description
// eslint-disable-next-line no-console
console.log("disabled without a reason")

// eslint-disable-next-line no-console -- a reason keeps the exception reviewable
console.log("disabled with a reason")
