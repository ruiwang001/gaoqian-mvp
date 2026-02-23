"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-5 py-8">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent mb-6" />
      {children}
    </div>
  );
}
