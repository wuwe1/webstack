import { flattenErrors, sValidator } from "@hono/standard-validator"
import type { ErrorHandler, NotFoundHandler, ValidationTargets } from "hono"
import { HTTPException } from "hono/http-exception"

export interface ApiErrorBody<Code extends string = string> {
  error: {
    code: Code
    message: string
    fieldErrors?: Record<string, string[]>
  }
}

export const apiError = <Code extends string>(
  error: ApiErrorBody<Code>["error"],
): ApiErrorBody<Code> => ({ error })

export const validate = <
  Target extends keyof ValidationTargets,
  Schema extends Parameters<typeof sValidator>[1],
>(
  target: Target,
  schema: Schema,
) =>
  sValidator(target, schema, (result, c) => {
    if (result.success) return undefined
    const { fieldErrors } = flattenErrors(result.error)
    return c.json(
      apiError({
        code: "invalid_request",
        message: "Invalid request",
        fieldErrors,
      }),
      400,
    )
  })

export const handleError: ErrorHandler = (error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      apiError({
        code: `http_${error.status}`,
        message: error.message || "Request failed",
      }),
      { status: error.status, headers: error.res?.headers ?? {} },
    )
  }
  console.error(error)
  return c.json(
    apiError({ code: "internal_error", message: "Internal server error" }),
    500,
  )
}

export const handleNotFound: NotFoundHandler = (c) =>
  c.json(apiError({ code: "not_found", message: "Not found" }), 404)
