import { useState } from "react";
import { useLanguage } from "../lib/i18n";
import { StatusPill } from "./StatusPill";
import { NodeDrawer } from "./NodeDrawer";
import type { Department, NodeRow } from "../lib/types";

interface Props {
  departments: Department[];
  nodes: NodeRow[];
}

export function DepartmentGrid({ departments, nodes }: Props) {
  const { t } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<NodeRow | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map(dept => {
          const deptNodes = nodes.filter(n => n.department_id === dept.id);
          return (
            <div key={dept.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-l-4" style={{ borderLeftColor: dept.color }}>
                <span className="text-lg">{dept.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{dept.name}</p>
                  <p className="label-caps text-gray-400">{dept.owner === "shared" ? "Shared" : dept.owner === "amaury" ? "Amaury" : "David"}</p>
                </div>
              </div>

              <div className="divide-y divide-gray-50 px-4 pb-4">
                {deptNodes.length === 0 ? (
                  <p className="text-xs text-gray-300 py-3">{t.noUpdates}</p>
                ) : (
                  deptNodes.map(node => (
                    <div
                      key={node.id}
                      className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded transition-colors"
                      onClick={() => setSelectedNode(node)}
                    >
                      <StatusPill status={node.status} />
                      <span className="text-sm text-gray-700 flex-1 truncate">{node.title}</span>
                      <span className="text-xs text-gray-300 shrink-0">
                        {new Date(node.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <NodeDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />
    </>
  );
}
