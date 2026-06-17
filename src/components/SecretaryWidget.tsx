import { useState, useEffect, useCallback, useRef } from "react";
import { Shield, X, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { useLanguage } from "../lib/i18n";

interface Analysis {
  urgent_action: string | null;
  alerts: string[];
  kaizen_tip: string | null;
  recommendation: string | null;
  summary?: string;
}

export function SecretaryWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionIdRef = useRef<string | null>(null);

  const callAgent = useCallback(async (sessionType: "open" | "close", sessionId?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase.functions.invoke("secretary-agent", {
      body: { session_type: sessionType, session_id: sessionId },
    });

    if (error) {
      console.error("secretary-agent error:", error);
      return null;
    }
    return data as Analysis;
  }, []);

  useEffect(() => {
    let mounted = true;
    const sid = crypto.randomUUID();
    sessionIdRef.current = sid;

    callAgent("open", sid).then(result => {
      if (!mounted) return;
      if (result) {
        setAnalysis(result);
        if (result.urgent_action || (result.alerts?.length ?? 0) > 0) {
          setOpen(true);
        }
      }
      setLoading(false);
    });

    function handleClose() {
      if (sessionIdRef.current) {
        callAgent("close", sessionIdRef.current);
      }
    }

    window.addEventListener("beforeunload", handleClose);
    return () => {
      mounted = false;
      window.removeEventListener("beforeunload", handleClose);
      handleClose();
    };
  }, [callAgent]);

  const hasContent = analysis && (
    analysis.urgent_action ||
    (analysis.alerts?.length ?? 0) > 0 ||
    analysis.kaizen_tip ||
    analysis.recommendation
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && hasContent && (
        <div
          className="w-80 rounded-2xl shadow-2xl border overflow-hidden"
          style={{ backgroundColor: "var(--caua-amazon)", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-white/70" />
              <span className="label-caps text-white">{t.secretaryTitle}</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-0.5 rounded hover:bg-white/10">
              <X size={14} className="text-white/60" />
            </button>
          </div>

          <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
            {analysis?.urgent_action && (
              <Section
                label={t.urgentAction}
                text={analysis.urgent_action}
                accent="#ef4444"
              />
            )}
            {(analysis?.alerts?.length ?? 0) > 0 && (
              <Section
                label={t.alerts}
                text={analysis!.alerts.join("\n")}
                accent="var(--caua-mazorca)"
              />
            )}
            {analysis?.kaizen_tip && (
              <Section label={t.kaizen} text={analysis.kaizen_tip} accent="var(--caua-pod)" />
            )}
            {analysis?.recommendation && (
              <Section label={t.recommendation} text={analysis.recommendation} accent="var(--caua-criollo)" />
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
        style={{ backgroundColor: "var(--caua-amazon)" }}
        title={t.secretaryTitle}
      >
        <Shield size={20} className="text-white" />
        {loading && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
        )}
        {!loading && analysis?.urgent_action && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500" />
        )}
        {!loading && !analysis?.urgent_action && hasContent && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: "var(--caua-pod)" }} />
        )}
        <span className="absolute -bottom-0.5 -right-0.5 text-white/60">
          {open ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
        </span>
      </button>
    </div>
  );
}

function Section({ label, text, accent }: { label: string; text: string; accent: string }) {
  return (
    <div className="space-y-1">
      <p className="label-caps" style={{ color: accent }}>{label}</p>
      <p className="text-white/80 text-xs leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}
