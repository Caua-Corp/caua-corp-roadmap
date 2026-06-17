export type Status = "red" | "yellow" | "green";
export type Owner = "amaury" | "david" | "shared";

export interface Stage {
  id: string;
  name: string;
  slug: string;
  start_date: string;
  end_date: string | null;
  target_arr: string;
  is_current: boolean;
  sort_order: number;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  owner: Owner;
  color: string;
  icon: string;
}

export interface NodeRow {
  id: string;
  department_id: string;
  stage_id: string;
  title: string;
  description: string | null;
  status: Status;
  owner: Owner;
  target_metric: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface NodeUpdate {
  id: string;
  node_id: string;
  status: Status;
  note: string | null;
  created_at: string;
  created_by: string | null;
}

export interface NorthStar {
  id: string;
  mrr_usd: number;
  arr_usd: number;
  ipo_target_year: number;
  ipo_target_arr: string;
  active_subscribers: number;
  units_inventory: number;
  welfare_amaury: number;
  welfare_david: number;
  updated_at: string;
}

export const STATUS_EMOJI: Record<Status, string> = {
  red: "🔴",
  yellow: "🟡",
  green: "🟢",
};

export function displayName(owner: Owner): string {
  if (owner === "amaury") return "Amaury";
  if (owner === "david") return "David";
  return "Shared";
}
