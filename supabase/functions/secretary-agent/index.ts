import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const authHeader = req.headers.get("Authorization");
  const { data: { user } } = await supabase.auth.getUser(authHeader?.replace("Bearer ", "") ?? "");
  if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const { session_type = "open", session_id } = await req.json().catch(() => ({}));

  // Fetch previous close summary for context continuity
  const { data: lastClose } = await supabase
    .from("secretary_sessions")
    .select("analysis")
    .eq("user_id", user.id)
    .eq("session_type", "close")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const previousSummary = lastClose?.analysis?.summary as string | undefined;

  // Gather current state
  const [nodesRes, updatesRes, metricsRes, stagesRes] = await Promise.all([
    supabase.from("nodes").select("title, status, updated_at, owner").order("updated_at", { ascending: false }).limit(30),
    supabase.from("node_updates").select("note, status, created_at, created_by").order("created_at", { ascending: false }).limit(20),
    supabase.from("north_star_metrics").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("stages").select("name, is_current, target_arr").eq("is_current", true).maybeSingle(),
  ]);

  const nodes = nodesRes.data ?? [];
  const updates = updatesRes.data ?? [];
  const metrics = metricsRes.data;
  const currentStage = stagesRes.data;

  const redNodes = nodes.filter((n: { status: string }) => n.status === "red").map((n: { title: string }) => n.title);
  const recentNotes = updates.slice(0, 5).map((u: { note: string | null; created_by: string | null }) => `${u.created_by?.split("@")[0] ?? "?"}: ${u.note ?? "(no note)"}`);

  const systemPrompt = session_type === "open"
    ? `You are SA-GUARDIAN, welfare and execution secretary for CAÚA — a Colombian cacao culture company. You monitor two co-founders: Amaury (CTO, technical lead) and David (CEO, brand/DTC).

CAÚA North Star: ARR growth toward $600K by end 2026 → IPO NASDAQ 2034 at $800M-$1.5B.
Current stage: ${currentStage?.name ?? "M0"} (target: ${currentStage?.target_arr ?? "unknown"}).
Current ARR: $${metrics?.arr_usd ?? 0} | MRR: $${metrics?.mrr_usd ?? 0} | Subscribers: ${metrics?.active_subscribers ?? 0} | Inventory Austin: ${metrics?.units_inventory ?? 0}u.
Welfare Amaury: ${metrics?.welfare_amaury ?? "unknown"}/10 | Welfare David: ${metrics?.welfare_david ?? "unknown"}/10.

PREVIOUS SESSION SUMMARY:
${previousSummary ?? "No previous session. First analysis."}

Blocked nodes (RED): ${redNodes.length > 0 ? redNodes.join(", ") : "none"}.
Recent activity: ${recentNotes.length > 0 ? recentNotes.join("; ") : "none"}.

Generate a SESSION OPEN brief for the user: what they left off, what needs attention today, and one kaizen improvement tip. Be direct, warm but professional. Respond in the language of the user (${user.email?.includes("amaury") ? "Spanish" : "English"}).`
    : `You are SA-GUARDIAN closing a session for ${user.email?.split("@")[0]}.

Current state:
- ARR: $${metrics?.arr_usd ?? 0} | MRR: $${metrics?.mrr_usd ?? 0}
- Welfare A: ${metrics?.welfare_amaury ?? "?"}/10 · D: ${metrics?.welfare_david ?? "?"}/10
- Blocked: ${redNodes.join(", ") || "none"}
- Recent updates: ${recentNotes.join("; ") || "none"}

Write a CLOSE SUMMARY (2-3 sentences max) capturing: what was accomplished, what is still open, and one thing to prioritize next session. This will be injected as context at the next session open. Respond in ${user.email?.includes("amaury") ? "Spanish" : "English"}.`;

  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not set" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: "user", content: `Generate analysis for session_type="${session_type}". Return JSON with keys: urgent_action (string|null), alerts (string[]), kaizen_tip (string|null), recommendation (string|null), summary (string — one paragraph session summary for continuity).` }],
    }),
  });

  if (!aiRes.ok) {
    const errText = await aiRes.text();
    return new Response(JSON.stringify({ error: errText }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const aiData = await aiRes.json();
  const rawText = aiData.content?.[0]?.text ?? "{}";

  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = { recommendation: rawText, alerts: [], urgent_action: null, kaizen_tip: null, summary: rawText };
  }

  // Save session record
  await supabase.from("secretary_sessions").insert({
    user_id: user.id,
    session_type,
    session_id: session_id ?? null,
    analysis: parsed,
    created_at: new Date().toISOString(),
  });

  return new Response(JSON.stringify(parsed), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
