import { useState } from "react";
import { LogOut, LayoutGrid } from "lucide-react";
import { useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";
import { useLanguage, LangToggle } from "../lib/i18n";
import { WelfareModal } from "./WelfareModal";
import type { NorthStar, Stage } from "../lib/types";

interface Props {
  northStar?: NorthStar;
  currentStage?: Stage;
}

export function NorthStarBanner({ northStar, currentStage }: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [welfareOpen, setWelfareOpen] = useState(false);

  const arr = northStar?.arr_usd ?? 0;
  const targetStr = currentStage?.target_arr ?? "$600K";
  const targetNum = parseFloat(targetStr.replace(/[^0-9.]/g, "")) * (targetStr.includes("K") ? 1000 : targetStr.includes("M") ? 1_000_000 : 1);
  const progress = targetNum > 0 ? Math.min((arr / targetNum) * 100, 100) : 0;

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  const wA = northStar?.welfare_amaury ?? 0;
  const wD = northStar?.welfare_david ?? 0;
  const welfareColor = (w: number) => w >= 7 ? "bg-green-400" : w >= 4 ? "bg-yellow-400" : "bg-red-400";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 h-[72px] flex items-center gap-4"
        style={{ backgroundColor: "var(--caua-amazon)", color: "var(--caua-white)" }}
      >
        <img src="/logo-white.png" alt="CAÚA" className="h-8 object-contain shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="label-caps text-white/60">{t.northStar}</span>
            <span className="text-sm font-bold">${arr.toLocaleString()} {t.arr}</span>
            <span className="text-white/40 text-xs">→ {targetStr}</span>
          </div>
          <div className="w-full max-w-xs h-1.5 rounded-full bg-white/20">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: "var(--caua-pod)" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setWelfareOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
            title={t.welfareCheck}
          >
            <span className="label-caps text-white/60">{t.welfare}</span>
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${welfareColor(wA)}`} title="Amaury" />
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${welfareColor(wD)}`} title="David" />
          </button>

          <div className="w-px h-6 bg-white/20" />
          <Link to="/portfolio" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Portfolio Boston Matrix">
            <LayoutGrid size={16} className="text-white/70" />
          </Link>
          <div className="w-px h-6 bg-white/20" />
          <LangToggle dark />
          <div className="w-px h-6 bg-white/20" />

          <button onClick={logout} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title={t.logout}>
            <LogOut size={16} className="text-white/70" />
          </button>
        </div>
      </header>

      <WelfareModal open={welfareOpen} onClose={() => setWelfareOpen(false)} northStar={northStar} />
    </>
  );
}
