export type Onboarding = {
  age: number;
  currentIncome: number;
  targetIncome: number;
  dailyHours: "1" | "2-3" | "4-6" | "6+";
  skillsText: string;
  execution: 1 | 2 | 3;
};

export type Recommendation = {
  id: string;
  title: string;
  fitScore: number;
  incomeRange: string;
  difficulty: "低" | "中" | "高";
  startCost: "低" | "中" | "高";
  why: string[];
  firstSteps: string[];
};

export type SubTask = {
  id: string;
  title: string;
  done: boolean;
  aiCanDo: boolean;
  aiOutput?: string;
};

export type TaskDetail = {
  taskId: string;
  aiExecutable: boolean;
  reasoning: string;
  subTasks: SubTask[];
  aiOutput?: string;
  loading?: boolean;
  error?: string;
};

export type PlanTask = {
  id: string;
  title: string;
  etaMinutes: number;
  stage: "准备" | "获客" | "交付";
  done: boolean;
  detail?: TaskDetail;
  expanded?: boolean;
};

export type Plan = {
  planId: string;
  chosen: Recommendation;
  pricing: {
    unitPrice: number;
    monthlyTarget: number;
    needOrders: number;
    perDayOrders: number;
  };
  tasks: PlanTask[];
  createdAt: number;
};

const KEY = "gaoqian_mvp_v1";

type Store = {
  onboarding?: Onboarding;
  recommendations?: Recommendation[];
  plan?: Plan;
};

export function loadStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

export function saveStore(next: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function patchStore(patch: Partial<Store>) {
  const cur = loadStore();
  saveStore({ ...cur, ...patch });
}
