import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { MinusIcon, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function NumberField({ className, ...props }: NumberFieldPrimitive.Root.Props) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-field"
      className={cn("inline-flex", className)}
      {...props}
    />
  )
}

function NumberFieldGroup({
  className,
  ...props
}: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(
        "flex h-8 items-center overflow-hidden rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(
        "h-full w-10 min-w-0 bg-transparent text-center text-base tabular-nums outline-none md:text-sm",
        className
      )}
      {...props}
    />
  )
}

const stepperClassName =
  "flex h-full w-7 shrink-0 items-center justify-center text-muted-foreground transition-colors outline-none select-none hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0"

function NumberFieldDecrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      className={cn(stepperClassName, className)}
      {...props}
    >
      {children ?? <MinusIcon />}
    </NumberFieldPrimitive.Decrement>
  )
}

function NumberFieldIncrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      className={cn(stepperClassName, className)}
      {...props}
    >
      {children ?? <PlusIcon />}
    </NumberFieldPrimitive.Increment>
  )
}

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
}
