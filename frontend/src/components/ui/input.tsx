import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-[42px] w-full rounded-lg border border-input bg-card px-3.5 text-sm font-sans text-foreground outline-none transition-shadow",
        "placeholder:text-muted-foreground",
        "focus-visible:border-primary focus-visible:shadow-ring-focus",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
