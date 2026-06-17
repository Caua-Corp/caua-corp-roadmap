-- ============================================================
-- R&D IRONMAN SEED + MOTORES DE TRACCIÓN — CAÚA
-- 5 líneas upcycled cacao × fases Ironman × stages del roadmap
-- Motor de tracción: palanca que activa cada acción y genera loop
-- Ejecutar en: supabase.com/project/wrbipeqnwsoyfvfciejn → SQL Editor
-- ============================================================

-- 1. Departamento R&D Innovación
INSERT INTO departments (id, name, slug, owner, color, icon)
VALUES (gen_random_uuid(), 'R&D · Innovación', 'rd-innovacion', 'amaury', '#881C79', '🔬')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================

DO $$
DECLARE
  dept_id     uuid;
  stage_m0a   uuid;
  stage_m0b   uuid;
  stage_q1    uuid;
  stage_q2    uuid;
  stage_q3    uuid;
BEGIN

  SELECT id INTO dept_id FROM departments WHERE slug = 'rd-innovacion';
  SELECT id INTO stage_m0a FROM stages WHERE sort_order = 1 LIMIT 1;
  SELECT id INTO stage_m0b FROM stages WHERE sort_order = 2 LIMIT 1;
  SELECT id INTO stage_q1  FROM stages WHERE sort_order = 3 LIMIT 1;
  SELECT id INTO stage_q2  FROM stages WHERE sort_order = 4 LIMIT 1;
  SELECT id INTO stage_q3  FROM stages WHERE sort_order = 5 LIMIT 1;

  -- ================================================================
  -- LÍNEA 1 · WHOLE-FOOD CACAO (hero en mercado)
  -- Motor: Guardian storytelling → suscripción → ARR → fondo Guardian
  -- ================================================================

  INSERT INTO nodes (department_id, stage_id, title, description, status, owner, target_metric, updated_at) VALUES
  (dept_id, stage_m0a,
   '🏊 Whole-Food BASE — mapeo nuevos orígenes',
   'Validar lotes Huila/Santander/Meta para próxima cosecha Q1. COGS por origen con cada Guardián.
⚙️ Motor: Guardian storytelling → suscriptor paga por historia del origen → ARR financia cosecha → Guardian tiene ingresos garantizados → storytelling más auténtico.',
   'green', 'amaury',
   '5 lotes mapeados · COGS validado < $3.50/250g', now()),

  (dept_id, stage_m0b,
   '🚴 Whole-Food BUILD I — formato 500g + polvo',
   'Prototipo 500g (Founders tier) + polvo loose cacao ceremonial. Sensorial interno.
⚙️ Motor: Founders tier paga $199/mes → financia R&D próximo formato → nuevo formato retiene churn Founders → LTV sube → más ARR para R&D.',
   'yellow', 'amaury',
   'Batch 50u · NPS sensorial ≥ 8', now()),

  (dept_id, stage_q1,
   '🏃 Whole-Food BUILD II — batch Guardian-to-shelf',
   'Primer batch con trazabilidad completa: QR activo que lleva al perfil del Guardian. Etiqueta oficial bilingüe.
⚙️ Motor: QR de trazabilidad → unboxing viral Instagram → tráfico orgánico → nuevos suscriptores → MRR crece → más volumen → economías de escala.',
   'red', 'amaury',
   '500u · QR activo · Minsalud aprobado', now()),

  (dept_id, stage_q2,
   '⚡ Whole-Food PEAK — drop "Founding Harvest"',
   'Lote numerado, pre-order exclusivo para lista email 60 compradores + Founders tier. Escasez real (500u max).
⚙️ Motor: escasez real → urgencia → conversión alta → PR orgánico → nuevos leads → lista email crece → siguiente drop aún más grande.',
   'red', 'amaury',
   '200 pre-ordenes · agotado en 72h', now());

  -- ================================================================
  -- LÍNEA 2 · NIBS (CAÚA×Zurych×Lust — sprint activo)
  -- Motor: Alimentec leads → B2B deal → prueba → reorder → referral
  -- ================================================================

  INSERT INTO nodes (department_id, stage_id, title, description, status, owner, target_metric, updated_at) VALUES
  (dept_id, stage_m0a,
   '🏊 NIBS BASE — Alimentec pipeline activo',
   'Cerrar Anexo D (precios de transferencia). Pipeline: Salvaje, Valerio, leads de feria.
⚙️ Motor: demo Alimentec → prueba gratuita 50u → compra B2B recurrente → referral a otro retailer gourmet → escala sin costo de adquisición.',
   'yellow', 'shared',
   'Anexo D firmado · 3 deals B2B activos · 1 reorder', now()),

  (dept_id, stage_m0b,
   '🚴 NIBS BUILD I — primer batch comercial 500u',
   'Batch 500u (blanco + oscuro). Conciliar precios: $29.000 etiqueta / $20.500 DTC / $12.300 B2B. Landing co-branded live.
⚙️ Motor: canal B2B genera flujo de caja rápido → financia inventario → inventario permite DTC → DTC financia margen → margen fondea siguiente batch.',
   'red', 'shared',
   '500u producidas · precio final 3 canales aprobado', now()),

  (dept_id, stage_q1,
   '🏃 NIBS BUILD II — retail premium Bogotá (3 puntos)',
   'Entrada a 3 tiendas gourmet Bogotá. Comité de Marca aprueba punto de venta. KPI sell-through.
⚙️ Motor: retailer hace degustaciones en tienda → consumidor prueba → compra impulsiva → recompra online CAÚA → suscriptor potencial → LTV largo.',
   'red', 'shared',
   '3 retailers · sell-through ≥ 60% en 30 días', now()),

  (dept_id, stage_q2,
   '⚡ NIBS PEAK — primer envío España vía Manuel',
   'Manuel Bello como distribuidor nacional ES (no exclusivo). 100u primer envío test. Feedback mercado EU.
⚙️ Motor: España valida precio premium EU → dato de mercado real → sube precio base → mejora margen global → financia expansión Chile/México.',
   'red', 'shared',
   '100u España entregadas · precio EU validado', now());

  -- ================================================================
  -- LÍNEA 3 · BEBIDA FUNCIONAL DE CACAO
  -- *** Costos reales: subir archivo de Downloads → completar nodo BASE ***
  -- Motor: lista email 60 compradores → piloto → feedback → fórmula final
  -- ================================================================

  INSERT INTO nodes (department_id, stage_id, title, description, status, owner, target_metric, updated_at) VALUES
  (dept_id, stage_m0b,
   '🏊 Bebida BASE — COGS validado Terra Cruz ✅',
   'Co-packer: Terra Cruz. Proceso: maquila caliente ($2,500/L) + embotellado 330ml ($1,800/u incl. botella+tapa) + pasteurizado ($300/u) + cuarto frío 3d ($119/u). Ingredientes: cacao 15g/u ($750) + etiqueta termoencogible ($400) + mucílago/agua ($200). COGS REAL: $4,394 COP/u = $1.05 USD/u 330ml. Batch mínimo: 100L → 303 botellas → inversión: ~$340 USD. Margen DTC @$8USD: 87%.
⚙️ Motor: COGS $1.05 → precio DTC $8-12 con 87% margen → margen financia batch siguiente → escala reduce COGS a <$0.90 → pricing power vs competencia.',
   'green', 'amaury',
   'COGS: $1.05 USD/u ✅ · Margen DTC 87% · Batch mín: 303u/$340 USD', now()),

  (dept_id, stage_q1,
   '🚴 Bebida BUILD I — 3 prototipos + panel sensorial',
   'Fórmula A: cacao+agua, clean label. Fórmula B: cacao+leche avena. Fórmula C: cacao+ashwagandha+MCT. Panel 10 personas (biohackers/atletas Austin profile).
⚙️ Motor: panel sensorial gratuito → feedback en 1 sesión → descarta 2 fórmulas → acelera go-to-market → reduce costo de pivote → lanzamiento más rápido.',
   'red', 'amaury',
   '3 fórmulas · NPS ≥ 7 en 1 · ganadora seleccionada', now()),

  (dept_id, stage_q2,
   '🏃 Bebida BUILD II — batch 200u + certifications',
   'Co-packer certificado. Batch 200u. Vida útil 30 días mín. Declaración nutricional, INVIMA/FDA considerations.
⚙️ Motor: certificación → B2B horeca acepta producto → volumen B2B subsidia costo unitario DTC → DTC viable → suscripción mensual bebida = ARR recurrente.',
   'red', 'amaury',
   '200u · shelf-life 30d · Minsalud OK · co-packer firmado', now()),

  (dept_id, stage_q3,
   '⚡ Bebida PEAK — piloto DTC + 3 cuentas horeca Austin',
   'Lanzamiento: 500u a lista email + 3 cafés/hoteles Austin. Precio DTC $8-12. A/B test packaging.
⚙️ Motor: horeca muestra la bebida a huéspedes → QR en mesa → suscripción DTC → retención mensual → ARR bebida se suma al ARR barras → valuación compañía sube.',
   'red', 'amaury',
   '500u vendidas en 30 días · 1 cuenta horeca recurrente', now());

  -- ================================================================
  -- LÍNEA 4 · FRUIT DROPS (freeze-dried pulpa cacao)
  -- Motor: bundle Founders → retención → word-of-mouth → nuevos Founders
  -- ================================================================

  INSERT INTO nodes (department_id, stage_id, title, description, status, owner, target_metric, updated_at) VALUES
  (dept_id, stage_q1,
   '🏊 Fruit Drops BASE — co-packer liofilizador Colombia',
   'Identificar co-packer con liofilizador. COGS pulpa liofilizada/kg. Probar: pulpa natural vs fermentada. Benchmark: Pacari (Ecuador), Crio Bru (USA).
⚙️ Motor: pulpa liofilizada es byproduct del proceso de fermentación → cero waste → costo marginal bajo → margen > 80% → financia R&D sin inversión adicional.',
   'red', 'amaury',
   '1 co-packer · COGS < $8/kg · muestra lab', now()),

  (dept_id, stage_q2,
   '🚴 Fruit Drops BUILD I — prototipo bolsa kraft 50g',
   'Batch 100u bolsa kraft 50g. Sensorial: acidez, dulzor, crunch. Comparar vs Pacari. Foto product-grade para DTC.
⚙️ Motor: producto visualmente viral (color + textura) → UGC orgánico → reach gratuito → nuevos leads → suscriptores Ritual agregan drops → cross-sell eleva LTV.',
   'red', 'amaury',
   '100u · diferenciación vs competencia clara · foto DTC', now()),

  (dept_id, stage_q3,
   '🏃 Fruit Drops BUILD II — bundle sorpresa Founders tier',
   'Incluir Fruit Drops como item sorpresa en caja Founders Q3. Medir churn ese mes vs mes anterior.
⚙️ Motor: sorpresa → deleite → UGC Instagram stories → alcance orgánico → nuevos Founders ingresan → cada nuevo Founders = $199/mes → ARR escala sin CAC.',
   'red', 'amaury',
   'Churn Founders < 1% · NPS del drop ≥ 9', now());

  -- ================================================================
  -- LÍNEA 5 · CASCARA (tisana de cáscara de cacao)
  -- Motor: zero-waste storytelling → premium retail → margen alto
  -- ================================================================

  INSERT INTO nodes (department_id, stage_id, title, description, status, owner, target_metric, updated_at) VALUES
  (dept_id, stage_q2,
   '🏊 Cascara BASE — protocolo secado + infusión',
   'Proceso: cosecha pods → secado solar 7 días → tostado suave 120°C 15min → empaque loose-leaf. COGS desde finca con Guardian.
⚙️ Motor: cáscara antes era descarte → CAÚA la convierte en producto premium → cero costo de materia prima → margen > 90% → prueba de modelo circular completo → PR ambiental.',
   'red', 'amaury',
   'Protocolo documentado · COGS < $0.50/15g · muestra', now()),

  (dept_id, stage_q3,
   '🚴 Cascara BUILD I — batch 100 bolsas + sensorial',
   'Batch 100 bolsas 15g. Infusión 85°C / 5 min. Perfil de sabor (frutal-ácido-herbal). Comparar vs cacao ceremonial. Foto y vídeo ritual.
⚙️ Motor: tisana = ritual matutino alternativo al café → posiciona vs café specialty → precio comparable ($15-25/bolsa) → suscriptores intercambian café por Cascara → retención alta.',
   'red', 'amaury',
   '100u · NPS ≥ 7 · diferenciación vs té/café documentada', now());

  -- ================================================================
  -- Updates de apertura para cada nodo R&D
  -- ================================================================

  INSERT INTO node_updates (node_id, status, note, created_by, created_at)
  SELECT n.id, n.status,
    '🛡 SA-GUARDIAN · Hito R&D creado — Estructura Ironman activa. ' ||
    CASE
      WHEN n.title LIKE '%Whole-Food%BASE%' THEN 'Guardianes Pentámera confirmados: Lucho (Huila), Ricardo (Santander), Fernando (Meta), Marta (Arauca), Rafael (Cundinamarca). COGS actual validado: $3.18/250g en lote 312kg.'
      WHEN n.title LIKE '%Whole-Food%BUILD I%' THEN 'Formato 500g pensado para tier Founders ($199). Polvo ceremonial abre canal horeca (baristas specialty). Iniciar prototipado M0 Sprint 3-4.'
      WHEN n.title LIKE '%Whole-Food%BUILD II%' THEN 'QR de trazabilidad = diferenciador competitivo principal en USA. Consumidor paga premium por historia real del Guardian. Prioridad Q1.'
      WHEN n.title LIKE '%Whole-Food%PEAK%' THEN 'Drop numerado activa FOMO real. Lista de 60 compradores es el activo más valioso para piloto. Preparar email sequence 5 días antes del drop.'
      WHEN n.title LIKE '%NIBS%BASE%' THEN 'Pipeline Alimentec activo. Bloqueo principal: Anexo D sin firma = sin precio de transferencia = sin producción. Desbloquear ANTES de cualquier otro paso NIBS.'
      WHEN n.title LIKE '%NIBS%BUILD I%' THEN 'Conciliar precios es urgente. Discrepancia $29k vs $20.5k puede destruir canal B2B o DTC. Comité de Marca debe decidir en 1 sesión.'
      WHEN n.title LIKE '%NIBS%BUILD II%' THEN '3 retailers Bogotá = validación de mercado real antes de escalar. Priorizar tiendas con clientela fit: Bioplaza, Almacén Naturista, Juan Valdez gourmet.'
      WHEN n.title LIKE '%NIBS%PEAK%' THEN 'España: Manuel Bello listo. Primer envío test 100u permite validar precio EU y feedback antes de compromiso mayor.'
      WHEN n.title LIKE '%Bebida%BASE%' THEN '✅ COGS VALIDADO con cotización Terra Cruz (jun-2026). COGS real: $4,394 COP/u = $1.05 USD/botella 330ml. Margen DTC @$8: 87%. Inversión mínima: 100L / 303u / ~$340 USD. Co-packer: Terra Cruz — maquila caliente + embotellado + pasteurizado. Empaque termoencogible ya disponible. PRÓXIMO PASO: confirmar fórmula base y agendar turno con Terra Cruz.'
      WHEN n.title LIKE '%Bebida%BUILD I%' THEN 'Panel sensorial: proponer a 10 personas del perfil Austin (fundadores, atletas, biohackers). Slack/WhatsApp CAÚA community primero.'
      WHEN n.title LIKE '%Bebida%BUILD II%' THEN 'Co-packer: explorar Colombina (tiene línea funcional), Postobón (RTD), o co-packers locales en Bogotá/Medellín con certificación INVIMA.'
      WHEN n.title LIKE '%Bebida%PEAK%' THEN 'Austin B2B horeca: contactar hoteles Proper, Jo''s Coffee, Greater Goods. Pitch: "primera bebida de cacao funcional RTD con trazabilidad Guardian".'
      WHEN n.title LIKE '%Fruit Drops%BASE%' THEN 'Pulpa de cacao es byproduct del proceso de fermentación de los Guardianes. Costo marginal casi cero. Alta prioridad por margen potencial > 80%.'
      WHEN n.title LIKE '%Fruit Drops%BUILD I%' THEN 'Foto del producto es crítica para DTC. Contratar fotógrafo producto en Bogotá O usar contenido de Alimentec como referencia.'
      WHEN n.title LIKE '%Fruit Drops%BUILD II%' THEN 'Bundle sorpresa = táctica de retención de alto impacto. Documentar experiencia con fotos para próximo sprint de contenido.'
      WHEN n.title LIKE '%Cascara%BASE%' THEN 'Zero waste = narrativa poderosa para prensa y retail sostenible. Potencial de cobertura en medios especializados (Food Navigator, Specialty Coffee).'
      WHEN n.title LIKE '%Cascara%BUILD I%' THEN 'Mercado cascara/cascara de café está creciendo. Barismo specialty ya conoce el concepto. Entrada natural por canal café specialty Austin.'
      ELSE 'Hito iniciado.'
    END,
    'sa-guardian@cauaculture.co',
    now()
  FROM nodes n
  WHERE n.department_id = dept_id;

END $$;
