import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl bg-bg-2/60 px-3 text-sm text-text-1 placeholder:text-text-mute shadow-edge shadow-inset",
        "focus:outline-none focus:ring-2 focus:ring-accent-blue/30 transition",
        className
      )}
      {...props}
    />
  );
}
