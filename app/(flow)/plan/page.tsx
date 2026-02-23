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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { loadStore, patchStore, PlanTask, TaskDetail, SubTask } from "@/components/storage";
import { calcProgress, todayTopTasks } from "@/components/plan-utils";
import { CheckCircle2, Circle, RotateCcw, Sparkles, ChevronDown, ChevronUp, Bot, User, Lightbulb } from "lucide-react";

export default function PlanPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [analyzingTaskId, setAnalyzingTaskId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const store = loadStore();
    setPlan(store.plan);
  }, []);

  // Prevent hydration mismatch - render placeholder until mounted
  if (!mounted) {
    return (
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <BrandMark />
          <Badge>任务板</Badge>
        </header>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500">加载中...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <BrandMark />
          <Badge>任务板</Badge>
        </header>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-700 dark:text-slate-300">尚未生成任务板。</div>
            <div className="mt-4">
              <Button onClick={() => router.push("/onboarding")}>去生成</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = calcProgress(plan.tasks);
  const top = todayTopTasks(plan.tasks);

  function toggle(id: string) {
    const nextTasks = plan!.tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    const next = { ...plan!, tasks: nextTasks };
    patchStore({ plan: next });
    setPlan(next);
  }

  function toggleExpand(id: string) {
    const nextTasks = plan!.tasks.map((t) =>
      t.id === id ? { ...t, expanded: !t.expanded } : t
    );
    const next = { ...plan!, tasks: nextTasks };
    patchStore({ plan: next });
    setPlan(next);
  }

  async function analyzeTask(taskId: string) {
    const task = plan!.tasks.find((t) => t.id === taskId);
    if (!task) return;

    setAnalyzingTaskId(taskId);

    try {
      const res = await fetch("/api/kimi/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: task.title,
          taskStage: task.stage,
          chosenTitle: plan!.chosen.title,
          skillsText: loadStore().onboarding?.skillsText || "",
        }),
      });

      if (!res.ok) throw new Error(`请求失败: ${res.status}`);
      const data = await res.json();

      const detail: TaskDetail = {
        taskId,
        aiExecutable: data.aiExecutable,
        reasoning: data.reasoning,
        aiOutput: data.aiOutput,
        subTasks: data.subTasks || [],
        expanded: true,
      };

      const nextTasks = plan!.tasks.map((t) =>
        t.id === taskId ? { ...t, detail, expanded: true } : t
      );
      const next = { ...plan!, tasks: nextTasks };
      patchStore({ plan: next });
      setPlan(next);
    } catch (e: any) {
      const errorTasks = plan!.tasks.map((t) =>
        t.id === taskId ? { ...t, detail: { taskId, aiExecutable: false, reasoning: "", subTasks: [], error: e?.message || "分析失败" } as TaskDetail, expanded: true } : t
      );
      setPlan({ ...plan!, tasks: errorTasks });
    } finally {
      setAnalyzingTaskId(null);
    }
  }

  function toggleSubTask(taskId: string, subTaskId: string) {
    const nextTasks = plan!.tasks.map((t) => {
      if (t.id !== taskId || !t.detail) return t;
      const subTasks = t.detail.subTasks.map((st) =>
        st.id === subTaskId ? { ...st, done: !st.done } : st
      );
      return { ...t, detail: { ...t.detail, subTasks } };
    });
    const next = { ...plan!, tasks: nextTasks };
    patchStore({ plan: next });
    setPlan(next);
  }

  function reset() {
    const nextTasks = plan!.tasks.map((t) => ({ ...t, done: false, detail: undefined, expanded: false }));
    const next = { ...plan!, tasks: nextTasks };
    patchStore({ plan: next });
    setPlan(next);
  }

  function stageBlock(stage: PlanTask["stage"]) {
    const items = plan!.tasks.filter((t) => t.stage === stage);
    return (
      <Card key={stage}>
        <CardHeader>
          <CardTitle>{stage}</CardTitle>
          <CardDescription>可勾选执行清单（含预计耗时）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((t) => {
            const hasDetail = !!t.detail;
            const aiCanExecute = t.detail?.aiExecutable;
            
            return (
              <div key={t.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* 主任务行 */}
                <button
                  onClick={() => toggle(t.id)}
                  className="flex w-full items-start gap-3 p-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {t.done ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 text-slate-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${t.done ? "line-through text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>
                      {t.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">预计 {t.etaMinutes} 分钟</div>
                  </div>
                  <Badge className="shrink-0">{t.done ? "已完成" : "待办"}</Badge>
                </button>

                {/* 操作按钮区 */}
                <div className="px-3 pb-3 flex items-center gap-2">
                  {/* 未分析时显示分析按钮 */}
                  {!hasDetail && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => analyzeTask(t.id)}
                      disabled={analyzingTaskId === t.id}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Lightbulb className="mr-1 h-3.5 w-3.5" />
                      {analyzingTaskId === t.id ? "分析中..." : "任务拆解"}
                    </Button>
                  )}

                  {/* 已分析且AI可直接执行 */}
                  {hasDetail && aiCanExecute && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(t.id)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950"
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      AI已生成
                      {t.expanded ? <ChevronUp className="ml-1 h-3.5 w-3.5" /> : <ChevronDown className="ml-1 h-3.5 w-3.5" />}
                    </Button>
                  )}

                  {/* 已分析但需手动执行 */}
                  {hasDetail && !aiCanExecute && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(t.id)}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                    >
                      <User className="mr-1 h-3.5 w-3.5" />
                      查看步骤
                      {t.expanded ? <ChevronUp className="ml-1 h-3.5 w-3.5" /> : <ChevronDown className="ml-1 h-3.5 w-3.5" />}
                    </Button>
                  )}
                </div>

                {/* 展开的详情 */}
                {t.expanded && t.detail && (
                  <div className="px-3 pb-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    {t.detail.error && (
                      <div className="py-2 text-sm text-red-500">{t.detail.error}</div>
                    )}

                    {!t.detail.error && (
                      <div className="py-3 space-y-3">
                        {/* AI 判断结果 */}
                        <div className="flex items-start gap-2">
                          <Bot className="h-4 w-4 text-purple-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {t.detail.aiExecutable ? "✅ AI可直接完成" : "⚠️ 需要手动执行"}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.detail.reasoning}</div>
                          </div>
                        </div>

                        {/* AI 直接完成的输出 */}
                        {t.detail.aiExecutable && t.detail.aiOutput && (
                          <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-purple-100 dark:border-purple-900">
                            <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">AI生成内容：</div>
                            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{t.detail.aiOutput}</div>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="mt-2"
                              onClick={() => toggle(t.id)}
                            >
                              采用并标记完成
                            </Button>
                          </div>
                        )}

                        {/* 子任务列表 */}
                        {!t.detail.aiExecutable && t.detail.subTasks.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">执行步骤：</div>
                            {t.detail.subTasks.map((st) => (
                              <div key={st.id} className="rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 overflow-hidden">
                                {/* 子任务行 */}
                                <button
                                  onClick={() => toggleSubTask(t.id, st.id)}
                                  className="w-full flex items-start gap-2 p-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                                >
                                  {st.done ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-slate-300 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <div className={`text-sm ${st.done ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300"}`}>
                                      {st.title}
                                    </div>
                                  </div>
                                </button>

                                {/* AI可做的子任务显示AI按钮 */}
                                {st.aiCanDo && !st.done && (
                                  <div className="px-2 pb-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={async () => {
                                        // 这里可以调用AI生成子任务内容
                                        // 简化版：直接标记AI已帮忙
                                        const nextTasks = plan!.tasks.map((task) => {
                                          if (task.id !== t.id || !task.detail) return task;
                                          const subTasks = task.detail.subTasks.map((s) =>
                                            s.id === st.id ? { ...s, aiOutput: "AI已协助完成此步骤" } : s
                                          );
                                          return { ...task, detail: { ...task.detail, subTasks } };
                                        });
                                        setPlan({ ...plan!, tasks: nextTasks });
                                      }}
                                      className="text-purple-600 dark:text-purple-400 text-xs"
                                    >
                                      <Bot className="mr-1 h-3 w-3" />
                                      AI协助
                                    </Button>
                                  </div>
                                )}

                                {/* AI输出内容 */}
                                {st.aiOutput && (
                                  <div className="mx-2 mb-2 p-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded">
                                    {st.aiOutput}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <BrandMark />
        <div className="flex items-center gap-2">
          <Badge>任务板</Badge>
          <Button variant="secondary" size="sm" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            重置勾选
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{plan.chosen.title}</CardTitle>
          <CardDescription>目标 → 拆解 → 每日执行（稳健估算，不承诺收益）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 hairline">
              <div className="text-xs text-slate-500 dark:text-slate-400">目标月收入</div>
              <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">¥{plan.pricing.monthlyTarget}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 hairline">
              <div className="text-xs text-slate-500 dark:text-slate-400">建议客单价</div>
              <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">¥{plan.pricing.unitPrice}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 hairline">
              <div className="text-xs text-slate-500 dark:text-slate-400">需成交单量</div>
              <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{plan.pricing.needOrders} 单/月</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 hairline">
              <div className="text-xs text-slate-500 dark:text-slate-400">日均目标</div>
              <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{plan.pricing.perDayOrders} 单/天</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">执行进度</span>
              <span className="text-slate-500 dark:text-slate-500">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <Separator />

          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">今日优先（最多3条）</div>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {top.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggle(t.id)}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-4 text-left hairline transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between">
                    <Badge>{t.stage}</Badge>
                    <div className="text-xs text-slate-500 dark:text-slate-500">{t.etaMinutes} 分钟</div>
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{t.title}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {(["准备", "获客", "交付"] as const).map(stageBlock)}
      </div>

      <Card>
        <CardContent className="p-6 text-xs text-slate-500 dark:text-slate-500">
          风险提示：任务板为执行拆解与区间估算，结果受市场、定价、执行质量等影响，不构成承诺或投资/就业建议。
        </CardContent>
      </Card>
    </div>
  );
}
