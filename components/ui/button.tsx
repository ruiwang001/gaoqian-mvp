import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]";
  const variants: Record<Variant, string> = {
    primary: "bg-white/10 text-text-1 shadow-edge shadow-inset hover:bg-white/14",
    secondary: "bg-white/6 text-text-2 shadow-edge hover:bg-white/10",
    ghost: "bg-transparent text-text-2 hover:bg-white/6"
  };
  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base"
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
