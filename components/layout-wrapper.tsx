"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-5xl px-5 py-8">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
