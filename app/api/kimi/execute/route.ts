import { NextResponse } from "next/server";
import { z } from "zod";
import { kimiChatJSON } from "@/lib/kimi";

const Input = z.object({
  taskTitle: z.string(),
  taskStage: z.enum(["准备", "获客", "交付"]),
  chosenTitle: z.string(),
  skillsText: z.string(),
});

type SubTask = {
  id: string;
  title: string;
  done: boolean;
  aiCanDo: boolean;
  aiOutput?: string;
};

type Out = {
  aiExecutable: boolean;
  reasoning: string;
  aiOutput?: string;
  subTasks: SubTask[];
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

  const { taskTitle, taskStage, chosenTitle, skillsText } = parsed.data;

  const system =
    "你是一个任务执行分析专家。分析用户任务是否能被AI直接完成，如果不能则拆解为子任务。输出必须严格按JSON格式。";

  const prompt = `
任务："${taskTitle}"
阶段：${taskStage}
赚钱路径：${chosenTitle}
用户技能：${skillsText}

请分析这个任务：
1. AI能否直接完成这个任务？（aiExecutable: true/false）
2. 给出判断理由（reasoning: 简短说明）
3. 如果AI能直接完成，提供执行结果（aiOutput: 具体内容）
4. 如果AI不能直接完成，拆解成3-6个子任务（subTasks），每个子任务标注aiCanDo（AI能否代做）

子任务示例：
- "写一篇小红书文案" → AI可直接完成
- "注册闲鱼账号" → 需要用户自己完成（aiCanDo: false）
- "设计Logo" → AI可生成初稿（aiCanDo: true）
`;

  const schemaHint = `{
  "aiExecutable": boolean,
  "reasoning": "string",
  "aiOutput": "string (optional, AI能直接完成时的输出内容)",
  "subTasks": [
    { "id": "string", "title": "string", "aiCanDo": boolean, "aiOutput": "string (optional)" }
  ]
}`;

  try {
    const out = await kimiChatJSON<Out>({
      system,
      user: prompt,
      schemaHint,
    });

    // Normalize output
    const normalized: Out = {
      aiExecutable: Boolean(out.aiExecutable),
      reasoning: String(out.reasoning || ""),
      aiOutput: out.aiOutput ? String(out.aiOutput) : undefined,
      subTasks: (out.subTasks || []).map((st, idx) => ({
        id: st.id?.trim() || `sub_${idx + 1}`,
        title: String(st.title || "").slice(0, 100),
        done: false,
        aiCanDo: Boolean(st.aiCanDo),
        aiOutput: st.aiOutput ? String(st.aiOutput) : undefined,
      })),
    };

    return NextResponse.json(normalized);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "AI执行分析失败" },
      { status: 500 }
    );
  }
}
