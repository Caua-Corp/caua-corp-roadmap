import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../integrations/supabase/client";
import { NorthStarBanner } from "../../components/NorthStarBanner";
import { StageTimeline } from "../../components/StageTimeline";
import { DepartmentGrid } from "../../components/DepartmentGrid";
import type { Stage, Department, NodeRow, NorthStar } from "../../lib/types";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stages = [] } = useQuery<Stage[]>({
    queryKey: ["stages"],
    queryFn: async () => {
      const { data } = await supabase.from("stages").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await supabase.from("departments").select("*");
      return data ?? [];
    },
  });

  const currentStage = stages.find(s => s.is_current);

  const { data: nodes = [] } = useQuery<NodeRow[]>({
    queryKey: ["nodes", currentStage?.id],
    enabled: !!currentStage,
    queryFn: async () => {
      const { data } = await supabase
        .from("nodes")
        .select("*")
        .eq("stage_id", currentStage!.id);
      return data ?? [];
    },
  });

  const { data: northStar } = useQuery<NorthStar>({
    queryKey: ["north_star"],
    queryFn: async () => {
      const { data } = await supabase
        .from("north_star_metrics")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
      return data;
    },
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--caua-white)" }}>
      <NorthStarBanner northStar={northStar} currentStage={currentStage} />
      <div className="pt-[72px]">
        <StageTimeline stages={stages} />
        <div className="px-4 md:px-8 py-6">
          <DepartmentGrid departments={departments} nodes={nodes} />
        </div>
      </div>
    </div>
  );
}
