import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { useLanguage, setLangForEmail } from "../lib/i18n";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t, setLang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
    } else {
      setLangForEmail(email, setLang);
      navigate({ to: "/" });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--caua-white)" }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <img src="/logo-lightbg.png" alt="CAÚA" className="h-12 object-contain" />
        </div>

        <h1 className="text-center text-sm font-semibold text-gray-500 mb-6 label-caps">
          {t.appName}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-caps text-gray-500 block mb-1">{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--caua-pod)]"
            />
          </div>
          <div>
            <label className="label-caps text-gray-500 block mb-1">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--caua-pod)]"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60"
            style={{ backgroundColor: "var(--caua-amazon)" }}
          >
            {loading ? t.loading : isSignUp ? t.signUp : t.login}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          {isSignUp ? t.haveAccount : t.noAccount}{" "}
          <button
            className="underline font-semibold"
            style={{ color: "var(--caua-pod)" }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? t.login : t.signUp}
          </button>
        </p>
      </div>
    </div>
  );
}
