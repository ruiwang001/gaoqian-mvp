import Link from "next/link";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShieldCheck, Sparkles, ListChecks } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <BrandMark />
        <div className="flex items-center gap-2">
          <Badge>清新金融质感</Badge>
          <Badge>极简MVP</Badge>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            目标驱动的赚钱执行系统
          </h1>
          <p className="text-balance text-slate-600 dark:text-slate-400">
            不做鸡汤。不承诺收益。只把"赚钱目标"拆成你今天就能勾选执行的清单。
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 hairline">
              <ShieldCheck className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <span className="text-sm text-slate-700 dark:text-slate-300">稳健估算</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 hairline">
              <Sparkles className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <span className="text-sm text-slate-700 dark:text-slate-300">AI推荐路径</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 hairline">
              <ListChecks className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <span className="text-sm text-slate-700 dark:text-slate-300">任务板拆解</span>
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

          <p className="text-xs text-slate-500 dark:text-slate-500">
            MVP：仅 4 页闭环（信息 → 推荐 → 任务板 → 每日执行）。
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>你将得到</CardTitle>
            <CardDescription>像金融App一样的克制与质感：数据化、结构化、可执行。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 hairline">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">3条赚钱路径（AI）</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                适合度评分、启动成本、难度、最小启动步骤。
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 hairline">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">任务板（12-18条）</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                分阶段：准备 / 获客 / 交付；每条任务包含预计耗时。
              </div>
            </div>

            <Separator />

            <div className="text-xs text-slate-500 dark:text-slate-500">
              风险提示：所有收入为区间估算，结果取决于执行与市场，不构成承诺或建议。
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}