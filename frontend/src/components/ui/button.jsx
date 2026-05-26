import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:shadow-[0_0_32px_rgba(34,211,238,0.5)]",
        braindoc:
          "bg-gradient-to-br from-[#3F72AF] to-[#112D4E] text-white shadow-[0_0_24px_rgba(63,114,175,0.35)] hover:shadow-[0_0_32px_rgba(63,114,175,0.5)]",
        braindocOutline:
          "border border-[rgba(63,114,175,0.35)] bg-transparent text-[#5a8fc4] hover:border-[#3F72AF] hover:bg-[rgba(63,114,175,0.1)]",
        outline:
          "border border-cyan-500/30 bg-transparent text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/10",
        ghost:
          "text-cyan-300/80 hover:bg-cyan-500/10 hover:text-cyan-200",
        neural:
          "border border-[rgba(63,114,175,0.3)] bg-[rgba(63,114,175,0.1)] text-[#DBE2EF] hover:border-[#3F72AF] hover:bg-[rgba(63,114,175,0.18)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
