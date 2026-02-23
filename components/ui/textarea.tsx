import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[96px] w-full rounded-xl bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 hairline focus:outline-none focus:ring-2 focus:ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-slate-700",
        className
      )}
      {...props}
    />
  );
}
