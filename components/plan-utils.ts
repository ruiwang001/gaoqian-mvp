import { PlanTask } from "@/components/storage";

export function calcProgress(tasks: PlanTask[]) {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.done).length;
  return Math.round((done / tasks.length) * 100);
}

export function todayTopTasks(tasks: PlanTask[]) {
  // MVP策略：优先选未完成 + 每个阶段各取1个，最多3个
  const notDone = tasks.filter((t) => !t.done);
  const pick: PlanTask[] = [];
  const stages: PlanTask["stage"][] = ["准备", "获客", "交付"];
  for (const s of stages) {
    const t = notDone.find((x) => x.stage === s);
    if (t) pick.push(t);
  }
  if (pick.length < 3) {
    for (const t of notDone) {
      if (pick.length >= 3) break;
      if (!pick.some((x) => x.id === t.id)) pick.push(t);
    }
  }
  return pick.slice(0, 3);
}