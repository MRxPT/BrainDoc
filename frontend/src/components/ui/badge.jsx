import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-cyan-500/25 bg-cyan-500/10 text-cyan-300",
        braindoc:
          "border-[rgba(63,114,175,0.25)] bg-[rgba(63,114,175,0.1)] text-[#3F72AF]",
        neural:
          "border-[rgba(63,114,175,0.25)] bg-[rgba(63,114,175,0.1)] text-[#5a8fc4]",
        success:
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        outline:
          "border-white/10 bg-white/5 text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
