import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-xl bg-primary-color text-white shadow-sm hover:bg-primary-color/90",
        destructive:
          "rounded-xl bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "rounded-xl border border-[#7A1CAC] bg-transparent text-[#7A1CAC] shadow-sm hover:bg-[#7A1CAC]/10",
        secondary:
          "rounded-xl bg-[#090909] text-white shadow-sm hover:bg-[#232323]",
        ghost: "rounded-xl hover:bg-[#7A1CAC]/10 hover:text-[#7A1CAC]",
        link: "text-[#7A1CAC] underline-offset-4 hover:underline",
        buttonOutline:
          "rounded-xl border border-red-500 text-red-500 text-lg hover:bg-red-500 hover:text-white",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
