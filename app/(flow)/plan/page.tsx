"use client";

import { useEffect, useState } from "react";
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
import { loadStore, patchStore, PlanTask, TaskDetail } from "@/components/storage";
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

  if (!mounted) {
    return (
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <BrandMark />
          <Badge>任务板</Badge>
        </header>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-text-3">加载中...</div>
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
            <div className="text-sm text-text-3">尚未生成任务板。</div>
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
    const nextTasks = plan!.tasks.map((t: PlanTask) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    const next = { ...plan!, tasks: nextTasks };
    patchStore({ plan: next });
    setPlan(next);
  }

  function toggleExpand(id: string) {
    const nextTasks = plan!.tasks.map((t: PlanTask) =>
      t.id === id ? { ...t, expanded: !t.expanded } : t
    );
    const next = { ...plan!, tasks: nextTasks };
    patchStore({ plan: next });
    setPlan(next);
  }

  async function analyzeTask(taskId: string) {
    const task = plan!.tasks.find((t: PlanTask) => t.id === taskId);
    if (!task) return;

    setAnalyzingTaskId(taskId);
    const store = loadStore();

    try {
      const res = await fetch("/api/kimi/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: task.title,
          taskStage: task.stage,
          chosenTitle: plan!.chosen.title,
          skillsText: store.onboarding?.skillsText || "",
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

      const nextTasks = plan!.tasks.map((t: PlanTask) =>
        t.id === taskId ? { ...t, detail, expanded: true } : t
      );
      const next = { ...plan!, tasks: nextTasks };
      patchStore({ plan: next });
      setPlan(next);
    } catch (e: any) {
      const errorTasks = plan!.tasks.map((t: PlanTask) =>
        t.id === taskId ? { ...t, detail: { taskId, aiExecutable: false, reasoning: "", subTasks: [], error: e?.message || "分析失败" } as TaskDetail, expanded: true } : t
      );
      setPlan({ ...plan!, tasks: errorTasks });
    } finally {
      setAnalyzingTaskId(null);
    }
  }

  function toggleSubTask(taskId: string, subTaskId: string) {
    const nextTasks = plan!.tasks.map((t: PlanTask) => {
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
    const nextTasks = plan!.tasks.map((t: PlanTask) => ({ ...t, done: false, detail: undefined, expanded: false }));
    const next = { ...plan!, tasks: nextTasks };
    patchStore({ plan: next });
    setPlan(next);
  }

  function stageBlock(stage: PlanTask["stage"]) {
    const items = plan!.tasks.filter((t: PlanTask) => t.stage === stage);
    return (
      <Card key={stage}>
        <CardHeader>
          <CardTitle>{stage}</CardTitle>
          <CardDescription>可勾选执行清单（含预计耗时）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((t: PlanTask) => {
            const hasDetail = !!t.detail;
            const aiCanExecute = t.detail?.aiExecutable;
            
            return (
              <div key={t.id} className="rounded-2xl border border-stroke-1 overflow-hidden">
                {/* 主任务行 - 轻奢悬浮效果 */}
                <button
                  onClick={() => toggle(t.id)}
                  className={[
                    "flex w-full items-start gap-3 p-3 text-left transition-all duration-200",
                    "bg-white/[0.03] shadow-edge hover:bg-white/[0.06] hover:-translate-y-[2px] hover:shadow-hover",
                    t.done ? "shadow-glow" : ""
                  ].join(" ")}
                >
                  {t.done ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent-emerald" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 text-text-mute" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${t.done ? "line-through text-text-3" : "text-text-1"}`}>
                      {t.title}
                    </div>
                    <div className="text-xs text-text-mute">预计 {t.etaMinutes} 分钟</div>
                  </div>
                  <Badge className="shrink-0">{t.done ? "已完成" : "待办"}</Badge>
                </button>

                {/* 操作按钮区 */}
                <div className="px-3 pb-3 flex items-center gap-2">
                  {!hasDetail && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => analyzeTask(t.id)}
                      disabled={analyzingTaskId === t.id}
                      className="text-text-3 hover:text-text-1 hover:bg-white/6"
                    >
                      <Lightbulb className="mr-1 h-3.5 w-3.5" />
                      {analyzingTaskId === t.id ? "分析中..." : "任务拆解"}
                    </Button>
                  )}

                  {hasDetail && aiCanExecute && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(t.id)}
                      className="text-accent-purple hover:text-accent-purple hover:bg-accent-purple/10"
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      AI 已生成
                      {t.expanded ? <ChevronUp className="ml-1 h-3.5 w-3.5" /> : <ChevronDown className="ml-1 h-3.5 w-3.5" />}
                    </Button>
                  )}

                  {hasDetail && !aiCanExecute && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(t.id)}
                      className="text-accent-amber hover:text-accent-amber hover:bg-accent-amber/10"
                    >
                      <User className="mr-1 h-3.5 w-3.5" />
                      查看步骤
                      {t.expanded ? <ChevronUp className="ml-1 h-3.5 w-3.5" /> : <ChevronDown className="ml-1 h-3.5 w-3.5" />}
                    </Button>
                  )}
                </div>

                {/* 展开的详情 */}
                {t.expanded && t.detail && (
                  <div className="px-3 pb-3 border-t border-stroke-1 bg-white/[0.02]">
                    {t.detail.error && (
                      <div className="py-2 text-sm text-red-400">{t.detail.error}</div>
                    )}

                    {!t.detail.error && (
                      <div className="py-3 space-y-3">
                        {/* AI 判断结果 */}
                        <div className="flex items-start gap-2">
                          <Bot className="h-4 w-4 text-accent-purple mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-text-1">
                              {t.detail.aiExecutable ? "✅ AI 可直接完成" : "⚠️ 需要手动执行"}
                            </div>
                            <div className="text-xs text-text-3 mt-1">{t.detail.reasoning}</div>
                          </div>
                        </div>

                        {/* AI 直接完成的输出 */}
                        {t.detail.aiExecutable && t.detail.aiOutput && (
                          <div className="rounded-xl bg-bg-2/60 p-3 border border-accent-purple/20">
                            <div className="text-xs font-medium text-accent-purple mb-2">AI 生成内容：</div>
                            <div className="text-sm text-text-2 whitespace-pre-wrap">{t.detail.aiOutput}</div>
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
                            <div className="text-xs font-medium text-text-3">执行步骤：</div>
                            {t.detail.subTasks.map((st) => (
                              <div key={st.id} className="rounded-lg bg-white/[0.03] border border-stroke-1 overflow-hidden">
                                <button
                                  onClick={() => toggleSubTask(t.id, st.id)}
                                  className="w-full flex items-start gap-2 p-2 text-left hover:bg-white/[0.05] transition"
                                >
                                  {st.done ? (
                                    <CheckCircle2 className="h-4 w-4 text-accent-emerald mt-0.5" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-text-mute mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <div className={`text-sm ${st.done ? "line-through text-text-3" : "text-text-2"}`}>
                                      {st.title}
                                    </div>
                                  </div>
                                </button>

                                {st.aiCanDo && !st.done && (
                                  <div className="px-2 pb-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={async () => {
                                        const nextTasks = plan!.tasks.map((task: PlanTask) => {
                                          if (task.id !== t.id || !task.detail) return task;
                                          const subTasks = task.detail.subTasks.map((s) =>
                                            s.id === st.id ? { ...s, aiOutput: "AI 已协助完成此步骤" } : s
                                          );
                                          return { ...task, detail: { ...task.detail, subTasks } };
                                        });
                                        setPlan({ ...plan!, tasks: nextTasks });
                                      }}
                                      className="text-accent-purple text-xs hover:text-accent-purple"
                                    >
                                      <Bot className="mr-1 h-3 w-3" />
                                      AI 协助
                                    </Button>
                                  </div>
                                )}

                                {st.aiOutput && (
                                  <div className="mx-2 mb-2 p-2 text-xs text-text-3 bg-white/[0.03] rounded">
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
          {/* 数据卡 - 金融数字质感 */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white/4 p-4 shadow-edge shadow-inset">
              <div className="text-xs text-text-mute">目标月收入</div>
              <div className="mt-1 text-lg font-semibold num text-text-1">¥{plan.pricing.monthlyTarget.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl bg-white/4 p-4 shadow-edge shadow-inset">
              <div className="text-xs text-text-mute">建议客单价</div>
              <div className="mt-1 text-lg font-semibold num text-text-1">¥{plan.pricing.unitPrice.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl bg-white/4 p-4 shadow-edge shadow-inset">
              <div className="text-xs text-text-mute">需成交单量</div>
              <div className="mt-1 text-lg font-semibold num text-text-1">{plan.pricing.needOrders.toLocaleString()} 单/月</div>
            </div>
            <div className="rounded-2xl bg-white/4 p-4 shadow-edge shadow-inset">
              <div className="text-xs text-text-mute">日均目标</div>
              <div className="mt-1 text-lg font-semibold num text-text-1">{plan.pricing.perDayOrders.toLocaleString()} 单/天</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-2">执行进度</span>
              <span className="num text-text-3">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <Separator />

          <div>
            <div className="text-sm font-semibold text-text-1">今日优先（最多3条）</div>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {top.map((t: PlanTask) => (
                <button
                  key={t.id}
                  onClick={() => toggle(t.id)}
                  className="rounded-2xl bg-white/[0.03] p-4 text-left shadow-edge transition hover:bg-white/[0.06] hover:-translate-y-[2px] hover:shadow-hover"
                >
                  <div className="flex items-center justify-between">
                    <Badge>{t.stage}</Badge>
                    <div className="text-xs text-text-mute">{t.etaMinutes} 分钟</div>
                  </div>
                  <div className="mt-2 text-sm font-medium text-text-1">{t.title}</div>
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
        <CardContent className="p-6 text-xs text-text-mute">
          风险提示：任务板为执行拆解与区间估算，结果受市场、定价、执行质量等影响，不构成承诺或投资/就业建议。
        </CardContent>
      </Card>
    </div>
  );
}
