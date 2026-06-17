import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../integrations/supabase/client";
import { NorthStarBanner } from "../../components/NorthStarBanner";
import { DepartmentGrid } from "../../components/DepartmentGrid";
import { useLanguage } from "../../lib/i18n";
import type { Stage, Department, NodeRow, NorthStar } from "../../lib/types";

export const Route = createFileRoute("/_authenticated/stage/$slug")({
  component: StagePage,
});

function StagePage() {
  const { slug } = Route.useParams();
  const { t } = useLanguage();

  const { data: stage } = useQuery<Stage>({
    queryKey: ["stage", slug],
    queryFn: async () => {
      const { data } = await supabase.from("stages").select("*").eq("slug", slug).single();
      return data;
    },
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await supabase.from("departments").select("*");
      return data ?? [];
    },
  });

  const { data: nodes = [] } = useQuery<NodeRow[]>({
    queryKey: ["nodes", stage?.id],
    enabled: !!stage?.id,
    queryFn: async () => {
      const { data } = await supabase.from("nodes").select("*").eq("stage_id", stage!.id);
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
      <NorthStarBanner northStar={northStar} currentStage={stage} />
      <div className="pt-[72px] px-4 md:px-8 py-6">
        <div className="mb-4">
          <p className="label-caps text-gray-400">{t.stage}</p>
          <h2 className="text-xl font-bold" style={{ color: "var(--caua-amazon)" }}>{stage?.name ?? "…"}</h2>
          {stage?.target_arr && (
            <p className="text-sm text-gray-500 mt-1">Target {t.arr}: {stage.target_arr}</p>
          )}
        </div>
        <DepartmentGrid departments={departments} nodes={nodes} />
      </div>
    </div>
  );
}
