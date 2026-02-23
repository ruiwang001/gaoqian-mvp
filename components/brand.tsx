import { Badge } from "@/components/ui/badge";

export function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 text-text-1 shadow-edge shadow-inset">
        钱
      </div>
      <div className="leading-tight">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight text-text-1">搞钱</span>
          <Badge className="bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/20">MVP</Badge>
        </div>
        <div className="text-xs text-text-3">AI 执行路径拆解</div>
      </div>
    </div>
  );
}
