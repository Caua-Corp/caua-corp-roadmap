import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "en" | "es";

const T = {
  en: {
    appName: "CAÚA Strategy Hub",
    login: "Log in",
    email: "Email",
    password: "Password",
    signUp: "Sign up",
    noAccount: "No account?",
    haveAccount: "Have an account?",
    dashboard: "Dashboard",
    northStar: "North Star",
    arr: "ARR",
    mrr: "MRR",
    subscribers: "Subscribers",
    inventory: "Inventory",
    welfare: "Welfare",
    stage: "Stage",
    current: "NOW",
    past: "Past",
    future: "Future",
    update: "Update",
    status: "Status",
    note: "Note",
    save: "Save",
    done: "Mark Done",
    history: "Update history",
    noUpdates: "No updates yet.",
    target: "Target metric",
    logout: "Log out",
    welfareCheck: "Welfare check",
    mood: "Mood (1-10)",
    financial: "Financial status",
    financialOpts: ["Stable", "Tight", "Crisis"],
    notes: "Notes",
    submit: "Submit",
    secretaryTitle: "SA-GUARDIAN",
    alerts: "Alerts",
    kaizen: "Kaizen tip",
    recommendation: "Recommendation",
    urgentAction: "Urgent",
    analyzing: "Analyzing session…",
    sessionOpen: "Session opened",
    sessionClose: "Session closed",
    loading: "Loading…",
    error: "Error",
    saved: "Saved",
    en: "EN",
    es: "ES",
  },
  es: {
    appName: "CAÚA Strategy Hub",
    login: "Ingresar",
    email: "Correo",
    password: "Contraseña",
    signUp: "Registrarse",
    noAccount: "¿Sin cuenta?",
    haveAccount: "¿Ya tienes cuenta?",
    dashboard: "Panel",
    northStar: "North Star",
    arr: "ARR",
    mrr: "MRR",
    subscribers: "Suscriptores",
    inventory: "Inventario",
    welfare: "Bienestar",
    stage: "Stage",
    current: "AHORA",
    past: "Pasado",
    future: "Futuro",
    update: "Actualizar",
    status: "Estado",
    note: "Nota",
    save: "Guardar",
    done: "Completar ✓",
    history: "Historial de updates",
    noUpdates: "Sin updates aún.",
    target: "Métrica objetivo",
    logout: "Cerrar sesión",
    welfareCheck: "Check de bienestar",
    mood: "Ánimo (1-10)",
    financial: "Estado financiero",
    financialOpts: ["Estable", "Ajustado", "Crisis"],
    notes: "Notas",
    submit: "Enviar",
    secretaryTitle: "SA-GUARDIAN",
    alerts: "Alertas",
    kaizen: "Tip kaizen",
    recommendation: "Recomendación",
    urgentAction: "Urgente",
    analyzing: "Analizando sesión…",
    sessionOpen: "Sesión abierta",
    sessionClose: "Sesión cerrada",
    loading: "Cargando…",
    error: "Error",
    saved: "Guardado",
    en: "EN",
    es: "ES",
  },
} as const;

type Translations = typeof T.en;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: T.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("caualang");
    return (stored === "es" || stored === "en") ? stored : "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("caualang", l);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: T[lang] as Translations }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LangContext);
}

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLanguage();
  const base = dark
    ? "text-xs font-bold px-2 py-0.5 rounded transition-colors"
    : "text-xs font-bold px-2 py-0.5 rounded transition-colors";
  const active = dark ? "bg-white/20 text-white" : "bg-caua-amazon text-white";
  const inactive = dark ? "text-white/60 hover:text-white" : "text-caua-amazon/60 hover:text-caua-amazon";
  return (
    <div className="flex gap-1">
      <button className={`${base} ${lang === "en" ? active : inactive}`} onClick={() => setLang("en")}>EN</button>
      <button className={`${base} ${lang === "es" ? active : inactive}`} onClick={() => setLang("es")}>ES</button>
    </div>
  );
}

export function setLangForEmail(email: string, setLang: (l: Lang) => void) {
  if (email.includes("amaury") || email.includes("cauaculture.co") || email.includes("cauacolombia.co")) {
    setLang("es");
  } else {
    setLang("en");
  }
}
