import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { itemsQuery } from "@/features/items/api";
import { ItemsTable } from "@/features/items/items-table";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const { data, error, isPending } = useQuery(itemsQuery);

  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">Items</h1>
      {isPending && <Skeleton className="h-40 w-full" />}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load items</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {data && <ItemsTable items={data} />}
    </section>
  );
}
