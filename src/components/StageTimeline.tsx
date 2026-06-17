import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "../lib/i18n";
import type { Stage } from "../lib/types";

export function StageTimeline({ stages }: { stages: Stage[] }) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentRef.current && containerRef.current) {
      currentRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [stages]);

  return (
    <div
      ref={containerRef}
      className="flex gap-3 overflow-x-auto px-4 md:px-8 py-4 scrollbar-none"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
    >
      {stages.map(stage => {
        const isCurrent = stage.is_current;
        const isPast = !isCurrent && stages.findIndex(s => s.is_current) > stages.indexOf(stage);

        return (
          <div
            key={stage.id}
            ref={isCurrent ? currentRef : undefined}
            className={`shrink-0 w-48 rounded-xl p-3 border transition-all ${
              isCurrent
                ? "stage-current-glow border-[var(--caua-pod)] bg-white"
                : isPast
                ? "border-gray-200 bg-gray-50 opacity-60 grayscale"
                : "border-dashed border-gray-200 bg-white/60"
            }`}
          >
            <Link to="/stage/$slug" params={{ slug: stage.slug }} className="block">
              {isCurrent && (
                <span
                  className="label-caps text-xs px-1.5 py-0.5 rounded mb-1 inline-block"
                  style={{ backgroundColor: "var(--caua-pod)", color: "white" }}
                >
                  {t.current}
                </span>
              )}
              <p className="text-xs font-semibold leading-tight mt-1" style={{ color: "var(--caua-amazon)" }}>
                {stage.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{stage.target_arr}</p>
              {stage.start_date && (
                <p className="text-[10px] text-gray-300 mt-1">
                  {new Date(stage.start_date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                </p>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
