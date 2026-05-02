import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "relative group rounded-[12px] border-2 border-[#7A1CAC] bg-gradient-to-r from-[#7A1CAC]/60 to-[#C68FE6]/60 text-white transition-all duration-300 before:absolute before:transition-all before:duration-1000 before:-inset-px before:bg-gradient-to-r before:from-[#7A1CAC]/50 before:via-[#9B4AC7] before:to-[#531276]/50 before:rounded-xl before:blur-lg before:opacity-100 before:-z-10 hover:bg-transparent hover:text-[#7A1CAC] hover:border-transparent hover:before:opacity-40 hover:before:-inset-2 hover:before:duration-200",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-[#7A1CAC] bg-transparent shadow-sm hover:bg-[#7A1CAC]/10 hover:text-[#7A1CAC]",
        secondary:
          "relative group rounded-xl border-2 border-[#090909] before:absolute before:transitiona-all before:duration-1000 before:-inset-px before:bg-gradient-to-r before:from-[#44BCFF] before:via-[#FF44EC] before:to-[#FF675E] before:rounded-xl before:blur-lg before:opacity-70 before:-z-10 hover:before:opacity-100 hover:before:-inset-1 hover:before:duration-200 bg-gradient-to-r from-[#090909] to-[#232323] text-white hover:bg-none hover:bg-transparent hover:text-[#090909]",
        ghost: "hover:bg-[#7A1CAC]/10 hover:text-[#7A1CAC]",
        link: "text-[#7A1CAC] underline-offset-4 hover:underline",
        buttonOutline:
          "border-2 border-red-500 text-red-500 text-lg hover:bg-red-500 hover:text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
