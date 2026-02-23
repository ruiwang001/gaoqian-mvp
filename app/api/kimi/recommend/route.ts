import { NextResponse } from "next/server";
import { z } from "zod";
import { kimiChatJSON } from "@/lib/kimi";

const Input = z.object({
  age: z.number().int().min(10).max(80),
  currentIncome: z.number().min(0),
  targetIncome: z.number().min(0),
  dailyHours: z.enum(["1", "2-3", "4-6", "6+"]),
  skillsText: z.string().min(1).max(2000),
  execution: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

type Out = {
  recommendations: Array<{
    id: string;
    title: string;
    fitScore: number;
    incomeRange: string;
    difficulty: "低" | "中" | "高";
    startCost: "低" | "中" | "高";
    why: string[];
    firstSteps: string[];
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

  const user = parsed.data;
  const system =
    "你是一个严谨的个人赚钱路径规划师（偏金融产品风格）：输出要克制、结构化、可执行，不许夸大，不许承诺收益。";
  const prompt =
    `用户信息： ` +
    `年龄：${user.age} 当前月收入：${user.currentIncome} 目标月收入：${user.targetIncome} 每天可投入时间：${user.dailyHours} 小时档 ` +
    `执行力(1-3)：${user.execution} 技能/经验（自由描述）：${user.skillsText} ` +
    `请给出 3 条"可快速启动"的赚钱路径（偏副业/轻创业），要求： ` +
    `- 每条路径标题清晰（如：AI写简历/短视频剪辑/闲鱼选品转卖） ` +
    `- 给出适合度 0-100 ` +
    `- 给出收入区间（保守，写成字符串，如"3000-8000/月"） ` +
    `- 给出难度(低/中/高)、启动成本(低/中/高) ` +
    `- why: 3-5条理由（短句） ` +
    `- firstSteps: 3-6条最小启动步骤（短句） ` +
    `输出要"像金融App"，简洁、稳健。`;

  const schemaHint = `{ "recommendations": [ { "id": "string", "title": "string", "fitScore": 0, "incomeRange": "string", "difficulty": "低|中|高", "startCost": "低|中|高", "why": ["string"], "firstSteps": ["string"] } ] }`;

  const out = await kimiChatJSON<Out>({
    system,
    user: prompt,
    schemaHint,
  });

  // clamp + normalize
  out.recommendations = (out.recommendations || []).slice(0, 3).map((r, idx) => ({
    ...r,
    id: r.id?.trim() || `rec_${idx + 1}`,
    fitScore: Math.max(
      0,
      Math.min(100, Math.round(Number(r.fitScore) || 0))
    ),
    why: (r.why || []).slice(0, 6),
    firstSteps: (r.firstSteps || []).slice(0, 8),
  }));

  return NextResponse.json(out);
}