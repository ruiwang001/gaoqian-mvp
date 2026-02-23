"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShieldCheck, Sparkles, ListChecks, Type, Minus, Plus } from "lucide-react";

export default function HomePage() {
  const [fontSize, setFontSize] = useState(100);
  const [showFontControl, setShowFontControl] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("font-size");
    if (saved) setFontSize(Number(saved));
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem("font-size", String(fontSize));
  }, [fontSize]);

  const adjustFont = (delta: number) => {
    setFontSize(prev => Math.max(80, Math.min(130, prev + delta)));
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <BrandMark />
        <div className="flex items-center gap-2">
          <Badge>轻奢金融质感</Badge>
          <Badge>极简 MVP</Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowFontControl(!showFontControl)}
            className="relative"
            title="调整字体"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {showFontControl && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <span className="text-sm text-text-2">字体大小</span>
          <Button variant="ghost" size="icon" onClick={() => adjustFont(-10)}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center">{fontSize}%</span>
          <Button variant="ghost" size="icon" onClick={() => adjustFont(10)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-text-1">
            目标驱动的赚钱执行系统
          </h1>
          <p className="text-balance text-text-2">
            不做鸡汤。不承诺收益。只把"赚钱目标"拆成你今天就能勾选执行的清单。
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/4 px-3 py-2 shadow-edge">
              <ShieldCheck className="h-4 w-4 text-text-2" />
              <span className="text-sm text-text-2">稳健估算</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/4 px-3 py-2 shadow-edge">
              <Sparkles className="h-4 w-4 text-text-2" />
              <span className="text-sm text-text-2">AI 推荐路径</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/4 px-3 py-2 shadow-edge">
              <ListChecks className="h-4 w-4 text-text-2" />
              <span className="text-sm text-text-2">任务板拆解</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/onboarding">
              <Button size="lg">
                开始搞钱
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-text-mute">
            MVP：仅 4 页闭环（信息 → 推荐 → 任务板 → 每日执行）。
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>你将得到</CardTitle>
            <CardDescription>像金融 App 一样的克制与质感：数据化、结构化、可执行。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-white/4 p-4 shadow-edge shadow-inset">
              <div className="text-sm font-medium text-text-1">3 条赚钱路径（AI）</div>
              <div className="mt-1 text-sm text-text-3">
                适合度评分、启动成本、难度、最小启动步骤。
              </div>
            </div>

            <div className="rounded-2xl bg-white/4 p-4 shadow-edge shadow-inset">
              <div className="text-sm font-medium text-text-1">任务板（12-18 条）</div>
              <div className="mt-1 text-sm text-text-3">
                分阶段：准备 / 获客 / 交付；每条任务包含预计耗时。
              </div>
            </div>

            <Separator />

            <div className="text-xs text-text-mute">
              风险提示：所有收入为区间估算，结果取决于执行与市场，不构成承诺或建议。
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
