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
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50 disabled:pointer-events-none dark:focus:ring-slate-700";
  const variants: Record<Variant, string> = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-soft dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
    secondary: "bg-slate-50 text-slate-900 hover:bg-slate-100 hairline dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
  };
  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base"
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
