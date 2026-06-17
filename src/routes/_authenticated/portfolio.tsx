import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../../lib/i18n";

export const Route = createFileRoute("/_authenticated/portfolio")({
  component: PortfolioPage,
});

interface Product {
  id: string;
  name: string;
  nameEs: string;
  quadrant: "star" | "cow" | "eagle" | "dog";
  effort: number;
  budget: number;
  stage: string;
  traction: string;
  tractionEs: string;
  blocker: string | null;
  blockerEs: string | null;
  color: string;
  icon: string;
}

const PRODUCTS: Product[] = [
  {
    id: "bebida",
    name: "Functional Cacao Drink (RTD)",
    nameEs: "Bebida Funcional RTD",
    quadrant: "star",
    effort: 35,
    budget: 40,
    stage: "BUILD I",
    traction: "COGS $1.05 USD/330ml (Terra Cruz validated) · Margin DTC 87% · Min batch 303u/$340 USD · Shrink label ready",
    tractionEs: "COGS $1.05 USD/330ml (Terra Cruz validado) · Margen DTC 87% · Batch mín 303u/$340 USD · Etiqueta termoencogible lista",
    blocker: "Formula not finalized · Schedule Terra Cruz slot",
    blockerEs: "Fórmula no finalizada · Agendar turno en Terra Cruz",
    color: "#87AA27",
    icon: "🍵",
  },
  {
    id: "polvo-milo",
    name: "Cacao Powder + Mucilage (Milo-style)",
    nameEs: "Polvo Cacao + Mucílago (Milo Modular)",
    quadrant: "cow",
    effort: 25,
    budget: 20,
    stage: "BASE → BUILD I",
    traction: "Ricardo's press ready · Milk modulator format · Existing cacao audience",
    tractionEs: "Prensa de Ricardo disponible · Formato modulador de leche · Audiencia cacao existente",
    blocker: null,
    blockerEs: null,
    color: "#EEA110",
    icon: "🥛",
  },
  {
    id: "nibs",
    name: "NIBS (CAÚA × Zurych × Lust)",
    nameEs: "NIBS Co-branded",
    quadrant: "eagle",
    effort: 25,
    budget: 25,
    stage: "BUILD I",
    traction: "Alimentec B2B pipeline · 3-party co-brand reduces risk · B2B cashflow fast",
    tractionEs: "Pipeline B2B Alimentec activo · Co-brand 3 partes reduce riesgo · Caja B2B rápida",
    blocker: "Toppan packaging standardization · Anexo D unsigned",
    blockerEs: "Estandarización Toppan pendiente · Anexo D sin firmar",
    color: "#881C79",
    icon: "🌿",
  },
  {
    id: "whole-food",
    name: "Whole-Food Cacao (Lucho + girones)",
    nameEs: "Cacao Entero Lucho + Girones",
    quadrant: "eagle",
    effort: 10,
    budget: 10,
    stage: "BUILD II",
    traction: "Most creative product · Guardian storytelling · Premium DTC",
    tractionEs: "Producto más creativo · Storytelling Guardian · DTC premium",
    blocker: "High resource & creativity demand — focus after RTD launch",
    blockerEs: "Alto consumo de recursos y creatividad — activar post-RTD",
    color: "#1C3B26",
    icon: "🍫",
  },
  {
    id: "fruit-drops",
    name: "Fruit Drops (freeze-dried pulp)",
    nameEs: "Fruit Drops (pulpa liofilizada)",
    quadrant: "dog",
    effort: 3,
    budget: 3,
    stage: "EXPLORE",
    traction: "Zero-waste byproduct · > 80% margin potential",
    tractionEs: "Byproduct sin costo · Margen potencial > 80%",
    blocker: "No co-packer identified yet",
    blockerEs: "Co-packer no identificado aún",
    color: "#DB5527",
    icon: "🍑",
  },
  {
    id: "cascara",
    name: "Cascara Tea (pod husk)",
    nameEs: "Tisana Cascara (cáscara del pod)",
    quadrant: "dog",
    effort: 2,
    budget: 2,
    stage: "EXPLORE",
    traction: "Zero-waste · Specialty coffee channel entry point",
    tractionEs: "Cero residuo · Entrada por canal café specialty",
    blocker: "Lowest priority — activate Q2 2026+",
    blockerEs: "Menor prioridad — activar Q2 2026+",
    color: "#5A7A32",
    icon: "🍃",
  },
];

const QUADRANTS = {
  star: {
    label: "⭐ Estrella",
    sub: "Alto crecimiento · Alta tracción",
    strategy: "Invertir agresivamente — es el motor del ARR",
    bg: "bg-green-50",
    border: "border-green-300",
    badge: "bg-green-500 text-white",
  },
  cow: {
    label: "🐄 Vaca Lechera",
    sub: "Caja rápida · Bajo riesgo",
    strategy: "Cosechar: mínima inversión, máximo flujo",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    badge: "bg-yellow-500 text-white",
  },
  eagle: {
    label: "❓ Incógnita",
    sub: "Alta oportunidad · Necesita empuje",
    strategy: "Invertir selectivamente — convertir en Estrella",
    bg: "bg-purple-50",
    border: "border-purple-300",
    badge: "bg-purple-500 text-white",
  },
  dog: {
    label: "🐕 Perro",
    sub: "Bajo crecimiento · Recurso mínimo",
    strategy: "Mantener lean — evaluar en Q3",
    bg: "bg-gray-50",
    border: "border-gray-200",
    badge: "bg-gray-400 text-white",
  },
};

