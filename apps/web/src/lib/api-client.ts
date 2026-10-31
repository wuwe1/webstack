import type { ApiErrorBody, AppType } from "api"
import { DetailedError, hc, parseResponse } from "hono/client"

export const api = hc<AppType>("/")

interface FailedResponse {
  statusCode?: number
  detail?: { data?: Partial<ApiErrorBody> }
}

export class ApiError extends Error {
  override readonly name = "ApiError"
  readonly status: number
  readonly code: string
  readonly fieldErrors: Record<string, string[]>

  constructor(cause: FailedResponse) {
    const status = cause.statusCode ?? 0
    const body = cause.detail?.data?.error
    super(body?.message ?? `Request failed with ${status}`, { cause })
    this.status = status
    this.code = body?.code ?? "unknown"
    this.fieldErrors = body?.fieldErrors ?? {}
  }
}

export const send: typeof parseResponse = async (response) => {
  try {
    return await parseResponse(response)
  } catch (error) {
    if (error instanceof DetailedError) throw new ApiError(error)
    throw error
  }
}
