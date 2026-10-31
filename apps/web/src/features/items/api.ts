import { queryOptions } from "@tanstack/react-query"
import type { InferResponseType } from "hono/client"

import { api } from "@/lib/api-client"

const getItems = api.api.items.$get

export type Item = InferResponseType<typeof getItems, 200>[number]

export const itemsQuery = queryOptions({
  queryKey: ["items"],
  queryFn: async () => {
    const response = await getItems({ query: {} })
    if (!response.ok) throw new Error(`Request failed with ${response.status}`)
    return response.json()
  },
})
