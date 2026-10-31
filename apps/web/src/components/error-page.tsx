import { useRouter } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export function ErrorPage() {
  const router = useRouter()

  return (
    <section className="grid justify-items-start gap-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        This page could not be shown. Try again in a moment.
      </p>
      <Button onClick={() => void router.invalidate()}>Try again</Button>
    </section>
  )
}
