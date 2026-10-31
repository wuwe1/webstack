import { queryOptions } from "@tanstack/react-query"
import type { InferResponseType } from "hono/client"

import { api, send } from "@/lib/api-client"

const getItems = api.api.items.$get

export type Item = InferResponseType<typeof getItems, 200>[number]

export const itemsQuery = queryOptions({
  queryKey: ["items"],
  queryFn: () => send(getItems({ query: {} })),
})
