import { queryOptions } from "@tanstack/react-query";
import { itemListSchema } from "@webstack/shared";

import { api } from "@/lib/api-client";

export const itemsQuery = queryOptions({
  queryKey: ["items"],
  queryFn: async () => {
    const response = await api.api.items.$get({ query: {} });
    if (!response.ok) throw new Error(`Request failed with ${response.status}`);
    return itemListSchema.parse(await response.json());
  },
});
