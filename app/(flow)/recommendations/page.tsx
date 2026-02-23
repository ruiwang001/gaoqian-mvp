"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loadStore, patchStore, Recommendation } from "@/components/storage";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function RecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const onboarding = useMemo(() => loadStore().onboarding, []);

  useEffect(() => {
    (async () => {
      try {
        if (!onboarding) {
          router.push("/onboarding");
          return;
        }
        const res = await fetch("/api/kimi/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(onboarding),
        });
        if (!res.ok) throw new Error(`请求失败: ${res.status}`);
        const data = await res.json();
        patchStore({ recommendations: data.recommendations || [] });
        setRecs(data.recommendations || []);
      } catch (e: any) {
        setErr(e?.message || "未知错误");
      } finally {
        setLoading(false);
      }
    })();
  }, [onboarding, router]);

  async function choose(chosen: Recommendation) {
    if (!onboarding) return;
    patchStore({ recommendations: recs });

    const res = await fetch("/api/kimi/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chosen,
        targetIncome: onboarding.targetIncome,
        dailyHours: onboarding.dailyHours,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      setErr(`生成任务板失败: ${res.status} ${t}`);
      return;
    }

    const data = await res.json();
    const unitPrice = data.unitPrice as number;
    const tasksRaw = (data.tasks || []) as Array<{
      id: string;
      stage: "准备" | "获客" | "交付";
      title: string;
      etaMinutes: number;
    }>;

    const needOrders =
      unitPrice > 0 ? Math.ceil(onboarding.targetIncome / unitPrice) : 0;
    const perDayOrders = Math.max(1, Math.ceil(needOrders / 30));

    patchStore({
      plan: {
        planId: `plan_${Date.now()}`,
        chosen,
        pricing: {
          unitPrice,
          monthlyTarget: onboarding.targetIncome,
          needOrders,
          perDayOrders,
        },
        tasks: tasksRaw.map((t) => ({ ...t, done: false })),
        createdAt: Date.now(),
      },
    });

    router.push("/plan");
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <BrandMark />
        <Badge>AI 推荐</Badge>
      </header>

      {loading && (
        <Card>
          <CardContent className="flex items-center gap-3 p-6 text-text-2">
            <Loader2 className="h-4 w-4 animate-spin text-accent-blue" />
            正在生成 3 条路径（稳健估算）…
          </CardContent>
        </Card>
      )}

      {!loading && err && (
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-text-1">发生错误</div>
            <div className="mt-1 text-sm text-text-3">{err}</div>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => location.reload()}>
                重试
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !err && (
        <div className="grid gap-6 lg:grid-cols-3">
          {recs.map((r) => (
            <Card key={r.id} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{r.title}</span>
                  <span className="text-xs text-text-3">{r.fitScore}/100</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  收入区间：{r.incomeRange}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>难度：{r.difficulty}</Badge>
                  <Badge>成本：{r.startCost}</Badge>
                </div>

                <div className="rounded-2xl bg-white/4 p-4 shadow-edge shadow-inset">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-1">
                    <Sparkles className="h-4 w-4 text-accent-amber" />
                    推荐原因
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-2">
                    {r.why.slice(0, 5).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="rounded-2xl bg-white/4 p-4 shadow-edge shadow-inset">
                  <div className="text-sm font-medium text-text-1">最小启动步骤</div>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-text-2">
                    {r.firstSteps.slice(0, 6).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>

                <div className="mt-auto pt-2">
                  <Button className="w-full" onClick={() => choose(r)}>
                    选这个并生成任务板
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
