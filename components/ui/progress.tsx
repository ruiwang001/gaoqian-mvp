import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-white/6 shadow-edge", className)}>
      <div 
        className="h-full rounded-full bg-white/26 shadow-inset transition-[width] duration-400 ease-out" 
        style={{ width: `${v}%` }} 
      />
    </div>
  );
}
