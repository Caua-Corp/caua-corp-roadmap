import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { useLanguage } from "../lib/i18n";
import type { NorthStar } from "../lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  northStar?: NorthStar;
}

export function WelfareModal({ open, onClose, northStar }: Props) {
  const { t } = useLanguage();
  const [mood, setMood] = useState(7);
  const [financial, setFinancial] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? ""));
  }, []);

  async function submit() {
    setSaving(true);
    const isAmaury = userEmail.includes("amaury") || userEmail.includes("cauaculture") || userEmail.includes("cauacolombia");

    const patch: Record<string, unknown> = isAmaury
      ? { welfare_amaury: mood }
      : { welfare_david: mood };

    if (northStar?.id) {
      await supabase.from("north_star_metrics").update({
        ...patch,
        updated_at: new Date().toISOString(),
      }).eq("id", northStar.id);
    } else {
      await supabase.from("north_star_metrics").insert({
        mrr_usd: 193,
        arr_usd: 2300,
        ipo_target_year: 2034,
        ipo_target_arr: "$800M-$1.5B",
        active_subscribers: 6,
        units_inventory: 400,
        welfare_amaury: isAmaury ? mood : 5,
        welfare_david: isAmaury ? 5 : mood,
        ...patch,
      });
    }

    toast.success(t.saved);
    setSaving(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900">{t.welfareCheck}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-caps text-gray-400 block mb-2">{t.mood}</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={10}
                value={mood}
                onChange={e => setMood(Number(e.target.value))}
                className="flex-1 accent-[var(--caua-pod)]"
              />
              <span className="w-8 text-center font-bold text-lg" style={{ color: mood >= 7 ? "var(--caua-pod)" : mood >= 4 ? "var(--caua-mazorca)" : "#ef4444" }}>
                {mood}
              </span>
            </div>
          </div>

          <div>
            <label className="label-caps text-gray-400 block mb-2">{t.financial}</label>
            <div className="flex gap-2">
              {t.financialOpts.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setFinancial(i)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                    financial === i ? "border-gray-800 bg-gray-100" : "border-transparent bg-gray-50 text-gray-500"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-caps text-gray-400 block mb-1">{t.notes}</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--caua-pod)] resize-none"
            />
          </div>

          <button
            onClick={submit}
            disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--caua-amazon)" }}
          >
            {saving ? t.loading : t.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
