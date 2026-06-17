import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { useLanguage } from "../lib/i18n";
import { StatusPill } from "./StatusPill";
import type { NodeRow, NodeUpdate, Status } from "../lib/types";

interface Props {
  node: NodeRow | null;
  onClose: () => void;
}

const STATUS_OPTIONS: Status[] = ["red", "yellow", "green"];
const STATUS_LABELS: Record<Status, { en: string; es: string }> = {
  red: { en: "Blocked", es: "Bloqueado" },
  yellow: { en: "In Progress", es: "En progreso" },
  green: { en: "On Track", es: "Al día" },
};

export function NodeDrawer({ node, onClose }: Props) {
  const { t, lang } = useLanguage();
  const qc = useQueryClient();
  const [status, setStatus] = useState<Status>("yellow");
  const [note, setNote] = useState("");
  const [targetMetric, setTargetMetric] = useState("");
  const [updates, setUpdates] = useState<NodeUpdate[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!node) return;
    setStatus(node.status);
    setNote("");
    setTargetMetric(node.target_metric ?? "");
    supabase
      .from("node_updates")
      .select("*")
      .eq("node_id", node.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setUpdates(data ?? []));
  }, [node]);

  async function save(markDone = false) {
    if (!node) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const finalStatus: Status = markDone ? "green" : status;

    await supabase.from("nodes").update({
      status: finalStatus,
      target_metric: targetMetric || null,
      updated_at: new Date().toISOString(),
      updated_by: user?.email ?? null,
    }).eq("id", node.id);

    if (note.trim()) {
      await supabase.from("node_updates").insert({
        node_id: node.id,
        status: finalStatus,
        note: note.trim(),
        created_by: user?.email ?? null,
      });
    }

    qc.invalidateQueries({ queryKey: ["nodes"] });
    toast.success(t.saved);
    setSaving(false);
    onClose();
  }

  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--caua-pod)" }}>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-4">{node.title}</h3>
          <button onClick={onClose} className="shrink-0 p-1 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <label className="label-caps text-gray-400 block mb-2">{t.status}</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                    status === s ? "border-gray-800 shadow" : "border-transparent bg-gray-100"
                  }`}
                >
                  <StatusPill status={s} label={STATUS_LABELS[s][lang]} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-caps text-gray-400 block mb-1">{t.target}</label>
            <input
              value={targetMetric}
              onChange={e => setTargetMetric(e.target.value)}
              placeholder="e.g. 100 subscribers"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--caua-pod)]"
            />
          </div>

          <div>
            <label className="label-caps text-gray-400 block mb-1">{t.note}</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder={lang === "es" ? "Agrega una nota…" : "Add a note…"}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--caua-pod)] resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--caua-amazon)" }}
            >
              {saving ? t.loading : t.save}
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--caua-pod)" }}
            >
              {t.done}
            </button>
          </div>

          <div>
            <p className="label-caps text-gray-400 mb-2">{t.history}</p>
            {updates.length === 0 ? (
              <p className="text-xs text-gray-300">{t.noUpdates}</p>
            ) : (
              <div className="space-y-2">
                {updates.map(u => (
                  <div key={u.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusPill status={u.status} />
                      <span className="text-xs text-gray-400">
                        {new Date(u.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {u.created_by && <span className="text-xs text-gray-400">· {u.created_by.split("@")[0]}</span>}
                    </div>
                    {u.note && <p className="text-xs text-gray-600">{u.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
