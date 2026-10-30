import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => (
      <main className="mx-auto w-full max-w-3xl p-4 md:p-8">
        <Outlet />
      </main>
    ),
  },
)
