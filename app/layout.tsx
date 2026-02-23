import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutWrapper } from "@/components/layout-wrapper";

export const metadata: Metadata = {
  title: "搞钱 MVP",
  description: "AI帮你拆解赚钱路径：目标 → 推荐 → 任务板",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="fin-bg">
        <div className="fin-noise">
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
