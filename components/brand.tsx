import { Badge } from "@/components/ui/badge";

export function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-900 text-white shadow-soft dark:bg-slate-100 dark:text-slate-900">
        钱
      </div>
      <div className="leading-tight">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight dark:text-slate-100">搞钱</span>
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">MVP</Badge>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">AI 执行路径拆解</div>
      </div>
    </div>
  );
}