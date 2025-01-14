
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        success: "border-transparent bg-green-500/10 text-green-500",
        warning: "border-transparent bg-yellow-500/10 text-yellow-500",
        caution: "border-transparent bg-orange-500/10 text-orange-500",
        destructive: "border-transparent bg-red-500/10 text-red-500",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}