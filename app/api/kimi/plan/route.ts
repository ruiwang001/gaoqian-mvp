import { NextResponse } from "next/server";
import { z } from "zod";
import { kimiChatJSON } from "@/lib/kimi";

const Input = z.object({
  chosen: z.object({
    id: z.string(),
    title: z.string(),
    fitScore: z.number(),
    incomeRange: z.string(),
    difficulty: z.enum(["低", "中", "高"]),
    startCost: z.enum(["低", "中", "高"]),
    why: z.array(z.string()),
    firstSteps: z.array(z.string()),
  }),
  targetIncome: z.number().min(0),
  dailyHours: z.enum(["1", "2-3", "4-6", "6+"]),
});

type Out = {
  unitPrice: number;
  tasks: Array<{
    id: string;
    stage: "准备" | "获客" | "交付";
    title: string;
    etaMinutes: number;
  }>;
};

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Input.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { chosen, targetIncome, dailyHours } = parsed.data;
  const system =
    "你是一个执行拆解专家：把赚钱路径拆成清晰任务板（像项目管理+金融产品风格），不许鸡汤，不许夸大。";
  const prompt =
    `选择的赚钱路径：${chosen.title} ` +
    `目标月收入：${targetIncome} ` +
    `每天可投入时间：${dailyHours} 小时档 ` +
    `请输出： ` +
    `1) 建议客单价 unitPrice（人民币整数，保守可行） ` +
    `2) 任务列表 tasks：总共 12-18 条，分为三阶段：准备/获客/交付。 ` +
    `每条任务必须具体可执行、可勾选，给出预计耗时 etaMinutes（15-240）。 ` +
    `避免泛泛描述（如"努力推广"不行）。 `;

  const schemaHint = `{ "unitPrice": 0, "tasks": [ { "id": "string", "stage": "准备|获客|交付", "title": "string", "etaMinutes": 0 } ] }`;

  const out = await kimiChatJSON<Out>({
    system,
    user: prompt,
    schemaHint,
  });

  const tasks = (out.tasks || [])
    .slice(0, 24)
    .map((t, idx) => ({
      id: t.id?.trim() || `t_${idx + 1}`,
      stage: t.stage,
      title: String(t.title || "").slice(0, 80),
      etaMinutes: Math.max(
        15,
        Math.min(240, Math.round(Number(t.etaMinutes) || 30))
      ),
    }));

  const unitPrice = Math.max(
    19,
    Math.min(4999, Math.round(Number(out.unitPrice) || 299))
  );

  return NextResponse.json({ unitPrice, tasks });
}