import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "p2g-btn-primary",
  outline: "p2g-btn-outline",
  ghost: "p2g-btn-ghost",
};

export function Button({ variant = "primary", className = "", style, ...props }: Props) {
  return (
    <button
      className={`p2g-btn ${VARIANT_CLASS[variant]} ${className}`}
      style={{ height: 42, padding: "0 22px", ...style }}
      {...props}
    />
  );
}