const totalEffort = PRODUCTS.reduce((s, p) => s + p.effort, 0);
const totalBudget = PRODUCTS.reduce((s, p) => s + p.budget, 0);

export default function PortfolioPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isEs = lang === "es";

  const byQuadrant = (q: Product["quadrant"]) => PRODUCTS.filter(p => p.quadrant === q);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--caua-white)" }}>
      <div className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 h-14 border-b bg-white/90 backdrop-blur-sm">
        <button onClick={() => navigate({ to: "/" })} className="p-1.5 rounded hover:bg-gray-100">
          <ArrowLeft size={18} />
        </button>
        <img src="/logo-lightbg.png" alt="CAÚA" className="h-7" />
        <h1 className="font-bold text-sm" style={{ color: "var(--caua-amazon)" }}>
          {isEs ? "Portafolio · Boston Matrix" : "Portfolio · Boston Matrix"}
        </h1>
        <span className="ml-auto label-caps text-gray-400">
          {isEs ? "Esfuerzo" : "Effort"}: {totalEffort}% · {isEs ? "Presupuesto" : "Budget"}: {totalBudget}%
        </span>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-8">

        {/* Intro */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-600 leading-relaxed">
            {isEs
              ? "Cada línea de desarrollo upcycled cacao posicionada según tracción actual vs potencial de mercado. El % de esfuerzo y presupuesto refleja dónde invertir ahora para maximizar ARR."
              : "Each upcycled cacao development line positioned by current traction vs market potential. Effort and budget % reflects where to invest now to maximize ARR."}
          </p>
        </div>

        {/* 2×2 Boston Matrix visual */}
        <div className="grid grid-cols-2 gap-3">
          {(["star", "eagle", "cow", "dog"] as const).map(q => {
            const qd = QUADRANTS[q];
            const products = byQuadrant(q);
            return (
              <div key={q} className={`rounded-2xl border-2 p-4 ${qd.bg} ${qd.border}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`label-caps px-2 py-0.5 rounded-full text-xs ${qd.badge}`}>{qd.label}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{qd.sub}</p>
                <p className="text-xs font-medium text-gray-700 mb-3 italic">{qd.strategy}</p>

                {products.map(p => (
                  <div key={p.id} className="bg-white rounded-xl p-3 mb-2 shadow-sm border border-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{p.icon}</span>
                      <span className="text-xs font-bold text-gray-800 leading-tight">
                        {isEs ? p.nameEs : p.name}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="label-caps px-1.5 py-0.5 rounded text-white text-[10px]" style={{ backgroundColor: p.color }}>
                        {p.stage}
                      </span>
                      <span className="label-caps text-gray-400 text-[10px]">
                        {isEs ? "Esfuerzo" : "Effort"} {p.effort}% · {isEs ? "Budget" : "Budget"} {p.budget}%
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug mb-1">
                      ⚙️ {isEs ? p.tractionEs : p.traction}
                    </p>
                    {(isEs ? p.blockerEs : p.blocker) && (
                      <p className="text-[11px] text-red-500 leading-snug">
                        🚫 {isEs ? p.blockerEs : p.blocker}
                      </p>
                    )}
                  </div>
                ))}

                {products.length === 0 && (
                  <p className="text-xs text-gray-300 italic">{isEs ? "Sin productos aquí aún" : "No products here yet"}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Allocation bar */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="label-caps text-gray-400 mb-3">{isEs ? "Distribución de esfuerzo por línea" : "Effort distribution by line"}</p>
          <div className="space-y-2">
            {PRODUCTS.map(p => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-gray-700">{p.icon} {isEs ? p.nameEs : p.name}</span>
                  <span className="label-caps text-gray-400">{p.effort}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${p.effort}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic recommendation */}
        <div className="rounded-2xl p-5 text-white" style={{ backgroundColor: "var(--caua-amazon)" }}>
          <p className="label-caps text-white/60 mb-2">{isEs ? "Regla de inversión" : "Investment rule"}</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="font-bold mb-1">⭐ {isEs ? "Estrella · 35% esfuerzo" : "Star · 35% effort"}</p>
              <p className="text-white/70">{isEs ? "Bebida RTD — COGS $1.05 USD validado (Terra Cruz). Margen 87%. Batch mín $340 USD. Finalizar fórmula y agendar turno." : "RTD Drink — COGS $1.05 USD validated (Terra Cruz). 87% margin. Min batch $340 USD. Finalize formula and book slot."}</p>
            </div>
            <div>
              <p className="font-bold mb-1">🐄 {isEs ? "Vaca · 25% esfuerzo" : "Cow · 25% effort"}</p>
              <p className="text-white/70">{isEs ? "Polvo Milo — mínima inversión, caja rápida con prensa de Ricardo." : "Milo Powder — min investment, fast cash from Ricardo's press."}</p>
            </div>
            <div>
              <p className="font-bold mb-1">❓ {isEs ? "Incógnita · 25% esfuerzo" : "Question Mark · 25% effort"}</p>
              <p className="text-white/70">{isEs ? "NIBS: cerrar Toppan + Anexo D. Lucho whole-food: activar post-RTD." : "NIBS: close Toppan + Anexo D. Lucho whole-food: activate post-RTD."}</p>
            </div>
            <div>
              <p className="font-bold mb-1">🐕 {isEs ? "Perro · 5% esfuerzo" : "Dog · 5% effort"}</p>
              <p className="text-white/70">{isEs ? "Drops + Cascara: exploración lean, sin inversión hasta Q2." : "Drops + Cascara: lean explore, no spend until Q2."}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
