"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { patchStore } from "@/components/storage";
import { ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [age, setAge] = useState("28");
  const [currentIncome, setCurrentIncome] = useState("6000");
  const [targetIncome, setTargetIncome] = useState("10000");
  const [dailyHours, setDailyHours] = useState<"1" | "2-3" | "4-6" | "6+">("2-3");
  const [skillsText, setSkillsText] = useState(
    "比如：会写作、会用AI工具、会做PPT、会剪映基础"
  );
  const [execution, setExecution] = useState<1 | 2 | 3>(2);

  const valid = useMemo(() => {
    const a = Number(age),
      c = Number(currentIncome),
      t = Number(targetIncome);
    return (
      Number.isFinite(a) &&
      a > 0 &&
      Number.isFinite(c) &&
      c >= 0 &&
      Number.isFinite(t) &&
      t >= 0 &&
      skillsText.trim().length >= 2
    );
  }, [age, currentIncome, targetIncome, skillsText]);

  function next() {
    if (!valid) return;
    patchStore({
      onboarding: {
        age: Number(age),
        currentIncome: Number(currentIncome),
        targetIncome: Number(targetIncome),
        dailyHours,
        skillsText: skillsText.trim(),
        execution,
      },
    });
    router.push("/recommendations");
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <BrandMark />
        <Badge>信息收集</Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>你的目标</CardTitle>
            <CardDescription>尽量用数字表达，系统会更好拆解。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>年龄</Label>
              <Input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                inputMode="numeric"
              />
            </div>

            <div className="grid gap-2">
              <Label>当前月收入（¥）</Label>
              <Input
                value={currentIncome}
                onChange={(e) => setCurrentIncome(e.target.value)}
                inputMode="numeric"
              />
            </div>

            <div className="grid gap-2">
              <Label>目标月收入（¥）</Label>
              <Input
                value={targetIncome}
                onChange={(e) => setTargetIncome(e.target.value)}
                inputMode="numeric"
              />
            </div>

            <div className="grid gap-2">
              <Label>每天可投入时间</Label>
              <div className="grid grid-cols-4 gap-2">
                {(["1", "2-3", "4-6", "6+"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setDailyHours(v)}
                    className={[
                      "h-11 rounded-xl text-sm shadow-edge transition",
                      dailyHours === v
                        ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                        : "bg-white/4 text-text-2 hover:bg-white/6",
                    ].join(" ")}
                  >
                    {v}小时
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>执行力（1-3）</Label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((v) => (
                  <button
                    key={v}
                    onClick={() => setExecution(v as 1 | 2 | 3)}
                    className={[
                      "h-11 rounded-xl text-sm shadow-edge transition",
                      execution === v
                        ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                        : "bg-white/4 text-text-2 hover:bg-white/6",
                    ].join(" ")}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="text-xs text-text-mute">1=容易拖延，2=正常，3=自驱执行强</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>你擅长什么</CardTitle>
            <CardDescription>自由描述即可：技能/经历/资源。越具体越好。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
            />

            <div className="rounded-2xl bg-white/4 p-4 shadow-edge shadow-inset text-sm text-text-3">
              示例：写简历/剪视频/做PPT/会英语/会销售/会用AI/有渠道资源/能线下跑业务…
            </div>

            <Button
              size="lg"
              disabled={!valid}
              onClick={next}
              className="w-full"
            >
              生成赚钱路径
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-text-mute">
              风险提示：本产品输出为"行动建议与任务拆解"，不构成收益承诺。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
