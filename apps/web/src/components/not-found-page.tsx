import { Link } from "@tanstack/react-router"

import { buttonVariants } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <section className="grid justify-items-start gap-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">This address does not exist.</p>
      <Link to="/" className={buttonVariants({ variant: "outline" })}>
        Back to home
      </Link>
    </section>
  )
}
