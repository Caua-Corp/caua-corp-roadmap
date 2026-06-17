import { useState, useEffect } from "react";
import { Zap, X, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { useLanguage } from "../lib/i18n";
import type { NodeRow, Status } from "../lib/types";

type ActionType = "social" | "email" | "strategic" | "technical" | "product" | "bd";

const ACTION_TYPES: { value: ActionType; labelEs: string; labelEn: string; emoji: string }[] = [
  { value: "social",    labelEs: "Red Social / Contenido",    labelEn: "Social Media / Content",  emoji: "📱" },
  { value: "email",     labelEs: "Email / Outreach / DM",     labelEn: "Email / Outreach / DM",   emoji: "📧" },
  { value: "strategic", labelEs: "Acto Estratégico",          labelEn: "Strategic Move",          emoji: "♟️" },
  { value: "technical", labelEs: "Acto Técnico / Producto",   labelEn: "Technical / Product Act", emoji: "⚙️" },
  { value: "product",   labelEs: "R&D / Prototipo",           labelEn: "R&D / Prototype",         emoji: "🔬" },
  { value: "bd",        labelEs: "BD / Deal / Reunión",       labelEn: "BD / Deal / Meeting",     emoji: "🤝" },
];

const TRACTION_LABELS: { value: string; labelEs: string; labelEn: string }[] = [
  { value: "lead",       labelEs: "Lead generado",        labelEn: "Lead generated" },
  { value: "reply",      labelEs: "Respuesta / engagement", labelEn: "Reply / engagement" },
  { value: "deal",       labelEs: "Deal avanzado",        labelEn: "Deal advanced" },
  { value: "shipped",    labelEs: "Feature/producto listo", labelEn: "Feature/product shipped" },
  { value: "subscriber", labelEs: "Nuevo suscriptor",     labelEn: "New subscriber" },
  { value: "revenue",    labelEs: "Ingreso generado",     labelEn: "Revenue generated" },
  { value: "visibility", labelEs: "Visibilidad / PR",     labelEn: "Visibility / PR" },
  { value: "learning",   labelEs: "Aprendizaje clave",    labelEn: "Key learning" },
];

export function ActionCaptureButton() {
  const { lang } = useLanguage();
  const qc = useQueryClient();
  const isEs = lang === "es";

  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>("social");
  const [founder, setFounder] = useState<"amaury" | "david">("amaury");
  const [traction, setTraction] = useState("lead");
  const [detail, setDetail] = useState("");
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<NodeRow[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      supabase.from("nodes").select("id, title, status, department_id")
        .order("updated_at", { ascending: false }).limit(30)
        .then(({ data }) => setNodes(data ?? []));

      supabase.auth.getUser().then(({ data }) => {
        const email = data.user?.email ?? "";
        if (email.includes("amaury")) setFounder("amaury");
        else if (email.includes("david")) setFounder("david");
      });
    }
  }, [open]);

  async function submit() {
    if (!detail.trim()) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    const actionEmoji = ACTION_TYPES.find(a => a.value === actionType)?.emoji ?? "⚡";
    const tractionLabel = TRACTION_LABELS.find(t => t.value === traction);
    const tractionText = isEs ? tractionLabel?.labelEs : tractionLabel?.labelEn;

    const noteText = `${actionEmoji} [${isEs ? ACTION_TYPES.find(a => a.value === actionType)?.labelEs : ACTION_TYPES.find(a => a.value === actionType)?.labelEn}] ${detail.trim()}\n📈 Tracción: ${tractionText}\n👤 ${founder === "amaury" ? "Amaury" : "David"}`;

    if (nodeId) {
      await supabase.from("node_updates").insert({
        node_id: nodeId,
        status: "yellow" as Status,
        note: noteText,
        created_by: user?.email ?? null,
      });
      await supabase.from("nodes").update({
        updated_at: new Date().toISOString(),
        updated_by: user?.email ?? null,
      }).eq("id", nodeId);
    } else {
      // Log as a standalone traction event (insert to the most recent relevant node)
      const { data: currentNodes } = await supabase
        .from("nodes").select("id").order("updated_at", { ascending: false }).limit(1);
      if (currentNodes?.[0]) {
        await supabase.from("node_updates").insert({
          node_id: currentNodes[0].id,
          status: "green" as Status,
          note: noteText,
          created_by: user?.email ?? null,
        });
      }
    }

    qc.invalidateQueries({ queryKey: ["nodes"] });
    toast.success(isEs ? "⚡ Acción registrada — tracción ingresada al Roadmap" : "⚡ Action logged — traction captured in Roadmap");
    setDetail("");
    setNodeId(null);
    setSaving(false);
    setOpen(false);
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: "var(--caua-mazorca)", color: "white" }}
        title={isEs ? "Registrar acción de tracción" : "Log traction action"}
      >
        <Zap size={16} />
        <span>Action</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "var(--caua-mazorca)" }}>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-white" />
                <span className="font-bold text-white text-sm">
                  {isEs ? "Registrar acción de tracción" : "Log traction action"}
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20">
                <X size={16} className="text-white" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">

              {/* Founder */}
              <div>
                <p className="label-caps text-gray-400 mb-2">{isEs ? "¿Quién lo hizo?" : "Who did it?"}</p>
                <div className="flex gap-2">
                  {(["amaury", "david"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFounder(f)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        founder === f
                          ? "border-gray-800 bg-gray-100"
                          : "border-transparent bg-gray-50 text-gray-400"
                      }`}
                    >
                      {f === "amaury" ? "🛠 Amaury" : "🎨 David"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Type */}
              <div>
                <p className="label-caps text-gray-400 mb-2">{isEs ? "Tipo de acción" : "Action type"}</p>
                <div className="grid grid-cols-3 gap-2">
                  {ACTION_TYPES.map(a => (
                    <button
                      key={a.value}
                      onClick={() => setActionType(a.value)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border-2 transition-all text-center ${
                        actionType === a.value
                          ? "border-[var(--caua-mazorca)] bg-orange-50 text-orange-800"
                          : "border-transparent bg-gray-50 text-gray-500"
                      }`}
                    >
                      <span className="block text-base mb-0.5">{a.emoji}</span>
                      {isEs ? a.labelEs : a.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* What happened */}
              <div>
                <p className="label-caps text-gray-400 mb-2">{isEs ? "¿Qué hiciste exactamente?" : "What exactly did you do?"}</p>
                <textarea
                  value={detail}
                  onChange={e => setDetail(e.target.value)}
                  rows={3}
                  placeholder={isEs
                    ? "Ej: Publiqué reel del proceso de fermentación de Lucho, 2.4k vistas en 2h…"
                    : "E.g.: Posted fermentation reel, 2.4k views in 2h, 3 DMs asking where to buy…"
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--caua-mazorca)] resize-none"
                  autoFocus
                />
              </div>

              {/* Traction generated */}
              <div>
                <p className="label-caps text-gray-400 mb-2">{isEs ? "Tracción generada" : "Traction generated"}</p>
                <div className="flex flex-wrap gap-2">
                  {TRACTION_LABELS.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTraction(t.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        traction === t.value
                          ? "border-[var(--caua-amazon)] bg-[var(--caua-amazon)] text-white"
                          : "border-gray-200 text-gray-500 hover:border-gray-400"
                      }`}
                    >
                      {isEs ? t.labelEs : t.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link to node (optional) */}
              <div>
                <p className="label-caps text-gray-400 mb-2">
                  {isEs ? "Vincular a nodo del roadmap (opcional)" : "Link to roadmap node (optional)"}
                </p>
                <div className="relative">
                  <select
                    value={nodeId ?? ""}
                    onChange={e => setNodeId(e.target.value || null)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--caua-mazorca)] appearance-none bg-white"
                  >
                    <option value="">{isEs ? "— Sin vincular —" : "— Unlinked —"}</option>
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.title}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={submit}
                disabled={saving || !detail.trim()}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--caua-mazorca)" }}
              >
                <Zap size={16} />
                {saving
                  ? (isEs ? "Registrando…" : "Logging…")
                  : (isEs ? "Registrar acción ⚡" : "Log action ⚡")
                }
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
