// App State & Data Mock
const state = {
  currentView: 'dashboard'
};

// Chart instance registry — prevents accumulating requestAnimationFrame loops
const chartInstances = {};

// Company Bio Scanner — selected scrape language
let scanLanguage = 'en';
let lastScannedDomain = null;

// LeadMiner pre-loaded for demo
let leadsRevealed = false;
let _originalLeadsData = null; // backup of the original leads

// ══════════════════════════════════════════════════
//  SINGLE SOURCE OF TRUTH — All modules read from here
// ══════════════════════════════════════════════════
const leadsData = [
  {
    name: 'John Mitchell',       org: 'Acme Corp',              title: 'VP of Sales · Enterprise Tech',   dur: 'Since Feb 2026',
    email: 'j.mitchell@acmecorp.com',            city: 'San Francisco, CA',
    mailSent: true,  liSent: true,
    icpScore: 95, closingProb: 88, channel: 'Email',
    signal: 'Requested pricing for 500-seat deployment — meeting booked Apr 22',
    status: 'hot'
  },
  {
    name: 'Sarah Chen',          org: 'Globex Industries',      title: 'Chief Revenue Officer',           dur: 'Since Jan 2026',
    email: 's.chen@globex.io',                   city: 'New York, NY',
    mailSent: true,  liSent: true,
    icpScore: 92, closingProb: 81, channel: 'LinkedIn',
    signal: 'Downloaded ROI whitepaper + attended last 2 product webinars',
    status: 'hot'
  },
  {
    name: 'Michael Rodriguez',   org: 'Initech Solutions',      title: 'Head of Operations',              dur: 'Since Mar 2026',
    email: 'm.rodriguez@initech.com',            city: 'Austin, TX',
    mailSent: true,  liSent: true,
    icpScore: 90, closingProb: 76, channel: 'Email',
    signal: 'Replied to first outreach — scheduling discovery call this week',
    status: 'hot'
  },
  {
    name: 'Emma Thompson',       org: 'Stark Enterprises',      title: 'Director of Procurement',         dur: 'Since Feb 2026',
    email: 'e.thompson@stark.co',                city: 'London, UK',
    mailSent: true,  liSent: false,
    icpScore: 87, closingProb: 69, channel: 'Email',
    signal: 'Comparing 3 vendors — requested case studies for similar-size orgs',
    status: 'active'
  },
  {
    name: 'David Kumar',         org: 'Wayne Holdings',         title: 'VP Strategic Partnerships',       dur: 'Since Feb 2026',
    email: 'd.kumar@wayneholdings.com',          city: 'Chicago, IL',
    mailSent: true,  liSent: true,
    icpScore: 85, closingProb: 64, channel: 'LinkedIn',
    signal: 'Referred by existing customer — warm intro made via CEO',
    status: 'active'
  },
  {
    name: 'Laura Fernandez',     org: 'Umbrella Inc',           title: 'Head of Growth',                  dur: 'Since Mar 2026',
    email: 'l.fernandez@umbrella-inc.com',       city: 'Madrid, ES',
    mailSent: true,  liSent: false,
    icpScore: 83, closingProb: 58, channel: 'Email',
    signal: 'High engagement on product pages — visited pricing 4 times',
    status: 'active'
  },
  {
    name: 'Robert Klein',        org: 'Hooli Technologies',     title: 'SVP Business Development',        dur: 'Since Jan 2026',
    email: 'r.klein@hooli.tech',                 city: 'Seattle, WA',
    mailSent: false, liSent: true,
    icpScore: 80, closingProb: 52, channel: 'WhatsApp',
    signal: 'Inbound lead from SDR outreach — requested technical deep-dive',
    status: 'active'
  },
  {
    name: 'Akira Tanaka',        org: 'Massive Dynamic',        title: 'Director of Innovation',          dur: 'Since Feb 2026',
    email: 'a.tanaka@massivedynamic.jp',         city: 'Tokyo, JP',
    mailSent: true,  liSent: false,
    icpScore: 78, closingProb: 46, channel: 'Email',
    signal: 'APAC expansion project — evaluating vendors for Q3 rollout',
    status: 'in-sequence'
  },
  {
    name: 'Isabella Moretti',    org: 'Pied Piper Software',    title: 'Head of Customer Success',        dur: 'Since Mar 2026',
    email: 'i.moretti@piedpiper.io',             city: 'Milan, IT',
    mailSent: true,  liSent: false,
    icpScore: 75, closingProb: 42, channel: 'Email',
    signal: 'Signed up for free trial — used product 12 times in 7 days',
    status: 'in-sequence'
  },
  {
    name: 'James O\'Brien',       org: 'Oscorp Industries',      title: 'VP of Finance',                   dur: 'Since Feb 2026',
    email: 'j.obrien@oscorp.com',                city: 'Dublin, IE',
    mailSent: true,  liSent: true,
    icpScore: 73, closingProb: 38, channel: 'LinkedIn',
    signal: 'Budget approval pending Q2 board review — champion identified',
    status: 'in-sequence'
  },
  {
    name: 'Sofia Petrov',        org: 'Cyberdyne Systems',      title: 'CTO',                             dur: 'Since Mar 2026',
    email: 's.petrov@cyberdyne.tech',            city: 'Berlin, DE',
    mailSent: false, liSent: false,
    icpScore: 70, closingProb: 33, channel: 'Email',
    signal: 'Technical evaluation in progress — needs integration docs',
    status: 'in-sequence'
  },
  {
    name: 'Marcus Webb',         org: 'Vandelay Industries',    title: 'Head of Procurement',             dur: 'Since Dec 2025',
    email: 'm.webb@vandelay.com',                city: 'Toronto, CA',
    mailSent: true,  liSent: false,
    icpScore: 68, closingProb: 28, channel: 'Email',
    signal: 'No activity for 38 days — was in final vendor selection',
    status: 'dormant'
  },
  {
    name: 'Priya Nair',          org: 'Dunder Mifflin Corp',    title: 'Regional Director',               dur: 'Since Nov 2025',
    email: 'p.nair@dundermifflin.com',           city: 'Mumbai, IN',
    mailSent: false, liSent: true,
    icpScore: 64, closingProb: 22, channel: 'LinkedIn',
    signal: 'No activity for 52 days — pilot paused after budget cut',
    status: 'dormant'
  },
  {
    name: 'Thomas Anderson',     org: 'Nakatomi Trading',       title: 'Director of Sales Ops',           dur: 'Since Oct 2025',
    email: 't.anderson@nakatomi.co',             city: 'Los Angeles, CA',
    mailSent: true,  liSent: false,
    icpScore: 60, closingProb: 17, channel: 'Email',
    signal: 'No activity for 65 days — interest paused after reorg',
    status: 'dormant'
  },
];

// Save original leads so they can be restored after cache contamination
_originalLeadsData = leadsData.map(l => ({ ...l }));

// ══════════════════════════════════════════════════
//  MARKETING PILOT — Company Branding Kit state
//  Editable at runtime; every Marketing Pilot agent reads from here
// ══════════════════════════════════════════════════
const brandKitData = {
  name: 'Arqui',
  industry: 'PropTech · Real Estate Operating System · B2B & B2C',
  tagline: 'Del caos al control profesional.',
  mission: 'Transformamos el caos operativo del real estate en control profesional mediante una plataforma única que conecta constructoras, inversores, compradores, residentes y administradores. Centralizamos la información dispersa entre Excel, WhatsApp y correos, eliminando la incertidumbre que cuesta márgenes, confianza y tiempo.',
  palette: [
    { hex: '#20316D', name: 'Blue Lebane',        role: 'Primary' },
    { hex: '#111827', name: 'Graphite',           role: 'Text / Dark' },
    { hex: '#BFC7E1', name: 'Soft Lavender Blue', role: 'Accent' },
    { hex: '#10B981', name: 'Emerald',            role: 'Success' },
    { hex: '#F59E0B', name: 'Amber',              role: 'Warning' },
    { hex: '#FBFBFE', name: 'White Off',          role: 'Background' },
  ],
  typography: {
    heading: 'Plus Jakarta Sans',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
  values: [
    { title: 'Experto sin ser condescendiente', desc: 'Dominamos el sector pero empoderamos al usuario. Hablamos como colega que ya resolvió el problema, no como vendedor genérico de software.', color: '#20316D' },
    { title: 'Empático con el caos',            desc: 'Validamos la frustración antes de ofrecer la solución. Sabemos que consolidar 10 obras en Excel no es falta de disciplina — es la realidad del sector.', color: '#BFC7E1' },
    { title: 'Tecnológico pero accesible',      desc: 'La IA hace el trabajo pesado. El usuario no la ve — ve sus resultados. Resultado siempre por encima de tecnología.', color: '#9499A1' },
  ],
  personas: [
    { code: 'P1', role: 'Director de Constructora',           label: 'Primary buyer',                      size: '5–50 obras simultáneas · 50–500 empleados',          pains: 'Información dispersa entre Excel y WhatsApp, desvíos de presupuesto detectados post-cierre, sin visibilidad financiera real-time de obras activas',                                       triggers: 'Crecimiento de cartera de obras, sobrecosto crítico en proyecto reciente, presión de inversores por reportes verificables' },
    { code: 'P2', role: 'Gerente de Operaciones',             label: 'Power user · champion interno',      size: 'PMO de constructora · 5–20 obras bajo gestión',      pains: 'Coordinar contratistas por WhatsApp, perseguir actas y certificados, consolidar avance de 5+ obras manualmente cada cierre de mes',                                                  triggers: 'Cierre de mes caótico, contratista frenado por falta de info, pedido del director de un dashboard único' },
    { code: 'P3', role: 'Inversor Institucional Real Estate', label: 'Decision maker financiero (Capital)',size: 'Family offices · fondos · inversores HNW retail',    pains: 'Reportes manuales no verificables, fe en el desarrollador como único respaldo, sin trazabilidad peso-a-peso del proyecto',                                                                triggers: 'Due diligence de nuevo proyecto, búsqueda de TIR ajustada al riesgo, exigencia de transparencia post-crisis del sector' },
    { code: 'P4', role: 'Comprador en Pozo',                  label: 'End user emocional (State)',         size: 'Joven profesional · primer/segundo inmueble',         pains: 'Ansiedad del pozo: pagar sin ver avance, depender de renders y promesas, no saber si la obra sigue en cronograma',                                                                       triggers: 'Reserva de unidad nueva, retraso en entrega esperada, búsqueda de transparencia post-Vicentín/casos públicos' },
    { code: 'P5', role: 'Residente de Edificio',              label: 'Community user (Home)',              size: 'Edificio de 20–200 unidades',                         pains: 'No conocer a vecinos, expensas opacas, reservar amenities por WhatsApp del encargado, mantenimiento sin trazabilidad',                                                                  triggers: 'Mudanza a edificio nuevo, conflicto vecinal, expensas que aumentan sin explicación' },
    { code: 'P6', role: 'Administrador de Consorcio',         label: 'Operational buyer (PM)',             size: '1–10 edificios bajo administración',                  pains: 'Coordinar reclamos por WhatsApp, papeles físicos, asambleas con baja participación, expensas atrasadas perseguidas a mano',                                                              triggers: 'Sumar nuevo edificio a la cartera, reclamo masivo no resuelto, exigencia del consorcio de digitalización' },
  ],
  competitors: [
    { name: 'Procore',                     positioning: 'All-in-one construction management — "estándar de la industria"', tier: 'Premium', diff: '$9B+ valuación · 1M+ usuarios · ecosystem global pero genérico, no LATAM, sin componente inversor/residente' },
    { name: 'Autodesk Construction Cloud', positioning: 'BIM + construction handoff (CAD-native)',                          tier: 'Premium', diff: '40+ años en CAD · fortaleza técnica BIM · débil en finanzas, comunidad y módulos no-construcción' },
    { name: 'CMiC',                        positioning: 'ERP financiero para grandes constructoras',                        tier: 'Premium', diff: 'Single database (50 años) · fuerte en CFO · pesado, lento de implementar, sin LATAM ni mobile-first' },
    { name: 'Lebane',                      positioning: 'AI-native PropTech LATAM con WhatsApp',                            tier: 'Mid',     diff: 'Único competidor regional con IA + WhatsApp · $4M funding · enfoque solo en gestión, no es ecosistema completo' },
  ],
  channels: [
    { name: 'LinkedIn',           icon: 'linkedin',       color: '#0A66C2', handle: '@arqui',           audience: 'Constructoras + inversores institucionales · canal #1 B2B (Build · Capital · PM)' },
    { name: 'Instagram',          icon: 'instagram',      color: '#E4405F', handle: '@arqui.app',       audience: 'Compradores en pozo + residentes · canal visual (State · Home)' },
    { name: 'WhatsApp Business',  icon: 'message-circle', color: '#25D366', handle: '+54 9 11 ...',     audience: 'Operativo + outbound LATAM (Build · PM · leads regionales)' },
    { name: 'Email / Newsletter', icon: 'mail',           color: '#F59E0B', handle: 'hola@arqui.app',   audience: 'Nurturing post-demo + thought leadership ecosistema' },
  ],
  toneByChannel: [
    { channel: 'LinkedIn',  tone: 'Competente · directo · thought-leadership',  formality: 'Mid-formal', formalityColor: '#FEF3C7,#B45309', pattern: 'Power phrases del ecosistema. Posts founder POV. "La infraestructura digital del real estate". Voseo siempre. Cero corporate blah.' },
    { channel: 'Instagram', tone: 'Aspiracional · visual · cálido',             formality: 'Casual',     formalityColor: '#D1FAE5,#065F46', pattern: 'Reels de obra real, no renders. Comunidad. "No renders. Obra real." Carrusel educativo de pozo. Voseo + emojis sutiles.' },
    { channel: 'WhatsApp',  tone: 'Operativo · ultra directo · empático',       formality: 'Casual',     formalityColor: '#D1FAE5,#065F46', pattern: 'Mensajes cortos. Personalización con nombre propio ("Hola Martín"). 1 dolor + 1 resultado + 1 pregunta. Sin corporate blah.' },
    { channel: 'Email',     tone: 'Newsletter-style · crisp · personal',        formality: 'Mid-formal', formalityColor: '#FEF3C7,#B45309', pattern: 'Asuntos en pregunta ("¿Cuánto tiempo tardás en…?"). Cold email ≤ 150 palabras. Voseo. 3 secciones max en newsletter.' },
  ],
  samples: [
    { title: '"Del caos al control profesional." — Hero ecosistema',                channel: 'LinkedIn',  channelColor: '#EFF6FF,#1D4ED8', perf: 'Power phrase #1',     voiceFit: 98 },
    { title: '"No renders. Obra real." — Arqui State',                              channel: 'Instagram', channelColor: '#FCE7F3,#9D174D', perf: 'Power phrase',        voiceFit: 96 },
    { title: '"Tu rentabilidad no puede esperar al cierre del mes." — Arqui Build', channel: 'Email',     channelColor: '#FEF3C7,#B45309', perf: 'Cold outbound',       voiceFit: 95 },
    { title: '"Por primera vez, el pozo no es un acto de fe." — Capital · State',   channel: 'LinkedIn',  channelColor: '#EFF6FF,#1D4ED8', perf: 'Thought leadership',  voiceFit: 94 },
    { title: '"Menos llamadas, menos papel. Todo en un lugar." — Arqui PM',         channel: 'LinkedIn',  channelColor: '#EFF6FF,#1D4ED8', perf: 'Cold outreach Carlos',voiceFit: 92 },
    { title: '"Optimizá tus flujos operativos con IA predictiva" (anti-ejemplo)',   channel: 'Blog',      channelColor: '#F3F4F6,#374151', perf: 'Corporate blah · prohibido', voiceFit: 12 },
  ],
};

// Preset color palettes the user can pick in one click
const brandPresets = [
  { name: 'Indigo Dev',  palette: ['#6366F1','#0F172A','#F59E0B','#10B981','#EF4444','#F8FAFC'] },
  { name: 'Neo Mint',    palette: ['#059669','#064E3B','#FBBF24','#14B8A6','#DC2626','#F0FDFA'] },
  { name: 'Sunset B2C',  palette: ['#F97316','#7C2D12','#FACC15','#EC4899','#DC2626','#FFF7ED'] },
  { name: 'Nordic Cool', palette: ['#0EA5E9','#0C4A6E','#A78BFA','#22D3EE','#F43F5E','#F0F9FF'] },
  { name: 'Monochrome+', palette: ['#18181B','#52525B','#EAB308','#71717A','#DC2626','#FAFAFA'] },
  { name: 'Rose Luxury', palette: ['#BE185D','#500724','#FBBF24','#F43F5E','#DC2626','#FFF1F2'] },
  { name: 'Forest Trust',palette: ['#166534','#14532D','#CA8A04','#22C55E','#DC2626','#F0FDF4'] },
  { name: 'Tech Noir',   palette: ['#A855F7','#0F0F17','#22D3EE','#EC4899','#F43F5E','#111827'] },
];

const paletteRoles = ['Primary', 'Text / Dark', 'Accent', 'Success', 'Warning', 'Background'];

// Apply a preset palette to brandKitData and re-render
function applyBrandPreset(idx) {
  const preset = brandPresets[idx];
  if (!preset) return;
  brandKitData.palette = preset.palette.map((hex, i) => ({
    hex,
    name: hex.toUpperCase(),
    role: paletteRoles[i] || '—',
  }));
  switchView(state.currentView);
}

// Update a single palette color (from native color picker)
function updatePaletteColor(idx, hex) {
  if (brandKitData.palette[idx]) {
    brandKitData.palette[idx].hex = hex;
    brandKitData.palette[idx].name = hex.toUpperCase();
    // Update the swatch in-place without full re-render so focus stays on picker
    const swatch = document.getElementById('bk-swatch-' + idx);
    const hexLabel = document.getElementById('bk-hex-' + idx);
    if (swatch) swatch.style.background = hex;
    if (hexLabel) hexLabel.textContent = hex.toUpperCase();
  }
}


// ── SAVE BRAND PROFILE → WF01 ──────────────────────────
const BRAND_ID = '20000000-0000-0000-0000-000000000002';
const WF01_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/brand-profile-updated';

async function saveBrandProfile() {
  const btn = document.getElementById('bk-save-btn');
  if (btn) { btn.textContent = 'Saving…'; btn.disabled = true; }

  const profile_payload = {
    identity: {
      company_name: brandKitData.name,
      industry:     brandKitData.industry,
      tagline:      brandKitData.tagline,
      mission:      brandKitData.mission,
    },
    palette:        brandKitData.palette.map(c => ({ role: c.role, hex: c.hex })),
    typography:     brandKitData.typography,
    values:         brandKitData.values,
    personas:       brandKitData.personas,
    competitors:    brandKitData.competitors,
    channels:       brandKitData.channels,
    tone_by_channel: brandKitData.toneByChannel,
    content_samples: brandKitData.samples,
  };

  try {
    const res = await fetch(WF01_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_id: BRAND_ID,
        changed_fields: ['mission', 'personas', 'competitors', 'tone_by_channel'],
        profile_payload,
      }),
    });
    const data = await res.json();
    if (btn) { btn.textContent = data.brandvoice_queued ? '✅ Saved & queued' : '✅ Saved'; }
    setTimeout(() => { if (btn) { btn.textContent = 'Save & Sync'; btn.disabled = false; } }, 3000);
  } catch (e) {
    if (btn) { btn.textContent = '❌ Error — retry'; btn.disabled = false; }
    console.error('saveBrandProfile error:', e);
  }
}

// ── WF02 BrandVoice Optimizer ──────────────────────────
const WF02_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/brandvoice';

async function runBrandVoiceOptimizer() {
  const btn = document.getElementById('wf02-run-btn');
  if (btn) { btn.textContent = 'Running…'; btn.disabled = true; }
  try {
    // WF01 queues the brandvoice_rebuild job in Supabase then calls WF02 directly
    const res = await fetch(WF01_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: BRAND_ID, profile_payload: {}, changed_fields: ['brandvoice_rebuild'] }),
    });
    const data = await res.json();
    if (btn) { btn.textContent = '✅ Optimized'; }
    showToast('BrandVoice optimization triggered.');
    // Re-hydrate after a short delay so the view picks up the new rules / profile
    setTimeout(() => hydrateBrandVoiceView(), 1500);
    setTimeout(() => { if (btn) { btn.textContent = 'Run Optimizer'; btn.disabled = false; } }, 3000);
  } catch (e) {
    if (btn) { btn.textContent = '❌ Error — retry'; btn.disabled = false; }
    console.error('[WF01->WF02] error:', e);
  }
}

// ── WF03 Research Source Sync ──────────────────────────
const WF03_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/research-sync';

async function syncResearchSources() {
  const btn = document.getElementById('wf03-sync-btn');
  if (btn) { btn.textContent = 'Syncing…'; btn.disabled = true; }
  try {
    // fire-and-forget — WF03 processes all sources in batches, no respondToWebhook
    fetch(WF03_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: BRAND_ID, trigger: 'manual' }),
    }).catch(e => console.error('[WF03] webhook error:', e));
    if (btn) { btn.textContent = '✅ Synced'; }
    showToast('Research sync triggered — runs in background.');
    setTimeout(() => hydrateContentEngineView(), 1500);
    setTimeout(() => { if (btn) { btn.textContent = '↻ Sync Sources'; btn.disabled = false; } }, 3000);
  } catch (e) {
    if (btn) { btn.textContent = '❌ Error — retry'; btn.disabled = false; }
    console.error('[WF03] error:', e);
  }
}

// ── Supabase helpers for queue-job creation ────────────
const SUPABASE_URL = 'https://lvgqecbibzqkmemecskr.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2Z3FlY2JpYnpxa21lbWVjc2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Nzc2NjYsImV4cCI6MjA5MjM1MzY2Nn0.dFWq5rlelCyQ2Gdx1qQnKZo4s3x828fbC-EADX8D1G8';

async function createQueueJob(job_type) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/workflow_jobs`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ brand_id: BRAND_ID, job_type }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`createQueueJob failed: ${res.status} ${err}`);
  }
  return res.json();
}

// ── Content Queue table — reads content_drafts from Supabase ───
async function supabaseGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`
    }
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchContentDrafts(brandId, limit = 12) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    order: 'created_at.desc',
    limit: String(limit),
    select: 'id,title,status,qa_json,created_at,brief:content_briefs(channel,goal)'
  });
  return supabaseGet(`content_drafts?${params}`);
}

function statusBadge(status) {
  const map = {
    draft:     { bg: '#FEF3C7', fg: '#B45309', label: 'Draft' },
    approved:  { bg: '#D1FAE5', fg: '#065F46', label: 'Approved' },
    published: { bg: '#DBEAFE', fg: '#1E40AF', label: 'Published' },
    rejected:  { bg: '#FEE2E2', fg: '#991B1B', label: 'Rejected' },
    qa_failed: { bg: '#F3F4F6', fg: '#374151', label: 'QA failed' }
  };
  const s = map[status] || { bg: '#F3F4F6', fg: '#374151', label: status };
  return `<span class="lm-tag" style="background:${s.bg};color:${s.fg}">${s.label}</span>`;
}

function channelBadge(channel) {
  const map = {
    LinkedIn: { bg: '#EFF6FF', fg: '#1D4ED8' },
    Blog:     { bg: '#F3F4F6', fg: '#374151' },
    Email:    { bg: '#FEF3C7', fg: '#B45309' }
  };
  const c = map[channel] || { bg: '#F3F4F6', fg: '#374151' };
  return `<span class="lm-tag" style="background:${c.bg};color:${c.fg}">${channel || '—'}</span>`;
}

function parseQaJson(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch (e) { return {}; }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function refreshContentQueue() {
  const tbody = document.getElementById('content-queue-tbody');
  if (!tbody) return;
  try {
    const rows = await fetchContentDrafts(BRAND_ID);
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">No drafts yet — click "Build Draft" to generate one.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(r => {
      const qa = parseQaJson(r.qa_json);
      const score = qa.final_score != null ? qa.final_score : '—';
      const scoreColor = (typeof score === 'number' && score >= 85) ? '#10B981' :
                        (typeof score === 'number' && score >= 70) ? '#F59E0B' : '#9CA3AF';
      const channel = r.brief?.channel || '—';
      const titleShort = (r.title || '(no title)').slice(0, 60) + ((r.title || '').length > 60 ? '…' : '');
      return `<tr>
        <td><strong>${escapeHtml(titleShort)}</strong></td>
        <td>${channelBadge(channel)}</td>
        <td>Post</td>
        <td><span style="color:${scoreColor};font-weight:600">${score}</span></td>
        <td>${statusBadge(r.status)}</td>
      </tr>`;
    }).join('');
  } catch (err) {
    console.error('[content-queue] refresh error:', err);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#991B1B;padding:20px">Failed to load drafts. See console.</td></tr>';
  }
}

// ── BrandVoice Optimizer hydration ─────────────────────
async function fetchBrandProfile(brandId) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    select: 'data_json,completion_pct,updated_at,brand:brands(name,industry)'
  });
  const rows = await supabaseGet(`brand_profiles?${params}`);
  return rows[0] || null;
}

async function fetchLatestVoiceRules(brandId) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    order: 'version.desc',
    limit: '1',
    select: 'version,rules_json,tone_dimensions_json,source_summary_json,created_at'
  });
  const rows = await supabaseGet(`brand_voice_rules?${params}`);
  return rows[0] || null;
}

function fmtRelativeTime(iso) {
  if (!iso) return '—';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} h ago`;
  return `${Math.floor(diff/86400)} d ago`;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? '—';
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

async function hydrateBrandVoiceView() {
  try {
    const [profileRow, voiceRow] = await Promise.all([
      fetchBrandProfile(BRAND_ID),
      fetchLatestVoiceRules(BRAND_ID),
    ]);

    const data = profileRow?.data_json || {};
    const brandName = data.identity?.company_name || profileRow?.brand?.name || 'Brand';
    const industry  = data.identity?.industry || profileRow?.brand?.industry || '—';

    setText('bvo-brand-tag', `Brand: ${brandName}`);
    setText('bvo-brand-title-name', brandName);
    setText('bvo-industry', industry);

    // Personas → audience summary
    const personas = Array.isArray(data.personas) ? data.personas : [];
    const audienceLine = personas.length
      ? personas.slice(0, 3).map(p => p.role).filter(Boolean).join(' · ') +
        (personas.length > 3 ? ` · +${personas.length - 3} more` : '')
      : '—';
    setText('bvo-audience', audienceLine);

    // Channels
    const channels = Array.isArray(data.channels) ? data.channels : [];
    setHTML('bvo-channels', channels.map(c => {
      const name = escapeHtml(c.name || '—');
      return `<span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8;margin-right:4px">${name}</span>`;
    }).join('') || '—');

    // Core values
    const values = Array.isArray(data.values) ? data.values : [];
    const coreLine = values.map(v => v.title).filter(Boolean).join(' · ') || '—';
    setText('bvo-core-values', coreLine);

    // Palette
    const palette = Array.isArray(data.palette) ? data.palette : [];
    setHTML('bvo-palette', palette.slice(0, 6).map(c => {
      const hex = /^#[0-9A-Fa-f]{3,8}$/.test(c.hex || '') ? c.hex : '#E5E7EB';
      return `<span title="${escapeHtml(c.role || '')}" style="width:28px;height:28px;background:${hex};border-radius:6px;display:inline-block;border:1px solid #E5E7EB;margin-right:6px"></span>`;
    }).join('') || '—');

    // ──── Voice rules side ────
    const rules  = voiceRow?.rules_json || {};
    const tone   = voiceRow?.tone_dimensions_json || {};
    const srcSum = voiceRow?.source_summary_json || {};

    const always = Array.isArray(rules.always_rules) ? rules.always_rules : [];
    const never  = Array.isArray(rules.never_rules)  ? rules.never_rules  : [];
    const banned = Array.isArray(rules.banned_terms) ? rules.banned_terms : [];

    const totalRules = always.length + never.length + banned.length +
                       (Array.isArray(rules.channel_rules) ? rules.channel_rules.length : 0) +
                       (Array.isArray(rules.persona_rules) ? rules.persona_rules.length : 0) +
                       (Array.isArray(rules.approved_cta_patterns) ? rules.approved_cta_patterns.length : 0);

    setText('bvo-stat-rules', totalRules ? String(totalRules) : '—');
    setText('bvo-stat-samples', String(data.content_samples?.length ?? '—'));
    setText('bvo-stat-tone-dims', String(Object.keys(tone).length || '—'));
    setText('bvo-rules-count', totalRules ? `(${totalRules} coded — excerpt)` : '(— coded)');

    setHTML('bvo-always-list',
      always.slice(0, 6).map(r => `<li>${escapeHtml(r)}</li>`).join('')
      || '<li style="color:var(--text-muted)">No rules yet — click Run Optimizer.</li>');
    setHTML('bvo-never-list',
      never.slice(0, 6).map(r => `<li>${escapeHtml(r)}</li>`).join('')
      || '<li style="color:var(--text-muted)">—</li>');

    // Tone dimensions bars
    const toneLabels = {
      formal_vs_casual:        'Formal ↔ Casual',
      technical_vs_accessible: 'Technical ↔ Accessible',
      serious_vs_playful:      'Serious ↔ Playful',
      humble_vs_bold:          'Humble ↔ Bold',
      short_vs_expansive:      'Short ↔ Expansive',
    };
    const toneHTML = Object.entries(toneLabels).map(([key, label]) => {
      const val = Number.isFinite(tone[key]) ? tone[key] : null;
      const display = val == null ? '—' : `${val}%`;
      const width = val == null ? 0 : val;
      return `<div style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
          <span>${label}</span>
          <span style="color:var(--ai-accent); font-weight:600;">${display}</span>
        </div>
        <div style="height:6px; background:#F3F4F6; border-radius:3px; overflow:hidden;">
          <div style="height:100%; width:${width}%; background:linear-gradient(90deg, #EC4899, #BE185D);"></div>
        </div>
      </div>`;
    }).join('');
    setHTML('bvo-tone-dims', toneHTML);

    // Calibration timestamp + source line
    const calib = voiceRow?.created_at ? fmtRelativeTime(voiceRow.created_at) : 'never run';
    setText('bvo-last-calibration', `Last calibration: ${calib}`);

    const sampleCount = Array.isArray(data.content_samples) ? data.content_samples.length : 0;
    const fieldCount  = Array.isArray(srcSum.input_fields_used) ? srcSum.input_fields_used.length : 0;
    setText('bvo-sources', `Sources: ${sampleCount} content samples · ${fieldCount} profile fields`);
  } catch (err) {
    console.error('[BVO hydrate] error:', err);
  }
}

// ── ContentEngine hydration ────────────────────────────
async function fetchContentInsights(brandId) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    order: 'score.desc',
    select: 'insight_type,title,channel,score,payload_json,created_at'
  });
  return supabaseGet(`content_insights?${params}`);
}

async function fetchTopCompetitorContent(brandId, limit = 8) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    order: 'scraped_at.desc',
    limit: String(limit),
    select: 'title,competitor_name,channel,url,metrics_json,analysis_json,scraped_at'
  });
  return supabaseGet(`competitor_content?${params}`);
}

async function fetchResearchSources(brandId) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    active: 'eq.true',
    order: 'source_type.asc',
    select: 'source_type,source_url,source_handle,competitor_name,channel,config_json'
  });
  return supabaseGet(`research_sources?${params}`);
}

async function fetchLatestResearchRun(brandId) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    order: 'started_at.desc.nullslast',
    limit: '1',
    select: 'run_type,status,started_at,finished_at'
  });
  const rows = await supabaseGet(`research_runs?${params}`);
  return rows[0] || null;
}

function channelTagStyle(channel) {
  const map = {
    LinkedIn:  'background:#EFF6FF;color:#1D4ED8',
    Blog:      'background:#F3F4F6;color:#374151',
    Email:     'background:#FEF3C7;color:#B45309',
    YouTube:   'background:#FEE2E2;color:#991B1B',
    Instagram: 'background:#FCE7F3;color:#9D174D',
    WhatsApp:  'background:#D1FAE5;color:#065F46',
    'X/Twitter': 'background:#F1F5F9;color:#0F172A',
  };
  return map[channel] || 'background:#F3F4F6;color:#374151';
}

function totalEngagement(metrics) {
  if (!metrics || typeof metrics !== 'object') return 0;
  const likes    = Number(metrics.likes)    || 0;
  const comments = Number(metrics.comments) || 0;
  const views    = Number(metrics.views)    || 0;
  return likes + comments + Math.round(views / 100);
}

function fmtCompactNumber(n) {
  if (n == null || !Number.isFinite(n)) return '—';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

async function hydrateContentEngineView() {
  try {
    const [profileRow, insights, topPieces, sources, latestRun] = await Promise.all([
      fetchBrandProfile(BRAND_ID),
      fetchContentInsights(BRAND_ID),
      fetchTopCompetitorContent(BRAND_ID),
      fetchResearchSources(BRAND_ID),
      fetchLatestResearchRun(BRAND_ID),
    ]);

    const data = profileRow?.data_json || {};
    const industry = data.identity?.industry || profileRow?.brand?.industry || '—';

    // Header tag — "<industry> · N pieces analyzed"
    setText('ce-brand-tag', `${industry} · ${topPieces.length} pieces analyzed`);

    // Sub-header — last sync + sources line
    const lastSync = latestRun?.finished_at || latestRun?.started_at;
    setText('ce-last-sync', `Last sync: ${lastSync ? fmtRelativeTime(lastSync) : 'never'}`);

    const channelSet = new Set(sources.map(s => s.channel || s.source_type).filter(Boolean));
    setText('ce-sources-line',
      channelSet.size ? `Sources: ${[...channelSet].join(', ')}` : 'Sources: none configured');

    // Stats
    const insightsByType = insights.reduce((acc, i) => {
      (acc[i.insight_type] = acc[i.insight_type] || []).push(i);
      return acc;
    }, {});
    const formatsCount = (insightsByType.top_formats || []).length;
    const gapsCount    = (insightsByType.content_gaps || []).length;

    // Avg engagement vs baseline — pick top_hooks insight payload.data.vs_baseline
    const hookInsight = (insightsByType.top_hooks || [])[0];
    const vsBaseline = hookInsight?.payload_json?.data?.vs_baseline;
    const vsBaselineDisplay = Number.isFinite(vsBaseline) ? `+${vsBaseline}x` : '—';

    setText('ce-stat-pieces',  topPieces.length ? String(topPieces.length) : '—');
    setText('ce-stat-formats', formatsCount     ? String(formatsCount)     : '—');
    setText('ce-stat-vs-baseline', vsBaselineDisplay);
    setText('ce-stat-gaps',    gapsCount        ? String(gapsCount)        : '—');

    // Top-Performing Pieces table
    const topTbody = document.getElementById('ce-top-pieces-tbody');
    if (topTbody) {
      if (!topPieces.length) {
        topTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">
          No top-performing pieces analyzed yet — click <strong>Sync Sources</strong> then <strong>Run Analysis</strong> to populate.
        </td></tr>`;
      } else {
        const sorted = [...topPieces].sort((a, b) =>
          totalEngagement(b.metrics_json) - totalEngagement(a.metrics_json));
        topTbody.innerHTML = sorted.slice(0, 5).map(p => {
          const eng = totalEngagement(p.metrics_json);
          const rawAnalysis = p.analysis_json;
          let analysis = rawAnalysis;
          if (typeof rawAnalysis === 'string') {
            try { analysis = JSON.parse(rawAnalysis); } catch (_) { analysis = {}; }
          }
          analysis = analysis || {};
          const why = analysis.probable_performance_reason
                   || analysis.relevance_to_brand
                   || analysis.hook_type
                   || '—';
          const whyShort = String(why).slice(0, 120) + (String(why).length > 120 ? '…' : '');
          const channel = p.channel || '—';
          return `<tr>
            <td><strong>${escapeHtml(p.title || '(untitled)')}</strong></td>
            <td>${escapeHtml(p.competitor_name || '—')}</td>
            <td><span class="lm-tag" style="${channelTagStyle(channel)}">${escapeHtml(channel)}</span></td>
            <td><strong style="color:#10B981">${fmtCompactNumber(eng)}</strong></td>
            <td style="font-size:12px; color:var(--text-muted)">${escapeHtml(whyShort)}</td>
          </tr>`;
        }).join('');
      }
    }

    // Content Gaps cards
    const gapsContainer = document.getElementById('ce-gaps-container');
    if (gapsContainer) {
      const gaps = insightsByType.content_gaps || [];
      if (!gaps.length) {
        gapsContainer.innerHTML = `<div style="grid-column: 1 / -1; padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">
          No content gaps surfaced yet. Run Analysis to identify themes your audience engages with but you haven't covered.
        </div>`;
      } else {
        gapsContainer.innerHTML = gaps.slice(0, 6).map(g => {
          const p = g.payload_json || {};
          const dataObj = p.data || {};
          const gapTopic = dataObj.gap_topic || g.title || 'Gap';
          const insightText = p.insight || '';
          const stats = [];
          if (dataObj.our_posts != null)        stats.push(`Your posts: ${dataObj.our_posts}`);
          if (dataObj.competitor_posts != null) stats.push(`Competitor posts: ${dataObj.competitor_posts}`);
          if (dataObj.sample_size != null)      stats.push(`Sample: ${dataObj.sample_size}`);
          return `<div style="padding:12px; border-left:3px solid #F97316; background:#FFF7ED; border-radius:4px;">
            <strong style="font-size:13px;">${escapeHtml(gapTopic)}</strong>
            <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">${escapeHtml(insightText)}</p>
            ${stats.length ? `<p style="font-size:11px; color:#9A3412; margin-top:6px;">${stats.join(' · ')}</p>` : ''}
          </div>`;
        }).join('');
      }
    }

    // Research Sources cards
    const srcContainer = document.getElementById('ce-sources-container');
    if (srcContainer) {
      if (!sources.length) {
        srcContainer.innerHTML = `<div style="grid-column: 1 / -1; padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">
          No research sources configured yet. Add competitor accounts, blogs or channels to start monitoring.
        </div>`;
      } else {
        srcContainer.innerHTML = sources.map(s => {
          const label = s.competitor_name || s.source_handle || s.source_url || s.source_type;
          const sub = [s.source_type, s.channel].filter(Boolean).join(' · ') || '—';
          return `<div style="padding:10px 12px; border:1px solid var(--border); border-radius:6px;">
            <div style="font-size:12px; font-weight:700;">${escapeHtml(label || '—')}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${escapeHtml(sub)}</div>
          </div>`;
        }).join('');
      }
    }
  } catch (err) {
    console.error('[CE hydrate] error:', err);
  }
}

// ── WF04 Content Analyzer ──────────────────────────────
const WF04_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/content-analysis';

async function runContentAnalysis() {
  const btn = document.getElementById('wf04-analyze-btn');
  if (btn) { btn.textContent = 'Analyzing…'; btn.disabled = true; }
  try {
    await createQueueJob('content_analysis');
    // fire-and-forget — WF04 takes ~2.5 min, don't await response
    fetch(WF04_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: BRAND_ID }),
    }).catch(e => console.error('[WF04] webhook error:', e));
    if (btn) { btn.textContent = '✅ Queued'; }
    showToast('Content analysis queued — runs in background.');
    setTimeout(() => hydrateContentEngineView(), 1500);
    setTimeout(() => { if (btn) { btn.textContent = 'Run Analysis'; btn.disabled = false; } }, 3000);
  } catch (e) {
    if (btn) { btn.textContent = '❌ Error — retry'; btn.disabled = false; }
    console.error('[WF04] error:', e);
  }
}

// ── WF05 Hook Miner ────────────────────────────────────
const WF05_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/hook-mining';

async function runHookMiner() {
  const btn = document.getElementById('wf05-mine-btn');
  if (btn) { btn.textContent = 'Mining…'; btn.disabled = true; }
  try {
    await createQueueJob('hook_mining');
    // fire-and-forget — WF05 runs multi-batch AI processing, don't await response
    fetch(WF05_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: BRAND_ID }),
    }).catch(e => console.error('[WF05] webhook error:', e));
    if (btn) { btn.textContent = '✅ Queued'; }
    showToast('Hook mining queued — runs in background.');
    setTimeout(() => { if (btn) { btn.textContent = 'Mine Hooks'; btn.disabled = false; } }, 3000);
  } catch (e) {
    if (btn) { btn.textContent = '❌ Error — retry'; btn.disabled = false; }
    console.error('[WF05] error:', e);
  }
}

// ── WF06 Brief Generator (ContentBuilder) ──────────────
const WF06_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf06-brief-generator';

async function generateContentBrief(channel = 'LinkedIn', persona = 'VP Engineering') {
  try {
    const res = await fetch(WF06_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: BRAND_ID, channel, persona })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[WF06] Error:', err);
    return null;
  }
}

async function handleRegenerate() {
  const btn = document.getElementById('btn-regenerate');
  const btnHeader = document.getElementById('wf06-generate-btn');
  if (!btn && !btnHeader) return;

  const channel = document.getElementById('cb-channel')?.value || 'LinkedIn';
  const persona = document.getElementById('cb-persona')?.value || 'VP Engineering';

  const setBtns = (html, bg = '', color = '', disabled = true) => {
    [btn, btnHeader].forEach(b => {
      if (!b) return;
      b.disabled = disabled;
      b.innerHTML = html;
      b.style.background = bg;
      b.style.color = color;
    });
    lucide.createIcons();
  };

  setBtns('<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Generating...');

  let result = await generateContentBrief(channel, persona);
  console.log('[WF06] raw response:', result);

  // n8n a veces envuelve la respuesta — desempaquetamos los casos comunes
  if (Array.isArray(result)) result = result[0];
  if (result && result.json && typeof result.ok === 'undefined') result = result.json;
  if (result && result.data && typeof result.ok === 'undefined') result = result.data;

  console.log('[WF06] unwrapped:', result);

  // Considerar éxito si ok===true, o si hay brief_id (por si "ok" no viaja)
  const success = result && (result.ok === true || !!result.brief_id);

  if (success) {
    setBtns('<i data-lucide="check" style="width:12px"></i> Brief ready!', '#10B981', 'white');
    const idShort = result.brief_id ? result.brief_id.slice(0, 8) : 'ok';
    showToast(`New brief generated — ID: ${idShort}...`);

    // Render brief into the DOM if backend returned it
    let brief = result.brief;
    if (typeof brief === 'string') {
      try { brief = JSON.parse(brief); } catch (e) { brief = null; }
    }
    if (brief) renderBriefIntoView(brief, channel);

    setTimeout(() => {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i data-lucide="refresh-cw" style="width:12px"></i> Regenerate'; btn.style.background = ''; btn.style.color = ''; }
      if (btnHeader) { btnHeader.disabled = false; btnHeader.innerHTML = '<i data-lucide="sparkles" style="width:13px;vertical-align:middle;margin-right:6px"></i>Generate Brief'; btnHeader.style.background = '#22C55E'; btnHeader.style.color = 'white'; }
      lucide.createIcons();
    }, 3000);
  } else {
    setBtns('<i data-lucide="alert-circle" style="width:12px"></i> Error — retry', '#EF4444', 'white', false);
    showToast('Could not generate brief. Try again.', 'error');
    console.warn('[WF06] response did not match expected shape:', result);
  }
}

// ── WF07 Content Builder + QA ──────────────────────────
const WF07_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf07-content-builder';
// Reuses BRAND_ID

// Tracks the most recent draft built by WF07 so the Approve/Discard buttons
// know which entity_id to send to WF08.
let lastBuiltDraftId = null;

async function generateDraft() {
  try {
    const res = await fetch(WF07_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: BRAND_ID })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[WF07] Error:', err);
    return null;
  }
}

async function handleBuildDraft() {
  const btn = document.getElementById('btn-build-draft');
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Building draft...';
  lucide.createIcons();

  let result = await generateDraft();
  console.log('[WF07] raw response:', result);

  if (Array.isArray(result)) result = result[0];
  if (result && result.json && typeof result.ok === 'undefined') result = result.json;
  if (result && result.data && typeof result.ok === 'undefined') result = result.data;

  console.log('[WF07] unwrapped:', result);

  const success = result && result.ok === true && result.draft_id;

  if (success) {
    const score = Number(result.final_score) || 0;
    const passed = result.status === 'draft';
    const idShort = result.draft_id.slice(0, 8);

    // Remember this draft so the Approve/Discard buttons can act on it
    lastBuiltDraftId = result.draft_id;

    btn.innerHTML = passed
      ? `<i data-lucide="check" style="width:12px"></i> Score ${score} — queued`
      : `<i data-lucide="alert-triangle" style="width:12px"></i> QA ${score} (failed)`;
    btn.style.background = passed ? '#10B981' : '#F59E0B';
    btn.style.color = 'white';

    showToast(passed
      ? `Draft ${idShort} built (score ${score}/100) and queued for approval.`
      : `Draft ${idShort} built but QA failed (${score}/100). Not queued.`);

    // Render draft into the preview card
    let draft = result.draft;
    if (typeof draft === 'string') {
      try { draft = JSON.parse(draft); } catch (e) { draft = null; }
    }
    if (draft) renderDraftIntoView(draft);

    // Refresh queue table to show the newly inserted draft
    refreshContentQueue();

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="wand-2" style="width:12px"></i> Build Draft';
      btn.style.background = '';
      btn.style.color = '';
      lucide.createIcons();
    }, 4000);
  } else {
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error — retry';
    btn.style.background = '#EF4444';
    btn.style.color = 'white';
    btn.disabled = false;
    lucide.createIcons();
    showToast('Could not build draft. Check that WF06 ran first (need a brief with status=ready).', 'error');
    console.warn('[WF07] response did not match expected shape:', result);
  }
}

function renderDraftIntoView(draft) {
  const bodyEl = document.getElementById('cb-post-body');
  if (!bodyEl) return;
  const parts = [];
  if (draft.title)      parts.push(draft.title);
  if (draft.draft_text) parts.push(draft.draft_text);
  bodyEl.textContent = parts.join('\n\n');
}

// ── WF08 Approval Handler ──────────────────────────────
const WF08_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf08-approve';

async function sendApprovalDecision(decision, notes = '') {
  if (!lastBuiltDraftId) {
    showToast('No draft to act on. Click "Build Draft" first.', 'error');
    return null;
  }
  try {
    const res = await fetch(WF08_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_id: BRAND_ID,
        entity_type: 'content_draft',
        entity_id: lastBuiltDraftId,
        decision,
        notes
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[WF08] Error:', err);
    return null;
  }
}

async function handleApproveQueue() {
  const btn = document.getElementById('btn-approve-queue');
  if (!btn) return;
  if (!lastBuiltDraftId) {
    showToast('Build a draft first (purple "Build Draft" button).', 'error');
    return;
  }

  btn.disabled = true;
  const original = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Approving...';
  lucide.createIcons();

  let result = await sendApprovalDecision('approved', 'Approved from ContentBuilder UI');
  if (Array.isArray(result)) result = result[0];
  if (result && result.json) result = result.json;

  if (result && result.ok) {
    btn.innerHTML = '<i data-lucide="check" style="width:12px"></i> Approved & queued';
    btn.style.background = '#10B981';
    showToast(`Draft ${lastBuiltDraftId.slice(0, 8)} approved. Creative render job queued.`);
    refreshContentQueue();
  } else {
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error';
    btn.style.background = '#EF4444';
    showToast('Approval failed. See console.', 'error');
    console.warn('[WF08] response:', result);
  }
  lucide.createIcons();

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = original;
    btn.style.background = '';
    lucide.createIcons();
  }, 4000);
}

// ── WF09 Creative Brain (MVP — visual brief only) ──────
const WF09_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf09-creative-brain';

async function generateVisualBrief(draftId) {
  try {
    const res = await fetch(WF09_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: BRAND_ID, draft_id: draftId })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[WF09] Error:', err);
    return null;
  }
}

async function handleGenerateVisual() {
  const btn = document.getElementById('btn-generate-visual');
  if (!btn) return;
  if (!lastBuiltDraftId) {
    showToast('Build (and ideally approve) a draft first.', 'error');
    return;
  }

  btn.disabled = true;
  const original = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Rendering brief...';
  lucide.createIcons();

  btn.innerHTML = '<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Generating image...';
  lucide.createIcons();

  let result = await generateVisualBrief(lastBuiltDraftId);
  console.log('[WF09] raw response:', result);
  if (Array.isArray(result)) result = result[0];
  if (result && result.json) result = result.json;

  if (result && result.ok && result.asset_id) {
    btn.innerHTML = '<i data-lucide="check" style="width:12px"></i> Image ready';
    btn.style.background = '#10B981';
    btn.style.color = 'white';

    let asset = result.asset;
    if (typeof asset === 'string') {
      try { asset = JSON.parse(asset); } catch (e) { asset = null; }
    }
    const imageUrl = result.image_url || null;
    if (asset || imageUrl) renderVisualBriefIntoView(asset, imageUrl);
    showToast(`Image generated (asset ${result.asset_id.slice(0, 8)}). See card below.`);
  } else {
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error';
    btn.style.background = '#EF4444';
    btn.style.color = 'white';
    showToast('Visual brief failed. See console.', 'error');
    console.warn('[WF09] response:', result);
  }
  lucide.createIcons();

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = original;
    btn.style.background = '';
    btn.style.color = '';
    lucide.createIcons();
  }, 4000);
}

function renderVisualBriefIntoView(asset, imageUrl) {
  const card = document.getElementById('visual-brief-card');
  const body = document.getElementById('visual-brief-body');
  if (!card || !body) return;
  card.style.display = 'block';

  const colorChip = (hex) => `<span style="display:inline-block;width:14px;height:14px;background:${hex};border-radius:3px;vertical-align:middle;border:1px solid #00000020;margin-right:6px"></span><code style="font-size:11px">${hex}</code>`;

  const imageBlock = imageUrl ? `
    <div style="margin-bottom:20px;border-radius:10px;overflow:hidden;border:1px solid #BAE6FD;background:#F0F9FF;">
      <img src="${imageUrl}" alt="Generated visual"
        style="width:100%;display:block;max-height:480px;object-fit:cover;"
        onerror="this.parentElement.innerHTML='<div style=padding:20px;text-align:center;color:#64748B;font-size:13px>Image URL expired — regenerate to get a new one.</div>'">
      <div style="padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:11px;color:#0369A1;font-weight:600;">DALL-E 3 · Generated just now</span>
        <a href="${imageUrl}" target="_blank" style="font-size:11px;color:#0369A1;text-decoration:none;font-weight:600;">
          <i data-lucide="external-link" style="width:11px;vertical-align:middle;margin-right:3px"></i>Open full size
        </a>
      </div>
    </div>` : '';

  const briefBlock = asset ? `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;font-size:13px">
      <div>
        <div style="color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Asset type</div>
        <div style="font-weight:600;margin-bottom:14px">${escapeHtml(asset.asset_type || '—')}</div>
        <div style="color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Headline</div>
        <div style="font-weight:600;font-size:18px;line-height:1.3;margin-bottom:14px">${escapeHtml(asset.headline || '—')}</div>
        <div style="color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Subheadline</div>
        <div style="margin-bottom:14px">${escapeHtml(asset.subheadline || '—')}</div>
        <div style="color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Dimensions</div>
        <div><code>${escapeHtml(asset.dimensions || '—')}</code></div>
      </div>
      <div>
        <div style="color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Visual direction</div>
        <div style="margin-bottom:14px;line-height:1.5">${escapeHtml(asset.visual_direction || '—')}</div>
        <div style="color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Brand elements</div>
        <div style="margin-bottom:6px">${colorChip(asset.brand_elements?.primary_color || '#888')}primary</div>
        <div>Heading font: <strong>${escapeHtml(asset.brand_elements?.font_heading || '—')}</strong></div>
      </div>
    </div>` : '';

  body.innerHTML = imageBlock + briefBlock;
  lucide.createIcons();
}

// ── WF10 Auto Publisher (simulation) ───────────────────
const WF10_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf10-auto-publish';

async function simulatePublish(draftId) {
  try {
    const res = await fetch(WF10_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: BRAND_ID, draft_id: draftId })
    });
    return { httpOk: res.ok, body: await res.json() };
  } catch (err) {
    console.error('[WF10] Error:', err);
    return null;
  }
}

async function handlePublish() {
  const btn = document.getElementById('btn-publish');
  if (!btn) return;
  if (!lastBuiltDraftId) {
    showToast('Build and approve a draft first.', 'error');
    return;
  }

  btn.disabled = true;
  const original = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Publishing...';
  lucide.createIcons();

  const result = await simulatePublish(lastBuiltDraftId);
  console.log('[WF10] response:', result);

  let body = result?.body;
  if (Array.isArray(body)) body = body[0];
  if (body && body.json) body = body.json;

  if (result && result.httpOk && body && body.ok) {
    btn.innerHTML = '<i data-lucide="check" style="width:12px"></i> Published';
    btn.style.background = '#10B981';
    btn.style.color = 'white';
    showToast(`Draft ${lastBuiltDraftId.slice(0, 8)} published to ${body.channel} (simulation).`);
    refreshContentQueue();
  } else if (body && body.reason === 'draft_not_approved') {
    btn.innerHTML = '<i data-lucide="alert-triangle" style="width:12px"></i> Not approved';
    btn.style.background = '#F59E0B';
    btn.style.color = 'white';
    showToast('Draft must be approved first. Click "Approve & queue" before publishing.', 'error');
  } else {
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error';
    btn.style.background = '#EF4444';
    btn.style.color = 'white';
    showToast('Publish failed. See console.', 'error');
  }
  lucide.createIcons();

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = original;
    btn.style.background = '';
    btn.style.color = '';
    lucide.createIcons();
  }, 4000);
}

async function handleDiscardDraft() {
  const btn = document.getElementById('btn-discard-draft');
  if (!btn) return;
  if (!lastBuiltDraftId) {
    showToast('No draft to discard.', 'error');
    return;
  }

  btn.disabled = true;
  const original = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Rejecting...';
  lucide.createIcons();

  let result = await sendApprovalDecision('rejected', 'Discarded from ContentBuilder UI');
  if (Array.isArray(result)) result = result[0];
  if (result && result.json) result = result.json;

  if (result && result.ok) {
    btn.innerHTML = '<i data-lucide="check" style="width:12px"></i> Rejected';
    showToast(`Draft ${lastBuiltDraftId.slice(0, 8)} rejected.`);
    refreshContentQueue();
  } else {
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error';
    showToast('Reject failed. See console.', 'error');
    console.warn('[WF08] response:', result);
  }
  lucide.createIcons();

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = original;
    lucide.createIcons();
  }, 4000);
}

// Render the brief returned by WF06 into the ContentBuilder preview card
function renderBriefIntoView(brief, channel) {
  const bodyEl = document.getElementById('cb-post-body');
  if (!bodyEl) return;

  const lines = [];
  if (brief.hook)     lines.push(brief.hook);
  if (brief.opening)  lines.push(brief.opening);

  const bodyParas = Array.isArray(brief.body) ? brief.body : [];
  bodyParas.forEach(p => p && lines.push(p));

  if (brief.cta) lines.push(brief.cta);

  // Join with double newline; the <p> uses white-space: pre-line so \n becomes a break
  bodyEl.textContent = lines.filter(Boolean).join('\n\n');

  const channelEl = document.getElementById('cb-tag-channel');
  if (channelEl && channel) channelEl.textContent = channel;

  const metaEl = document.getElementById('cb-generated-meta');
  if (metaEl) metaEl.textContent = 'Generated just now · Draft';
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: ${type === 'success' ? '#10B981' : '#EF4444'};
    color: white; padding: 12px 20px; border-radius: 8px;
    font-size: 13px; font-weight: 500; z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: fadeIn 0.2s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Update a top-level brandKitData text field silently
function updateBrandField(key, value) { brandKitData[key] = value; }

function updateBrandTypography(key, value) { brandKitData.typography[key] = value; }

// ── Font picker (Branding Bio Typography) ───────────────
// All fonts here must also be imported in index.html
const BRAND_FONTS_SANS = ['Inter','Outfit','Plus Jakarta Sans','Poppins','Montserrat','DM Sans','Manrope','Space Grotesk','IBM Plex Sans','Roboto','Open Sans','Lato','Nunito Sans','Work Sans','Sora','Bricolage Grotesque','Onest','Public Sans'];
const BRAND_FONTS_SERIF = ['Playfair Display','Lora','Merriweather','EB Garamond'];
const BRAND_FONTS_DISPLAY = ['Bebas Neue','Oswald','Anton'];
const BRAND_FONTS_MONO = ['JetBrains Mono','Fira Code','IBM Plex Mono','Space Mono','Source Code Pro','Roboto Mono'];

function renderFontChips(kind, currentValue) {
  const list = (kind === 'mono')
    ? BRAND_FONTS_MONO
    : BRAND_FONTS_SANS.concat(BRAND_FONTS_SERIF, BRAND_FONTS_DISPLAY);
  const fallback = (kind === 'mono') ? 'monospace' : 'sans-serif';
  const chips = list.map(name => {
    const active = name === currentValue;
    return `<button type="button" onclick="pickBrandFont('${kind}', '${name.replace(/'/g, "&#39;")}')"
      style="font-family:'${name}', ${fallback}; padding:6px 10px; border-radius:6px; border:1px solid ${active ? '#6366F1' : 'var(--border)'}; background:${active ? '#EEF2FF' : 'white'}; color:${active ? '#4338CA' : 'var(--text-main)'}; cursor:pointer; font-size:12px; font-weight:600; white-space:nowrap;">${name}</button>`;
  }).join('');
  return `<div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:12px; max-height:120px; overflow-y:auto; padding:4px 0;">${chips}</div>`;
}

function pickBrandFont(kind, name) {
  brandKitData.typography[kind] = name;
  // Update input
  const input = document.querySelector(`.bk-font-input[data-kind="${kind}"]`);
  if (input) {
    input.value = name;
    input.style.fontFamily = `'${name}', ${kind === 'mono' ? 'monospace' : 'sans-serif'}`;
  }
  // Update preview line
  const preview = document.querySelector(`.font-preview[data-kind="${kind}"]`);
  if (preview) preview.style.fontFamily = `'${name}', ${kind === 'mono' ? 'monospace' : 'sans-serif'}`;
  // Re-render chips so the active style updates
  const card = input?.closest('div[style*="border:1px solid var(--border)"]');
  const oldChips = card?.querySelector('div[style*="display:flex; gap:6px"]');
  if (oldChips) oldChips.outerHTML = renderFontChips(kind, name);
}

// Wraps the original input handler so chips also reflect the change
function updateBrandFontInput(inputEl, kind) {
  const value = inputEl.value;
  updateBrandTypography(kind, value);
  inputEl.style.fontFamily = `'${value}', ${kind === 'mono' ? 'monospace' : 'sans-serif'}`;
  const preview = inputEl.parentElement.querySelector('.font-preview');
  if (preview) preview.style.fontFamily = `'${value}', ${kind === 'mono' ? 'monospace' : 'sans-serif'}`;
}
function updateBrandListItem(list, idx, key, value) {
  if (brandKitData[list] && brandKitData[list][idx]) brandKitData[list][idx][key] = value;
}

// Add / remove items in list sections
function addBrandListItem(list, template) {
  brandKitData[list].push(template);
  switchView(state.currentView);
}
function removeBrandListItem(list, idx) {
  brandKitData[list].splice(idx, 1);
  switchView(state.currentView);
}

// ── Helpers shared across all modules ──

function getLeadStats() {
  if (!leadsRevealed) return { total: 0, mailSent: 0, liSent: 0, icpPct: 0 };
  const total    = leadsData.length;
  const mailSent = leadsData.filter(l => l.mailSent).length;
  const liSent   = leadsData.filter(l => l.liSent).length;
  const icpPct   = Math.round((leadsData.filter(l => l.mailSent || l.liSent).length / total) * 100);
  return { total, mailSent, liSent, icpPct };
}

function buildLeadRows() {
  if (!leadsRevealed) {
    return `<tr><td colspan="9" style="text-align:center;padding:60px 20px">
      <div style="max-width:380px;margin:0 auto">
        <div style="font-size:48px;margin-bottom:16px">🔍</div>
        <h3 style="font-size:16px;font-weight:700;margin-bottom:8px;color:var(--text-main)">No leads loaded yet</h3>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:16px">Use the <strong>AI Assistant</strong> chatbot to search and import leads matching your criteria.</p>
        <p style="font-size:12px;color:var(--ai-accent);font-weight:600;cursor:pointer" onclick="document.getElementById('chatbot-fab').click()">💬 Open AI Assistant to get started →</p>
      </div>
    </td></tr>`;
  }
  return leadsData.map((l, idx) => `
    <tr>
      <td><input type="checkbox" class="lm-check"></td>
      <td class="lm-name" style="cursor:pointer;color:var(--ai-accent);text-decoration:underline dotted" onclick="openLeadPanel(${idx})">${l.name}</td>
      <td class="lm-org">${l.org}</td>
      <td class="lm-title">${l.title}</td>
      <td class="lm-dur">${l.dur}</td>
      <td class="lm-email">${l.email}</td>
      <td>${l.city ? `<span class="lm-city">${l.city}</span>` : `<span class="lm-city lm-city-empty">—</span>`}</td>
      <td><span class="lm-status ${l.mailSent ? 'sent' : 'not-sent'}">${l.mailSent ? 'Sent' : 'Not sent'}</span></td>
      <td><span class="lm-status ${l.liSent   ? 'sent' : 'not-sent'}">${l.liSent   ? 'Sent' : 'Not sent'}</span></td>
    </tr>
  `).join('');
}

// ICP Scorer — sorted by score desc
function buildIcpRows() {
  const scoreColor = p => p >= 70 ? 'var(--success)' : p >= 40 ? 'var(--warning)' : 'var(--danger)';
  return [...leadsData]
    .sort((a, b) => b.icpScore - a.icpScore)
    .map(l => `
    <tr>
      <td><div class="cell-lead">
        <div class="cell-avatar" style="background:#EDE9FE;color:#7C3AED">${l.name[0]}</div>
        <div class="cell-info"><strong>${l.name} · ${l.org}</strong><span>${l.title}</span></div>
      </div></td>
      <td><div class="score-badge ${l.icpScore >= 80 ? 'score-high' : l.icpScore >= 60 ? 'score-med' : 'score-low'}">${l.icpScore}</div></td>
      <td><span style="font-size:12px">${l.signal}</span></td>
      <td><span style="color:${scoreColor(l.closingProb)};font-weight:700">${l.closingProb}%</span></td>
      <td><span class="ch-badge">${l.channel}</span></td>
      <td>${l.status === 'hot'
        ? `<button class="btn-sm btn-primary"><i data-lucide="send"></i> Contact NOW</button>`
        : `<button class="btn-sm btn-ai"><i data-lucide="zap"></i> Add to Sequence</button>`
      }</td>
    </tr>
  `).join('');
}

// MessageTailor — top lead for the example message
function getTopLead() {
  return [...leadsData].sort((a, b) => b.icpScore - a.icpScore)[0];
}

// OutreachFlow — stats from leadsData
function getOutreachStats() {
  const inSeq    = leadsData.filter(l => l.status === 'in-sequence' || l.status === 'active' || l.status === 'hot').length;
  const replied  = leadsData.filter(l => l.mailSent && l.liSent).length;
  const channels = [...new Set(leadsData.map(l => l.channel))].length;
  const meetingRate = Math.round((replied / leadsData.length) * 100);
  return { inSeq, replied, channels, meetingRate };
}

// Smart Nurture — dormant leads
function getDormantLeads() {
  return leadsData.filter(l => l.status === 'dormant');
}

// Initialize Icons
lucide.createIcons();

// ══════════════════════════════════════════════════════════
//  HTBA BRAND / PRODUCT PROFILE PANEL
// ══════════════════════════════════════════════════════════

function openBrandPanel(brandName) {
  const panel = document.getElementById('htba-brand-panel');
  const overlay = document.getElementById('htba-brand-overlay');
  const content = document.getElementById('htba-brand-content');

  if(!panel) return;

  const brands = {
    'Nature Made': {
      brand: 'Nature Made', name: 'B12 1000mcg Time Release', overview: 'Mass-market vitamin staple. High volume, traditional formulations.', country: 'USA', channel: 'Mass Retail / Amazon',
      url: 'amazon.com', activeIng: 'Cyanocobalamin', form: 'Synthetic', dose: '1000 mcg',
      units: '160 Count', servings: '160', format: 'Tablet', claims: 'Metabolic Health',
      complementary: 'None', price: '$8.99', pricePerServ: '$0.05', avgRating: '4.4', reviewCount: '15,200',
      sentimentScore: '68/100', targetUser: 'Budget-conscious, general public',
      topComplaints: ['Low efficacy in deficient patients', 'Pill size', 'Digestive issues'],
      topPraises: ['Very affordable', 'Brand trust', 'Available in local stores'],
      socialFootprint: 'Amazon (Dominant), Facebook Ads', socialRating: 'Amazon: 4.4 ★ (Heavy volume, low depth)'
    },
    'Thorne': {
      brand: 'Thorne', name: 'B-Complex #12', overview: 'Practitioner-grade supplement brand focused on clinical efficacy and clean ingredients.', country: 'USA', channel: 'Practitioner / DTC',
      url: 'thorne.com', activeIng: 'Methylcobalamin', form: 'Methylated', dose: '600 mcg',
      units: '60 Count', servings: '60', format: 'Capsule', claims: 'Energy Production',
      complementary: 'Folate', price: '$22.00', pricePerServ: '$0.36', avgRating: '4.8', reviewCount: '4,100',
      sentimentScore: '92/100', targetUser: 'Biohackers, MTHFR mutation carriers',
      topComplaints: ['Strong odor/smell', 'High price', 'Nausea if taken on empty stomach'],
      topPraises: ['High absorption', 'Clean ingredients', 'Doctor recommended'],
      socialFootprint: 'Instagram, Huberman Lab podcast, Reddit (r/Supplements)', socialRating: 'Reddit: Very High Trust (Top Tier)'
    },
    'Huel': {
      brand: 'Huel', name: 'Black Edition', overview: 'Nutritionally complete food pioneer. Heavy focus on macros and convenience.', country: 'UK', channel: 'DTC',
      url: 'huel.com', activeIng: 'Plant Protein', form: 'Pea/Rice Blend', dose: '40g',
      units: '1.5kg', servings: '17', format: 'Powder', claims: 'Complete Nutrition',
      complementary: 'MCTs, Vitamins', price: '$45.00', pricePerServ: '$2.65', avgRating: '4.2', reviewCount: '32,400',
      sentimentScore: '71/100', targetUser: 'Busy professionals, fitness enthusiasts',
      topComplaints: ['Chalky/sandy texture', 'Artificial sweetener taste', 'Clumping issue'],
      topPraises: ['Great macros', 'Fills you up', 'Convenience'],
      socialFootprint: 'Reddit (r/Huel), YouTube (Sponsorships), IG', socialRating: 'Reddit (Cult following, highly engaged): 4.1 ★'
    },
    'Athletic Greens': {
      brand: 'Athletic Greens (AG1)', name: 'AG1', overview: 'Premium foundational nutrition powder. Huge podcast marketing footprint.', country: 'USA', channel: 'DTC / Subscription',
      url: 'drinkag1.com', activeIng: 'Stevia / 75 Vitamins', form: 'Powder Blend', dose: '12g',
      units: '360g', servings: '30', format: 'Powder', claims: 'Daily Foundational Health',
      complementary: 'Pre/Probiotics', price: '$79.00', pricePerServ: '$2.63', avgRating: '4.5', reviewCount: '85,000+',
      sentimentScore: '88/100', targetUser: 'High-income health optimizers',
      topComplaints: ['Metallic stevia aftertaste', 'Prohibitive price', 'Over-marketed/hype'],
      topPraises: ['All-in-one convenience', 'Digestive benefits', 'Energy boost'],
      socialFootprint: 'Podcasts (Joe Rogan, Huberman, Ferris), TikTok, IG', socialRating: 'TikTok: Hyped but polarized. Trustpilot: 4.5 ★'
    },
    'Ritual': {
      brand: 'Ritual', name: 'Essential for Women 18+', overview: 'Transparent, visually appealing multivitamins targeted at millennial women.', country: 'USA', channel: 'DTC / Retail',
      url: 'ritual.com', activeIng: 'Algae Oil (Omega3)', form: 'Vegan Omega', dose: '330mg',
      units: '60 Count', servings: '30', format: 'Oil Capsule', claims: 'Foundational Support',
      complementary: 'B12, D3', price: '$33.00', pricePerServ: '$1.10', avgRating: '4.1', reviewCount: '12,500',
      sentimentScore: '76/100', targetUser: 'Millennial and Gen-Z women focused on transparency',
      topComplaints: ['Fishy burps/aftertaste later in day', 'Missing key minerals (Ca, C)', 'Subscription model difficult to cancel'],
      topPraises: ['Beautiful packaging', 'Mint essence is nice', 'Vegan omega sourcing'],
      socialFootprint: 'Instagram, TikTok, Pinterest', socialRating: 'IG (Aesthetic & Trendy): High Engagement, 4.3 ★'
    }
  };

  const data = brands[brandName] || brands['Thorne'];

  content.innerHTML = `
    <div style="padding: 24px; position:relative;">
      <button class="lm-btn-outline" style="position:absolute; top:24px; right:24px; padding:4px 8px; border:none; background:transparent" onclick="closeBrandPanel()">
        <i data-lucide="x"></i>
      </button>
      
      <div style="display:flex; align-items:center; gap:16px;">
        <div style="width:50px;height:50px;background:#F1F5F9;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;border:1px solid #E2E8F0">
          🏢
        </div>
        <div>
          <h2 style="margin:0; font-size:20px; color:#0F172A">${data.brand}</h2>
          <span style="color:#64748B; font-size:14px">${data.name}</span>
        </div>
      </div>
      
      <p style="margin: 16px 0 24px 0; font-size:13px; color:#475569; line-height:1.5;">
        ${data.overview}
      </p>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
        <div class="card" style="padding:16px">
          <h4 style="margin:0 0 12px 0; color:#334155; font-size:12px; text-transform:uppercase">Product DNA</h4>
          <div style="display:flex; flex-direction:column; gap:8px; font-size:13px">
            <div style="display:flex; justify-content:space-between">
              <span style="color:#64748B">Active Ingredient:</span> <strong>${data.activeIng}</strong>
            </div>
            <div style="display:flex; justify-content:space-between">
              <span style="color:#64748B">Chemical Form:</span> <strong>${data.form}</strong>
            </div>
            <div style="display:flex; justify-content:space-between">
              <span style="color:#64748B">Dose per Serving:</span> <strong>${data.dose}</strong>
            </div>
            <div style="display:flex; justify-content:space-between">
              <span style="color:#64748B">Format:</span> <strong>${data.format}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:8px; padding-top:8px; border-top:1px solid #E2E8F0">
              <span style="color:#64748B">Claims:</span> <strong style="text-align:right;max-width:140px">${data.claims}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#64748B">Complementary:</span> <strong>${data.complementary}</strong>
            </div>
          </div>
        </div>

        <div class="card" style="padding:16px">
          <h4 style="margin:0 0 12px 0; color:#334155; font-size:12px; text-transform:uppercase">Market & Commercial</h4>
          <div style="display:flex; flex-direction:column; gap:8px; font-size:13px">
            <div style="display:flex; justify-content:space-between">
              <span style="color:#64748B">Price:</span> <strong>${data.price}</strong>
            </div>
            <div style="display:flex; justify-content:space-between">
              <span style="color:#64748B">Price Per Serv:</span> <strong>${data.pricePerServ}</strong>
            </div>
            <div style="display:flex; justify-content:space-between">
              <span style="color:#64748B">Channel:</span> <strong>${data.channel}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:8px; padding-top:8px; border-top:1px solid #E2E8F0">
              <span style="color:#64748B">Avg Rating:</span> <strong>${data.avgRating} ★</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#64748B">Reviews:</span> <strong>${data.reviewCount}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#64748B">Sentiment Score:</span> <strong style="color:#059669">${data.sentimentScore}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- NEW SECTION: SOCIAL FOOTPRINT -->
      <div class="card" style="margin-top:16px; padding:16px">
        <h4 style="margin:0 0 12px 0; color:#334155; font-size:12px; text-transform:uppercase">Social & Digital Footprint</h4>
        <div style="font-size:13px; line-height:1.6; color:#1E293B">
          <div style="margin-bottom:8px">
            <span style="color:#64748B;font-weight:600">Dominant Networks:</span> 
            <span>${data.socialFootprint}</span>
          </div>
          <div>
            <span style="color:#64748B;font-weight:600">Social Rating/Impact:</span> 
            <span style="font-weight:600; color:#10B981">${data.socialRating}</span>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:16px; padding:16px">
        <h4 style="margin:0 0 12px 0; color:#334155; font-size:12px; text-transform:uppercase">Consumer NLP Analysis</h4>
        
        <div style="margin-bottom:12px">
          <strong style="font-size:12px; color:#EF4444">🔴 Top Complaints (Friction)</strong>
          <ul style="margin:4px 0 0 0; padding-left:16px; color:#475569; font-size:12px">
            ${data.topComplaints.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
        
        <div style="margin-bottom:12px">
          <strong style="font-size:12px; color:#10B981">🟢 Top Praises (Drivers)</strong>
          <ul style="margin:4px 0 0 0; padding-left:16px; color:#475569; font-size:12px">
            ${data.topPraises.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>

        <div style="padding:12px; background:#F8FAFC; border-radius:4px; font-size:12px; border-left:3px solid #3B82F6">
          <span style="color:#64748B">Inferred Target User:</span><br>
          <strong style="color:#1E293B">${data.targetUser}</strong>
        </div>
      </div>

      <div style="margin-top:20px; display:flex; gap:12px">
        <button class="lm-btn-primary" style="flex:1">Generate Formulation Opportunity</button>
        <button class="lm-btn-outline" style="flex:1">Track SKU Pricing</button>
      </div>

    </div>
  `;

  panel.classList.add('open');
  overlay.classList.add('open');
  lucide.createIcons();
}

function closeBrandPanel() {
  const panel = document.getElementById('htba-brand-panel');
  const overlay = document.getElementById('htba-brand-overlay');
  if(panel) panel.classList.remove('open');
  if(overlay) overlay.classList.remove('open');
}

// Attach event listener to overlay
const brandOverlay = document.getElementById('htba-brand-overlay');
if(brandOverlay) {
  brandOverlay.addEventListener('click', closeBrandPanel);
}

// --- Sidebar Navigation Logic ---
function toggleNavMenu(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
}

document.querySelectorAll('.nav-item[data-view]').forEach(item => {
  item.addEventListener('click', (e) => {
    // Prevent toggle bubbling if clicking sub-items
    if(item.classList.contains('has-chevron')) return;

    // Remove active from all
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    // Add active to clicked
    item.classList.add('active');

    // Switch view
    const targetView = item.getAttribute('data-view');
    switchView(targetView);
  });
});

function switchView(viewId) {
  state.currentView = viewId;
  const container = document.getElementById('view-container');

  // Update topbar breadcrumb
  const viewMeta = {
    'dashboard':     { name: 'Dashboard',     sub: 'Pipeline overview, priority prospects, and strategic recommendations' },
    'leadminer':     { name: 'LeadMiner™',    sub: 'Growth Engine · Your complete prospect database with enrichment and outreach tracking' },
    'icp-scorer':    { name: 'ICP Scorer™',   sub: 'Growth Engine · Which prospects to focus on and why — ranked by purchase likelihood' },
    'message-tailor':{ name: 'MessageTailor™',sub: 'Growth Engine · Personalized outreach crafted for each prospect and channel' },
    'outreach-flow': { name: 'OutreachFlow™', sub: 'Growth Engine · The full buyer journey orchestrated across every touchpoint' },
    'smart-nurture': { name: 'Smart Nurture™',sub: 'Growth Engine · Bringing dormant opportunities back to life at the right moment' },
    'company-bio':   { name: 'Company Bio Scanner', sub: 'Sales Growth Engine · AI-driven web scanning & client profiling' },
    'analytics':     { name: 'Analytics & Metrics', sub: 'Social media performance, brand reach, audience insights, and review intelligence' },
    'price-intelligence':  { name: 'Price Intelligence Agent', sub: 'Competitive Intelligence · How your pricing compares across competitors, regions, and segments' },
    'launch-tracker':      { name: 'Product Launch Tracker', sub: 'Competitive Intelligence · What your competitors are launching, where, and when' },
    'sentiment-analyzer':  { name: 'Sentiment Analyzer', sub: 'Competitive Intelligence · How the market perceives your brand versus the competition' },
    'demand-intelligence': { name: 'Demand Intelligence Agent', sub: 'Competitive Intelligence · Where demand is growing and which opportunities to prioritize' },
    'supply-chain-ci':     { name: 'Supply Chain CI', sub: 'Competitive Intelligence · Which suppliers are at risk and how it affects your production timeline' },

    // Marketing Pilot — Tier 1 Light agents (content engine, not campaign manager)
    'branding-kit':        { name: 'Branding Bio', sub: 'Marketing Pilot · Foundation input — your brand data fuels every downstream agent' },
    'brandvoice-optimizer': { name: 'BrandVoice Optimizer', sub: 'Marketing Pilot · Codifies your brand voice into reusable rules the rest of the agents follow' },
    'content-engine':      { name: 'ContentEngine', sub: 'Marketing Pilot · Analyzes top-performing content in your industry and surfaces what actually gets engagement' },
    'hook-miner':          { name: 'HookMiner', sub: 'Marketing Pilot · Extracts the hooks and opening frameworks that drive the most engagement, ranked by channel' },
    'content-builder':     { name: 'ContentBuilder', sub: 'Marketing Pilot · Generates publish-ready posts, emails and copies calibrated to your voice and audience' },
    'creative-brain':      { name: 'CreativeBrain', sub: 'Marketing Pilot · Renders multi-format creatives (banners, templates, ad variants) on-brand at scale' },
    'auto-publisher':      { name: 'AutoPublisher', sub: 'Marketing Pilot · Schedules and publishes content across social + blog channels using optimal-timing models' },
  };
  const meta = viewMeta[viewId] || { name: viewId, sub: '' };
  const nameEl = document.getElementById('topbar-view-name');
  const subEl  = document.getElementById('topbar-subtitle');
  if (nameEl) nameEl.textContent = meta.name;
  if (subEl)  subEl.textContent  = meta.sub;

  // Destroy existing chart instances before replacing DOM (prevents rAF loop leak)
  Object.keys(chartInstances).forEach(key => {
    chartInstances[key].destroy();
    delete chartInstances[key];
  });

  // Render View Dynamically Based On Choice
  container.innerHTML = generateViewHTML(viewId);
  lucide.createIcons({ nodes: [container] }); // Scope scan to container only

  if(viewId === 'dashboard') {
    setTimeout(() => renderDashboardCharts(), 50);
  } else if (['price-intelligence','launch-tracker','sentiment-analyzer','demand-intelligence','supply-chain-ci','content-engine','hook-miner','content-builder','creative-brain','auto-publisher'].includes(viewId)) {
    setTimeout(() => renderCICharts(viewId), 50);
  } else if (viewId === 'analytics') {
    setTimeout(() => renderAnalyticsCharts(), 50);
  }

  if (viewId === 'content-builder') {
    setTimeout(() => refreshContentQueue(), 80);
  }

  if (viewId === 'brandvoice-optimizer') {
    setTimeout(() => hydrateBrandVoiceView(), 80);
  }

  if (viewId === 'content-engine') {
    setTimeout(() => hydrateContentEngineView(), 80);
  }
}


// ═══════════════════════════════════════════════════════════
//  COMPANY BIO SCANNER — CACHED DB + LIVE SCRAPING FALLBACK
// ═══════════════════════════════════════════════════════════

const companyCacheDB = {
  'acmecorp.com': {
    name: 'Acme Corp',
    tagline: 'Enterprise Technology Solutions',
    description: 'Acme Corp is a leading enterprise technology provider delivering scalable SaaS solutions for Fortune 500 companies. Founded in 1998 and headquartered in San Francisco, the company serves over 2,000 customers worldwide with a focus on cloud infrastructure, data analytics, and workflow automation.',
    industry: 'Enterprise SaaS / Technology',
    headcount: '1,000 – 5,000 employees',
    location: 'San Francisco, CA, USA',
    founded: 1998,
    services: [
      'Cloud Infrastructure Platform',
      'Data Analytics Suite',
      'Workflow Automation',
      'Enterprise Integrations',
      'Professional Services',
      'Custom Development',
    ],
    techStack: ['AWS', 'Kubernetes', 'Salesforce', 'Snowflake'],
    socials: {
      linkedin: 'https://www.linkedin.com/company/acme-corp/',
      twitter: 'https://twitter.com/acmecorp',
      instagram: '',
      facebook: '',
      youtube: '',
      tiktok: '',
    },
    whatTheyDo: [
      { icon: 'cloud', title: 'Cloud Platform', desc: 'Enterprise-grade cloud infrastructure serving 2,000+ customers across regulated industries.' },
      { icon: 'bar-chart', title: 'Analytics Suite', desc: 'Real-time data analytics and BI tools powering data-driven decisions.' },
      { icon: 'zap', title: 'Workflow Automation', desc: 'Low-code automation platform reducing manual operations by 60%.' },
      { icon: 'link', title: 'Integrations', desc: '500+ pre-built integrations with popular enterprise software.' },
    ],
    differentiators: [
      '25+ years of enterprise SaaS experience',
      'Fortune 500 customer base with 98% retention rate',
      'Global presence across 40+ countries',
      'SOC 2 Type II and ISO 27001 certified',
      'Industry-leading 99.99% uptime SLA',
    ],
    recentMoves: [
      { date: '2026', event: 'Series F funding round — $150M at $2.5B valuation' },
      { date: '2025', event: 'Acquired DataStream Analytics for real-time BI capabilities' },
      { date: '2024', event: 'Launched AI-powered workflow engine with GPT integration' },
    ],
    icpMatch: { score: 95, label: 'Perfect ICP Match', text: 'Acme Corp fits your ICP perfectly: large enterprise SaaS with complex sales cycles, strong technology adoption, and recent expansion into AI/ML. High probability of strategic partnership.' },
    leads: [
      { name: 'John Mitchell', title: 'VP of Sales — Enterprise Tech', score: 95, action: 'Send personalized LinkedIn InMail — Decision maker', actionType: 'hot' },
      { name: 'Jennifer Park', title: 'Chief Marketing Officer', score: 88, action: 'Invite to executive briefing', actionType: 'hot' },
      { name: 'Ryan Foster', title: 'Director of Partnerships', score: 82, action: 'Request warm intro via mutual contact', actionType: 'warm' },
      { name: 'Diana Chen', title: 'Head of Product Strategy', score: 76, action: 'Share relevant case study', actionType: 'warm' },
    ],
  },

  'globex.io': {
    name: 'Globex Industries',
    tagline: 'Industrial Innovation at Scale',
    description: 'Globex Industries is a diversified industrial conglomerate operating in manufacturing, logistics, and supply chain technology. Founded in 1985 and headquartered in New York, Globex serves B2B clients across 62 countries with a focus on operational excellence and sustainable industrial practices.',
    industry: 'Industrial / Manufacturing',
    headcount: '10,000+ employees',
    location: 'New York, NY, USA',
    founded: 1985,
    services: [
      'Industrial Manufacturing',
      'Supply Chain Solutions',
      'Logistics & Distribution',
      'IoT & Industry 4.0',
      'Sustainability Consulting',
      'Custom Engineering',
    ],
    techStack: ['SAP', 'Microsoft Dynamics', 'AWS IoT', 'PowerBI'],
    socials: {
      linkedin: 'https://www.linkedin.com/company/globex-industries/',
      twitter: '',
      instagram: '',
      facebook: '',
      youtube: 'https://www.youtube.com/@globex',
      tiktok: '',
    },
    whatTheyDo: [
      { icon: 'factory', title: 'Manufacturing', desc: 'Large-scale industrial production across 45 facilities globally.' },
      { icon: 'truck', title: 'Supply Chain', desc: 'End-to-end supply chain management with 99.2% on-time delivery.' },
      { icon: 'cpu', title: 'Industry 4.0', desc: 'IoT-enabled smart factories with real-time production monitoring.' },
      { icon: 'leaf', title: 'Sustainability', desc: 'Net-zero roadmap by 2035 with circular economy initiatives.' },
    ],
    differentiators: [
      '40+ years of industrial operational experience',
      '45 manufacturing facilities across 6 continents',
      'Vertically integrated supply chain control',
      'Industry-leading sustainability practices (CDP A-list)',
      'Strategic partnerships with top-tier OEMs',
    ],
    recentMoves: [
      { date: '2026', event: 'Announced $500M investment in Mexico manufacturing hub' },
      { date: '2025', event: 'Launched AI-driven predictive maintenance platform' },
      { date: '2024', event: 'Completed acquisition of European logistics leader TransGlobal' },
    ],
    icpMatch: { score: 89, label: 'Strong ICP Match', text: 'Globex matches your ICP: global industrial player with complex B2B sales, strong digital transformation agenda, and active M&A strategy. Ideal for enterprise-scale partnerships.' },
    leads: [
      { name: 'Sarah Chen', title: 'Chief Revenue Officer', score: 92, action: 'Executive outreach via LinkedIn', actionType: 'hot' },
      { name: 'Martin Reyes', title: 'VP of Operations', score: 85, action: 'Send industry benchmark report', actionType: 'hot' },
      { name: 'Angela Brooks', title: 'Director of Procurement', score: 79, action: 'Schedule budget-aligned proposal meeting', actionType: 'warm' },
      { name: 'Hiroshi Yamamoto', title: 'Head of APAC Strategy', score: 74, action: 'Connect via regional event', actionType: 'warm' },
    ],
  },

  'initech.com': {
    name: 'Initech Solutions',
    tagline: 'Consulting for the Modern Enterprise',
    description: 'Initech Solutions is a management consulting firm specializing in digital transformation, operational efficiency, and technology strategy. Founded in 2005 and headquartered in Austin, Initech advises mid-market and enterprise clients on high-impact change initiatives.',
    industry: 'Management Consulting',
    headcount: '500 – 1,000 employees',
    location: 'Austin, TX, USA',
    founded: 2005,
    services: [
      'Digital Transformation',
      'Operational Excellence',
      'Technology Strategy',
      'Change Management',
      'M&A Advisory',
      'Data & AI Consulting',
    ],
    techStack: ['Salesforce', 'Tableau', 'Microsoft Teams', 'Jira'],
    socials: {
      linkedin: 'https://www.linkedin.com/company/initech-solutions/',
      twitter: 'https://twitter.com/initechsol',
      instagram: '',
      facebook: '',
      youtube: '',
      tiktok: '',
    },
    whatTheyDo: [
      { icon: 'trending-up', title: 'Digital Transformation', desc: 'End-to-end DX programs for enterprises navigating legacy modernization.' },
      { icon: 'settings', title: 'Operations', desc: 'Lean/Six Sigma methodology combined with tech enablement.' },
      { icon: 'layers', title: 'Tech Strategy', desc: 'Technology roadmaps aligned with business outcomes and KPIs.' },
      { icon: 'users', title: 'Change Mgmt', desc: 'Organizational change programs with 85%+ adoption rates.' },
    ],
    differentiators: [
      'Top 20 boutique consulting firm in North America',
      'Industry-leading 4.8 Glassdoor rating',
      'Deep bench of ex-Big 4 and ex-FAANG talent',
      'Outcome-based pricing models',
      'Published proprietary research on Industry 4.0',
    ],
    recentMoves: [
      { date: '2026', event: 'Opened new EMEA office in London' },
      { date: '2025', event: 'Launched AI Advisory practice with 40+ practitioners' },
      { date: '2024', event: 'Recognized as "Best Consulting Firm to Work For" — Forbes' },
    ],
    icpMatch: { score: 87, label: 'Strong ICP Match', text: 'Initech aligns well: consulting firm with strong advisor network, active digital practice, and propensity to recommend solutions to clients. High leverage for multi-deal partnerships.' },
    leads: [
      { name: 'Michael Rodriguez', title: 'Head of Operations', score: 90, action: 'Executive discovery call scheduled', actionType: 'hot' },
      { name: 'Laura Pierce', title: 'Managing Partner — Tech Practice', score: 84, action: 'Invite to partner advisory board', actionType: 'warm' },
      { name: 'Dan Wexler', title: 'Principal — Digital Strategy', score: 78, action: 'Share sector benchmarks', actionType: 'warm' },
    ],
  },

  'stark.co': {
    name: 'Stark Enterprises',
    tagline: 'Advanced Manufacturing & Clean Energy',
    description: 'Stark Enterprises is a diversified industrial and technology conglomerate focused on advanced manufacturing, clean energy, and defense innovation. Founded in 1940 and headquartered in London, Stark operates in 30+ countries with strong R&D investment in sustainable technologies.',
    industry: 'Industrial / Clean Energy',
    headcount: '5,000 – 10,000 employees',
    location: 'London, UK',
    founded: 1940,
    services: [
      'Advanced Manufacturing',
      'Clean Energy Systems',
      'Defense Technology',
      'R&D Services',
      'Engineering Consulting',
      'Specialty Materials',
    ],
    techStack: ['SAP', 'Oracle', 'Autodesk', 'Ansys'],
    socials: {
      linkedin: 'https://www.linkedin.com/company/stark-enterprises/',
      twitter: '',
      instagram: '',
      facebook: '',
      youtube: '',
      tiktok: '',
    },
    whatTheyDo: [
      { icon: 'cpu', title: 'Advanced Mfg', desc: 'Precision engineering for aerospace, automotive, and defense.' },
      { icon: 'zap', title: 'Clean Energy', desc: 'Solar, wind, and battery storage solutions at utility scale.' },
      { icon: 'shield', title: 'Defense Tech', desc: 'Mission-critical systems for defense and security markets.' },
      { icon: 'flask-conical', title: 'R&D', desc: '$800M annual R&D spend across 12 research centers.' },
    ],
    differentiators: [
      '80+ years of industrial heritage',
      'Top-tier defense contractor with NATO clearance',
      '12 R&D centers across UK, US, and APAC',
      'ESG leadership — CDP A-list 5 years running',
      'Extensive IP portfolio (3,200+ active patents)',
    ],
    recentMoves: [
      { date: '2026', event: 'Announced $2B clean energy megaproject in North Sea' },
      { date: '2025', event: 'Strategic partnership with leading aerospace OEM' },
      { date: '2024', event: 'Launched venture arm with $300M deployment target' },
    ],
    icpMatch: { score: 82, label: 'Good ICP Match', text: 'Stark is a strong fit: established industrial player with heavy R&D investment and active corporate venture arm. Multiple entry points across divisions.' },
    leads: [
      { name: 'Emma Thompson', title: 'Director of Procurement', score: 87, action: 'Request RFP/vendor onboarding', actionType: 'hot' },
      { name: 'Harold Sterling', title: 'Chief Innovation Officer', score: 81, action: 'Position as strategic innovation partner', actionType: 'warm' },
      { name: 'Nina Kowalski', title: 'Head of Corporate Venture', score: 75, action: 'Explore partnership or investment fit', actionType: 'warm' },
    ],
  },
};

function getCompanyCache(domain, lang = 'en') {
  let cleanDomain = domain.replace(/^www\./, '').split('/')[0];
  let data = companyCacheDB[cleanDomain];
  if (!data) return null;
  if (lang !== 'en' && data.translations && data.translations[lang]) {
    return { ...data, ...data.translations[lang] };
  }
  return data;
}

function setScanLanguage(lang) {
  scanLanguage = lang;
  document.querySelectorAll('#lang-selector [data-lang]').forEach(btn => {
    const active = btn.dataset.lang === lang;
    btn.style.background = active ? 'var(--ai-accent)' : 'white';
    btn.style.color = active ? 'white' : 'var(--text-main)';
    btn.style.borderColor = active ? 'var(--ai-accent)' : 'var(--border)';
  });
  // Re-render results in new language if a company is already displayed
  if (lastScannedDomain) {
    const cached = getCompanyCache(lastScannedDomain, lang);
    if (cached) {
      renderCompanyResults(cached, lastScannedDomain);
      document.getElementById('company-bio-results').style.opacity = '1';
    }
  }
}

async function scanCompanyBio() {
  const urlEl = document.getElementById('company-url-input');
  let url = urlEl.value.trim();
  if (!url) {
    alert("Please enter a valid company URL (e.g., https://acme.com)");
    return;
  }
  if (!url.startsWith('http')) url = 'https://' + url;

  let domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
  let nameRaw = domain.split('.')[0];
  let companyName = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1);

  const resultsDiv = document.getElementById('company-bio-results');
  const emptyDiv = document.getElementById('company-bio-empty');

  emptyDiv.style.display = 'none';
  resultsDiv.style.display = 'block';
  resultsDiv.style.opacity = '0.4';

  // --- Check cache first ---
  let cached = getCompanyCache(domain, scanLanguage);

  let companyData;
  if (cached) {
    companyData = cached;
    companyName = cached.name;
  } else {
    // Loading states
    document.getElementById('scanned-company-name').textContent = companyName;
    document.getElementById('scanned-company-url-link').textContent = domain;
    document.getElementById('scanned-company-url-link').href = "https://" + domain;
    document.getElementById('scanned-company-initial').textContent = companyName.charAt(0).toUpperCase();
    document.getElementById('scanned-company-desc').innerHTML = '<i style="color:var(--text-muted)">🔄 Scanning website and extracting AI insights...</i>';
    document.getElementById('scanned-industry').textContent = 'Analyzing...';
    document.getElementById('scanned-headcount').textContent = 'Analyzing...';
    document.getElementById('scanned-location').textContent = 'Analyzing...';
    document.getElementById('scanned-services').innerHTML = '<span style="color:var(--text-muted);font-style:italic">Extracting product lines...</span>';
    document.getElementById('scanned-tech-stack').innerHTML = '<span style="color:var(--text-muted);font-style:italic">Detecting...</span>';

    companyData = await scrapeCompanyData(url, domain, companyName, scanLanguage);
  }

  // === RENDER ALL DATA ===
  renderCompanyResults(companyData, domain);

  resultsDiv.style.opacity = '1';
  resultsDiv.style.transition = 'opacity 0.4s ease-in-out';
  lucide.createIcons();
}

function renderCompanyResults(data, domain) {
  lastScannedDomain = domain;
  let name = data.name || domain;
  document.getElementById('scanned-company-name').textContent = name;
  document.getElementById('scanned-company-url-link').textContent = domain;
  document.getElementById('scanned-company-url-link').href = "https://" + domain;
  document.getElementById('scanned-company-initial').textContent = (name.charAt(0) || '?').toUpperCase();

  // Tagline
  let taglineEl = document.getElementById('scanned-tagline');
  taglineEl.textContent = data.tagline ? '"' + data.tagline + '"' : '';

  // Description
  document.getElementById('scanned-company-desc').textContent = data.description || (name + ' is an industry leader delivering innovative solutions.');

  // Firmographics
  document.getElementById('scanned-industry').textContent = data.industry || 'B2B / Technology Services';
  document.getElementById('scanned-headcount').textContent = data.headcount || '51 – 200 employees';
  document.getElementById('scanned-location').textContent = data.location || 'Global / Not specified';

  // Founded
  let foundedEl = document.getElementById('scanned-founded');
  if (foundedEl) foundedEl.textContent = data.founded ? 'Est. ' + data.founded : '';

  // Services
  let servicesHtml = (data.services || ['Core Platform', 'Enterprise Solutions']).map(s =>
    '<span style="display:inline-block;background:#EDE9FE;color:#7C3AED;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:500;margin:3px 4px 3px 0">' + s + '</span>'
  ).join('');
  document.getElementById('scanned-services').innerHTML = servicesHtml;

  // Tech Stack
  let techHtml = (data.techStack || ['Custom Stack']).map(t =>
    '<span style="display:inline-block;background:#F1F5F9;color:#334155;padding:2px 10px;border-radius:4px;font-size:11px;font-weight:500;margin:2px 4px 2px 0;border:1px solid #E2E8F0">' + t + '</span>'
  ).join('');
  document.getElementById('scanned-tech-stack').innerHTML = techHtml;

  // Social Links Grid
  let socials = data.socials || {};
  let socialHtml = '';
  let socialConfig = [
    { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', icon: 'linkedin' },
    { key: 'twitter', label: 'X (Twitter)', color: '#0F172A', icon: 'twitter' },
    { key: 'instagram', label: 'Instagram', color: '#E4405F', icon: 'instagram' },
    { key: 'facebook', label: 'Facebook', color: '#1877F2', icon: 'facebook' },
    { key: 'youtube', label: 'YouTube', color: '#FF0000', icon: 'youtube' },
    { key: 'tiktok', label: 'TikTok', color: '#010101', icon: 'music' },
  ];

  socialHtml += '<a href="https://' + domain + '" target="_blank" style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;text-decoration:none;color:white;background:var(--ai-accent);font-size:13px;font-weight:600"><i data-lucide="globe" style="width:16px"></i>' + domain + '</a>';

  socialConfig.forEach(s => {
    let href = socials[s.key];
    if (href) {
      socialHtml += '<a href="' + href + '" target="_blank" style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;text-decoration:none;color:white;background:' + s.color + ';font-size:13px;font-weight:600"><i data-lucide="' + s.icon + '" style="width:16px"></i>' + s.label + '</a>';
    } else {
      socialHtml += '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;color:#D1D5DB;background:#F9FAFB;border:1px solid #E5E7EB;font-size:13px;font-weight:500;opacity:0.5"><i data-lucide="' + s.icon + '" style="width:16px"></i>' + s.label + '</div>';
    }
  });
  document.getElementById('scanned-social-grid').innerHTML = socialHtml;

  // ICP Match
  if (data.icpMatch) {
    document.getElementById('scanned-icp-score').textContent = data.icpMatch.label;
    document.getElementById('scanned-icp-text').textContent = data.icpMatch.text;
  }

  // Leads Table
  let leads = data.leads || [
    { name: 'Decision Maker 1', title: 'VP of Sales', score: 85, action: 'Send LinkedIn Connection', actionType: 'hot' },
    { name: 'Decision Maker 2', title: 'Head of Growth', score: 68, action: 'Wait for event', actionType: 'sequence' },
  ];

  let leadsHtml = leads.map(l => {
    let scoreClass = l.score >= 85 ? 'score-high' : l.score >= 65 ? 'score-med' : 'score-low';
    let actionColor = l.actionType === 'hot' ? 'color:var(--ai-accent); font-weight:600;' : 'color:var(--text-muted);';
    let btnHtml = l.actionType === 'hot'
      ? '<button class="btn-sm btn-ai" style="padding:4px 12px"><i data-lucide="zap" style="width:12px"></i> Draft</button>'
      : '<button class="btn-sm" style="border:1px solid var(--border); padding:4px 12px">Sequence</button>';

    return '<tr style="border-bottom:1px solid var(--border);">' +
      '<td style="padding:12px 0;"><strong style="color:var(--text-main);display:block;">' + l.name + '</strong><span style="color:var(--text-muted);font-size:12px">' + l.title + '</span></td>' +
      '<td style="padding:12px 0;"><span class="score-badge ' + scoreClass + '">' + l.score + '</span></td>' +
      '<td style="padding:12px 0; ' + actionColor + ' font-size:13px;">' + l.action + '</td>' +
      '<td style="padding:12px 0; text-align:right;">' + btnHtml + '</td>' +
      '</tr>';
  }).join('');
  document.getElementById('scanned-leads-tbody').innerHTML = leadsHtml;

  // === WHAT THEY DO ===
  let wtdSection = document.getElementById('scanned-whattheydo-section');
  if (data.whatTheyDo && data.whatTheyDo.length > 0) {
    wtdSection.style.display = 'block';
    document.getElementById('scanned-whattheydo').innerHTML = data.whatTheyDo.map(item =>
      '<div style="padding:16px;border:1px solid var(--border);border-radius:10px;background:linear-gradient(135deg,rgba(124,58,237,0.03) 0%,transparent 60%);">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
          '<div style="width:32px;height:32px;background:linear-gradient(135deg,#7C3AED,#A78BFA);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i data-lucide="' + item.icon + '" style="width:16px;height:16px;color:white"></i></div>' +
          '<h5 style="margin:0;font-size:14px;font-weight:700;color:var(--text-main)">' + item.title + '</h5>' +
        '</div>' +
        '<p style="margin:0;font-size:13px;line-height:1.6;color:var(--text-muted)">' + item.desc + '</p>' +
      '</div>'
    ).join('');
  } else {
    wtdSection.style.display = 'none';
  }

  // === KEY DIFFERENTIATORS ===
  let diffSection = document.getElementById('scanned-diff-section');
  if (data.differentiators && data.differentiators.length > 0) {
    diffSection.style.display = 'block';
    document.getElementById('scanned-differentiators').innerHTML = data.differentiators.map(d =>
      '<div style="display:flex;align-items:start;gap:10px;padding:10px 14px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;">' +
        '<span style="color:#F59E0B;font-size:16px;flex-shrink:0;margin-top:1px;">✦</span>' +
        '<span style="font-size:13px;color:#92400E;line-height:1.5">' + d + '</span>' +
      '</div>'
    ).join('');
  } else {
    diffSection.style.display = 'none';
  }

  // === RECENT STRATEGIC MOVES ===
  let movesSection = document.getElementById('scanned-moves-section');
  if (data.recentMoves && data.recentMoves.length > 0) {
    movesSection.style.display = 'block';
    document.getElementById('scanned-recentmoves').innerHTML = data.recentMoves.map((m, i) =>
      '<div style="display:flex;align-items:start;gap:14px;' + (i < data.recentMoves.length - 1 ? 'border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:12px;' : '') + '">' +
        '<div style="width:48px;height:28px;background:linear-gradient(135deg,#059669,#10B981);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="font-size:11px;font-weight:700;color:white">' + m.date + '</span></div>' +
        '<p style="margin:0;font-size:13px;color:var(--text-main);line-height:1.5">' + m.event + '</p>' +
      '</div>'
    ).join('');
  } else {
    movesSection.style.display = 'none';
  }
}

async function scrapeCompanyData(url, domain, companyName, lang = 'en') {
  let data = {
    name: companyName,
    tagline: '',
    description: '',
    industry: 'B2B / Technology Services',
    headcount: '51 – 200 employees',
    location: 'Global / Not specified',
    services: ['Core Platform', 'Professional Services', 'Enterprise Solutions'],
    techStack: ['Custom Stack'],
    socials: {},
    leads: [],
  };

  try {
    let html = '';
    // Build language-specific URL: try /<lang> path first, fallback to root
    let baseUrl = url.replace(/\/$/, '');
    let langUrl = lang !== 'en' ? baseUrl + '/' + lang : baseUrl;
    let proxyUrls = [
      'https://corsproxy.io/?' + encodeURIComponent(langUrl),
      'https://api.allorigins.win/raw?url=' + encodeURIComponent(langUrl),
      ...(lang !== 'en' ? [
        'https://corsproxy.io/?' + encodeURIComponent(baseUrl),
        'https://api.allorigins.win/raw?url=' + encodeURIComponent(baseUrl),
      ] : []),
      'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url),
    ];

    for (let proxyUrl of proxyUrls) {
      try {
        let response = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
        if (response.ok) {
          html = await response.text();
          if (html && html.length > 100) break;
        }
      } catch(innerErr) { continue; }
    }

    if (html && html.length > 100) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(html, 'text/html');
      let lowerHtml = html.toLowerCase();

      // Description
      let metaDesc = doc.querySelector('meta[name="description"]');
      let ogDesc = doc.querySelector('meta[property="og:description"]');
      data.description = (metaDesc && metaDesc.getAttribute('content')) || (ogDesc && ogDesc.getAttribute('content')) || '';
      if (!data.description || data.description.length < 15) {
        let paragraphs = doc.querySelectorAll('p');
        for (let p of paragraphs) {
          let txt = p.textContent.trim();
          if (txt.length > 40) { data.description = txt.substring(0, 300); break; }
        }
      }
      if (!data.description) data.description = companyName + ' is an industry leader delivering innovative solutions and strategic value worldwide.';

      // Tagline
      let ogTitle = doc.querySelector('meta[property="og:title"]');
      let titleEl = doc.querySelector('title');
      let tagline = (ogTitle && ogTitle.getAttribute('content')) || (titleEl && titleEl.textContent) || '';
      tagline = tagline.replace(companyName, '').replace(/[-|–]/g, '').trim();
      if (tagline.length >= 3 && tagline.length <= 80) data.tagline = tagline;

      // Social Links
      let allLinks = html.match(/href=["'][^"']*["']/gi) || [];
      for (let link of allLinks) {
        let href = link.replace(/href=["']/i, '').replace(/["']$/, '');
        if (/linkedin\.com\/(company|in)\//i.test(href) && !data.socials.linkedin) data.socials.linkedin = href;
        if (/(?:twitter|x)\.com\//i.test(href) && !/intent/i.test(href) && !data.socials.twitter) data.socials.twitter = href;
        if (/instagram\.com\//i.test(href) && !data.socials.instagram) data.socials.instagram = href;
        if (/facebook\.com\//i.test(href) && !data.socials.facebook) data.socials.facebook = href;
        if (/youtube\.com\//i.test(href) && !data.socials.youtube) data.socials.youtube = href;
        if (/tiktok\.com\//i.test(href) && !data.socials.tiktok) data.socials.tiktok = href;
      }

      // Industry
      if (lowerHtml.includes('yacht') || lowerHtml.includes('yachts') || lowerHtml.includes('marine') || lowerHtml.includes('nautical') || lowerHtml.includes('boat') || lowerHtml.includes('vessel') || lowerHtml.includes('sailing')) data.industry = 'Luxury Marine / Yacht Manufacturing';
      else if (lowerHtml.includes('biostimulant') || lowerHtml.includes('fertilizer') || lowerHtml.includes('crop') || lowerHtml.includes('agriculture')) data.industry = 'Agrochemicals / Biostimulants';
      else if (lowerHtml.includes('software') || lowerHtml.includes('saas') || lowerHtml.includes('platform')) data.industry = 'B2B SaaS / Enterprise Software';
      else if (lowerHtml.includes('finance') || lowerHtml.includes('banking') || lowerHtml.includes('fintech')) data.industry = 'Financial Services / Fintech';
      else if (lowerHtml.includes('health') || lowerHtml.includes('medical') || lowerHtml.includes('pharma')) data.industry = 'Healthcare / Healthtech';
      else if (lowerHtml.includes('logistics') || lowerHtml.includes('supply chain')) data.industry = 'Logistics / Supply Chain';
      else if (lowerHtml.includes('consulting') || lowerHtml.includes('advisory')) data.industry = 'Consulting / Professional Services';
      else if (lowerHtml.includes('marketing') || lowerHtml.includes('advertising')) data.industry = 'Marketing / Advertising';
      else if (lowerHtml.includes('manufacturing') || lowerHtml.includes('industrial')) data.industry = 'Manufacturing / Industrial';

      // Location
      let geoMeta = doc.querySelector('meta[name="geo.placename"]') || doc.querySelector('meta[name="geo.region"]');
      if (geoMeta) data.location = geoMeta.getAttribute('content');
      if (!data.location || data.location === 'Global / Not specified') {
        let addressEl = doc.querySelector('address');
        if (addressEl) data.location = addressEl.textContent.trim().substring(0, 80);
      }

      // Services from nav links
      let navLinks = doc.querySelectorAll('nav a, header a, [class*="menu"] a, [class*="nav"] a');
      let seen = new Set();
      let navServices = [];
      navLinks.forEach(a => {
        let text = a.textContent.trim();
        if (text.length > 2 && text.length < 40 && !seen.has(text.toLowerCase())) {
          let lower = text.toLowerCase();
          if (!['home', 'about', 'contact', 'blog', 'news', 'career', 'login', 'cookie', 'privacy', 'terms', 'search', 'menu', 'close'].includes(lower) && !/^\d+$/.test(text)) {
            seen.add(lower);
            navServices.push(text);
          }
        }
      });
      if (navServices.length > 2) data.services = navServices.slice(0, 10);

      // Tech Stack
      let detectedTech = [];
      if (lowerHtml.includes('react') || lowerHtml.includes('__next')) detectedTech.push('React');
      if (lowerHtml.includes('wordpress') || lowerHtml.includes('wp-content')) detectedTech.push('WordPress');
      if (lowerHtml.includes('shopify')) detectedTech.push('Shopify');
      if (lowerHtml.includes('hubspot')) detectedTech.push('HubSpot');
      if (lowerHtml.includes('google-analytics') || lowerHtml.includes('gtag') || lowerHtml.includes('gtm')) detectedTech.push('Google Analytics');
      if (lowerHtml.includes('cloudflare')) detectedTech.push('Cloudflare');
      if (lowerHtml.includes('stripe')) detectedTech.push('Stripe');
      if (detectedTech.length > 0) data.techStack = detectedTech;
    }
  } catch(e) {
    // fallback: keep defaults
  }

  return data;
}

// --- Dynamic View Generators ---
function generateViewHTML(view) {
  const views = {
    'dashboard': `
      <div class="view-section active">
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-h">
              <span class="kpi-label">Active Prospects</span>
              <div class="kpi-icon"><i data-lucide="users"></i></div>
            </div>
            <div class="kpi-val">${leadsData.length}</div>
            <div class="kpi-trend trend-up"><i data-lucide="trending-up" style="width:14px"></i> +6 since Cannes 2025</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-h">
              <span class="kpi-label">Hot Opportunities</span>
              <div class="kpi-icon"><i data-lucide="target"></i></div>
            </div>
            <div class="kpi-val">${leadsData.filter(l=>l.status==='hot').length}</div>
            <div class="kpi-trend trend-up"><i data-lucide="trending-up" style="width:14px"></i> Sea trials confirmed</div>
          </div>
          <div class="kpi-card ai-kpi">
            <div class="kpi-h">
              <span class="kpi-label">Avg Closing Probability</span>
              <div class="kpi-icon"><i data-lucide="sparkles"></i></div>
            </div>
            <div class="kpi-val">${Math.round(leadsData.reduce((s,l)=>s+l.closingProb,0)/leadsData.length)}%</div>
            <div class="kpi-trend" style="color:var(--ai-accent)"><i data-lucide="zap" style="width:14px"></i> Predictive Score</div>
          </div>
          <div class="kpi-card danger-kpi">
            <div class="kpi-h">
              <span class="kpi-label">Dormant Prospects</span>
              <div class="kpi-icon"><i data-lucide="alert-triangle"></i></div>
            </div>
            <div class="kpi-val">${leadsData.filter(l=>l.status==='dormant').length}</div>
            <div class="kpi-trend trend-down"><i data-lucide="trending-down" style="width:14px"></i> Reactivation recommended</div>
          </div>
        </div>

        <!-- Strategic Recommendations -->
        <div class="kpi-grid" style="grid-template-columns:1fr 1fr 1fr 1fr; margin-top:24px;">
          <div class="card" style="padding:16px; border-left:4px solid #EF4444;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
              <span style="font-size:18px;">🔥</span>
              <strong style="font-size:13px; color:var(--text-main);">Priority Prospect</strong>
            </div>
            <p style="font-size:13px; color:var(--text-muted); line-height:1.5; margin:0 0 12px 0;">John Mitchell — Score 95. Meeting booked Apr 22 for 500-seat deployment.</p>
            <button class="insight-action"><i data-lucide="send" style="width:12px"></i> Draft message</button>
          </div>
          <div class="card" style="padding:16px; border-left:4px solid #F59E0B;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
              <span style="font-size:18px;">⚠️</span>
              <strong style="font-size:13px; color:var(--text-main);">Reactivation Alert</strong>
            </div>
            <p style="font-size:13px; color:var(--text-muted); line-height:1.5; margin:0 0 12px 0;">Marcus Webb dormant 38 days. Was in final vendor selection — time to re-engage.</p>
            <button class="insight-action"><i data-lucide="calendar" style="width:12px"></i> Send reactivation</button>
          </div>
          <div class="card" style="padding:16px; border-left:4px solid #3B82F6;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
              <span style="font-size:18px;">💡</span>
              <strong style="font-size:13px; color:var(--text-main);">Market Signal</strong>
            </div>
            <p style="font-size:13px; color:var(--text-muted); line-height:1.5; margin:0 0 12px 0;">Competitor pricing up +8% QoQ. Value advantage on Enterprise tier — brief sales team.</p>
            <button class="insight-action"><i data-lucide="refresh-cw" style="width:12px"></i> View Price Intelligence</button>
          </div>
          <div class="card" style="padding:16px; border-left:4px solid #7C3AED;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
              <span style="font-size:18px;">📅</span>
              <strong style="font-size:13px; color:var(--text-main);">Upcoming Event</strong>
            </div>
            <p style="font-size:13px; color:var(--text-muted); line-height:1.5; margin:0 0 12px 0;">SaaStr Annual in 45 days. 5 prospects flagged for VIP dinner — send invites.</p>
            <button class="insight-action"><i data-lucide="users" style="width:12px"></i> View prospect list</button>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:300px; display:flex; flex-direction:column;">
            <h3 class="card-title"><i data-lucide="bar-chart-3"></i> Conversion Rate (Pipeline)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="conversionChart"></canvas></div>
          </div>
          <div class="card" style="height:300px; display:flex; flex-direction:column;">
            <h3 class="card-title"><i data-lucide="anchor"></i> Pipeline by Event Source</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="dashEventChart"></canvas></div>
          </div>
          <div class="card" style="height:300px; display:flex; flex-direction:column;">
            <h3 class="card-title"><i data-lucide="map-pin"></i> Prospects by Region</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="dashRegionChart"></canvas></div>
          </div>
        </div>
      </div>
    `,
    'lead-gen': `
      <div class="view-section active">
        <div class="flex-split">
          <div>
            <h2 style="font-family: var(--font-heading); font-size:24px;">Lead Generation</h2>
            <p style="color:var(--text-muted); font-size:14px;">Explore and prioritize automatically enriched prospects.</p>
          </div>
          <button class="btn-sm btn-primary"><i data-lucide="plus"></i> New Lead / Import</button>
        </div>

        <div class="data-table-wrap">
          <div class="table-header">
            <h3>Active Prospects Database</h3>
            <div class="table-filters">
              <button class="filter-btn">Industry <i data-lucide="chevron-down" style="width:14px;vertical-align:middle"></i></button>
              <button class="filter-btn">AI Score > 80</button>
              <button class="filter-btn"><i data-lucide="settings-2" style="width:14px;vertical-align:middle"></i> Filters</button>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Prospect</th>
                <th>Industry</th>
                <th>AI Score</th>
                <th>AI Recommendation (Next Action)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="cell-lead">
                    <div class="cell-avatar" style="background:#E3F2FD;color:#1976D2">G</div>
                    <div class="cell-info">
                      <strong>GlobalTech Solutions</strong>
                      <span>Sarah Jenkins (VP of Sales)</span>
                    </div>
                  </div>
                </td>
                <td>Software / SaaS</td>
                <td><div class="score-badge score-high">94</div></td>
                <td><span style="color:var(--ai-accent);font-weight:600;font-size:12px"><i data-lucide="linkedin" style="width:14px;vertical-align:middle"></i> Send LinkedIn connection now (High Reply Rate)</span></td>
                <td><button class="btn-sm btn-ai"><i data-lucide="zap"></i> Generate Msg</button></td>
                <td><button class="btn-sm btn-ai"><i data-lucide="zap"></i> Generar Msg</button></td>
              </tr>
              <tr>
                <td>
                  <div class="cell-lead">
                    <div class="cell-avatar" style="background:#FCE4EC;color:#C2185B">V</div>
                    <div class="cell-info">
                      <strong>Vortex Dynamics</strong>
                      <span>Michael Chang (Head of Growth)</span>
                    </div>
                  </div>
                </td>
                <td>Manufacturing</td>
                <td><div class="score-badge score-high">88</div></td>
                <td><span style="color:var(--text-muted);font-size:12px">Wait for industry event in 2 weeks</span></td>
                <td><button class="btn-sm btn-ai"><i data-lucide="zap"></i> Sequence</button></td>
              </tr>
              <tr>
                <td>
                  <div class="cell-lead">
                    <div class="cell-avatar" style="background:#FFF3E0;color:#F57C00">I</div>
                    <div class="cell-info">
                      <strong>Innovate Finance</strong>
                      <span>Carla Rossi (CMO)</span>
                    </div>
                  </div>
                </td>
                <td>Fintech</td>
                <td><div class="score-badge score-med">65</div></td>
                <td><span style="color:var(--text-muted);font-size:12px"><i data-lucide="mail"></i> Send follow-up email (Day 3)</span></td>
                <td><button class="btn-sm btn-ai"><i data-lucide="zap"></i> Auto-Draft</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    'opportunities': `
      <div class="view-section active">
        <div class="flex-split">
          <div>
            <h2 style="font-family: var(--font-heading); font-size:24px;">Opportunities Pipeline</h2>
            <p style="color:var(--text-muted); font-size:14px;">Monitor deals and AI-predicted close probability.</p>
          </div>
          <button class="btn-sm btn-primary"><i data-lucide="layout-grid"></i> Views</button>
        </div>

        <div class="kanban-board">
          <!-- Col 1 -->
          <div class="kanban-col">
            <div class="kanban-col-head">
              <span>Discovery</span>
              <span class="k-badge">3 Deals</span>
            </div>
            
            <div class="k-card">
              <div class="k-org">NexGen Corp</div>
              <div class="k-val">$12,500</div>
              <div class="k-ai-rec"><i data-lucide="brain"></i> Close propensity: 34%</div>
            </div>
            <div class="k-card">
              <div class="k-org">Alpha Retailers</div>
              <div class="k-val">$8,000</div>
              <div class="k-ai-rec"><i data-lucide="brain"></i> Close propensity: 41%</div>
            </div>
          </div>

          <!-- Col 2 -->
          <div class="kanban-col">
            <div class="kanban-col-head">
              <span>Demo / Meeting Set</span>
              <span class="k-badge">2 Deals</span>
            </div>
            
            <div class="k-card">
              <div class="k-org">GlobalTech Solutions</div>
              <div class="k-val">$45,000</div>
              <div class="k-ai-rec" style="background:#E3F8EE;color:#16A34A"><i data-lucide="trending-up"></i> Close propensity: 89% (Hot)</div>
              <p style="font-size:11px;color:var(--text-muted);margin-top:8px;"><i data-lucide="calendar" style="width:12px"></i> Demo tomorrow 10 AM</p>
            </div>
          </div>

          <!-- Col 3 -->
          <div class="kanban-col">
            <div class="kanban-col-head">
              <span>Negotiation</span>
              <span class="k-badge">1 Deal</span>
            </div>
            
            <div class="k-card">
              <div class="k-org">Apex Logistics</div>
              <div class="k-val">$22,000</div>
              <div class="k-ai-rec" style="background:#FFF1F2;color:#E11D48"><i data-lucide="alert-circle"></i> Alert: No response to proposal</div>
            </div>
          </div>

        </div>
      </div>
    `,
    'follow-ups': `
      <div class="view-section active">
        <div class="flex-split">
          <div>
            <h2 style="font-family: var(--font-heading); font-size:24px;">Follow-up Engine</h2>
            <p style="color:var(--text-muted); font-size:14px;">Automated sequences and dynamic AI suggestions.</p>
          </div>
        </div>
        
        <div class="card">
          <h3 class="card-title">Active Sequences Today (Timeline)</h3>
          <div class="timeline">
            <div class="ti-item">
              <div class="ti-dot"></div>
              <div class="ti-card">
                <div class="ti-info">
                  <h4>Campaign: Q1 Recovery</h4>
                  <p>Sending Step 3 (Case Studies) to 145 prospects in 15 mins.</p>
                  <span class="ti-ai-note">AI optimized send times based on lead time zones.</span>
                </div>
                <button class="btn-sm" style="border:1px solid var(--border)"><i data-lucide="pause"></i></button>
              </div>
            </div>
            <div class="ti-item">
              <div class="ti-dot" style="border-color:var(--text-light)"></div>
              <div class="ti-card" style="opacity:0.7">
                <div class="ti-info">
                  <h4>Campaign: Cold Outbound LinkedIn</h4>
                  <p>12 connection requests sent 2 hours ago.</p>
                  <span style="color:var(--success);font-size:11px;font-weight:600;margin-top:6px;display:block">3 accepted (25% conversion)</span>
                </div>
                <button class="btn-sm" style="border:1px solid var(--border)"><i data-lucide="eye"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    'company-bio': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #27272A 0%, #09090B 100%)">
          <div class="agent-bigicon">🌐</div>
          <div class="agent-header-text">
            <h2>Company Bio Scanner</h2>
            <p>Scan a client's website in real-time to generate a comprehensive AI company breakdown and contact strategy.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> Ready</div><br>
            <span class="agent-tag">AI Web Indexer</span>
          </div>
        </div>
        
        <div class="card" style="margin-top:24px; padding:24px">
          <h3 class="card-title" style="margin-bottom:16px;">Target Website</h3>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
            <span style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; white-space:nowrap;">Scan language</span>
            <div style="display:flex; gap:6px;" id="lang-selector">
              <button onclick="setScanLanguage('en')" data-lang="en" style="padding:5px 12px;border-radius:6px;border:1px solid var(--ai-accent);background:var(--ai-accent);color:white;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font-main)"><img src="https://flagcdn.com/16x12/gb.png" style="vertical-align:middle;margin-right:5px;border-radius:2px"> EN</button>
              <button onclick="setScanLanguage('it')" data-lang="it" style="padding:5px 12px;border-radius:6px;border:1px solid var(--border);background:white;color:var(--text-main);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font-main)"><img src="https://flagcdn.com/16x12/it.png" style="vertical-align:middle;margin-right:5px;border-radius:2px"> IT</button>
              <button onclick="setScanLanguage('es')" data-lang="es" style="padding:5px 12px;border-radius:6px;border:1px solid var(--border);background:white;color:var(--text-main);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font-main)"><img src="https://flagcdn.com/16x12/es.png" style="vertical-align:middle;margin-right:5px;border-radius:2px"> ES</button>
              <button onclick="setScanLanguage('fr')" data-lang="fr" style="padding:5px 12px;border-radius:6px;border:1px solid var(--border);background:white;color:var(--text-main);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font-main)"><img src="https://flagcdn.com/16x12/fr.png" style="vertical-align:middle;margin-right:5px;border-radius:2px"> FR</button>
              <button onclick="setScanLanguage('de')" data-lang="de" style="padding:5px 12px;border-radius:6px;border:1px solid var(--border);background:white;color:var(--text-main);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font-main)"><img src="https://flagcdn.com/16x12/de.png" style="vertical-align:middle;margin-right:5px;border-radius:2px"> DE</button>
            </div>
          </div>
          <div style="display:flex; gap:12px;">
            <input type="text" id="company-url-input" placeholder="e.g. https://www.acme-corp.com" style="flex:1; padding:12px; border:1px solid var(--border); border-radius:6px; font-size:14px; outline:none; font-family:var(--font-main);" />
            <button class="lm-btn-primary" style="padding:0 24px" onclick="scanCompanyBio()"><i data-lucide="scan" style="width:18px;margin-right:8px;vertical-align:middle"></i> Scan Web</button>
          </div>
        </div>

        <div id="company-bio-empty" class="empty-state" style="margin-top:24px; text-align:center; padding:64px 24px; background:white; border-radius:12px; border:1px dashed var(--border);">
          <div style="font-size:48px; margin-bottom:16px; opacity:0.6">🏢</div>
          <h3 style="font-size:18px; color:var(--text-main); margin-bottom:8px;">No website scanned yet</h3>
          <p style="color:var(--text-muted); font-size:14px; max-width:400px; margin:0 auto;">Enter a URL above and let our AI agents extract the company profile, ICP match, and key decision makers.</p>
        </div>

        <!-- HIDDEN BY DEFAULT: APPEARS ON SCAN -->
        <div id="company-bio-results" style="display:none; margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:18px; color:var(--text-main); font-weight:600; margin:0;">AI Analysis Results</h3>
            <span style="font-size:12px; font-weight:600; padding:4px 12px; border-radius:99px; background:#ECFDF5; color:#059669; border:1px solid #A7F3D0; white-space:nowrap;">Data Freshness: Today</span>
          </div>

          <!-- MAIN CARD: Company Identity -->
          <div class="card" style="padding:0; overflow:hidden;">
            <div style="padding:24px;">
              <div style="display:flex; gap:16px; align-items:center;">
                <div id="scanned-company-initial" style="width:64px;height:64px;border-radius:12px;background:linear-gradient(135deg,#7C3AED,#A78BFA);color:white;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;flex-shrink:0;">
                  A
                </div>
                <div style="flex:1;min-width:0;">
                  <h2 id="scanned-company-name" style="margin:0 0 2px 0; font-size:22px; color:var(--text-main)">Company Name</h2>
                  <div id="scanned-tagline" style="font-size:13px; color:var(--ai-accent); font-style:italic; margin-bottom:4px;"></div>
                  <a id="scanned-company-url-link" href="#" target="_blank" style="color:var(--text-muted);font-size:13px;text-decoration:none;"><i data-lucide="external-link" style="width:12px;vertical-align:middle;margin-right:4px;"></i>domain.com</a>
                </div>
              </div>
            </div>

            <div style="border-top:1px solid var(--border);"></div>

            <!-- Firmographics Row -->
            <div style="padding:16px 24px; display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:16px;">
              <div>
                <p style="margin:0 0 4px 0; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted);">Industry</p>
                <p id="scanned-industry" style="margin:0; font-size:15px; font-weight:700; color:var(--text-main);">—</p>
              </div>
              <div>
                <p style="margin:0 0 4px 0; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted);">Est. Headcount</p>
                <p id="scanned-headcount" style="margin:0; font-size:15px; font-weight:700; color:var(--text-main);">—</p>
              </div>
              <div>
                <p style="margin:0 0 4px 0; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted);">Location</p>
                <p id="scanned-location" style="margin:0; font-size:15px; font-weight:700; color:var(--text-main);">—</p>
              </div>
              <div>
                <p style="margin:0 0 4px 0; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted);">Tech Stack</p>
                <div id="scanned-tech-stack" style="margin:0;"></div>
              </div>
            </div>

            <div style="border-top:1px solid var(--border);"></div>

            <!-- Services / Product Lines Bar -->
            <div style="padding:16px 24px; background:linear-gradient(90deg, rgba(124,58,237,0.06) 0%, transparent 60%);">
              <p style="margin:0 0 8px 0; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#7C3AED;"><i data-lucide="package" style="width:12px;vertical-align:middle;margin-right:4px"></i> Product Lines / Services</p>
              <div id="scanned-services"></div>
            </div>

            <div style="border-top:1px solid var(--border);"></div>

            <!-- Online Presence (social grid) -->
            <div style="padding:16px 24px;">
              <p style="margin:0 0 10px 0; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--ai-accent);"><i data-lucide="globe" style="width:12px;vertical-align:middle;margin-right:4px"></i> Online Presence</p>
              <div id="scanned-social-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;"></div>
            </div>
          </div>

          <!-- ABOUT THE COMPANY -->
          <div class="card" style="margin-top:16px; padding:24px;">
            <h4 style="margin:0 0 12px 0; font-size:14px; font-weight:700; color:var(--text-main);"><i data-lucide="info" style="width:14px;vertical-align:middle;margin-right:6px;color:var(--ai-accent)"></i>About the Company</h4>
            <p id="scanned-company-desc" style="color:var(--text-muted);font-size:14px;line-height:1.7; margin:0;">
              Loading description...
            </p>
          </div>

          <!-- WHAT THEY DO -->
          <div id="scanned-whattheydo-section" class="card" style="margin-top:16px; padding:24px; display:none;">
            <h4 style="margin:0 0 16px 0; color:var(--text-muted); font-size:12px; text-transform:uppercase; letter-spacing:1px;"><i data-lucide="briefcase" style="width:14px;vertical-align:middle;margin-right:6px;color:var(--ai-accent)"></i>What They Do</h4>
            <div id="scanned-whattheydo" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;"></div>
          </div>

          <!-- KEY DIFFERENTIATORS -->
          <div id="scanned-diff-section" class="card" style="margin-top:16px; padding:24px; display:none;">
            <h4 style="margin:0 0 16px 0; color:var(--text-muted); font-size:12px; text-transform:uppercase; letter-spacing:1px;"><i data-lucide="star" style="width:14px;vertical-align:middle;margin-right:6px;color:#F59E0B"></i>Key Differentiators</h4>
            <div id="scanned-differentiators" style="display:flex; flex-direction:column; gap:8px;"></div>
          </div>

          <!-- RECENT STRATEGIC MOVES -->
          <div id="scanned-moves-section" class="card" style="margin-top:16px; padding:24px; display:none;">
            <h4 style="margin:0 0 16px 0; color:var(--text-muted); font-size:12px; text-transform:uppercase; letter-spacing:1px;"><i data-lucide="trending-up" style="width:14px;vertical-align:middle;margin-right:6px;color:#10B981"></i>Recent Strategic Moves</h4>
            <div id="scanned-recentmoves"></div>
          </div>

          <!-- ICP MATCH -->
          <div class="card" style="margin-top:16px; padding:24px;">
             <h4 style="margin:0 0 16px 0; color:var(--text-muted); font-size:12px; text-transform:uppercase; letter-spacing:1px;">AI ICP MATCH EVALUATION</h4>
             <div style="padding:16px; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; display:flex; align-items:start; gap:16px;">
               <div style="background:#16A34A; color:white; padding:8px; border-radius:50%; display:flex; align-items:center;justify-content:center;flex-shrink:0;"><i data-lucide="check" style="width:20px;height:20px"></i></div>
                 <div>
                   <h4 id="scanned-icp-score" style="margin:0 0 4px 0; color:#166534; font-size:16px">Perfect ICP Match</h4>
                   <p id="scanned-icp-text" style="margin:0; font-size:14px; color:#15803D; line-height:1.5;">This company fits exactly into your Tier 1 Ideal Customer Profile. High probability of closing based on tech stack synergy and funding stage.</p>
                 </div>
               </div>
               <button class="lm-btn-primary" style="margin-top:16px; width:100%; justify-content:center"><i data-lucide="plus-circle" style="width:16px;margin-right:8px"></i> Extract Founders & Add to Pipeline</button>
             </div>
          </div>
          
          <!-- Key Decision Makers (Lead Gen) -->
          <div class="card" style="margin-top:16px; padding:24px;">
             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
               <h4 style="margin:0; color:var(--text-muted); font-size:12px; text-transform:uppercase; letter-spacing:1px;"><i data-lucide="users" style="width:14px;vertical-align:middle;margin-right:4px;"></i> Key Decision Makers & Leads</h4>
               <button class="lm-btn-outline" style="padding:4px 12px; font-size:12px"><i data-lucide="download" style="width:12px"></i> Export</button>
             </div>
             
             <div style="overflow-x:auto;">
               <table class="data-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
                 <thead style="border-bottom:1px solid var(--border);">
                   <tr>
                     <th style="padding:12px 0; color:var(--text-muted); font-weight:600">Prospect</th>
                     <th style="padding:12px 0; color:var(--text-muted); font-weight:600">AI Score</th>
                     <th style="padding:12px 0; color:var(--text-muted); font-weight:600">Next Action</th>
                     <th style="padding:12px 0; color:var(--text-muted); font-weight:600"></th>
                   </tr>
                 </thead>
                 <tbody id="scanned-leads-tbody">
                 </tbody>
               </table>
             </div>
          </div>
      </div>
    `,

    // ── GROWTH ENGINE AI AGENTS ──

    'leadminer': `
      <div class="view-section active">
        <div class="agent-header">
          <div class="agent-bigicon">🔍</div>
          <div class="agent-header-text">
            <h2>LeadMiner™</h2>
            <p>Your complete prospect database — identifies, enriches, and tracks high-net-worth buyers from boat shows, dealer networks, web inquiries, and owner referrals. Every lead with full context and outreach status.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">Continuous Enrichment</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">${getLeadStats().total}</div>
            <div class="agent-stat-lbl">Leads in database</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${getLeadStats().icpPct}%</div>
            <div class="agent-stat-lbl">Contacted at least once</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${getLeadStats().mailSent}</div>
            <div class="agent-stat-lbl">Emails sent</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${getLeadStats().liSent}</div>
            <div class="agent-stat-lbl">LinkedIn contacted</div>
          </div>
        </div>

        <div class="lm-table-wrap">
          <div class="lm-toolbar">
            <div class="lm-toolbar-left">
              <span class="lm-breadcrumb">Template &rsaquo; <strong>Leads</strong></span>
            </div>
            <div class="lm-toolbar-right">
              <button class="lm-btn-outline"><i data-lucide="layout-list" style="width:14px"></i> Group</button>
              <button class="lm-btn-outline"><i data-lucide="sliders-horizontal" style="width:14px"></i> Filter</button>
              <button class="lm-btn-outline"><i data-lucide="download" style="width:14px"></i> Export</button>
              <button class="lm-btn-add"><i data-lucide="plus" style="width:14px"></i> Add Lead</button>
            </div>
          </div>

          <div style="overflow-x:auto">
            <table class="lm-table">
              <thead>
                <tr>
                  <th><input type="checkbox" class="lm-check"></th>
                  <th>Name <i data-lucide="chevrons-up-down" style="width:12px;opacity:0.4;vertical-align:middle"></i></th>
                  <th>Context</th>
                  <th>Profile</th>
                  <th>Source / Since</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Email Sent</th>
                  <th>LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                ${buildLeadRows()}
              </tbody>
            </table>
          </div>

          <div class="lm-footer">
            <span>Showing ${getLeadStats().total} leads · <button class="lm-link">View all</button></span>
            <div style="display:flex;gap:8px">
              <button class="lm-btn-outline">← Previous</button>
              <button class="lm-btn-outline">Next →</button>
            </div>
          </div>
        </div>
      </div>
    `,


    'icp-scorer': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #8E54E9 0%, #4776E6 100%)">
          <div class="agent-bigicon">🎯</div>
          <div class="agent-header-text">
            <h2>ICP Scorer™</h2>
            <p>Ranks every prospect by likelihood to purchase — based on wealth profile, engagement behavior, model interest, and buying signals. Tells your team exactly who to focus on and why.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">Updates Continuously</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">${leadsData.length}</div>
            <div class="agent-stat-lbl">Leads in database</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${leadsData.filter(l => l.icpScore >= 80).length}</div>
            <div class="agent-stat-lbl">Hot Leads (Score ≥ 80)</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${leadsData.filter(l => l.status === 'hot').length}</div>
            <div class="agent-stat-lbl">Top Priority (Hot 🔥)</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${Math.round(leadsData.reduce((s,l)=>s+l.icpScore,0)/leadsData.length)}</div>
            <div class="agent-stat-lbl">Average ICP Score</div>
          </div>
        </div>

        <div class="data-table-wrap">
          <div class="table-header">
            <h3>Lead Ranking by ICP Score <span style="font-size:11px;font-weight:500;color:var(--text-muted)">(${leadsData.length} leads · sorted by score)</span></h3>
            <div class="table-filters">
              <button class="filter-btn">Hot Only 🔥</button>
              <button class="filter-btn">Export</button>
            </div>
          </div>
          <table class="data-table">
            <thead><tr><th>Lead</th><th>ICP Score</th><th>Primary Signal</th><th>Close Prob. (AI)</th><th>Channel</th><th>Action</th></tr></thead>
            <tbody>${buildIcpRows()}</tbody>
          </table>
        </div>
      </div>
    `,

    'message-tailor': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)">
          <div class="agent-bigicon">✍️</div>
          <div class="agent-header-text">
            <h2>MessageTailor™</h2>
            <p>Crafts personalized outreach for each prospect — adapted to their profile, preferred channel, buying stage, and the specific yacht model they showed interest in. Every message feels one-to-one.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">Personalized Outreach</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">${getLeadStats().mailSent + getLeadStats().liSent}</div>
            <div class="agent-stat-lbl">Total messages sent</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${[...new Set(leadsData.map(l=>l.channel))].length}</div>
            <div class="agent-stat-lbl">Active channels</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${leadsData.filter(l=>l.status==='hot'||l.status==='active').length}</div>
            <div class="agent-stat-lbl">Leads with priority message</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${getTopLead().icpScore}</div>
            <div class="agent-stat-lbl">Top lead score (next to contact)</div>
          </div>
        </div>

        <div class="card" style="margin-bottom:20px; border:1px solid rgba(142,84,233,0.2);background:linear-gradient(180deg,white,#FAF5FF)">
          <h3 class="card-title"><i data-lucide="sparkles"></i> AI-generated message for ICP Scorer's #1 lead</h3>
          <div style="background:#F8F9FF;border-radius:10px;padding:20px;border:1px dashed rgba(142,84,233,0.3)">
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px"><strong>To:</strong> ${getTopLead().name} · <strong>Org:</strong> ${getTopLead().org} · <strong>Channel:</strong> ${getTopLead().channel} · <strong>Score:</strong> ${getTopLead().icpScore}</p>
            <p style="font-size:14px;line-height:1.7;color:var(--text-main)">"Dear ${getTopLead().name.split(' ')[0]}, it was a pleasure connecting at the show. Following up on your interest — I would be delighted to arrange a private viewing of the vessel at our Piacenza shipyard, where you can experience the craftsmanship and interior options firsthand. We have select build slots available for late 2026 delivery. Would next week work for a brief call to discuss configuration preferences?"</p>
            <div style="display:flex;gap:10px;margin-top:14px">
              <button class="btn-sm btn-primary"><i data-lucide="send"></i> Send now</button>
              <button class="btn-sm btn-ai"><i data-lucide="refresh-cw"></i> Regenerate variant</button>
              <button class="btn-sm" style="border:1px solid var(--border)"><i data-lucide="edit-3"></i> Edit</button>
            </div>
          </div>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎭</div>
            <h4>Adaptive Tone</h4>
            <p>Adjusts the message style based on the buyer profile — formal for family offices, warm for returning owners, concierge-level for UHNWI prospects.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📡</div>
            <h4>Native Multichannel</h4>
            <p>Generates tailored variants for Email, LinkedIn, and WhatsApp — each adapted to channel etiquette and the prospect’s preferred communication style.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h4>Context-Aware</h4>
            <p>References the specific model of interest, last interaction (sea trial, boat show visit, brochure download), and timing for maximum relevance.</p>
          </div>
        </div>
      </div>
    `,

    'outreach-flow': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #3ECF8E 0%, #0EA5E9 100%)">
          <div class="agent-bigicon">📤</div>
          <div class="agent-header-text">
            <h2>OutreachFlow™</h2>
            <p>Orchestrates the full outreach journey across email, LinkedIn, and WhatsApp — adapting timing and channel based on how each prospect responds. Designed for long-cycle, relationship-driven sales.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> 3 Active Sequences</div><br>
            <span class="agent-tag">Adaptive Cadence</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">${getOutreachStats().inSeq}</div>
            <div class="agent-stat-lbl">Leads in active sequences</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${getOutreachStats().replied}</div>
            <div class="agent-stat-lbl">Replied on both channels</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${getOutreachStats().channels}</div>
            <div class="agent-stat-lbl">Active channels in use</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${getOutreachStats().meetingRate}%</div>
            <div class="agent-stat-lbl">Dual-channel reply rate</div>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title"><i data-lucide="git-branch"></i> Sequence: Post-Boat Show Follow-Up — 6 touchpoints</h3>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-num">1</div>
              <div class="seq-body">
                <h4>Personal Thank You Email</h4>
                <p>Personalized follow-up referencing the specific model viewed and conversation at the show. Sent: Day 1 after event.</p>
                <div class="seq-channels"><span class="ch-badge">📧 Email</span><span class="act-score" style="color:var(--success);margin-left:8px">62% open rate</span></div>
              </div>
            </div>
            <div class="seq-step">
              <div class="seq-num">2</div>
              <div class="seq-body">
                <h4>Brochure & Configuration Options</h4>
                <p>If email opened: send digital brochure + interior configuration link. If not opened: resend with adjusted subject line. Day 4.</p>
                <div class="seq-channels"><span class="ch-badge">📧 Email</span><span class="act-score" style="color:var(--warning);margin-left:8px">48% click rate</span></div>
              </div>
            </div>
            <div class="seq-step">
              <div class="seq-num">3</div>
              <div class="seq-body">
                <h4>LinkedIn Connection + Shipyard Invitation</h4>
                <p>Connect on LinkedIn with a note referencing the show meeting. Include an invitation to visit the Piacenza shipyard. Day 7.</p>
                <div class="seq-channels"><span class="ch-badge">💼 LinkedIn</span><span class="act-score" style="color:var(--success);margin-left:8px">55% acceptance</span></div>
              </div>
            </div>
            <div class="seq-step">
              <div class="seq-num">4</div>
              <div class="seq-body">
                <h4>Sea Trial Invitation (if engaged)</h4>
                <p>If prospect opened brochure or accepted LinkedIn: invite to exclusive sea trial event. If no engagement: send lifestyle content instead. Day 14.</p>
                <div class="seq-channels"><span class="ch-badge">📧 Email</span><span class="ch-badge">💬 WhatsApp</span></div>
              </div>
            </div>
            <div class="seq-step">
              <div class="seq-num">5</div>
              <div class="seq-body">
                <h4>Build Slot Availability Update</h4>
                <p>Notify about remaining delivery slots for their model of interest. Creates urgency without pressure. Day 21.</p>
                <div class="seq-channels"><span class="ch-badge">📧 Email</span></div>
              </div>
            </div>
            <div class="seq-step">
              <div class="seq-num">6</div>
              <div class="seq-body">
                <h4>Dealer Handoff or Direct Call</h4>
                <p>If high engagement: schedule a direct call with commercial team. If moderate: warm handoff to nearest authorized dealer. Day 30.</p>
                <div class="seq-channels"><span class="ch-badge">💬 WhatsApp</span><span class="ch-badge">📧 Email</span><span class="act-score" style="color:var(--success);margin-left:8px">28% conversion to meeting</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    'smart-nurture': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #EC4899 0%, #8E54E9 100%)">
          <div class="agent-bigicon">💬</div>
          <div class="agent-header-text">
            <h2>Smart Nurture™</h2>
            <p>Keeps dormant prospects warm by detecting re-engagement signals — a brochure reopened, a boat show approaching, a competitor price change — and triggers the right message at the right moment to bring them back into the pipeline.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> Monitoring</div><br>
            <span class="agent-tag">Intent-Triggered</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">${getDormantLeads().length}</div>
            <div class="agent-stat-lbl">Dormant leads detected</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${Math.round(getDormantLeads().reduce((s,l)=>s+l.icpScore,0)/(getDormantLeads().length||1))}</div>
            <div class="agent-stat-lbl">Avg. ICP Score (dormant)</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">${getDormantLeads().filter(l=>l.mailSent||l.liSent).length}</div>
            <div class="agent-stat-lbl">Previously contacted</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">90 days</div>
            <div class="agent-stat-lbl">Monitoring window</div>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title"><i data-lucide="zap"></i> Dormant leads ready to reactivate (${getDormantLeads().length})</h3>
          <div class="activity-feed">
            ${getDormantLeads().map(l => `
            <div class="act-item">
              <div class="act-avatar" style="font-size:16px">${l.name[0]}${l.org[0]}</div>
              <div class="act-body">
                <strong>${l.name} · ${l.org}</strong>
                <p>${l.signal} — Recommended channel: <strong>${l.channel}</strong></p>
              </div>
              <span class="act-score" style="color:${l.icpScore>=70?'var(--warning)':'var(--text-light)'}">${l.icpScore} pts</span>
              <button class="btn-sm btn-ai" style="flex-shrink:0"><i data-lucide="send"></i> Reactivate</button>
            </div>
            `).join('')}
          </div>
        </div>
      </div>
    `,

    // ══════════════════════════════════════════╗
    //   COMPETITIVE INTELLIGENCE VIEWS          ║
    // ══════════════════════════════════════════╝

    'ci-pricing': `
      <div class="view-section active">
        <div class="agent-header" style="background:linear-gradient(135deg,#F59E0B 0%,#EF4444 100%)">
          <div class="agent-bigicon">💰</div>
          <div class="agent-header-text">
            <h2>Pricing Intelligence</h2>
            <p>Monitoreo en tiempo real de precios, estrategias y movimientos de pricing de competidores. Detecta oportunidades de optimización y amenazas de mercado.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> Live Tracking</div><br>
            <span class="agent-tag">Actualizado hace 6 min</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">4</div><div class="agent-stat-lbl">Competidores monitoreados</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#EF4444">-12%</div><div class="agent-stat-lbl">Variación de precio promedio (7 días)</div></div>
          <div class="agent-stat"><div class="agent-stat-val">3</div><div class="agent-stat-lbl">Alertas de precio activas</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">+8%</div><div class="agent-stat-lbl">Nuestra ventaja de precio actual</div></div>
        </div>

        <div class="card" style="margin-bottom:20px">
          <div class="table-header" style="margin-bottom:16px">
            <h3 class="card-title"><i data-lucide="bar-chart-3"></i> Benchmark de Precios — Producto Core</h3>
            <div style="display:flex;gap:8px">
              <span class="lm-status sent" style="align-self:center">Datos actualizados</span>
              <button class="filter-btn">Exportar CSV</button>
            </div>
          </div>
          <div style="overflow-x:auto">
            <table class="data-table">
              <thead><tr>
                <th>Competidor</th><th>Plan Base</th><th>Plan Pro</th><th>Plan Enterprise</th>
                <th>Estrategia</th><th>Cambio reciente</th><th>Alertas</th>
              </tr></thead>
              <tbody>
                <tr>
                  <td><div class="cell-lead"><div class="cell-avatar" style="background:#FEE2E2;color:#991B1B">S</div><div class="cell-info"><strong>Salesforce</strong><span>CRM Enterprise</span></div></div></td>
                  <td>$25/mo</td><td>$75/mo</td><td>Custom</td>
                  <td><span class="ch-badge" style="background:#FEF3C7;color:#B45309">Premium</span></td>
                  <td><span style="color:#EF4444;font-weight:700">▼ -5% hace 3 días</span></td>
                  <td><span class="lm-status not-sent">🔴 Alerta</span></td>
                </tr>
                <tr>
                  <td><div class="cell-lead"><div class="cell-avatar" style="background:#DBEAFE;color:#1D4ED8">H</div><div class="cell-info"><strong>HubSpot</strong><span>CRM + Marketing</span></div></td>
                  <td>$0 (freemium)</td><td>$45/mo</td><td>$1,200/mo</td>
                  <td><span class="ch-badge" style="background:#D1FAE5;color:#065F46">Penetración</span></td>
                  <td><span style="color:#10B981;font-weight:700">▲ +$5 Enterprise</span></td>
                  <td><span class="lm-status sent">✅ Estable</span></td>
                </tr>
                <tr>
                  <td><div class="cell-lead"><div class="cell-avatar" style="background:#EDE9FE;color:#5B21B6">P</div><div class="cell-info"><strong>Pipedrive</strong><span>Sales CRM</span></div></td>
                  <td>$14/mo</td><td>$34/mo</td><td>$99/mo</td>
                  <td><span class="ch-badge" style="background:#FEE2E2;color:#991B1B">Agresivo</span></td>
                  <td><span style="color:#EF4444;font-weight:700">▼ -15% descuento Q1</span></td>
                  <td><span class="lm-status not-sent">🔴 Alerta</span></td>
                </tr>
                <tr style="background:#F0FFF4">
                  <td><div class="cell-lead"><div class="cell-avatar" style="background:#D1FAE5;color:#065F46">N</div><div class="cell-info"><strong>Nosotros</strong><span>GrowthAI Platform</span></div></div></td>
                  <td>$19/mo</td><td>$49/mo</td><td>$149/mo</td>
                  <td><span class="ch-badge" style="background:#EDE9FE;color:#5B21B6">Valor-IA</span></td>
                  <td><span style="color:var(--text-muted)">Sin cambios</span></td>
                  <td><span class="lm-status sent">✅ Posición sólida</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="features-grid">
          <div class="feature-card" style="border-left:3px solid #EF4444">
            <div class="feature-icon">🚨</div>
            <h4>Alerta Crítica</h4>
            <p>Pipedrive lanzó descuento del 15% hasta fin de Q1. Riesgo de pérdida de deals sensibles al precio en segmento SMB.</p>
          </div>
          <div class="feature-card" style="border-left:3px solid #F59E0B">
            <div class="feature-icon">📊</div>
            <h4>Oportunidad Detectada</h4>
            <p>Salesforce bajó precios en plan base. Clientes insatisfechos migrando — capturar con bundling + demo gratuito.</p>
          </div>
          <div class="feature-card" style="border-left:3px solid #10B981">
            <div class="feature-icon">✅</div>
            <h4>Ventaja de Precio</h4>
            <p>Nuestra oferta Pro es 35% más accesible que HubSpot Pro con funciones de IA superiores. Usa en pitch comparativo.</p>
          </div>
        </div>
      </div>
    `,

    'ci-products': `
      <div class="view-section active">
        <div class="agent-header" style="background:linear-gradient(135deg,#3B82F6 0%,#06B6D4 100%)">
          <div class="agent-bigicon">🚀</div>
          <div class="agent-header-text">
            <h2>Product & Launches</h2>
            <p>Detección de nuevos lanzamientos, actualizaciones y discontinuaciones. Identifica gaps de mercado y ventanas de oportunidad antes que la competencia.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> Monitoreando</div><br>
            <span class="agent-tag">5 fuentes activas</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">7</div><div class="agent-stat-lbl">Lanzamientos detectados (30 días)</div></div>
          <div class="agent-stat"><div class="agent-stat-val">2</div><div class="agent-stat-lbl">Features solapados con nosotros</div></div>
          <div class="agent-stat"><div class="agent-stat-val">3</div><div class="agent-stat-lbl">Gaps de mercado identificados</div></div>
          <div class="agent-stat"><div class="agent-stat-val">1</div><div class="agent-stat-lbl">Discontinuaciones detectadas</div></div>
        </div>

        <div class="card">
          <h3 class="card-title"><i data-lucide="rocket"></i> Tracker de Lanzamientos — Últimos 30 días</h3>
          <div class="activity-feed">
            <div class="act-item">
              <div class="act-avatar" style="background:#FEE2E2;color:#991B1B;font-weight:700;font-size:12px">SF</div>
              <div class="act-body">
                <strong>Salesforce — Einstein AI Copilot</strong>
                <p>Lanzó asistente de IA generativa para ventas. Target: Enterprise. Regiones: NA, EU. Incluye análisis de llamadas y sugerencias de next steps automatizadas.</p>
              </div>
              <span class="lm-status not-sent" style="flex-shrink:0">🔴 Riesgo Alto</span>
              <span class="act-time">hace 5 días</span>
            </div>
            <div class="act-item">
              <div class="act-avatar" style="background:#DBEAFE;color:#1D4ED8;font-weight:700;font-size:12px">HS</div>
              <div class="act-body">
                <strong>HubSpot — Sales Hub AI Scoring</strong>
                <p>Lanzó Lead Scoring impulsado por IA dentro de su CRM free. Impacta directamente nuestro diferenciador en ICP Scorer™.</p>
              </div>
              <span class="lm-status not-sent" style="flex-shrink:0">⚠️ Monitorear</span>
              <span class="act-time">hace 12 días</span>
            </div>
            <div class="act-item">
              <div class="act-avatar" style="background:#D1FAE5;color:#065F46;font-weight:700;font-size:12px">PD</div>
              <div class="act-body">
                <strong>Pipedrive — Workflow Automations v2</strong>
                <p>Mejoró su módulo de secuencias automatizadas. Similar a OutreachFlow™ pero sin personalización por IA ni señales de intención.</p>
              </div>
              <span class="lm-status sent" style="flex-shrink:0">✅ Ventaja nuestra</span>
              <span class="act-time">hace 18 días</span>
            </div>
            <div class="act-item">
              <div class="act-avatar" style="background:#FEF3C7;color:#B45309;font-weight:700;font-size:12px">AP</div>
              <div class="act-body">
                <strong>Apollo.io — DISCONTINUÓ Email Hunter Gratuito</strong>
                <p>Eliminó el plan free de búsqueda de emails. Oportunidad de captura de usuarios migrados con LeadMiner™ como alternativa.</p>
              </div>
              <span class="lm-status sent" style="flex-shrink:0">🟢 Oportunidad</span>
              <span class="act-time">hace 22 días</span>
            </div>
          </div>
        </div>
      </div>
    `,

    'ci-market': `
      <div class="view-section active">
        <div class="agent-header" style="background:linear-gradient(135deg,#10B981 0%,#3B82F6 100%)">
          <div class="agent-bigicon">📈</div>
          <div class="agent-header-text">
            <h2>Market Trends</h2>
            <p>Identificación de tendencias emergentes, shifts de estrategia competitiva y señales de demanda en el mercado. Detecta disrupciones antes de que impacten tu pipeline.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> Analizando</div><br>
            <span class="agent-tag">8 fuentes de datos</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">↑ 340%</div><div class="agent-stat-lbl">Búsquedas "AI Sales CRM" (90 días)</div></div>
          <div class="agent-stat"><div class="agent-stat-val">67%</div><div class="agent-stat-lbl">Compradores priorizan IA en decisión</div></div>
          <div class="agent-stat"><div class="agent-stat-val">2</div><div class="agent-stat-lbl">Jugadores disruptivos emergentes</div></div>
          <div class="agent-stat"><div class="agent-stat-val">$4.2B</div><div class="agent-stat-lbl">TAM estimado (AI Sales Tools, 2026)</div></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
          <div class="card">
            <h3 class="card-title"><i data-lucide="trending-up"></i> Trends — en crecimiento</h3>
            <div class="activity-feed" style="gap:10px">
              ${[
                {label:'AI-native CRM', growth:'+340%', icon:'🤖'},
                {label:'Intent-based outreach', growth:'+210%', icon:'🎯'},
                {label:'Multichannel sequencing', growth:'+180%', icon:'📡'},
                {label:'Real-time lead scoring', growth:'+156%', icon:'⚡'},
                {label:'Voice AI in sales calls', growth:'+89%', icon:'🎙️'},
              ].map(t=>`
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-size:13px">${t.icon} ${t.label}</span>
                <span style="color:#10B981;font-weight:700;font-size:12px">${t.growth}</span>
              </div>`).join('')}
            </div>
          </div>
          <div class="card">
            <h3 class="card-title"><i data-lucide="trending-down"></i> Trends — en declive</h3>
            <div class="activity-feed" style="gap:10px">
              ${[
                {label:'Cold email blast (sin IA)', decline:'-67%', icon:'📧'},
                {label:'Manual CRM data entry', decline:'-54%', icon:'⌨️'},
                {label:'Single-channel outreach', decline:'-48%', icon:'📞'},
                {label:'Lead lists compradas', decline:'-41%', icon:'📋'},
                {label:'Reportes manuales', decline:'-38%', icon:'📊'},
              ].map(t=>`
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-size:13px">${t.icon} ${t.label}</span>
                <span style="color:#EF4444;font-weight:700;font-size:12px">${t.decline}</span>
              </div>`).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title"><i data-lucide="zap"></i> Jugadores disruptivos — Radar de amenazas</h3>
          <table class="data-table">
            <thead><tr><th>Empresa</th><th>Propuesta</th><th>Funding</th><th>Crecimiento</th><th>Nivel de amenaza</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Clay.com</strong></td>
                <td>Enrichment + IA automatizada de outreach</td>
                <td>$62M Series B</td>
                <td><span style="color:#10B981;font-weight:700">+890% usuarios</span></td>
                <td><span class="lm-status not-sent">🔴 Crítico</span></td>
              </tr>
              <tr>
                <td><strong>Instantly.ai</strong></td>
                <td>Email outreach masivo IA</td>
                <td>Bootstrapped</td>
                <td><span style="color:#10B981;font-weight:700">+340% ARR</span></td>
                <td><span class="lm-status not-sent">⚠️ Alto</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,

    'ci-moves': `
      <div class="view-section active">
        <div class="agent-header" style="background:linear-gradient(135deg,#EF4444 0%,#F59E0B 100%)">
          <div class="agent-bigicon">⚔️</div>
          <div class="agent-header-text">
            <h2>Competitor Moves</h2>
            <p>Feed de movimientos estratégicos de competidores en tiempo real: cambios de canal, nuevas partnerships, campañas, expansión geográfica y shifts de posicionamiento.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#EF4444;border-radius:50%;display:inline-block;animation:pulse 1s infinite"></span> 3 alertas activas</div><br>
            <span class="agent-tag">Reactivo · Tiempo real</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val" style="color:#EF4444">3</div><div class="agent-stat-lbl">Alertas críticas activas</div></div>
          <div class="agent-stat"><div class="agent-stat-val">12</div><div class="agent-stat-lbl">Movimientos detectados (7 días)</div></div>
          <div class="agent-stat"><div class="agent-stat-val">2</div><div class="agent-stat-lbl">Nuevas partnerships anunciadas</div></div>
          <div class="agent-stat"><div class="agent-stat-val">1</div><div class="agent-stat-lbl">Expansión geográfica detectada</div></div>
        </div>

        <div class="card" style="border:1px solid #FEE2E2;margin-bottom:20px">
          <h3 class="card-title"><i data-lucide="alert-triangle"></i> Alertas Críticas — Acción requerida</h3>
          <div class="activity-feed">
            <div class="act-item" style="border-left:3px solid #EF4444;padding-left:12px">
              <div class="act-avatar" style="background:#FEE2E2;color:#991B1B;font-size:20px">🚨</div>
              <div class="act-body">
                <strong>Salesforce lanzó campaña "Beat the AI Tax" — apunta directamente al segmento SMB</strong>
                <p>Campaña de Google Ads masiva con CPC estimado de $48. Mensaje: "No pagues más por IA que no entiende tus deals." Potencial captura de nuestros prospectos top.</p>
              </div>
              <button class="btn-sm btn-primary" style="flex-shrink:0"><i data-lucide="zap"></i> Contratacar</button>
            </div>
            <div class="act-item" style="border-left:3px solid #F59E0B;padding-left:12px">
              <div class="act-avatar" style="background:#FEF3C7;color:#B45309;font-size:20px">⚠️</div>
              <div class="act-body">
                <strong>HubSpot anunció partnership con LinkedIn Sales Navigator</strong>
                <p>Integración nativa para sincronizar leads desde LinkedIn directamente al CRM. Feature que compite con LeadMiner™. Disponible en 30 días.</p>
              </div>
              <button class="btn-sm btn-ai" style="flex-shrink:0"><i data-lucide="eye"></i> Monitorear</button>
            </div>
            <div class="act-item" style="border-left:3px solid #F59E0B;padding-left:12px">
              <div class="act-avatar" style="background:#FEF3C7;color:#B45309;font-size:20px">📍</div>
              <div class="act-body">
                <strong>Pipedrive expandiéndose a LATAM — abrió oficina en Buenos Aires y São Paulo</strong>
                <p>Presencia física + equipo de ventas local. Primera vez en la región. Potencial desplazamiento de nuestra posición preferida en Argentina y Brasil.</p>
              </div>
              <button class="btn-sm btn-ai" style="flex-shrink:0"><i data-lucide="map"></i> Ver región</button>
            </div>
          </div>
        </div>
      </div>
    `,

    'ci-social': `
      <div class="view-section active">
        <div class="agent-header" style="background:linear-gradient(135deg,#8B5CF6 0%,#EC4899 100%)">
          <div class="agent-bigicon">📱</div>
          <div class="agent-header-text">
            <h2>Social & Demand Signals</h2>
            <p>Monitoreo de actividad en redes sociales, contenido de alto engagement, campañas de influencers y señales de demanda orgánica de la competencia.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> Social Listening</div><br>
            <span class="agent-tag">LinkedIn · Twitter · G2 · Reddit</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">6</div><div class="agent-stat-lbl">Plataformas monitoreadas</div></div>
          <div class="agent-stat"><div class="agent-stat-val">-18%</div><div class="agent-stat-lbl">Sentimiento negativo Salesforce (G2)</div></div>
          <div class="agent-stat"><div class="agent-stat-val">+34K</div><div class="agent-stat-lbl">Menciones #AISales esta semana</div></div>
          <div class="agent-stat"><div class="agent-stat-val">89%</div><div class="agent-stat-lbl">Sentimiento positivo GrowthAI (beta)</div></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
          <div class="card">
            <h3 class="card-title"><i data-lucide="thumbs-up"></i> Sentimiento en G2 & Capterra</h3>
            <div class="activity-feed" style="gap:8px">
              ${[
                {comp:'Salesforce', score:'3.8⭐', trend:'↓', color:'#EF4444', complaint:'Precio & complejidad'},
                {comp:'HubSpot',    score:'4.4⭐', trend:'→', color:'#F59E0B', complaint:'Limite de features free'},
                {comp:'Pipedrive',  score:'4.5⭐', trend:'↑', color:'#10B981', complaint:'Falta IA nativa'},
                {comp:'Apollo.io',  score:'4.2⭐', trend:'↓', color:'#EF4444', complaint:'Calidad de datos'},
                {comp:'GrowthAI',   score:'4.9⭐', trend:'↑', color:'#10B981', complaint:'(Beta — N=24)'},
              ].map(c=>`
              <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-size:13px;font-weight:600;min-width:90px">${c.comp}</span>
                <span style="font-size:13px">${c.score}</span>
                <span style="color:${c.color};font-weight:700">${c.trend}</span>
                <span style="font-size:11px;color:var(--text-muted)">Top queja: ${c.complaint}</span>
              </div>`).join('')}
            </div>
          </div>
          <div class="card">
            <h3 class="card-title"><i data-lucide="trending-up"></i> Contenido viral de competidores</h3>
            <div class="activity-feed" style="gap:10px">
              <div class="act-item" style="flex-direction:column;align-items:flex-start;gap:4px">
                <strong style="font-size:12px">HubSpot LinkedIn — "The Death of Cold Calling"</strong>
                <p style="font-size:11px">128K impresiones · 3.4K interacciones · 87 comentarios</p>
                <span class="ch-badge">💼 LinkedIn</span>
              </div>
              <div class="act-item" style="flex-direction:column;align-items:flex-start;gap:4px">
                <strong style="font-size:12px">Salesforce Twitter — Einstein AI demo reel</strong>
                <p style="font-size:11px">45K impresiones · 890 RTs · Trending #AISales</p>
                <span class="ch-badge">🐦 Twitter/X</span>
              </div>
              <div class="act-item" style="flex-direction:column;align-items:flex-start;gap:4px">
                <strong style="font-size:12px">Clay.com Reddit — "How I booked 40 meetings with AI"</strong>
                <p style="font-size:11px">r/sales · 2.1K upvotes · 340 comentarios · Viral</p>
                <span class="ch-badge">🔴 Reddit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    'ci-recs': `
      <div class="view-section active">
        <div class="agent-header" style="background:linear-gradient(135deg,#EC4899 0%,#6366F1 100%)">
          <div class="agent-bigicon">🎯</div>
          <div class="agent-header-text">
            <h2>CI Recommendations</h2>
            <p>Recomendaciones accionables generadas por IA basadas en la inteligencia competitiva recopilada. Segmentadas para Ventas, Procurement y Estrategia de Precios.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#3ECF8E;border-radius:50%;display:inline-block"></span> IA Generativa</div><br>
            <span class="agent-tag">Actualizado: ahora</span>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">18</div><div class="agent-stat-lbl">Recomendaciones activas</div></div>
          <div class="agent-stat"><div class="agent-stat-val">6</div><div class="agent-stat-lbl">Acción inmediata requerida</div></div>
          <div class="agent-stat"><div class="agent-stat-val">3</div><div class="agent-stat-lbl">Alertas críticas pendientes</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">+$180K</div><div class="agent-stat-lbl">Pipeline potencial identificado</div></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px">
          <div class="card" style="border-top:3px solid #10B981">
            <h3 class="card-title" style="color:#065F46"><i data-lucide="briefcase"></i> Para el Equipo de Ventas</h3>
            <div class="activity-feed" style="gap:10px">
              ${[
                {icon:'🎯', text:'Contactar usuarios de Apollo.io que perdieron el plan free — ventana de 30 días antes de que vayan a HubSpot'},
                {icon:'💬', text:'Usar benchmark de precios vs Salesforce en pitch con Enterprise: tu plan es 68% más barato con IA nativa'},
                {icon:'⚡', text:'Priorizar leads en LATAM antes de que Pipedrive active su equipo local (90 días de ventana)'},
                {icon:'📣', text:'Crear contenido tipo "death of manual CRM" para capturar demanda orgánica trending en LinkedIn'},
              ].map(r=>`<div style="padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;line-height:1.5">${r.icon} ${r.text}</div>`).join('')}
            </div>
          </div>
          <div class="card" style="border-top:3px solid #3B82F6">
            <h3 class="card-title" style="color:#1D4ED8"><i data-lucide="package"></i> Para Procurement</h3>
            <div class="activity-feed" style="gap:10px">
              ${[
                {icon:'💰', text:'Apollo.io bajó precios de API de datos — renegociar contrato de enrichment antes de Q2'},
                {icon:'🔄', text:'Evaluar Clay.com como proveedor alternativo de datos. Pricing 40% más bajo con mayor cobertura LATAM'},
                {icon:'⚠️', text:'LinkedIn Sales Navigator subió 12% — revisar ROI del contrato y evaluar alternativas nativas'},
                {icon:'📦', text:'Salesforce liberó SDK de Einstein — evaluar integración de capa IA vs desarrollo propio'},
              ].map(r=>`<div style="padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;line-height:1.5">${r.icon} ${r.text}</div>`).join('')}
            </div>
          </div>
          <div class="card" style="border-top:3px solid #EC4899">
            <h3 class="card-title" style="color:#9D174D"><i data-lucide="trending-up"></i> Estrategia de Precios</h3>
            <div class="activity-feed" style="gap:10px">
              ${[
                {icon:'🏷️', text:'Lanzar oferta "anti-Pipedrive" temporal: primer mes gratis para usuarios que migren. Ventana: próximas 3 semanas'},
                {icon:'📊', text:'Plan Enterprise: subir precio a $179/mo. Ventaja de IA es +3x vs competencia. Elasticidad favorable'},
                {icon:'🎁', text:'Bundling: incluir LeadMiner™ gratis en plan Pro. Retención +28% y diferenciación vs HubSpot'},
                {icon:'🌎', text:'Pricing específico para LATAM: 30% descuento regional para frenar expansión de Pipedrive en la zona'},
              ].map(r=>`<div style="padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;line-height:1.5">${r.icon} ${r.text}</div>`).join('')}
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:20px;background:linear-gradient(135deg,#FFF7ED,#FFF);border:1px solid #FED7AA">
          <h3 class="card-title"><i data-lucide="alert-triangle"></i> 🚨 Executive Summary — Alertas de Acción Inmediata</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
            ${[
              {title:'Salesforce Campaign vs SMB', urgency:'URGENTE', desc:'Activar contra-campaña en Google Ads en 72hs o perder 15-20 leads del funnel'},
              {title:'HubSpot + LinkedIn Nav Integration', urgency:'30 DÍAS', desc:'Desarrollar integración nativa LinkedIn antes del lanzamiento de HubSpot'},
              {title:'Pipedrive LATAM Expansion', urgency:'90 DÍAS', desc:'Acelerar go-to-market en Argentina y Brasil antes de que Pipedrive esté asentado'},
              {title:'Apollo Free Plan Discontinuado', urgency:'AHORA', desc:'Capturar usuarios migrados — lanzar landing page específica esta semana'},
            ].map(a=>`
            <div style="background:white;border-radius:8px;padding:14px;border:1px solid var(--border)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <strong style="font-size:13px">${a.title}</strong>
                <span class="lm-status not-sent" style="font-size:10px">${a.urgency}</span>
              </div>
              <p style="font-size:12px;color:var(--text-muted);margin:0">${a.desc}</p>
            </div>`).join('')}
          </div>
        </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    `,

    // ═══════════════════════════════════════════════════
    //  COMPETITIVE INTELLIGENCE — 5 AI MARKET AGENTS
    // ═══════════════════════════════════════════════════

    'price-intelligence': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #B45309 0%, #92400E 100%)">
          <div class="agent-bigicon">💰</div>
          <div class="agent-header-text">
            <h2>Price Intelligence Agent</h2>
            <p>Consolidates competitor pricing across markets, dealer networks, and boat show catalogs — giving you a clear view of where you stand versus Ferretti, Azimut, Sunseeker, and Princess at any given moment.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">6 Competitors · 32 Models</span>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last sync: Today, 09:14 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Sources: 4 market feeds active</span>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">32</div>
            <div class="agent-stat-lbl">Models Tracked</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#10B981">-3.2%</div>
            <div class="agent-stat-lbl">Avg Price Gap vs Market</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">4</div>
            <div class="agent-stat-lbl">Price Alerts This Week</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">6</div>
            <div class="agent-stat-lbl">Competitors Monitored</div>
          </div>
        </div>

        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Avg Base Price by Brand (50-60 ft segment)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciPriceCompChart"></canvas></div>
          </div>
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Price Trend — Flybridge Segment (12 months)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciPriceTrendChart"></canvas></div>
          </div>
        </div>

        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3 class="card-title" style="margin:0"><i data-lucide="activity"></i> Price Intelligence Feed</h3>
            <select style="padding:4px 8px; border:1px solid var(--border); border-radius:4px; font-size:12px;">
              <option>All Competitors</option>
              <option>Ferretti Group</option>
              <option>Azimut-Benetti</option>
              <option>Sunseeker</option>
              <option>Princess Yachts</option>
              <option>Prestige</option>
            </select>
          </div>
          <div style="overflow-x:auto;">
            <table class="lm-table">
              <thead>
                <tr><th>Date</th><th>Competitor</th><th>Model</th><th>Signal</th><th>Detail</th><th>Impact</th><th></th></tr>
              </thead>
              <tbody>
                <tr style="cursor:pointer" onclick="this.nextElementSibling.classList.toggle('hidden')">
                  <td><span style="font-size:12px;color:var(--text-muted)">Apr 2026</span></td>
                  <td><strong>Ferretti Group</strong></td>
                  <td>Ferretti 780</td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Price Increase</span></td>
                  <td style="max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Listed at Cannes 2025 at EUR 2.1M — 8% above previous year pricing</td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Favorable</span></td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
                <tr class="hidden" style="background:#F8FAFC">
                  <td colspan="7" style="padding:16px;">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                      <div style="padding:12px; border-left:3px solid #F59E0B; background:white; border-radius:4px;">
                        <strong>Price Signal:</strong>
                        <p style="font-size:13px;color:#475569;margin-top:8px">Ferretti 780 listed at EUR 2.1M at Cannes Yachting Festival. This represents an 8% increase over the 2024 list price of EUR 1.94M. The increase is attributed to new interior package and upgraded Volvo IPS 950 engines.</p>
                      </div>
                      <div style="padding:12px; background:white; border-radius:4px; border:1px solid #E2E8F0">
                        <strong>AI Insight</strong>
                        <ul style="font-size:12px; margin-top:8px; padding-left:16px; color:#334155;">
                          <li><strong>Opportunity:</strong> Absolute Flybridge 60 sits 12% below Ferretti 780 in the same segment. Price gap is widening — positioning advantage.</li>
                          <li><strong>Recommendation:</strong> Arm dealers with updated competitive pricing sheet highlighting value-per-foot advantage.</li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr style="cursor:pointer" onclick="this.nextElementSibling.classList.toggle('hidden')">
                  <td><span style="font-size:12px;color:var(--text-muted)">Mar 2026</span></td>
                  <td><strong>Azimut</strong></td>
                  <td>Azimut Magellano 66</td>
                  <td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">New Pricing</span></td>
                  <td style="max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Revised upward to EUR 1.85M following strong euro and Volvo engine cost pass-through</td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Neutral</span></td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
                <tr class="hidden" style="background:#F8FAFC">
                  <td colspan="7" style="padding:16px;">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                      <div style="padding:12px; border-left:3px solid #EF4444; background:white; border-radius:4px;">
                        <strong>Price Signal:</strong>
                        <p style="font-size:13px;color:#475569;margin-top:8px">Azimut Magellano 66 price adjusted to EUR 1.85M from EUR 1.72M. Increase reflects engine cost pass-through (Volvo IPS) and euro appreciation against GBP and USD, impacting export market competitiveness.</p>
                      </div>
                      <div style="padding:12px; background:white; border-radius:4px; border:1px solid #E2E8F0">
                        <strong>AI Insight</strong>
                        <ul style="font-size:12px; margin-top:8px; padding-left:16px; color:#334155;">
                          <li><strong>Impact:</strong> Magellano 66 now directly competes with Navetta 68 on price. Historically Azimut was 5-8% cheaper in this segment.</li>
                          <li><strong>Recommendation:</strong> Highlight Navetta 68 livability advantage and fuel efficiency in dealer talking points for US and UK buyers.</li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><span style="font-size:12px;color:var(--text-muted)">Feb 2026</span></td>
                  <td><strong>Sunseeker</strong></td>
                  <td>Manhattan 55</td>
                  <td><span class="lm-tag" style="background:#DBEAFE;color:#1E40AF">Promo</span></td>
                  <td style="max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">UK dealer offering 5% early-order discount on 2027 build slots — clearing inventory pressure</td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Watch</span></td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
                <tr>
                  <td><span style="font-size:12px;color:var(--text-muted)">Feb 2026</span></td>
                  <td><strong>Princess</strong></td>
                  <td>Princess F55</td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Price Increase</span></td>
                  <td style="max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">GBP 1.2M base — 6% increase YoY. Attributed to carbon fiber hard-top option becoming standard</td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Favorable</span></td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,

    'launch-tracker': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)">
          <div class="agent-bigicon">🚀</div>
          <div class="agent-header-text">
            <h2>Product Launch Tracker</h2>
            <p>Tracks what your competitors are bringing to market — new models, boat show debuts, design partnerships, and segment expansions — so you always know what you are competing against before it hits the water.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">14 Launches (12m)</span>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last sync: Today, 08:45 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Sources: 6 industry feeds active</span>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">14</div>
            <div class="agent-stat-lbl">New Launches (12 months)</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">3</div>
            <div class="agent-stat-lbl">Upcoming Boat Shows</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">7</div>
            <div class="agent-stat-lbl">Models in Pipeline</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#F59E0B">6</div>
            <div class="agent-stat-lbl">Launch Alerts This Quarter</div>
          </div>
        </div>

        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Launches per Brand (Last 24 months)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciLaunchBarChart"></canvas></div>
          </div>
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Launch by Segment</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciLaunchSegmentChart"></canvas></div>
          </div>
        </div>

        <!-- Upcoming Boat Shows -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title" style="margin-bottom:20px;"><i data-lucide="calendar"></i> Upcoming Boat Shows & Expected Debuts</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
            <div style="padding:20px; border:1px solid var(--border); border-radius:10px; background:linear-gradient(135deg, rgba(109,40,217,0.04) 0%, transparent 60%);">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                <div style="width:40px;height:40px;background:linear-gradient(135deg,#6D28D9,#A78BFA);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:white;font-weight:700;font-size:13px">SEP</div>
                <div><strong style="font-size:14px;">Cannes Yachting Festival</strong><br><span style="font-size:12px;color:var(--text-muted)">Sep 9-14, 2026</span></div>
              </div>
              <p style="font-size:12px; color:var(--text-muted); margin:0 0 8px 0;">Expected debuts:</p>
              <div style="display:flex; flex-wrap:wrap; gap:4px;">
                <span class="lm-tag" style="background:#EDE9FE;color:#6D28D9">Ferretti 860</span>
                <span class="lm-tag" style="background:#EDE9FE;color:#6D28D9">Azimut S7</span>
                <span class="lm-tag" style="background:#DBEAFE;color:#1D4ED8">Absolute Navetta 75</span>
              </div>
            </div>
            <div style="padding:20px; border:1px solid var(--border); border-radius:10px;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                <div style="width:40px;height:40px;background:linear-gradient(135deg,#0369A1,#38BDF8);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:white;font-weight:700;font-size:13px">JAN</div>
                <div><strong style="font-size:14px;">Boot Düsseldorf</strong><br><span style="font-size:12px;color:var(--text-muted)">Jan 18-26, 2027</span></div>
              </div>
              <p style="font-size:12px; color:var(--text-muted); margin:0 0 8px 0;">Expected debuts:</p>
              <div style="display:flex; flex-wrap:wrap; gap:4px;">
                <span class="lm-tag" style="background:#EDE9FE;color:#6D28D9">Sunseeker 65 Sport</span>
                <span class="lm-tag" style="background:#EDE9FE;color:#6D28D9">Princess Y72</span>
              </div>
            </div>
            <div style="padding:20px; border:1px solid var(--border); border-radius:10px;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                <div style="width:40px;height:40px;background:linear-gradient(135deg,#EA580C,#FB923C);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:white;font-weight:700;font-size:13px">FEB</div>
                <div><strong style="font-size:14px;">Miami Int'l Boat Show</strong><br><span style="font-size:12px;color:var(--text-muted)">Feb 17-21, 2027</span></div>
              </div>
              <p style="font-size:12px; color:var(--text-muted); margin:0 0 8px 0;">Expected debuts:</p>
              <div style="display:flex; flex-wrap:wrap; gap:4px;">
                <span class="lm-tag" style="background:#EDE9FE;color:#6D28D9">Ferretti Infynito 80</span>
                <span class="lm-tag" style="background:#EDE9FE;color:#6D28D9">Prestige M48</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Launches Feed -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title" style="margin-bottom:20px;"><i data-lucide="rocket"></i> Recent Launch Intelligence</h3>
          <div style="overflow-x:auto;">
            <table class="lm-table">
              <thead><tr><th>Date</th><th>Brand</th><th>Model</th><th>Segment</th><th>Key Specs</th><th>Threat Level</th><th></th></tr></thead>
              <tbody>
                <tr>
                  <td><span style="font-size:12px;color:var(--text-muted)">Mar 2026</span></td>
                  <td><strong>Ferretti</strong></td>
                  <td>INFYNITO 80</td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Navetta/Explorer</span></td>
                  <td style="font-size:12px;">80 ft · Hybrid propulsion · Interior by Ideaworks</td>
                  <td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">High</span></td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Analyze</button></td>
                </tr>
                <tr>
                  <td><span style="font-size:12px;color:var(--text-muted)">Feb 2026</span></td>
                  <td><strong>Azimut</strong></td>
                  <td>Grande Trideck</td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Superyacht</span></td>
                  <td style="font-size:12px;">90 ft · Triple-deck · Alberto Mancini design</td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Medium</span></td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Analyze</button></td>
                </tr>
                <tr>
                  <td><span style="font-size:12px;color:var(--text-muted)">Jan 2026</span></td>
                  <td><strong>Sunseeker</strong></td>
                  <td>Ocean 182</td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Flybridge</span></td>
                  <td style="font-size:12px;">60 ft · New hull platform · Volvo IPS 950</td>
                  <td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">High</span></td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Analyze</button></td>
                </tr>
                <tr>
                  <td><span style="font-size:12px;color:var(--text-muted)">Dec 2025</span></td>
                  <td><strong>Princess</strong></td>
                  <td>X80 Superfly</td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Flybridge</span></td>
                  <td style="font-size:12px;">80 ft · Carbon superstructure · MTU engines</td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Medium</span></td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Analyze</button></td>
                </tr>
                <tr>
                  <td><span style="font-size:12px;color:var(--text-muted)">Nov 2025</span></td>
                  <td><strong>Prestige</strong></td>
                  <td>M-Line 48</td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Coupe/Sport</span></td>
                  <td style="font-size:12px;">48 ft · Catamaran hull · Electric option</td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Low</span></td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Analyze</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,

    'sentiment-analyzer': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #047857 0%, #065F46 100%)">
          <div class="agent-bigicon">📡</div>
          <div class="agent-header-text">
            <h2>Sentiment Analyzer</h2>
            <p>Shows how owners, press, and the market perceive Absolute versus the competition — across forums, editorial coverage, social channels, and dealer networks. Turns fragmented opinions into a clear picture of brand positioning.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">2,840 Mentions (30d)</span>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last sync: Today, 10:02 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Sources: 5 channels monitored</span>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">2,840</div>
            <div class="agent-stat-lbl">Total Mentions (30d)</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#10B981">78%</div>
            <div class="agent-stat-lbl">Absolute Positive Sentiment</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">+42</div>
            <div class="agent-stat-lbl">Net Promoter Signal</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#F59E0B">3</div>
            <div class="agent-stat-lbl">Competitor Alerts Active</div>
          </div>
        </div>

        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:300px; display:flex; flex-direction:column;">
            <h3 class="card-title">Brand Sentiment Comparison</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciSentimentBarChart"></canvas></div>
          </div>
          <div class="card" style="height:300px; display:flex; flex-direction:column;">
            <h3 class="card-title">Mention Sources</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciSentimentSourceChart"></canvas></div>
          </div>
          <div class="card" style="height:300px; display:flex; flex-direction:column;">
            <h3 class="card-title">Sentiment Trend (6 months)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciSentimentTrendChart"></canvas></div>
          </div>
        </div>

        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3 class="card-title" style="margin:0"><i data-lucide="message-circle"></i> Live Sentiment Feed</h3>
            <select style="padding:4px 8px; border:1px solid var(--border); border-radius:4px; font-size:12px;">
              <option>All Brands</option>
              <option>Absolute Yachts</option>
              <option>Ferretti Group</option>
              <option>Azimut-Benetti</option>
              <option>Sunseeker</option>
              <option>Princess Yachts</option>
            </select>
          </div>
          <div style="overflow-x:auto;">
            <table class="lm-table">
              <thead><tr><th>Source</th><th>Brand</th><th>Sentiment</th><th>Topic</th><th>Mention</th><th>Reach</th></tr></thead>
              <tbody>
                <tr>
                  <td><span class="lm-tag" style="background:#0A66C2;color:white;font-weight:600">LinkedIn</span></td>
                  <td><strong>Absolute</strong></td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Positive</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Design</span></td>
                  <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"The Navetta 68 interior is the best livable space I have ever experienced on a yacht this size."</td>
                  <td>12.4K</td>
                </tr>
                <tr>
                  <td><span class="lm-tag" style="background:#0F172A;color:white;font-weight:600">YachtForums</span></td>
                  <td><strong>Ferretti</strong></td>
                  <td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">Negative</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">After-Sales</span></td>
                  <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"Waited 6 months for warranty parts on my 720. Dealer communication was almost nonexistent."</td>
                  <td>8.2K</td>
                </tr>
                <tr>
                  <td><span class="lm-tag" style="background:#E4405F;color:white;font-weight:600">Instagram</span></td>
                  <td><strong>Sunseeker</strong></td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Positive</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Lifestyle</span></td>
                  <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"Summer at its finest on the Predator 60. British craftsmanship at its peak."</td>
                  <td>45.1K</td>
                </tr>
                <tr>
                  <td><span class="lm-tag" style="background:#3B82F6;color:white;font-weight:600">Press</span></td>
                  <td><strong>Absolute</strong></td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Positive</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Innovation</span></td>
                  <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"Absolute continues to push boundaries with the Navetta 75 — a serious contender in the superyacht entry segment."</td>
                  <td>28.7K</td>
                </tr>
                <tr>
                  <td><span class="lm-tag" style="background:#0F172A;color:white;font-weight:600">Dealer Net</span></td>
                  <td><strong>Azimut</strong></td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Mixed</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Delivery</span></td>
                  <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"Great product but build slot availability remains a challenge. Customers waiting 14+ months."</td>
                  <td>3.1K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,

    'demand-intelligence': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)">
          <div class="agent-bigicon">📊</div>
          <div class="agent-header-text">
            <h2>Demand Intelligence Agent</h2>
            <p>Identifies where buyer interest is growing — by region, by segment, by season — and highlights which opportunities deserve attention before the competition gets there first.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">847 Signals (30d)</span>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last sync: Today, 09:38 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Sources: 3 demand feeds active</span>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">847</div>
            <div class="agent-stat-lbl">Demand Signals (30d)</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#10B981">+34%</div>
            <div class="agent-stat-lbl">Top Growth: Middle East</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">23</div>
            <div class="agent-stat-lbl">High-Intent Inquiries</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#3B82F6">High</div>
            <div class="agent-stat-lbl">Seasonal Demand Index</div>
          </div>
        </div>

        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Monthly Inquiry Volume (12 months)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciDemandTrendChart"></canvas></div>
          </div>
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Demand by Region</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciDemandRegionChart"></canvas></div>
          </div>
        </div>

        <!-- Geographic Demand Cards -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title" style="margin-bottom:20px;"><i data-lucide="map-pin"></i> Regional Demand Signals</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:12px;">
            <div style="padding:16px; border-radius:10px; border:1px solid #BBF7D0; background:#F0FDF4;">
              <strong style="font-size:14px; color:#166534;">Mediterranean</strong>
              <p style="font-size:24px; font-weight:700; color:#166534; margin:8px 0 4px 0;">312</p>
              <span style="font-size:12px; color:#15803D;">+18% YoY · Peak Season</span>
            </div>
            <div style="padding:16px; border-radius:10px; border:1px solid #BBF7D0; background:#F0FDF4;">
              <strong style="font-size:14px; color:#166534;">North America</strong>
              <p style="font-size:24px; font-weight:700; color:#166534; margin:8px 0 4px 0;">224</p>
              <span style="font-size:12px; color:#15803D;">+12% YoY · FL/CA focus</span>
            </div>
            <div style="padding:16px; border-radius:10px; border:1px solid #FDE68A; background:#FFFBEB;">
              <strong style="font-size:14px; color:#92400E;">Middle East</strong>
              <p style="font-size:24px; font-weight:700; color:#92400E; margin:8px 0 4px 0;">178</p>
              <span style="font-size:12px; color:#B45309;">+34% YoY · Dubai/Qatar surge</span>
            </div>
            <div style="padding:16px; border-radius:10px; border:1px solid var(--border); background:white;">
              <strong style="font-size:14px; color:var(--text-main);">Asia-Pacific</strong>
              <p style="font-size:24px; font-weight:700; color:var(--text-main); margin:8px 0 4px 0;">133</p>
              <span style="font-size:12px; color:var(--text-muted);">+8% YoY · Emerging</span>
            </div>
          </div>
        </div>

        <!-- Demand Feed -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title" style="margin-bottom:20px;"><i data-lucide="signal"></i> High-Intent Demand Signals</h3>
          <div style="overflow-x:auto;">
            <table class="lm-table">
              <thead><tr><th>Signal</th><th>Source</th><th>Region</th><th>Segment</th><th>Detail</th><th>Intent</th></tr></thead>
              <tbody>
                <tr>
                  <td><span class="lm-tag" style="background:#DBEAFE;color:#1D4ED8">Inquiry Cluster</span></td>
                  <td>Dealer Network</td>
                  <td>Dubai, UAE</td>
                  <td>Navetta 68</td>
                  <td style="font-size:12px;">5 qualified inquiries from HNWI clients in Q1 2026 — all first-time buyers</td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">High</span></td>
                </tr>
                <tr>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Event Signal</span></td>
                  <td>Boat Show Lead</td>
                  <td>Fort Lauderdale, US</td>
                  <td>Flybridge 52</td>
                  <td style="font-size:12px;">12 sea trial requests post-FLIBS — highest conversion rate in US market</td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">High</span></td>
                </tr>
                <tr>
                  <td><span class="lm-tag" style="background:#EDE9FE;color:#6D28D9">Market Shift</span></td>
                  <td>Industry Report</td>
                  <td>Southern Europe</td>
                  <td>All Segments</td>
                  <td style="font-size:12px;">Italian yacht market up 22% in value (2025 vs 2024) — Confindustria Nautica report</td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Medium</span></td>
                </tr>
                <tr>
                  <td><span class="lm-tag" style="background:#DBEAFE;color:#1D4ED8">Inquiry Cluster</span></td>
                  <td>Website / CRM</td>
                  <td>Hong Kong</td>
                  <td>Navetta 52</td>
                  <td style="font-size:12px;">3 qualified leads from HK in 2 weeks — all referencing Cannes 2025 debut</td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">High</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,

    'supply-chain-ci': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%)">
          <div class="agent-bigicon">🔗</div>
          <div class="agent-header-text">
            <h2>Supply Chain CI</h2>
            <p>Tracks your critical suppliers — engines, electronics, composites, interiors — identifying cost shifts, delivery risks, and component bottlenecks before they impact your production schedule.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">34 Suppliers Tracked</span>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last sync: Today, 07:30 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Sources: 8 supplier feeds active</span>
        </div>

        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">34</div>
            <div class="agent-stat-lbl">Suppliers Monitored</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#EF4444">2</div>
            <div class="agent-stat-lbl">Critical Alerts</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">+12d</div>
            <div class="agent-stat-lbl">Avg Lead Time Shift</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#F59E0B">+4.8%</div>
            <div class="agent-stat-lbl">Material Cost Variance (vs Q4)</div>
          </div>
        </div>

        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Material Cost Index (12 months)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciSupplyCostChart"></canvas></div>
          </div>
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Lead Time by Component (weeks)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="ciSupplyLeadChart"></canvas></div>
          </div>
        </div>

        <!-- Supplier Risk Dashboard -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title" style="margin-bottom:20px;"><i data-lucide="shield-alert"></i> Supplier Risk Dashboard</h3>
          <div style="overflow-x:auto;">
            <table class="lm-table">
              <thead><tr><th>Supplier</th><th>Category</th><th>Risk Level</th><th>Lead Time</th><th>Cost Trend</th><th>Alert</th><th></th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>Volvo Penta</strong></td>
                  <td>Engines / IPS</td>
                  <td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">High</span></td>
                  <td>22 weeks <span style="font-size:11px;color:#EF4444">(+4w)</span></td>
                  <td style="color:#EF4444; font-weight:600;">+6.2%</td>
                  <td style="font-size:12px;">IPS 950 allocation reduced for Q3. Production backlog in Gothenburg.</td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
                <tr>
                  <td><strong>Besenzoni</strong></td>
                  <td>Marine Accessories</td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Low</span></td>
                  <td>6 weeks <span style="font-size:11px;color:#10B981">(stable)</span></td>
                  <td style="color:#10B981; font-weight:600;">+1.1%</td>
                  <td style="font-size:12px;">On schedule. New gangway model available for 2027 build slots.</td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
                <tr>
                  <td><strong>Webasto Marine</strong></td>
                  <td>AC / Climate</td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Medium</span></td>
                  <td>14 weeks <span style="font-size:11px;color:#F59E0B">(+2w)</span></td>
                  <td style="color:#F59E0B; font-weight:600;">+3.4%</td>
                  <td style="font-size:12px;">Semiconductor constraint affecting control units. Alternative sourcing under review.</td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
                <tr>
                  <td><strong>Poltrona Frau</strong></td>
                  <td>Leather / Interior</td>
                  <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Low</span></td>
                  <td>8 weeks <span style="font-size:11px;color:#10B981">(stable)</span></td>
                  <td style="color:#10B981; font-weight:600;">+0.8%</td>
                  <td style="font-size:12px;">Full capacity. Premium leather grades available for custom orders.</td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
                <tr>
                  <td><strong>Garmin Marine</strong></td>
                  <td>Navigation / Electronics</td>
                  <td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">High</span></td>
                  <td>18 weeks <span style="font-size:11px;color:#EF4444">(+6w)</span></td>
                  <td style="color:#EF4444; font-weight:600;">+8.1%</td>
                  <td style="font-size:12px;">GPSMAP 9000 series backordered globally. Recommend securing allocations for H2 builds.</td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
                <tr>
                  <td><strong>Fiberglass Italia</strong></td>
                  <td>Hull / Composite</td>
                  <td><span class="lm-tag" style="background:#FEF3C7;color:#92400E">Medium</span></td>
                  <td>10 weeks <span style="font-size:11px;color:#F59E0B">(+1w)</span></td>
                  <td style="color:#F59E0B; font-weight:600;">+5.3%</td>
                  <td style="font-size:12px;">Resin prices elevated due to EU chemical regulation (REACH). Stable supply volume.</td>
                  <td><button class="lm-btn-outline" style="padding:2px 6px">Detail</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,

    // ═══════════════════════════════════════════════════
    //  MARKETING PILOT — TIER 1 LIGHT AGENTS
    //  Flow: branding-kit → brandvoice → content-engine → hook-miner → content-builder → creative-brain
    // ═══════════════════════════════════════════════════

    'branding-kit': `
      <div class="view-section active">
        <style>
          .bk-input { width:100%; padding:10px 12px; background:white; border:1px solid var(--border); border-radius:6px; font-size:14px; font-weight:600; font-family:inherit; color:var(--text-main); transition:border-color 0.15s, box-shadow 0.15s; }
          .bk-input:focus { outline:none; border-color:#6366F1; box-shadow:0 0 0 3px rgba(99,102,241,0.15); }
          .bk-input.area { min-height:72px; resize:vertical; line-height:1.5; font-weight:500; }
          .bk-label { font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; display:block; }
          .bk-preset { cursor:pointer; border:1px solid var(--border); border-radius:8px; overflow:hidden; transition:transform 0.15s, box-shadow 0.15s; }
          .bk-preset:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.08); }
          .bk-preset-strip { display:flex; height:36px; }
          .bk-preset-strip span { flex:1; }
          .bk-preset-name { padding:6px 10px; font-size:11px; font-weight:600; background:white; text-align:center; }
          .bk-color-picker { width:100%; height:50px; border:1px solid var(--border); border-radius:6px; cursor:pointer; background:transparent; padding:0; }
          .bk-row-action { background:none; border:none; color:#DC2626; cursor:pointer; font-size:11px; padding:4px 8px; border-radius:4px; }
          .bk-row-action:hover { background:#FEE2E2; }
          .bk-add-btn { padding:6px 12px; border:1px dashed var(--border); background:transparent; border-radius:6px; font-size:12px; color:var(--text-muted); cursor:pointer; width:100%; transition:all 0.15s; }
          .bk-add-btn:hover { border-color:#6366F1; color:#6366F1; background:#EEF2FF; }
        </style>

        <div class="agent-header" style="background: linear-gradient(135deg, #6366F1 0%, #4338CA 100%)">
          <div class="agent-bigicon">🎯</div>
          <div class="agent-header-text">
            <h2>Branding Bio</h2>
            <p>Foundation input for the entire Marketing Pilot flow. Fill in your brand fingerprint — colors, typography, voice by channel, audience, competitors — and every downstream agent (BrandVoice, ContentEngine, HookMiner, ContentBuilder, CreativeBrain) will use it as the single source of truth.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Editing live</div><br>
            <span class="agent-tag">v3.1 · auto-saves as you type</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:12px;">
          <div style="display:flex; gap:12px;">
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="check-circle-2" style="width:11px;vertical-align:middle;margin-right:4px"></i>All 10 sections completed</span>
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="arrow-right" style="width:11px;vertical-align:middle;margin-right:4px"></i>Feeds: BrandVoice Optimizer · ContentBuilder · CreativeBrain</span>
          </div>
          <button
            id="bk-save-btn"
            onclick="saveBrandProfile()"
            style="padding:10px 20px; background:#6366F1; color:white; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer;">
            Save & Sync
          </button>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">100%</div><div class="agent-stat-lbl">Kit Completion</div></div>
          <div class="agent-stat"><div class="agent-stat-val">10</div><div class="agent-stat-lbl">Sections Filled</div></div>
          <div class="agent-stat"><div class="agent-stat-val">4</div><div class="agent-stat-lbl">Active Channels</div></div>
          <div class="agent-stat"><div class="agent-stat-val">12</div><div class="agent-stat-lbl">Content Samples Linked</div></div>
        </div>

        <!-- 1. Brand Identity -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="award"></i> 1. Brand Identity</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
            <div>
              <label class="bk-label">Company Name</label>
              <input class="bk-input" type="text" value="${brandKitData.name}" oninput="updateBrandField('name', this.value)" placeholder="Your company name">
            </div>
            <div>
              <label class="bk-label">Industry</label>
              <input class="bk-input" type="text" value="${brandKitData.industry}" oninput="updateBrandField('industry', this.value)" placeholder="e.g. Enterprise SaaS · B2B">
            </div>
            <div>
              <label class="bk-label">Tagline</label>
              <input class="bk-input" type="text" value="${brandKitData.tagline}" oninput="updateBrandField('tagline', this.value)" placeholder="Short phrase that captures your value prop">
            </div>
            <div style="grid-column:span 3;">
              <label class="bk-label">Mission / What we do</label>
              <textarea class="bk-input area" oninput="updateBrandField('mission', this.value)" placeholder="1-3 sentences describing what you do and who for">${brandKitData.mission}</textarea>
            </div>
          </div>
        </div>

        <!-- 2. Colorimetría -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="palette"></i> 2. Colorimetry</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Pick or customize</span>
          </div>

          <!-- Preset palettes -->
          <div style="margin-bottom:20px;">
            <label class="bk-label">Quick presets — click to apply</label>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
              ${brandPresets.map((p, i) => `
                <div class="bk-preset" onclick="applyBrandPreset(${i})">
                  <div class="bk-preset-strip">
                    ${p.palette.map(h => `<span style="background:${h}"></span>`).join('')}
                  </div>
                  <div class="bk-preset-name">${p.name}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Individual color pickers -->
          <label class="bk-label">Fine-tune — click any swatch to change the color</label>
          <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:14px;">
            ${brandKitData.palette.map((c, i) => `
              <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden; position:relative;">
                <div id="bk-swatch-${i}" style="height:70px; background:${c.hex}; position:relative; cursor:pointer;">
                  <input type="color" value="${c.hex}" oninput="updatePaletteColor(${i}, this.value)" style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; border:none; padding:0;">
                </div>
                <div style="padding:8px 10px;">
                  <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${c.role}</div>
                  <div id="bk-hex-${i}" style="font-size:11px; font-weight:600; margin-top:2px; font-family:monospace;">${c.hex.toUpperCase()}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3. Typography -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="type"></i> 3. Typography</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px;">
              <label class="bk-label">Headings</label>
              <input class="bk-input bk-font-input" data-kind="heading" type="text" value="${brandKitData.typography.heading}" oninput="updateBrandFontInput(this, 'heading')" list="bk-fonts" style="font-family:'${brandKitData.typography.heading}', sans-serif; font-size:20px; font-weight:700;">
              <div class="font-preview" data-kind="heading" style="font-size:13px; margin-top:10px; font-family:'${brandKitData.typography.heading}', sans-serif; font-weight:700;">Ship faster. Debug less.</div>
              ${renderFontChips('heading', brandKitData.typography.heading)}
            </div>
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px;">
              <label class="bk-label">Body</label>
              <input class="bk-input bk-font-input" data-kind="body" type="text" value="${brandKitData.typography.body}" oninput="updateBrandFontInput(this, 'body')" list="bk-fonts" style="font-family:'${brandKitData.typography.body}', sans-serif; font-size:20px; font-weight:600;">
              <div class="font-preview" data-kind="body" style="font-size:13px; margin-top:10px; font-family:'${brandKitData.typography.body}', sans-serif;">Fix production issues before your customers do.</div>
              ${renderFontChips('body', brandKitData.typography.body)}
            </div>
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px;">
              <label class="bk-label">Mono / Code</label>
              <input class="bk-input bk-font-input" data-kind="mono" type="text" value="${brandKitData.typography.mono}" oninput="updateBrandFontInput(this, 'mono')" list="bk-fonts-mono" style="font-family:'${brandKitData.typography.mono}', monospace; font-size:20px; font-weight:600;">
              <div class="font-preview" data-kind="mono" style="font-size:13px; margin-top:10px; font-family:'${brandKitData.typography.mono}', monospace; background:#0F172A; color:#A5F3FC; padding:6px 8px; border-radius:4px;">${brandKitData.name.toLowerCase().replace(/[^a-z0-9]/g,'')}.trace()</div>
              ${renderFontChips('mono', brandKitData.typography.mono)}
            </div>
          </div>
          <datalist id="bk-fonts">${BRAND_FONTS_SANS.concat(BRAND_FONTS_SERIF, BRAND_FONTS_DISPLAY).map(f => `<option value="${f}">`).join('')}</datalist>
          <datalist id="bk-fonts-mono">${BRAND_FONTS_MONO.map(f => `<option value="${f}">`).join('')}</datalist>
        </div>

        <!-- 4. Values -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="heart"></i> 4. Core Values</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
            ${brandKitData.values.map((v, i) => `
              <div style="padding:14px; border-left:3px solid ${v.color}; background:${v.color}11; border-radius:6px; position:relative;">
                <button class="bk-row-action" onclick="removeBrandListItem('values', ${i})" style="position:absolute; top:8px; right:8px;" title="Remove">✕</button>
                <input class="bk-input" type="text" value="${v.title}" oninput="updateBrandListItem('values', ${i}, 'title', this.value)" style="background:transparent; border:none; padding:0; font-size:14px; font-weight:700;">
                <textarea class="bk-input area" oninput="updateBrandListItem('values', ${i}, 'desc', this.value)" style="background:transparent; border:none; padding:4px 0 0 0; font-size:12px; color:var(--text-muted); min-height:44px; font-weight:400;">${v.desc}</textarea>
              </div>
            `).join('')}
          </div>
          <button class="bk-add-btn" onclick="addBrandListItem('values', { title:'New value', desc:'Describe what this value means in practice.', color:'#6366F1' })" style="margin-top:12px;">+ Add value</button>
        </div>

        <!-- 5. Target Audience -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="users"></i> 5. Target Audience</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:14px;">
            ${brandKitData.personas.map((p, i) => `
              <div style="padding:14px; border:1px solid var(--border); border-radius:8px; position:relative;">
                <button class="bk-row-action" onclick="removeBrandListItem('personas', ${i})" style="position:absolute; top:8px; right:8px;" title="Remove">✕</button>
                <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                  <div style="width:40px; height:40px; border-radius:50%; background:#EEF2FF; color:#4338CA; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${p.code}</div>
                  <div style="flex:1;">
                    <input class="bk-input" type="text" value="${p.role}" oninput="updateBrandListItem('personas', ${i}, 'role', this.value)" placeholder="Role" style="padding:4px 8px; font-size:14px;">
                    <input class="bk-input" type="text" value="${p.label}" oninput="updateBrandListItem('personas', ${i}, 'label', this.value)" placeholder="Label (e.g. Primary buyer)" style="padding:4px 8px; font-size:11px; margin-top:4px; font-weight:400; color:var(--text-muted);">
                  </div>
                </div>
                <label class="bk-label" style="margin-top:8px;">Company size / context</label>
                <input class="bk-input" type="text" value="${p.size}" oninput="updateBrandListItem('personas', ${i}, 'size', this.value)" style="font-size:12px; font-weight:400;">
                <label class="bk-label" style="margin-top:8px;">Pain points</label>
                <textarea class="bk-input area" oninput="updateBrandListItem('personas', ${i}, 'pains', this.value)" style="font-size:12px; font-weight:400; min-height:48px;">${p.pains}</textarea>
                <label class="bk-label" style="margin-top:8px;">Buying triggers</label>
                <textarea class="bk-input area" oninput="updateBrandListItem('personas', ${i}, 'triggers', this.value)" style="font-size:12px; font-weight:400; min-height:48px;">${p.triggers}</textarea>
              </div>
            `).join('')}
          </div>
          <button class="bk-add-btn" onclick="addBrandListItem('personas', { code:'P'+(brandKitData.personas.length+1), role:'New persona', label:'Role context', size:'', pains:'', triggers:'' })" style="margin-top:12px;">+ Add persona</button>
        </div>

        <!-- 6. Competitors -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="swords"></i> 6. Competitors Tracked</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>
          </div>
          <table class="lm-table">
            <thead><tr><th style="width:22%;">Competitor</th><th style="width:28%;">Positioning</th><th style="width:16%;">Price Tier</th><th>Differentiator vs Us</th><th style="width:40px;"></th></tr></thead>
            <tbody>
              ${brandKitData.competitors.map((c, i) => `
                <tr>
                  <td><input class="bk-input" type="text" value="${c.name}" oninput="updateBrandListItem('competitors', ${i}, 'name', this.value)" style="padding:6px 8px; font-size:13px;"></td>
                  <td><input class="bk-input" type="text" value="${c.positioning}" oninput="updateBrandListItem('competitors', ${i}, 'positioning', this.value)" style="padding:6px 8px; font-size:12px; font-weight:400;"></td>
                  <td>
                    <select class="bk-input" onchange="updateBrandListItem('competitors', ${i}, 'tier', this.value)" style="padding:6px 8px; font-size:12px; font-weight:600;">
                      <option ${c.tier==='Premium'?'selected':''}>Premium</option>
                      <option ${c.tier==='Mid'?'selected':''}>Mid</option>
                      <option ${c.tier==='Low'?'selected':''}>Low</option>
                    </select>
                  </td>
                  <td><input class="bk-input" type="text" value="${c.diff}" oninput="updateBrandListItem('competitors', ${i}, 'diff', this.value)" style="padding:6px 8px; font-size:12px; font-weight:400; color:var(--text-muted);"></td>
                  <td><button class="bk-row-action" onclick="removeBrandListItem('competitors', ${i})" title="Remove">✕</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <button class="bk-add-btn" onclick="addBrandListItem('competitors', { name:'New competitor', positioning:'How they position themselves', tier:'Mid', diff:'What makes them different' })" style="margin-top:12px;">+ Add competitor</button>
        </div>

        <!-- 7. Logos -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="image"></i> 7. Logos & Assets</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Preview generated from brand</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:14px;">
            <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
              <div style="aspect-ratio:3/2; background:white; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border);"><span style="font-family:'${brandKitData.typography.heading}',sans-serif; font-weight:800; font-size:28px; color:${brandKitData.palette[1]?.hex || '#0F172A'};">${brandKitData.name.toLowerCase().split(' ')[0]}<span style="color:${brandKitData.palette[0]?.hex || '#6366F1'};">.</span></span></div>
              <div style="padding:8px 10px; font-size:11px; color:var(--text-muted);">Primary · auto-generated</div>
            </div>
            <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
              <div style="aspect-ratio:3/2; background:${brandKitData.palette[1]?.hex || '#0F172A'}; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border);"><span style="font-family:'${brandKitData.typography.heading}',sans-serif; font-weight:800; font-size:28px; color:white;">${brandKitData.name.toLowerCase().split(' ')[0]}<span style="color:${brandKitData.palette[0]?.hex || '#6366F1'};">.</span></span></div>
              <div style="padding:8px 10px; font-size:11px; color:var(--text-muted);">Dark variant · auto-generated</div>
            </div>
            <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
              <div style="aspect-ratio:3/2; background:${brandKitData.palette[0]?.hex || '#6366F1'}; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border);"><span style="font-family:'${brandKitData.typography.heading}',sans-serif; font-weight:800; font-size:42px; color:white;">${(brandKitData.name[0] || 'A').toUpperCase()}.</span></div>
              <div style="padding:8px 10px; font-size:11px; color:var(--text-muted);">Icon · Favicon · App</div>
            </div>
            <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
              <div style="aspect-ratio:3/2; background:${brandKitData.palette[5]?.hex || '#F8FAFC'}; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border); color:var(--text-muted); font-size:11px; cursor:pointer;">+ Upload variant</div>
              <div style="padding:8px 10px; font-size:11px; color:var(--text-muted);">Social avatar · 512×512</div>
            </div>
          </div>
          <p style="margin-top:12px; font-size:11px; color:var(--text-muted);">💡 These previews update automatically as you change brand name, colors and typography.</p>
        </div>

        <!-- 8. Social Channels -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="share-2"></i> 8. Social Channels</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
            ${brandKitData.channels.map((c, i) => `
              <div style="padding:14px; border:1px solid var(--border); border-radius:8px; position:relative;">
                <button class="bk-row-action" onclick="removeBrandListItem('channels', ${i})" style="position:absolute; top:8px; right:8px;" title="Remove">✕</button>
                <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;"><i data-lucide="${c.icon}" style="color:${c.color}"></i>
                  <input class="bk-input" type="text" value="${c.name}" oninput="updateBrandListItem('channels', ${i}, 'name', this.value)" style="padding:4px 6px; font-size:13px; font-weight:600;">
                </div>
                <label class="bk-label">Handle / URL</label>
                <input class="bk-input" type="text" value="${c.handle}" oninput="updateBrandListItem('channels', ${i}, 'handle', this.value)" style="padding:6px 8px; font-size:12px; font-weight:400;">
                <label class="bk-label" style="margin-top:8px;">Audience / context</label>
                <input class="bk-input" type="text" value="${c.audience}" oninput="updateBrandListItem('channels', ${i}, 'audience', this.value)" style="padding:6px 8px; font-size:11px; font-weight:400;">
              </div>
            `).join('')}
          </div>
          <button class="bk-add-btn" onclick="addBrandListItem('channels', { name:'New channel', icon:'globe', color:'#6366F1', handle:'@yourhandle', audience:'Describe audience size / purpose' })" style="margin-top:12px;">+ Add channel</button>
        </div>

        <!-- 9. Tone by Channel -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="message-circle"></i> 9. Tone by Channel</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>
          </div>
          <table class="lm-table">
            <thead><tr><th style="width:16%;">Channel</th><th style="width:22%;">Primary Tone</th><th style="width:14%;">Formality</th><th>Examples / Patterns</th><th style="width:40px;"></th></tr></thead>
            <tbody>
              ${brandKitData.toneByChannel.map((t, i) => `
                <tr>
                  <td><input class="bk-input" type="text" value="${t.channel}" oninput="updateBrandListItem('toneByChannel', ${i}, 'channel', this.value)" style="padding:6px 8px; font-size:13px;"></td>
                  <td><input class="bk-input" type="text" value="${t.tone}" oninput="updateBrandListItem('toneByChannel', ${i}, 'tone', this.value)" style="padding:6px 8px; font-size:12px; font-weight:400;"></td>
                  <td>
                    <select class="bk-input" onchange="updateBrandListItem('toneByChannel', ${i}, 'formality', this.value)" style="padding:6px 8px; font-size:12px;">
                      <option ${t.formality==='Casual'?'selected':''}>Casual</option>
                      <option ${t.formality==='Mid-formal'?'selected':''}>Mid-formal</option>
                      <option ${t.formality==='Formal'?'selected':''}>Formal</option>
                    </select>
                  </td>
                  <td><textarea class="bk-input area" oninput="updateBrandListItem('toneByChannel', ${i}, 'pattern', this.value)" style="padding:6px 8px; font-size:12px; font-weight:400; min-height:44px; color:var(--text-muted);">${t.pattern}</textarea></td>
                  <td><button class="bk-row-action" onclick="removeBrandListItem('toneByChannel', ${i})" title="Remove">✕</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <button class="bk-add-btn" onclick="addBrandListItem('toneByChannel', { channel:'New channel', tone:'Primary tone · adjective', formality:'Mid-formal', formalityColor:'#FEF3C7,#B45309', pattern:'Describe the writing pattern / example' })" style="margin-top:12px;">+ Add tone by channel</button>
        </div>

        <!-- 10. Existing Content Samples -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="paperclip"></i> 10. Existing Content Samples</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Add/remove samples</span>
          </div>
          <table class="lm-table">
            <thead><tr><th>Sample</th><th style="width:16%;">Channel</th><th style="width:16%;">Performance</th><th style="width:12%;">Voice Fit</th><th style="width:40px;"></th></tr></thead>
            <tbody>
              ${brandKitData.samples.map((s, i) => {
                const fitColor = s.voiceFit >= 90 ? '#D1FAE5,#065F46' : s.voiceFit >= 75 ? '#FEF3C7,#B45309' : '#FEE2E2,#991B1B';
                const [fitBg, fitFg] = fitColor.split(',');
                return `
                  <tr>
                    <td><input class="bk-input" type="text" value="${s.title.replace(/"/g,'&quot;')}" oninput="updateBrandListItem('samples', ${i}, 'title', this.value)" style="padding:6px 8px; font-size:13px; font-weight:600;"></td>
                    <td><input class="bk-input" type="text" value="${s.channel}" oninput="updateBrandListItem('samples', ${i}, 'channel', this.value)" style="padding:6px 8px; font-size:12px; font-weight:400;"></td>
                    <td><input class="bk-input" type="text" value="${s.perf}" oninput="updateBrandListItem('samples', ${i}, 'perf', this.value)" style="padding:6px 8px; font-size:12px; font-weight:600; color:#10B981;"></td>
                    <td><span class="lm-tag" style="background:${fitBg};color:${fitFg}">${s.voiceFit}%</span></td>
                    <td><button class="bk-row-action" onclick="removeBrandListItem('samples', ${i})" title="Remove">✕</button></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <button class="bk-add-btn" onclick="addBrandListItem('samples', { title:'New sample — paste link or description', channel:'LinkedIn', channelColor:'#EFF6FF,#1D4ED8', perf:'—', voiceFit:85 })" style="margin-top:12px;">+ Add content sample</button>
        </div>

        <!-- 9. Tone by Channel -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="message-circle"></i> 9. Tone by Channel</h3>
            <span class="lm-tag" style="background:#D1FAE5;color:#065F46">✓ Defined</span>
          </div>
          <table class="lm-table">
            <thead><tr><th>Channel</th><th>Primary Tone</th><th>Formality</th><th>Examples / Patterns</th></tr></thead>
            <tbody>
              <tr><td><strong>LinkedIn</strong></td><td>Contrarian · confident</td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Mid-formal</span></td><td style="font-size:12px;color:var(--text-muted)">"We killed 40% of our dashboards…" — short sentences, line breaks, founder POV</td></tr>
              <tr><td><strong>X / Twitter</strong></td><td>Dry · technical · witty</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Casual</span></td><td style="font-size:12px;color:var(--text-muted)">Threads on debugging stories. One-liners with a code snippet. Self-deprecating on failures.</td></tr>
              <tr><td><strong>YouTube</strong></td><td>Calm · explanatory · no hype</td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Mid-formal</span></td><td style="font-size:12px;color:var(--text-muted)">Screen recordings, real dashboards, voice-over. No intro music. No "like and subscribe" CTAs.</td></tr>
              <tr><td><strong>Email</strong></td><td>Newsletter-style · crisp</td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Mid-formal</span></td><td style="font-size:12px;color:var(--text-muted)">"Hi [first name] —" opener. 3 sections max. One actionable takeaway per email.</td></tr>
            </tbody>
          </table>
        </div>

        <!-- 10. Content Samples -->
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="paperclip"></i> 10. Existing Content Samples</h3>
            <span class="lm-tag" style="background:#D1FAE5;color:#065F46">12 attached</span>
          </div>
          <table class="lm-table">
            <thead><tr><th>Sample</th><th>Channel</th><th>Performance</th><th>Voice Fit</th></tr></thead>
            <tbody>
              <tr><td><strong>"Why we killed our roadmap"</strong> — Founder post</td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td><strong style="color:#10B981">18.4K reactions</strong></td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">98%</span></td></tr>
              <tr><td><strong>"How we cut CI time by 60%"</strong> — Blog</td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span></td><td><strong style="color:#10B981">12.1K views</strong></td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">95%</span></td></tr>
              <tr><td><strong>"Debugging a 2ms latency spike"</strong> — Post-mortem</td><td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">YouTube</span></td><td><strong style="color:#10B981">9.2K views</strong></td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">92%</span></td></tr>
              <tr><td><strong>"A new way to handle incidents"</strong> — Launch email</td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Email</span></td><td><strong style="color:#10B981">48% open rate</strong></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">81%</span></td></tr>
              <tr><td><strong>"Hiring our first SRE"</strong> — Thread</td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">X/Twitter</span></td><td><strong style="color:#10B981">4.3K likes</strong></td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">94%</span></td></tr>
              <tr><td><strong>"Old blog draft — Transform your workflow"</strong></td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span></td><td><span style="color:var(--text-muted);font-size:12px;">Archived</span></td><td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">42% · flagged</span></td></tr>
            </tbody>
          </table>
        </div>

        <!-- Next step CTA -->
        <div class="card" style="margin-top:24px; background:linear-gradient(135deg, #EEF2FF 0%, #FDF2F8 100%); border:1px solid #E0E7FF;">
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="flex:1;">
              <strong style="font-size:15px;">Your kit feeds BrandVoice Optimizer →</strong>
              <p style="font-size:13px; color:var(--text-muted); margin-top:6px;">Every update here auto-propagates: voice rules recalibrate, ContentBuilder gets new constraints, CreativeBrain re-checks compliance on existing assets. One source of truth for the whole Marketing Pilot stack.</p>
            </div>
            <button class="btn-sm btn-primary" onclick="switchView('brandvoice-optimizer')"><i data-lucide="arrow-right" style="width:14px"></i> Open BrandVoice Optimizer</button>
          </div>
        </div>
      </div>
    `,

    'brandvoice-optimizer': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #EC4899 0%, #BE185D 100%)">
          <div class="agent-bigicon">🎙️</div>
          <div class="agent-header-text">
            <h2>BrandVoice Optimizer</h2>
            <p>Codifies your brand voice into reusable rules every downstream agent follows. One onboarding, and every post, email and ad sounds exactly like you — consistently, forever.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag" id="bvo-brand-tag">Brand: —</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:12px;">
          <div style="display:flex; gap:12px;">
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i><span id="bvo-last-calibration">Last calibration: —</span></span>
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i><span id="bvo-sources">Sources: —</span></span>
          </div>
          <button id="wf02-run-btn" onclick="runBrandVoiceOptimizer()" style="padding:8px 16px; background:#EC4899; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;"><i data-lucide="sparkles" style="width:13px;vertical-align:middle;margin-right:6px"></i>Run Optimizer</button>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val" id="bvo-stat-rules">—</div><div class="agent-stat-lbl">Voice Rules Coded</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">96%</div><div class="agent-stat-lbl">Brand Consistency Score</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="bvo-stat-samples">—</div><div class="agent-stat-lbl">Sample Pieces Analyzed</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="bvo-stat-tone-dims">—</div><div class="agent-stat-lbl">Tone Dimensions</div></div>
        </div>

        <!-- Brand Profile -->
        <div class="kpi-grid" style="grid-template-columns:2fr 1fr; margin-top:24px;">
          <div class="card">
            <h3 class="card-title"><i data-lucide="sparkles"></i> Brand Profile — <span id="bvo-brand-title-name">—</span></h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:14px;">
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Industry</div>
                <div style="font-size:14px; font-weight:600;" id="bvo-industry">—</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Target Audience</div>
                <div style="font-size:14px; font-weight:600;" id="bvo-audience">—</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Primary Channels</div>
                <div style="display:flex; gap:4px; margin-top:4px; flex-wrap:wrap;" id="bvo-channels">—</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Core Values</div>
                <div style="font-size:14px; font-weight:600;" id="bvo-core-values">—</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Palette</div>
                <div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;" id="bvo-palette">—</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Production Goal</div>
                <div style="font-size:14px; font-weight:600;">12 pieces / week</div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title"><i data-lucide="sliders"></i> Tone Dimensions</h3>
            <div style="margin-top:16px;" id="bvo-tone-dims">
              <div style="font-size:12px; color:var(--text-muted);">Loading…</div>
            </div>
          </div>
        </div>

        <!-- Voice Rules -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="check-circle-2"></i> Voice Rules <span id="bvo-rules-count">(— coded)</span></h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px;">
            <div style="padding:12px; border-left:3px solid #10B981; background:#F0FDF4; border-radius:4px;"><strong style="font-size:13px;">Always:</strong><ul style="font-size:12px; margin-top:6px; padding-left:16px; color:#065F46;" id="bvo-always-list"><li style="color:var(--text-muted)">Loading…</li></ul></div>
            <div style="padding:12px; border-left:3px solid #EF4444; background:#FEF2F8; border-radius:4px;"><strong style="font-size:13px;">Never:</strong><ul style="font-size:12px; margin-top:6px; padding-left:16px; color:#991B1B;" id="bvo-never-list"><li style="color:var(--text-muted)">Loading…</li></ul></div>
          </div>
        </div>

        <!-- Sample Learning -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="layers"></i> Sample Content Analyzed</h3>
            <button class="lm-btn-outline" style="padding:4px 10px; font-size:12px;"><i data-lucide="plus" style="width:12px"></i> Feed more samples</button>
          </div>
          <table class="lm-table">
            <thead><tr><th>Source</th><th>Format</th><th>Voice Fit</th><th>Key Traits Extracted</th></tr></thead>
            <tbody>
              <tr><td><strong>Founder's LinkedIn post · "Why we killed our roadmap"</strong></td><td>LinkedIn</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">98%</span></td><td style="font-size:12px;color:var(--text-muted)">Contrarian opener · direct second person · short sentences</td></tr>
              <tr><td><strong>Homepage headline · "Ship faster. Debug less."</strong></td><td>Landing</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">95%</span></td><td style="font-size:12px;color:var(--text-muted)">Imperative mood · outcome-first · parallelism</td></tr>
              <tr><td><strong>Engineering blog · "How we cut CI time by 60%"</strong></td><td>Blog</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">92%</span></td><td style="font-size:12px;color:var(--text-muted)">Numbers in headline · first-person plural · technical but accessible</td></tr>
              <tr><td><strong>Launch email · "A new way to handle incidents"</strong></td><td>Email</td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">81%</span></td><td style="font-size:12px;color:var(--text-muted)">Calm tone · problem-first · no superlatives</td></tr>
              <tr><td><strong>Old blog draft · "Transform your workflow"</strong></td><td>Blog</td><td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">42%</span></td><td style="font-size:12px;color:var(--text-muted)">Flagged: jargon ("transform", "seamless"), no specifics</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Before / After comparison -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="git-compare"></i> Voice Rules in Action — Before vs After</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:14px;">
            <div style="padding:16px; border:1px solid #FCA5A5; background:#FEF2F2; border-radius:8px;">
              <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px;"><span style="font-size:18px;">❌</span><strong style="font-size:13px;">Before — off-brand draft</strong></div>
              <p style="font-size:13px; line-height:1.6; color:#7F1D1D;">"In today's fast-paced digital landscape, engineering teams face unprecedented challenges. Our revolutionary platform leverages cutting-edge AI to transform how you debug and seamlessly integrate with your existing workflow, empowering your team to achieve next-level productivity."</p>
              <div style="margin-top:10px; font-size:11px; color:#991B1B;"><strong>Flagged:</strong> jargon (leverage, transform, seamless, empower) · generic opener · no specifics · passive voice · 4 adjective strings</div>
            </div>
            <div style="padding:16px; border:1px solid #86EFAC; background:#F0FDF4; border-radius:8px;">
              <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px;"><span style="font-size:18px;">✅</span><strong style="font-size:13px;">After — rewritten with voice rules</strong></div>
              <p style="font-size:13px; line-height:1.6; color:#14532D;">"Your engineers spend 12 hours a week debugging in five different tools. Acme replaces them with one. Setup takes 5 minutes. First alert fires within the hour. VP Engineering at Linear cut their on-call pages by 73% in six weeks. Ship faster. Debug less."</p>
              <div style="margin-top:10px; font-size:11px; color:#166534;"><strong>Voice-fit: 96%</strong> · specific numbers · named customer outcome · short sentences · imperative CTA · zero jargon</div>
            </div>
          </div>
        </div>

        <!-- Voice Consistency Trend -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="line-chart"></i> Voice Consistency Trend — last 12 weeks</h3>
          <div style="margin-top:14px;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-bottom:8px;"><span>Week 1</span><span>Week 12</span></div>
            <div style="display:flex; align-items:flex-end; gap:4px; height:120px;">
              ${[58,62,69,74,78,82,85,88,91,93,95,96].map((v, i) => `
                <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                  <div style="width:100%; height:${v}%; background:linear-gradient(180deg, #EC4899, #BE185D); border-radius:4px 4px 0 0;"></div>
                  <div style="font-size:9px; color:var(--text-muted);">${v}%</div>
                </div>
              `).join('')}
            </div>
            <p style="margin-top:12px; padding:10px 12px; background:#FDF2F8; border-radius:6px; font-size:12px; color:#831843;"><strong>📈 +38 points in 12 weeks.</strong> Brand voice rules now catch 96% of off-tone content at generation time, eliminating most review cycles. The remaining 4% are edge cases flagged for human review.</p>
          </div>
        </div>
      </div>
    `,

    'content-engine': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #06B6D4 0%, #0369A1 100%)">
          <div class="agent-bigicon">🧠</div>
          <div class="agent-header-text">
            <h2>ContentEngine</h2>
            <p>Scans top-performing content in your industry — competitors, thought leaders, adjacent categories — and surfaces the formats, themes and structures that are actually driving engagement right now.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag" id="ce-brand-tag">— · 0 pieces analyzed</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:12px;">
          <div style="display:flex; gap:12px;">
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i><span id="ce-last-sync">Last sync: —</span></span>
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i><span id="ce-sources-line">Sources: —</span></span>
          </div>
          <div style="display:flex; gap:8px;">
            <button id="wf03-sync-btn" onclick="syncResearchSources()" style="padding:8px 14px; background:white; color:#0369A1; border:1px solid #BAE6FD; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;"><i data-lucide="refresh-cw" style="width:13px;vertical-align:middle;margin-right:6px"></i>Sync Sources</button>
            <button id="wf04-analyze-btn" onclick="runContentAnalysis()" style="padding:8px 14px; background:#06B6D4; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;"><i data-lucide="zap" style="width:13px;vertical-align:middle;margin-right:6px"></i>Run Analysis</button>
          </div>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val" id="ce-stat-pieces">—</div><div class="agent-stat-lbl">Top Pieces Analyzed (30d)</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="ce-stat-formats">—</div><div class="agent-stat-lbl">Formats Identified</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981" id="ce-stat-vs-baseline">—</div><div class="agent-stat-lbl">Avg Engagement vs Baseline</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="ce-stat-gaps">—</div><div class="agent-stat-lbl">Content Gaps Surfaced</div></div>
        </div>

        <!-- Top formats by engagement -->
        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Avg Engagement by Format</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="mpFormatChart"></canvas></div>
          </div>
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Theme Share of Top Content (30d)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="mpThemeChart"></canvas></div>
          </div>
        </div>

        <!-- Top pieces table -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="flame"></i> Top-Performing Pieces (last 30 days)</h3>
          <table class="lm-table" style="margin-top:14px;">
            <thead><tr><th>Piece</th><th>Author / Brand</th><th>Format</th><th>Engagement</th><th>Why it worked</th></tr></thead>
            <tbody id="ce-top-pieces-tbody">
              <tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">Loading…</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Content gaps -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="zap"></i> Content Gaps — Themes your audience engages with but you haven't covered</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-top:14px;" id="ce-gaps-container">
            <div style="grid-column: 1 / -1; padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">Loading…</div>
          </div>
        </div>

        <!-- Share of voice -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="radar"></i> Share of Voice — Top brands in your space (last 30 days)</h3>
          <div style="margin-top:14px;">
            ${[
              {brand:'Datadog',     posts:42, share:22, engagement:4.1, color:'#632CA6'},
              {brand:'Vercel',      posts:38, share:20, engagement:5.6, color:'#000000'},
              {brand:'Linear',      posts:31, share:16, engagement:7.2, color:'#5E6AD2'},
              {brand:'Acme Corp',   posts:12, share:6,  engagement:4.8, color:'#6366F1', self:true},
              {brand:'Honeycomb',   posts:18, share:10, engagement:3.4, color:'#F97316'},
              {brand:'New Relic',   posts:16, share:8,  engagement:2.1, color:'#00AC69'},
              {brand:'Grafana',     posts:14, share:7,  engagement:2.8, color:'#F46800'},
              {brand:'Others',      posts:22, share:11, engagement:3.2, color:'#94A3B8'},
            ].map(b => `
              <div style="display:grid; grid-template-columns:120px 1fr 60px 80px 80px; gap:12px; align-items:center; padding:8px 0; border-bottom:1px solid var(--border);">
                <div style="display:flex; gap:8px; align-items:center; font-size:13px; font-weight:${b.self?'700':'500'};"><span style="width:8px;height:8px;border-radius:50%;background:${b.color};"></span>${b.brand}${b.self?' <span style="font-size:10px; color:var(--ai-accent);">(you)</span>':''}</div>
                <div style="height:8px; background:#F3F4F6; border-radius:4px; overflow:hidden;"><div style="height:100%; width:${b.share*4}%; background:${b.color};"></div></div>
                <div style="font-size:12px; text-align:right; color:var(--text-muted);">${b.posts} posts</div>
                <div style="font-size:12px; text-align:right; color:var(--text-muted);">${b.share}% voice</div>
                <div style="font-size:12px; text-align:right; color:${b.engagement >= 5 ? '#10B981' : '#374151'}; font-weight:600;">${b.engagement}x eng</div>
              </div>
            `).join('')}
          </div>
          <p style="margin-top:12px; padding:10px 12px; background:#EEF2FF; border-radius:6px; font-size:12px; color:#4338CA;"><strong>💡 Insight:</strong> Linear publishes less than Datadog but gets 1.8x the engagement — their post-mortem + contrarian-hook format is the one to study.</p>
        </div>

        <!-- Sources -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="database"></i> Research Sources Monitored</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-top:14px;" id="ce-sources-container">
            <div style="grid-column: 1 / -1; padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">Loading…</div>
          </div>
        </div>
      </div>
    `,

    'hook-miner': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #F97316 0%, #DC2626 100%)">
          <div class="agent-bigicon">🎣</div>
          <div class="agent-header-text">
            <h2>HookMiner</h2>
            <p>Extracts the opening hooks and narrative frameworks driving engagement in your industry. Every hook classified by channel, format, and proven performance — ready for ContentBuilder to use.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">187 hooks · 6 frameworks</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:12px;">
          <div style="display:flex; gap:12px;">
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last refresh: Today, 09:40 AM</span>
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Derived from ContentEngine's top-142 corpus</span>
          </div>
          <button id="wf05-mine-btn" onclick="runHookMiner()" style="padding:8px 16px; background:#F97316; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;"><i data-lucide="zap" style="width:13px;vertical-align:middle;margin-right:6px"></i>Mine Hooks</button>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">187</div><div class="agent-stat-lbl">Hooks Mined</div></div>
          <div class="agent-stat"><div class="agent-stat-val">6</div><div class="agent-stat-lbl">Frameworks Identified</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">82</div><div class="agent-stat-lbl">Avg Hook Score</div></div>
          <div class="agent-stat"><div class="agent-stat-val">LinkedIn</div><div class="agent-stat-lbl">Top Channel</div></div>
        </div>

        <!-- Framework distribution + top categories -->
        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Hook Category Share</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="mpHookCategoryChart"></canvas></div>
          </div>
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Avg Hook Score by Channel</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="mpHookChannelChart"></canvas></div>
          </div>
        </div>

        <!-- Hook library -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="book-open"></i> Hook Library — Top 8 of 187</h3>
            <select style="padding:4px 8px; border:1px solid var(--border); border-radius:4px; font-size:12px;"><option>All channels</option><option>LinkedIn</option><option>Email</option><option>Blog</option><option>YouTube</option></select>
          </div>
          <table class="lm-table">
            <thead><tr><th>Hook</th><th>Framework</th><th>Channel</th><th>Score</th><th>Use Count</th></tr></thead>
            <tbody>
              <tr><td style="max-width:340px;"><strong>"We killed 40% of our features — here's what happened."</strong></td><td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">Contrarian</span></td><td>LinkedIn</td><td><strong style="color:#10B981">96</strong></td><td>—</td></tr>
              <tr><td style="max-width:340px;"><strong>"Stop building dashboards nobody looks at."</strong></td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Imperative</span></td><td>Blog</td><td><strong style="color:#10B981">92</strong></td><td>12</td></tr>
              <tr><td style="max-width:340px;"><strong>"The 3-line Slack message that replaced our daily standup."</strong></td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">Specific Number</span></td><td>LinkedIn</td><td><strong style="color:#10B981">89</strong></td><td>8</td></tr>
              <tr><td style="max-width:340px;"><strong>"I cut our CI pipeline from 47 to 6 minutes. Here's exactly how."</strong></td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">Specific Number</span></td><td>LinkedIn</td><td><strong style="color:#10B981">87</strong></td><td>14</td></tr>
              <tr><td style="max-width:340px;"><strong>"Every VP Engineering I talk to has the same 3 complaints."</strong></td><td><span class="lm-tag" style="background:#DBEAFE;color:#1E40AF">Persona Aware</span></td><td>LinkedIn</td><td><strong style="color:#10B981">85</strong></td><td>6</td></tr>
              <tr><td style="max-width:340px;"><strong>"Why we moved off [category-leader] — and what changed."</strong></td><td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">Contrarian</span></td><td>Blog</td><td><strong style="color:#10B981">83</strong></td><td>3</td></tr>
              <tr><td style="max-width:340px;"><strong>"How we handle on-call at 12 engineers."</strong></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">How-We Do X</span></td><td>Email</td><td><strong style="color:#10B981">80</strong></td><td>9</td></tr>
              <tr><td style="max-width:340px;"><strong>"Here's the question I ask in every engineering interview."</strong></td><td><span class="lm-tag" style="background:#F3E8FF;color:#6B21A8">Open-Loop</span></td><td>LinkedIn</td><td><strong style="color:#10B981">78</strong></td><td>11</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Frameworks breakdown -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="layout-grid"></i> 6 Frameworks Identified</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-top:14px;">
            <div style="padding:12px; border-left:3px solid #EF4444; background:#FEF2F8; border-radius:4px;"><strong style="font-size:13px;">Contrarian (32 hooks)</strong><p style="font-size:12px; color:var(--text-muted); margin-top:4px;">Challenges conventional wisdom. Pattern: "Stop [common practice]" / "We killed [expected thing]"</p></div>
            <div style="padding:12px; border-left:3px solid #3B82F6; background:#EFF6FF; border-radius:4px;"><strong style="font-size:13px;">Specific Number (41 hooks)</strong><p style="font-size:12px; color:var(--text-muted); margin-top:4px;">Includes measurable outcomes. Pattern: "I cut X from Y to Z" / "We 3x'd [metric] in [time]"</p></div>
            <div style="padding:12px; border-left:3px solid #6B21A8; background:#F3E8FF; border-radius:4px;"><strong style="font-size:13px;">Open-Loop (28 hooks)</strong><p style="font-size:12px; color:var(--text-muted); margin-top:4px;">Creates curiosity gap. Pattern: "The question I ask every…" / "Here's the mistake most…"</p></div>
            <div style="padding:12px; border-left:3px solid #F59E0B; background:#FFF7ED; border-radius:4px;"><strong style="font-size:13px;">How-We-Do-X (34 hooks)</strong><p style="font-size:12px; color:var(--text-muted); margin-top:4px;">Transparent operational narrative. Pattern: "How we [do internal process] at [scale]"</p></div>
            <div style="padding:12px; border-left:3px solid #1D4ED8; background:#DBEAFE; border-radius:4px;"><strong style="font-size:13px;">Persona-Aware (26 hooks)</strong><p style="font-size:12px; color:var(--text-muted); margin-top:4px;">Names the reader directly. Pattern: "Every [persona] I talk to…" / "If you're a [role]…"</p></div>
            <div style="padding:12px; border-left:3px solid #374151; background:#F3F4F6; border-radius:4px;"><strong style="font-size:13px;">Imperative (26 hooks)</strong><p style="font-size:12px; color:var(--text-muted); margin-top:4px;">Strong action verb opener. Pattern: "Stop [X]" / "Start [Y]" / "Ship [Z]"</p></div>
          </div>
        </div>

        <!-- Recommended hooks for this week -->
        <div class="card" style="margin-top:24px; border:1px solid rgba(249,115,22,0.3); background:linear-gradient(180deg, white, #FFF7ED);">
          <h3 class="card-title"><i data-lucide="target"></i> Recommended Hooks This Week — auto-queued for ContentBuilder</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px;">
            <div style="padding:14px; border:1px solid var(--border); background:white; border-radius:8px;">
              <div style="display:flex; gap:6px; margin-bottom:8px;"><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">Contrarian</span><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span><span class="lm-tag" style="background:#F0FDF4;color:#166534">Score 94</span></div>
              <strong style="font-size:14px;">"We stopped doing daily standups. Here's what replaced them."</strong>
              <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">Engagement forecast: <strong style="color:#10B981;">3.2x baseline</strong> · trending theme in your industry</p>
            </div>
            <div style="padding:14px; border:1px solid var(--border); background:white; border-radius:8px;">
              <div style="display:flex; gap:6px; margin-bottom:8px;"><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">Specific Number</span><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span><span class="lm-tag" style="background:#F0FDF4;color:#166534">Score 92</span></div>
              <strong style="font-size:14px;">"I cut our on-call burden by 73% in 6 weeks — here's exactly how."</strong>
              <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">Engagement forecast: <strong style="color:#10B981;">2.9x baseline</strong> · aligns with "Reliability" brand value</p>
            </div>
            <div style="padding:14px; border:1px solid var(--border); background:white; border-radius:8px;">
              <div style="display:flex; gap:6px; margin-bottom:8px;"><span class="lm-tag" style="background:#DBEAFE;color:#1E40AF">Persona-Aware</span><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span><span class="lm-tag" style="background:#F0FDF4;color:#166534">Score 88</span></div>
              <strong style="font-size:14px;">"Every VP of Engineering I've talked to this quarter asked the same question."</strong>
              <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">Engagement forecast: <strong style="color:#10B981;">2.5x baseline</strong> · targets your P1 persona directly</p>
            </div>
            <div style="padding:14px; border:1px solid var(--border); background:white; border-radius:8px;">
              <div style="display:flex; gap:6px; margin-bottom:8px;"><span class="lm-tag" style="background:#F3E8FF;color:#6B21A8">Open-Loop</span><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Email</span><span class="lm-tag" style="background:#F0FDF4;color:#166534">Score 86</span></div>
              <strong style="font-size:14px;">"The one question I ask every engineering hire before we extend an offer."</strong>
              <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">Engagement forecast: <strong style="color:#10B981;">2.3x baseline</strong> · fits newsletter format</p>
            </div>
          </div>
        </div>

        <!-- Hook performance trend -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="trending-up"></i> Hook Performance — Your 10 Most-Used Hooks (last 90d)</h3>
          <table class="lm-table" style="margin-top:14px;">
            <thead><tr><th>Hook</th><th>Used in</th><th>Avg engagement</th><th>Trend</th><th>Verdict</th></tr></thead>
            <tbody>
              <tr><td><strong>"We killed X% of [thing]…"</strong></td><td>4 posts</td><td><strong style="color:#10B981;">4.8x</strong></td><td style="color:#10B981;">↑ +22% vs 30d ago</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Keep using</span></td></tr>
              <tr><td><strong>"I cut X from Y to Z"</strong></td><td>6 posts</td><td><strong style="color:#10B981;">4.2x</strong></td><td style="color:#10B981;">↑ +15%</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Keep using</span></td></tr>
              <tr><td><strong>"Stop [common practice]…"</strong></td><td>5 posts</td><td><strong style="color:#10B981;">3.7x</strong></td><td style="color:#F59E0B;">→ steady</td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Rotate variants</span></td></tr>
              <tr><td><strong>"Here's the question I ask…"</strong></td><td>3 posts</td><td><strong style="color:#10B981;">3.1x</strong></td><td style="color:#10B981;">↑ +8%</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Keep using</span></td></tr>
              <tr><td><strong>"In today's fast-paced world…"</strong></td><td>2 posts</td><td style="color:#EF4444;">0.4x</td><td style="color:#EF4444;">↓ -62%</td><td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">Retire — violates voice</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `,

    'content-builder': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #22C55E 0%, #15803D 100%)">
          <div class="agent-bigicon">✍️</div>
          <div class="agent-header-text">
            <h2>ContentBuilder</h2>
            <p>Combines your brand voice, ContentEngine insights and HookMiner frameworks to generate publish-ready content at scale. Posts, emails and copies that sound like you — because they use your rules.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Producing</div><br>
            <span class="agent-tag">12 pieces/week cadence</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:12px;">
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last batch: Today, 09:50 AM</span>
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Uses: BrandVoice rules · ContentEngine insights · HookMiner frameworks</span>
          </div>
          <button id="wf06-generate-btn" onclick="handleRegenerate()" style="padding:8px 16px; background:#22C55E; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap;"><i data-lucide="sparkles" style="width:13px;vertical-align:middle;margin-right:6px"></i>Generate Brief</button>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">47</div><div class="agent-stat-lbl">Pieces Generated (30d)</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">89%</div><div class="agent-stat-lbl">First-Draft Approval Rate</div></div>
          <div class="agent-stat"><div class="agent-stat-val">4</div><div class="agent-stat-lbl">Active Channels</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">86 hrs</div><div class="agent-stat-lbl">Team Hours Saved (30d)</div></div>
        </div>

        <!-- Generated content preview -->
        <div class="card" style="margin-top:24px; border:1px solid rgba(34,197,94,0.2); background:linear-gradient(180deg,white,#F0FDF4);">
          <h3 class="card-title"><i data-lucide="sparkles"></i> Latest Generated Piece — LinkedIn post</h3>
          <div style="background:white; border:1px solid var(--border); border-radius:10px; padding:20px; margin-top:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div style="display:flex; gap:8px; align-items:center;">
                <span id="cb-tag-channel" class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span>
                <span class="lm-tag" style="background:#FEE2E2;color:#991B1B">Contrarian hook</span>
                <span class="lm-tag" style="background:#F0FDF4;color:#166534">Hook score 96</span>
              </div>
              <span id="cb-generated-meta" style="font-size:11px; color:var(--text-muted);">Generated 3 min ago · Draft</span>
            </div>
            <p id="cb-post-body" style="font-size:15px; line-height:1.7; color:var(--text-main); white-space:pre-line;">We killed 40% of our dashboards last quarter.

Nobody complained.

Turns out: most "essential" dashboards get opened twice a month. The third-most-viewed dashboard at a 500-person engineering org we worked with? Last opened 94 days ago.

What we learned:

1/ Dashboards multiply because adding one is free. Removing one requires a meeting.

2/ Most teams don't need "data visibility" — they need a monthly one-pager with 3 numbers.

3/ The dashboards that stuck had an owner, a cadence, and a decision tied to them.

If you're a VP of Engineering drowning in Looker tabs, start with a 30-day audit: kill anything nobody opened.

Ship faster. Debug less.</p>
            <div style="display:flex; gap:10px; margin-top:16px; padding-top:16px; border-top:1px solid var(--border); align-items:center; flex-wrap:wrap;">
              <select id="cb-channel" style="font-size:12px; padding:4px 8px; border:1px solid var(--border); border-radius:6px;">
                <option value="LinkedIn">LinkedIn</option>
                <option value="Blog">Blog</option>
                <option value="Email">Email</option>
              </select>
              <select id="cb-persona" style="font-size:12px; padding:4px 8px; border:1px solid var(--border); border-radius:6px;">
                <option value="VP Engineering">VP Engineering</option>
                <option value="Senior Developer">Senior Developer</option>
              </select>
              <button class="btn-sm btn-ai" id="btn-regenerate" onclick="handleRegenerate()"><i data-lucide="refresh-cw" style="width:12px"></i> Regenerate</button>
              <button class="btn-sm btn-ai" id="btn-build-draft" onclick="handleBuildDraft()" style="background:#7C3AED;color:white;border:none;"><i data-lucide="wand-2" style="width:12px"></i> Build Draft</button>
              <button class="btn-sm btn-primary" id="btn-approve-queue" onclick="handleApproveQueue()"><i data-lucide="check" style="width:12px"></i> Approve & queue</button>
              <button class="btn-sm btn-ai" id="btn-publish" onclick="handlePublish()" style="background:#059669;color:white;border:none;"><i data-lucide="send" style="width:12px"></i> Publish</button>
              <button class="btn-sm btn-ai" id="btn-generate-visual" onclick="handleGenerateVisual()" style="background:#0EA5E9;color:white;border:none;"><i data-lucide="image" style="width:12px"></i> Generate Visual</button>
              <button class="btn-sm" style="border:1px solid var(--border);"><i data-lucide="edit-3" style="width:12px"></i> Edit</button>
              <button class="btn-sm" id="btn-discard-draft" onclick="handleDiscardDraft()" style="border:1px solid var(--border); margin-left:auto; color:#991B1B;"><i data-lucide="trash-2" style="width:12px"></i> Discard</button>
            </div>
          </div>
        </div>

        <!-- Visual Brief (rendered when WF09 runs) -->
        <div class="card" id="visual-brief-card" style="margin-top:24px; display:none; border:1px solid #0EA5E9; background: linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 60%);">
          <h3 class="card-title"><i data-lucide="image"></i> Generated Image — DALL-E 3 · CreativeBrain</h3>
          <div id="visual-brief-body" style="margin-top:14px;"></div>
        </div>

        <!-- Content queue + channel split -->
        <div class="kpi-grid" style="grid-template-columns: 2fr 1fr; margin-top:24px;">
          <div class="card">
            <h3 class="card-title"><i data-lucide="list"></i> Content Queue — awaiting approval</h3>
            <table class="lm-table" style="margin-top:14px;">
              <thead><tr><th>Title</th><th>Channel</th><th>Format</th><th>QA Score</th><th>Status</th></tr></thead>
              <tbody id="content-queue-tbody">
                <tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">Loading drafts...</td></tr>
              </tbody>
            </table>
          </div>
          <div class="card" style="height:360px; display:flex; flex-direction:column;">
            <h3 class="card-title">Channel Distribution</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="mpChannelSplitChart"></canvas></div>
          </div>
        </div>

        <!-- Voice QA -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="shield-check"></i> Voice QA Report — every piece scored against your brand rules</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:12px; margin-top:14px;">
            <div style="padding:14px; border:1px solid var(--border); border-radius:8px; text-align:center;">
              <div style="font-size:24px; font-weight:800; color:#10B981;">94%</div>
              <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Tone alignment</div>
              <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">vs BrandVoice rules</div>
            </div>
            <div style="padding:14px; border:1px solid var(--border); border-radius:8px; text-align:center;">
              <div style="font-size:24px; font-weight:800; color:#10B981;">96%</div>
              <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Jargon-free</div>
              <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">2 flagged uses of "leverage"</div>
            </div>
            <div style="padding:14px; border:1px solid var(--border); border-radius:8px; text-align:center;">
              <div style="font-size:24px; font-weight:800; color:#10B981;">91%</div>
              <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Persona match</div>
              <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">Addressed VP Eng directly</div>
            </div>
            <div style="padding:14px; border:1px solid var(--border); border-radius:8px; text-align:center;">
              <div style="font-size:24px; font-weight:800; color:#F59E0B;">82%</div>
              <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">CTA specificity</div>
              <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">3 pieces need CTA rewrite</div>
            </div>
          </div>
          <div style="margin-top:16px; padding:12px 14px; background:#FEF3C7; border-left:3px solid #F59E0B; border-radius:4px;">
            <strong style="font-size:12px;">⚠ 3 drafts flagged for review</strong>
            <p style="font-size:12px; color:#78350F; margin-top:6px;">"Transform your workflow with our seamless solution" → violates "never use jargon" rule (seamless, transform). Regenerate suggested.</p>
          </div>
        </div>

        <!-- Weekly production plan -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="calendar-days"></i> This Week's Production Plan</h3>
          <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:10px; margin-top:14px;">
            ${[
              {day:'Mon', title:'LinkedIn post',    topic:'Contrarian: dashboards',   hookScore:96, status:'approved'},
              {day:'Tue', title:'Blog article',      topic:'CI optimization story',   hookScore:87, status:'approved'},
              {day:'Wed', title:'LinkedIn post',    topic:'Slack standup swap',       hookScore:89, status:'draft'},
              {day:'Thu', title:'Email newsletter', topic:'Weekly brief #42',         hookScore:84, status:'approved'},
              {day:'Fri', title:'LinkedIn post',    topic:'3 VP Eng complaints',      hookScore:85, status:'draft'},
            ].map(d => `
              <div style="padding:12px; border:1px solid var(--border); border-radius:8px; background:${d.status==='approved'?'#F0FDF4':'#FEF3C7'}">
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">${d.day}</div>
                <div style="font-size:13px; font-weight:700; margin-top:4px;">${d.title}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${d.topic}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                  <span style="font-size:10px; color:#10B981; font-weight:700;">Score ${d.hookScore}</span>
                  <span class="lm-tag" style="background:${d.status==='approved'?'#D1FAE5':'#FEF3C7'};color:${d.status==='approved'?'#065F46':'#B45309'};">${d.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `,

    'creative-brain': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #A855F7 0%, #6B21A8 100%)">
          <div class="agent-bigicon">🎨</div>
          <div class="agent-header-text">
            <h2>CreativeBrain</h2>
            <p>Renders the content produced by ContentBuilder into multi-format creatives — banners, ad variants, email templates, short-form video covers. Every asset on-brand by default.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Rendering</div><br>
            <span class="agent-tag">Auto brand-compliance ON</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:12px;">
          <div style="display:flex; gap:12px;">
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last batch: Today, 10:05 AM</span>
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Brand guide: Acme Corp · v3.1</span>
          </div>
          <button onclick="switchView('content-builder')" style="padding:8px 16px; background:#A855F7; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap;"><i data-lucide="wand-2" style="width:13px;vertical-align:middle;margin-right:6px"></i>Generate New Visual</button>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">186</div><div class="agent-stat-lbl">Assets Produced (30d)</div></div>
          <div class="agent-stat"><div class="agent-stat-val">5</div><div class="agent-stat-lbl">Formats</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">98%</div><div class="agent-stat-lbl">Brand Compliance</div></div>
          <div class="agent-stat"><div class="agent-stat-val">2.4 min</div><div class="agent-stat-lbl">Avg Render Time</div></div>
        </div>

        <!-- Asset gallery -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="image"></i> Asset Library — last batch</h3>
            <select style="padding:4px 8px; border:1px solid var(--border); border-radius:4px; font-size:12px;"><option>All formats</option><option>LinkedIn Banner</option><option>Email Header</option><option>Ad Variant</option><option>Video Cover</option><option>Blog Hero</option></select>
          </div>
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:14px; margin-top:14px;">
            ${[
              {grad:'linear-gradient(135deg, #6366F1 0%, #0F172A 100%)', label:'LinkedIn Banner', title:'Ship faster. Debug less.'},
              {grad:'linear-gradient(135deg, #F59E0B 0%, #DC2626 100%)', label:'Email Header', title:'We killed 40% of dashboards'},
              {grad:'linear-gradient(135deg, #0F172A 0%, #6366F1 100%)', label:'Ad Variant · A', title:'Stop building dashboards nobody looks at'},
              {grad:'linear-gradient(135deg, #22C55E 0%, #0F172A 100%)', label:'Ad Variant · B', title:'From 47 min CI to 6 min'},
              {grad:'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)', label:'YouTube Cover', title:'How we handle on-call at 12 engineers'},
              {grad:'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)', label:'Blog Hero', title:'Engineering post-mortem: the 2ms spike'},
              {grad:'linear-gradient(135deg, #0F172A 0%, #F59E0B 100%)', label:'Email Header', title:'Your weekly engineering brief'},
              {grad:'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)', label:'Social Story', title:'3 questions every VP Eng should ask'},
            ].map(a => `
              <div style="border-radius:10px; overflow:hidden; border:1px solid var(--border); cursor:pointer; transition:transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="aspect-ratio:16/9; background:${a.grad}; display:flex; align-items:center; justify-content:center; padding:14px; text-align:center;">
                  <span style="color:white; font-weight:700; font-size:13px; line-height:1.4; font-family:var(--font-heading,inherit);">${a.title}</span>
                </div>
                <div style="padding:10px 12px; background:white;">
                  <div style="font-size:11px; color:var(--text-muted);">${a.label}</div>
                  <div style="display:flex; gap:6px; margin-top:6px;"><span class="lm-tag" style="background:#F0FDF4;color:#166534">On-brand</span><span class="lm-tag" style="background:#F3F4F6;color:#374151">Ready</span></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Format distribution + compliance -->
        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Assets by Format (30d)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="mpAssetFormatChart"></canvas></div>
          </div>
          <div class="card">
            <h3 class="card-title"><i data-lucide="shield-check"></i> Brand Compliance Check</h3>
            <div style="margin-top:14px;">
              ${[
                {label:'Logo placement & sizing', pct:100, color:'#10B981'},
                {label:'Palette adherence', pct:98, color:'#10B981'},
                {label:'Typography rules', pct:96, color:'#10B981'},
                {label:'Tone alignment (vs voice rules)', pct:94, color:'#10B981'},
                {label:'Imagery style guide', pct:87, color:'#F59E0B'},
              ].map(c => `<div style="margin-bottom:14px;"><div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;"><span>${c.label}</span><span style="color:${c.color}; font-weight:600;">${c.pct}%</span></div><div style="height:6px; background:#F3F4F6; border-radius:3px; overflow:hidden;"><div style="height:100%; width:${c.pct}%; background:${c.color};"></div></div></div>`).join('')}
              <div style="padding:10px 12px; background:#FFF7ED; border-left:3px solid #F59E0B; border-radius:4px; margin-top:14px;">
                <strong style="font-size:12px;">⚠ 2 flagged assets</strong><p style="font-size:11px; color:var(--text-muted); margin-top:4px;">Imagery style drift detected in 2 video covers — human review recommended before publish.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Template Library -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="layout-template"></i> Template Library — pre-configured and brand-locked</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-top:14px;">
            ${[
              {name:'LinkedIn Single Post',    size:'1200×627', variants:12, color:'#0A66C2'},
              {name:'LinkedIn Carousel (10)',  size:'1080×1080', variants:8, color:'#0A66C2'},
              {name:'Email Hero Banner',       size:'600×200',  variants:6, color:'#F59E0B'},
              {name:'YouTube Thumbnail',       size:'1280×720', variants:14, color:'#EF4444'},
              {name:'Blog Hero Image',         size:'1600×900', variants:9, color:'#374151'},
              {name:'X/Twitter Card',          size:'1200×675', variants:7, color:'#0F172A'},
              {name:'Instagram Story',         size:'1080×1920', variants:5, color:'#EC4899'},
              {name:'Google Ad · Display',     size:'336×280',  variants:11, color:'#22C55E'},
            ].map(t => `
              <div style="padding:12px; border:1px solid var(--border); border-radius:8px; transition:transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="width:100%; aspect-ratio:${t.size.replace('×','/')}; background:linear-gradient(135deg, ${t.color}22, ${t.color}55); border-radius:4px; margin-bottom:8px; max-height:90px;"></div>
                <div style="font-size:12px; font-weight:700;">${t.name}</div>
                <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${t.size} · ${t.variants} variants</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- A/B Test results -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="git-branch"></i> A/B Test Results — last 30 days</h3>
          <table class="lm-table" style="margin-top:14px;">
            <thead><tr><th>Asset pair</th><th>Variant A</th><th>Variant B</th><th>Winner</th><th>Lift</th></tr></thead>
            <tbody>
              <tr>
                <td><strong style="font-size:13px;">LinkedIn — dashboards post</strong><br><span style="font-size:11px;color:var(--text-muted)">Image vs text-only</span></td>
                <td>Static banner · dark<br><span style="font-size:11px;color:var(--text-muted)">2.1% CTR</span></td>
                <td>Text-only + emoji<br><span style="font-size:11px;color:var(--text-muted)">4.8% CTR</span></td>
                <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">B wins</span></td>
                <td style="color:#10B981;font-weight:700;">+128%</td>
              </tr>
              <tr>
                <td><strong style="font-size:13px;">Email — weekly brief header</strong><br><span style="font-size:11px;color:var(--text-muted)">Colorful vs minimal</span></td>
                <td>Gradient hero<br><span style="font-size:11px;color:var(--text-muted)">48% open</span></td>
                <td>Minimal · logo only<br><span style="font-size:11px;color:var(--text-muted)">52% open</span></td>
                <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">B wins</span></td>
                <td style="color:#10B981;font-weight:700;">+8%</td>
              </tr>
              <tr>
                <td><strong style="font-size:13px;">YouTube thumbnail</strong><br><span style="font-size:11px;color:var(--text-muted)">Face vs screenshot</span></td>
                <td>Dev face close-up<br><span style="font-size:11px;color:var(--text-muted)">7.2% CTR</span></td>
                <td>Code screenshot<br><span style="font-size:11px;color:var(--text-muted)">5.1% CTR</span></td>
                <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">A wins</span></td>
                <td style="color:#10B981;font-weight:700;">+41%</td>
              </tr>
              <tr>
                <td><strong style="font-size:13px;">Google Ad · Display 336×280</strong><br><span style="font-size:11px;color:var(--text-muted)">CTA variant</span></td>
                <td>"Start free trial"<br><span style="font-size:11px;color:var(--text-muted)">1.8% CTR</span></td>
                <td>"See it live"<br><span style="font-size:11px;color:var(--text-muted)">2.4% CTR</span></td>
                <td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">B wins</span></td>
                <td style="color:#10B981;font-weight:700;">+33%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,

    'auto-publisher': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)">
          <div class="agent-bigicon">🚀</div>
          <div class="agent-header-text">
            <h2>AutoPublisher</h2>
            <p>Schedules and publishes content autonomously across your social and blog channels — using per-channel, per-audience optimal-timing models learned from engagement history.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Publishing</div><br>
            <span class="agent-tag">4 channels · next publish in 1h 22m</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:12px;">
          <div style="display:flex; gap:12px;">
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last publish: Today, 09:15 AM</span>
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Source: ContentBuilder approved queue</span>
          </div>
          <button onclick="switchView('content-builder')" style="padding:8px 16px; background:#0EA5E9; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap;"><i data-lucide="send" style="width:13px;vertical-align:middle;margin-right:6px"></i>Publish Next Draft</button>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">34</div><div class="agent-stat-lbl">Scheduled (next 7d)</div></div>
          <div class="agent-stat"><div class="agent-stat-val">12</div><div class="agent-stat-lbl">Published this week</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">+23%</div><div class="agent-stat-lbl">Engagement vs manual baseline</div></div>
          <div class="agent-stat"><div class="agent-stat-val">98.6%</div><div class="agent-stat-lbl">Publish success rate</div></div>
        </div>

        <!-- Week calendar -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="calendar"></i> Publishing Calendar — This Week</h3>
            <div style="display:flex; gap:8px;">
              <button class="lm-btn-outline" style="padding:4px 10px; font-size:12px;"><i data-lucide="chevron-left" style="width:12px"></i></button>
              <span style="font-size:12px; padding:4px 10px; color:var(--text-muted);">Apr 14 – 20, 2026</span>
              <button class="lm-btn-outline" style="padding:4px 10px; font-size:12px;"><i data-lucide="chevron-right" style="width:12px"></i></button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:8px;">
            ${[
              {day:'Mon', date:'14', items:[{t:'LinkedIn',c:'#0A66C2',when:'09:15',title:'We killed 40% of dashboards…',status:'published'}]},
              {day:'Tue', date:'15', items:[{t:'Blog',c:'#374151',when:'10:30',title:'How we cut CI from 47 to 6 min',status:'scheduled'},{t:'Email',c:'#F59E0B',when:'07:00',title:'Weekly Eng Brief #42',status:'scheduled'}]},
              {day:'Wed', date:'16', items:[{t:'LinkedIn',c:'#0A66C2',when:'08:45',title:'Stop writing runbooks…',status:'queue'},{t:'X',c:'#0F172A',when:'14:00',title:'Debugging thread · 8 tweets',status:'queue'}]},
              {day:'Thu', date:'17', items:[{t:'LinkedIn',c:'#0A66C2',when:'09:10',title:'The 3-line Slack msg…',status:'queue'},{t:'YouTube',c:'#EF4444',when:'16:00',title:'Post-mortem: 2ms latency',status:'queue'}]},
              {day:'Fri', date:'18', items:[{t:'LinkedIn',c:'#0A66C2',when:'09:00',title:'Every VP Eng has the same 3 complaints',status:'queue'},{t:'Blog',c:'#374151',when:'11:15',title:'Handling on-call at 12 engineers',status:'queue'}]},
              {day:'Sat', date:'19', items:[]},
              {day:'Sun', date:'20', items:[{t:'X',c:'#0F172A',when:'18:30',title:'Weekly roundup thread',status:'queue'}]},
            ].map(d => `
              <div style="border:1px solid var(--border); border-radius:8px; padding:10px; min-height:140px; background:${d.items.length===0?'#F9FAFB':'white'};">
                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
                  <strong style="font-size:12px; color:var(--text-muted);">${d.day}</strong>
                  <span style="font-size:16px; font-weight:700;">${d.date}</span>
                </div>
                ${d.items.map(it => {
                  const bg = it.status==='published' ? '#D1FAE5' : it.status==='scheduled' ? '#EEF2FF' : '#FEF3C7';
                  const fg = it.status==='published' ? '#065F46' : it.status==='scheduled' ? '#4338CA' : '#B45309';
                  return `<div style="padding:6px 8px; background:${bg}; border-radius:4px; margin-bottom:4px; font-size:10px;">
                    <div style="display:flex; gap:4px; align-items:center; font-weight:700; color:${fg};"><span style="width:6px;height:6px;border-radius:50%;background:${it.c};"></span>${it.t} · ${it.when}</div>
                    <div style="color:${fg}; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${it.title}</div>
                  </div>`;
                }).join('') || '<div style="font-size:10px; color:var(--text-muted); text-align:center; padding:20px 0;">—</div>'}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Optimal timing model + queue -->
        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:340px; display:flex; flex-direction:column;">
            <h3 class="card-title">Optimal Posting Times by Channel (learned)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="mpTimingChart"></canvas></div>
          </div>
          <div class="card">
            <h3 class="card-title"><i data-lucide="list-ordered"></i> Next-up Queue</h3>
            <table class="lm-table" style="margin-top:10px;">
              <thead><tr><th>When</th><th>Channel</th><th>Piece</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td style="font-size:12px; color:var(--text-muted);">in 1h 22m</td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span></td><td style="font-size:12px;"><strong>How we cut CI from 47 to 6 min</strong></td><td><span class="lm-tag" style="background:#EEF2FF;color:#4338CA">Scheduled</span></td></tr>
                <tr><td style="font-size:12px; color:var(--text-muted);">Tomorrow · 08:45</td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td style="font-size:12px;"><strong>Stop writing runbooks…</strong></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Queue</span></td></tr>
                <tr><td style="font-size:12px; color:var(--text-muted);">Tomorrow · 14:00</td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">X</span></td><td style="font-size:12px;"><strong>Debugging thread · 8 tweets</strong></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Queue</span></td></tr>
                <tr><td style="font-size:12px; color:var(--text-muted);">Thu · 09:10</td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td style="font-size:12px;"><strong>The 3-line Slack msg…</strong></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Queue</span></td></tr>
                <tr><td style="font-size:12px; color:var(--text-muted);">Thu · 16:00</td><td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">YouTube</span></td><td style="font-size:12px;"><strong>Post-mortem: 2ms latency</strong></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Queue</span></td></tr>
                <tr><td style="font-size:12px; color:var(--text-muted);">Fri · 09:00</td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td style="font-size:12px;"><strong>Every VP Eng has 3 complaints</strong></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Queue</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Publish log -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="check-circle"></i> Recent Publish Log</h3>
          <table class="lm-table" style="margin-top:10px;">
            <thead><tr><th>Published</th><th>Channel</th><th>Piece</th><th>Reach (1h)</th><th>Engagement</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td style="font-size:12px;">Today · 09:15</td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td><strong style="font-size:13px;">We killed 40% of dashboards…</strong></td><td><strong>2.4K</strong></td><td style="color:#10B981;font-weight:600;">+18%</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Live</span></td></tr>
              <tr><td style="font-size:12px;">Mon · 09:10</td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td><strong style="font-size:13px;">The 3-line Slack msg replaces standup</strong></td><td><strong>3.1K</strong></td><td style="color:#10B981;font-weight:600;">+24%</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Live</span></td></tr>
              <tr><td style="font-size:12px;">Sun · 18:30</td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">X</span></td><td><strong style="font-size:13px;">Weekly roundup thread · 7 tweets</strong></td><td><strong>1.8K</strong></td><td style="color:#10B981;font-weight:600;">+12%</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Live</span></td></tr>
              <tr><td style="font-size:12px;">Fri · 11:00</td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span></td><td><strong style="font-size:13px;">How we handle on-call at 12 engineers</strong></td><td><strong>1.2K</strong></td><td style="color:#10B981;font-weight:600;">+9%</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Live</span></td></tr>
              <tr><td style="font-size:12px;">Thu · 07:00</td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Email</span></td><td><strong style="font-size:13px;">Weekly Eng Brief #41</strong></td><td><strong>4.1K sent</strong></td><td style="color:#10B981;font-weight:600;">52% open</td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Delivered</span></td></tr>
            </tbody>
          </table>
        </div>

        <!-- Channel health -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="activity"></i> Channel Health — connection status</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-top:14px;">
            ${[
              {name:'LinkedIn',  icon:'linkedin', iconColor:'#0A66C2', status:'Connected', statusColor:'#10B981', api:'OAuth · refreshed 2d ago', posts:'22 this month', rate:'within limits'},
              {name:'X / Twitter', icon:'at-sign', iconColor:'#0F172A', status:'Connected', statusColor:'#10B981', api:'OAuth · refreshed 1d ago', posts:'18 this month', rate:'within limits'},
              {name:'YouTube',   icon:'youtube', iconColor:'#EF4444', status:'Connected', statusColor:'#10B981', api:'OAuth · refreshed 5d ago', posts:'4 this month', rate:'within limits'},
              {name:'Email (SMTP)', icon:'mail', iconColor:'#F59E0B', status:'Connected', statusColor:'#10B981', api:'API key · validated', posts:'4 campaigns this month', rate:'within limits'},
              {name:'Blog (CMS)', icon:'file-text', iconColor:'#374151', status:'Connected', statusColor:'#10B981', api:'Webhook active', posts:'3 posts this month', rate:'within limits'},
              {name:'Instagram', icon:'image', iconColor:'#EC4899', status:'Reauth needed', statusColor:'#F59E0B', api:'Token expires in 3 days', posts:'0 this month', rate:'—'},
            ].map(c => `
              <div style="padding:14px; border:1px solid var(--border); border-radius:8px; position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><div style="display:flex; gap:8px; align-items:center;"><i data-lucide="${c.icon}" style="color:${c.iconColor}"></i><strong style="font-size:13px;">${c.name}</strong></div><span class="lm-tag" style="background:${c.statusColor}22;color:${c.statusColor}">${c.status}</span></div>
                <div style="font-size:11px; color:var(--text-muted); line-height:1.6;">${c.api}<br>${c.posts}<br>Rate: <strong style="color:${c.statusColor};">${c.rate}</strong></div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Cadence optimization insights -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="gauge"></i> Cadence Optimization — AI recommendations</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px;">
            <div style="padding:14px; border-left:3px solid #10B981; background:#F0FDF4; border-radius:6px;">
              <strong style="font-size:13px;">✓ LinkedIn cadence is optimal</strong>
              <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">Current: 5 posts/week. Engagement plateaus above 6/week for your audience. Keep current cadence.</p>
            </div>
            <div style="padding:14px; border-left:3px solid #F59E0B; background:#FFFBEB; border-radius:6px;">
              <strong style="font-size:13px;">⚠ Blog is under-posting</strong>
              <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">3 posts/month vs industry benchmark of 6-8. Long-form content has a 16-month discovery tail — compounding effect.</p>
            </div>
            <div style="padding:14px; border-left:3px solid #6366F1; background:#EEF2FF; border-radius:6px;">
              <strong style="font-size:13px;">💡 Consider Tuesday + Thursday YouTube uploads</strong>
              <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">Your VP Eng persona watches 2x more YouTube Tue/Thu than Mon/Wed/Fri. Current drops are all on Friday.</p>
            </div>
            <div style="padding:14px; border-left:3px solid #EC4899; background:#FDF2F8; border-radius:6px;">
              <strong style="font-size:13px;">🔥 Re-publish top post on X</strong>
              <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">"We killed 40% of dashboards" got 18.4K on LinkedIn but never went to X. Recommended: thread it Wednesday 2pm.</p>
            </div>
          </div>
        </div>
      </div>
    `,

    // ═══════════════════════════════════════════════════
    //  ANALYTICS & METRICS — SOCIAL & BRAND INTELLIGENCE
    // ═══════════════════════════════════════════════════

    'analytics': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%)">
          <div class="agent-bigicon">📈</div>
          <div class="agent-header-text">
            <h2>Analytics & Metrics</h2>
            <p>Consolidated view of social media performance, brand reach, audience engagement, and review intelligence across all digital channels.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag">4 Platforms Tracked</span>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last sync: Today, 10:30 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Sources: Instagram, LinkedIn, YouTube, Facebook, Reviews</span>
        </div>

        <!-- KPIs -->
        <div class="agent-stats">
          <div class="agent-stat">
            <div class="agent-stat-val">284K</div>
            <div class="agent-stat-lbl">Total Social Reach</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#10B981">4.2%</div>
            <div class="agent-stat-lbl">Avg Engagement Rate</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val">4.7<span style="font-size:14px;color:var(--text-muted)">/5</span></div>
            <div class="agent-stat-lbl">Review Score (Avg)</div>
          </div>
          <div class="agent-stat">
            <div class="agent-stat-val" style="color:#3B82F6">1,840</div>
            <div class="agent-stat-lbl">Brand Mentions (30d)</div>
          </div>
        </div>

        <!-- Platform Cards -->
        <div class="kpi-grid" style="grid-template-columns:1fr 1fr 1fr 1fr; margin-top:24px;">
          <div class="card" style="padding:20px; border-left:4px solid #E4405F;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
              <div style="width:36px;height:36px;background:#E4405F;border-radius:8px;display:flex;align-items:center;justify-content:center;"><i data-lucide="instagram" style="width:18px;color:white"></i></div>
              <strong style="font-size:14px;">Instagram</strong>
            </div>
            <div style="font-size:28px; font-weight:800; color:var(--text-main);">145K</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Followers</div>
            <div style="display:flex; gap:16px; margin-top:12px; padding-top:12px; border-top:1px solid var(--border);">
              <div><span style="font-size:16px; font-weight:700; color:#10B981;">5.1%</span><br><span style="font-size:11px;color:var(--text-muted)">Engagement</span></div>
              <div><span style="font-size:16px; font-weight:700; color:#10B981;">+12%</span><br><span style="font-size:11px;color:var(--text-muted)">Growth (3m)</span></div>
            </div>
          </div>
          <div class="card" style="padding:20px; border-left:4px solid #0A66C2;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
              <div style="width:36px;height:36px;background:#0A66C2;border-radius:8px;display:flex;align-items:center;justify-content:center;"><i data-lucide="linkedin" style="width:18px;color:white"></i></div>
              <strong style="font-size:14px;">LinkedIn</strong>
            </div>
            <div style="font-size:28px; font-weight:800; color:var(--text-main);">48K</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Followers</div>
            <div style="display:flex; gap:16px; margin-top:12px; padding-top:12px; border-top:1px solid var(--border);">
              <div><span style="font-size:16px; font-weight:700; color:#10B981;">3.8%</span><br><span style="font-size:11px;color:var(--text-muted)">Engagement</span></div>
              <div><span style="font-size:16px; font-weight:700; color:#10B981;">+22%</span><br><span style="font-size:11px;color:var(--text-muted)">Growth (3m)</span></div>
            </div>
          </div>
          <div class="card" style="padding:20px; border-left:4px solid #FF0000;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
              <div style="width:36px;height:36px;background:#FF0000;border-radius:8px;display:flex;align-items:center;justify-content:center;"><i data-lucide="youtube" style="width:18px;color:white"></i></div>
              <strong style="font-size:14px;">YouTube</strong>
            </div>
            <div style="font-size:28px; font-weight:800; color:var(--text-main);">67K</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Subscribers</div>
            <div style="display:flex; gap:16px; margin-top:12px; padding-top:12px; border-top:1px solid var(--border);">
              <div><span style="font-size:16px; font-weight:700; color:var(--text-main);">2.4M</span><br><span style="font-size:11px;color:var(--text-muted)">Total Views</span></div>
              <div><span style="font-size:16px; font-weight:700; color:#10B981;">+8%</span><br><span style="font-size:11px;color:var(--text-muted)">Growth (3m)</span></div>
            </div>
          </div>
          <div class="card" style="padding:20px; border-left:4px solid #1877F2;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
              <div style="width:36px;height:36px;background:#1877F2;border-radius:8px;display:flex;align-items:center;justify-content:center;"><i data-lucide="facebook" style="width:18px;color:white"></i></div>
              <strong style="font-size:14px;">Facebook</strong>
            </div>
            <div style="font-size:28px; font-weight:800; color:var(--text-main);">24K</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Followers</div>
            <div style="display:flex; gap:16px; margin-top:12px; padding-top:12px; border-top:1px solid var(--border);">
              <div><span style="font-size:16px; font-weight:700; color:var(--text-muted);">1.9%</span><br><span style="font-size:11px;color:var(--text-muted)">Engagement</span></div>
              <div><span style="font-size:16px; font-weight:700; color:#EF4444;">-3%</span><br><span style="font-size:11px;color:var(--text-muted)">Growth (3m)</span></div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-top:24px;">
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Engagement by Content Type</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="analyticsEngagementChart"></canvas></div>
          </div>
          <div class="card" style="height:320px; display:flex; flex-direction:column;">
            <h3 class="card-title">Follower Growth Trend (6 months)</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="analyticsGrowthChart"></canvas></div>
          </div>
        </div>

        <!-- Review Intelligence -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title" style="margin-bottom:20px;"><i data-lucide="star"></i> Review Intelligence</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:24px;">
            <div style="padding:20px; border-radius:10px; background:#FFFBEB; border:1px solid #FDE68A; text-align:center;">
              <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#92400E; margin-bottom:8px;">Google Reviews</div>
              <div style="font-size:36px; font-weight:800; color:#B45309;">4.7</div>
              <div style="color:#F59E0B; font-size:16px; letter-spacing:2px; margin:4px 0;">★★★★★</div>
              <div style="font-size:12px; color:#92400E;">312 reviews</div>
            </div>
            <div style="padding:20px; border-radius:10px; background:#F0FDF4; border:1px solid #BBF7D0; text-align:center;">
              <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#166534; margin-bottom:8px;">Trustpilot</div>
              <div style="font-size:36px; font-weight:800; color:#166534;">4.5</div>
              <div style="color:#10B981; font-size:16px; letter-spacing:2px; margin:4px 0;">★★★★☆</div>
              <div style="font-size:12px; color:#15803D;">89 reviews</div>
            </div>
            <div style="padding:20px; border-radius:10px; background:#EFF6FF; border:1px solid #BFDBFE; text-align:center;">
              <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#1E40AF; margin-bottom:8px;">Owner Forums</div>
              <div style="font-size:36px; font-weight:800; color:#1E40AF;">4.8</div>
              <div style="color:#3B82F6; font-size:16px; letter-spacing:2px; margin:4px 0;">★★★★★</div>
              <div style="font-size:12px; color:#1D4ED8;">156 mentions analyzed</div>
            </div>
          </div>

          <h4 style="font-size:13px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">Recent Reviews</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px; background:white;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div><strong>Marco R.</strong> <span style="font-size:12px; color:var(--text-muted);">· Google Reviews</span></div>
                <div><span style="color:#F59E0B;">★★★★★</span> <span style="font-size:12px; color:var(--text-muted);">2 days ago</span></div>
              </div>
              <p style="margin:0; font-size:13px; color:var(--text-muted); line-height:1.6;">"The Navetta 68 is simply in another league. The interior space feels like a luxury apartment on water. The Absolute team made the entire buying experience seamless — from the Cannes sea trial to delivery in Sardinia."</p>
            </div>
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px; background:white;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div><strong>James W.</strong> <span style="font-size:12px; color:var(--text-muted);">· Trustpilot</span></div>
                <div><span style="color:#F59E0B;">★★★★☆</span> <span style="font-size:12px; color:var(--text-muted);">1 week ago</span></div>
              </div>
              <p style="margin:0; font-size:13px; color:var(--text-muted); line-height:1.6;">"Purchased a Flybridge 52 through the Fort Lauderdale dealer. Beautiful boat, great fuel efficiency. Only minor complaint is the wait time for custom interior options — took 3 weeks longer than quoted."</p>
            </div>
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px; background:white;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div><strong>Abdullah K.</strong> <span style="font-size:12px; color:var(--text-muted);">· YachtForums</span></div>
                <div><span style="color:#F59E0B;">★★★★★</span> <span style="font-size:12px; color:var(--text-muted);">2 weeks ago</span></div>
              </div>
              <p style="margin:0; font-size:13px; color:var(--text-muted); line-height:1.6;">"Coming from a Sunseeker 55, the Absolute Navetta 52 is a completely different experience. Quieter, more livable, better use of space. The Italian design philosophy shows in every detail. Best decision I made."</p>
            </div>
          </div>
        </div>

        <!-- Top Performing Content -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title" style="margin-bottom:20px;"><i data-lucide="trending-up"></i> Top Performing Content (30d)</h3>
          <div style="overflow-x:auto;">
            <table class="lm-table">
              <thead><tr><th>Content</th><th>Platform</th><th>Type</th><th>Reach</th><th>Engagement</th><th>Saves/Shares</th><th>Date</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>Navetta 75 — First Sea Trial</strong></td>
                  <td><span class="lm-tag" style="background:#E4405F;color:white">Instagram</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Video Reel</span></td>
                  <td style="font-weight:700;">248K</td>
                  <td style="font-weight:700; color:#10B981;">8.4%</td>
                  <td>3,200</td>
                  <td style="font-size:12px; color:var(--text-muted);">Apr 8</td>
                </tr>
                <tr>
                  <td><strong>Sunset in Portofino — Owner Story</strong></td>
                  <td><span class="lm-tag" style="background:#E4405F;color:white">Instagram</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Carousel</span></td>
                  <td style="font-weight:700;">186K</td>
                  <td style="font-weight:700; color:#10B981;">6.7%</td>
                  <td>2,840</td>
                  <td style="font-size:12px; color:var(--text-muted);">Apr 2</td>
                </tr>
                <tr>
                  <td><strong>Full Walkthrough — Flybridge 60</strong></td>
                  <td><span class="lm-tag" style="background:#FF0000;color:white">YouTube</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Long Video</span></td>
                  <td style="font-weight:700;">142K</td>
                  <td style="font-weight:700; color:#10B981;">5.2%</td>
                  <td>1,450</td>
                  <td style="font-size:12px; color:var(--text-muted);">Mar 28</td>
                </tr>
                <tr>
                  <td><strong>CEO Interview — Vision for 2026</strong></td>
                  <td><span class="lm-tag" style="background:#0A66C2;color:white">LinkedIn</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Article</span></td>
                  <td style="font-weight:700;">89K</td>
                  <td style="font-weight:700; color:#10B981;">4.1%</td>
                  <td>720</td>
                  <td style="font-size:12px; color:var(--text-muted);">Mar 22</td>
                </tr>
                <tr>
                  <td><strong>Cannes 2025 — Behind the Scenes</strong></td>
                  <td><span class="lm-tag" style="background:#E4405F;color:white">Instagram</span></td>
                  <td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Stories</span></td>
                  <td style="font-weight:700;">72K</td>
                  <td style="font-weight:700;">3.8%</td>
                  <td>580</td>
                  <td style="font-size:12px; color:var(--text-muted);">Mar 15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Competitor Social Comparison -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title" style="margin-bottom:20px;"><i data-lucide="bar-chart-2"></i> Competitive Social Benchmarking</h3>
          <div style="overflow-x:auto;">
            <table class="lm-table">
              <thead><tr><th>Brand</th><th>Instagram</th><th>LinkedIn</th><th>YouTube</th><th>Avg Engagement</th><th>Review Score</th><th>Trend</th></tr></thead>
              <tbody>
                <tr style="background:rgba(124,58,237,0.04);">
                  <td><strong style="color:#7C3AED;">Absolute Yachts</strong></td>
                  <td style="font-weight:700;">145K</td>
                  <td style="font-weight:700;">48K</td>
                  <td style="font-weight:700;">67K</td>
                  <td style="font-weight:700; color:#10B981;">4.2%</td>
                  <td><span style="color:#F59E0B;">★</span> 4.7</td>
                  <td><span style="color:#10B981; font-weight:600;">↑ Growing</span></td>
                </tr>
                <tr>
                  <td><strong>Ferretti Group</strong></td>
                  <td>312K</td>
                  <td>85K</td>
                  <td>120K</td>
                  <td>3.1%</td>
                  <td><span style="color:#F59E0B;">★</span> 4.2</td>
                  <td><span style="color:var(--text-muted);">→ Stable</span></td>
                </tr>
                <tr>
                  <td><strong>Azimut-Benetti</strong></td>
                  <td>280K</td>
                  <td>72K</td>
                  <td>95K</td>
                  <td>2.8%</td>
                  <td><span style="color:#F59E0B;">★</span> 4.3</td>
                  <td><span style="color:var(--text-muted);">→ Stable</span></td>
                </tr>
                <tr>
                  <td><strong>Sunseeker</strong></td>
                  <td>420K</td>
                  <td>38K</td>
                  <td>52K</td>
                  <td>3.6%</td>
                  <td><span style="color:#F59E0B;">★</span> 4.0</td>
                  <td><span style="color:#EF4444; font-weight:600;">↓ Declining</span></td>
                </tr>
                <tr>
                  <td><strong>Princess Yachts</strong></td>
                  <td>198K</td>
                  <td>45K</td>
                  <td>78K</td>
                  <td>2.9%</td>
                  <td><span style="color:#F59E0B;">★</span> 4.1</td>
                  <td><span style="color:#10B981; font-weight:600;">↑ Growing</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="margin-top:16px; padding:16px; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px;">
            <strong style="color:#166534; font-size:13px;">Key Insight:</strong>
            <span style="color:#15803D; font-size:13px;"> Absolute has the highest engagement rate (4.2%) and review score (4.7) among all competitors despite having fewer followers. Growth trajectory is positive across all platforms except Facebook. Sunseeker leads in Instagram reach but shows declining engagement — quantity over quality.</span>
          </div>
        </div>
      </div>
    `
  };

  // Default fallback
  return views[view] || `<div class="view-section active"><h2>${view} - Under Construction</h2></div>`;
}



// Render specific Dashboard JS charts
function renderDashboardCharts() {
  const ctx = document.getElementById('conversionChart');
  if(!ctx) return;
  chartInstances['conversionChart'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Opportunities Created',
        data: [12, 19, 15, 25],
        backgroundColor: 'rgba(255, 123, 84, 0.8)',
        borderRadius: 4
      }, {
        label: 'Deals Won',
        data: [4, 8, 5, 12],
        backgroundColor: 'rgba(142, 84, 233, 0.8)',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { borderDash: [2,4] }}
      },
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  // Event source chart
  const evtCtx = document.getElementById('dashEventChart');
  if (evtCtx) {
    chartInstances['dashEventChart'] = new Chart(evtCtx, {
      type: 'bar',
      data: {
        labels: ['Cannes 2025', 'FLIBS 2025', 'Boot 2026', 'Dubai 2025', 'Dealer Refs', 'Web / Direct'],
        datasets: [{
          label: 'Leads Generated',
          data: [5, 3, 2, 1, 2, 1],
          backgroundColor: 'rgba(255, 123, 84, 0.8)',
          borderRadius: 4
        }, {
          label: 'Sea Trials Completed',
          data: [3, 1, 1, 0, 1, 0],
          backgroundColor: 'rgba(142, 84, 233, 0.8)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { borderDash: [2,4] }}
        },
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // Region chart
  const regCtx = document.getElementById('dashRegionChart');
  if (regCtx) {
    chartInstances['dashRegionChart'] = new Chart(regCtx, {
      type: 'doughnut',
      data: {
        labels: ['Mediterranean', 'North America', 'Middle East', 'Asia-Pacific', 'Northern Europe'],
        datasets: [{ data: [5, 3, 2, 2, 2], backgroundColor: ['#7C3AED','#3B82F6','#F59E0B','#10B981','#94A3B8'] }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}

function renderCICharts(viewId) {
  const chartOpts = { responsive: true, maintainAspectRatio: false };

  if (viewId === 'price-intelligence') {
    const comp = document.getElementById('ciPriceCompChart');
    const trend = document.getElementById('ciPriceTrendChart');
    if (comp) {
      chartInstances['ciPriceCompChart'] = new Chart(comp, {
        type: 'bar',
        data: {
          labels: ['Absolute', 'Ferretti', 'Azimut', 'Sunseeker', 'Princess', 'Prestige'],
          datasets: [
            { label: 'Base Price (EUR K)', data: [1420, 1680, 1580, 1520, 1610, 1180], backgroundColor: ['#7C3AED','#EF4444','#3B82F6','#F59E0B','#EC4899','#10B981'], borderRadius: 4 }
          ]
        },
        options: { ...chartOpts, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => 'EUR ' + v + 'K' } } } }
      });
    }
    if (trend) {
      chartInstances['ciPriceTrendChart'] = new Chart(trend, {
        type: 'line',
        data: {
          labels: ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
          datasets: [
            { label: 'Absolute', data: [1380,1380,1390,1400,1400,1410,1410,1420,1420,1420,1420,1420], borderColor: '#7C3AED', tension: 0.3, borderWidth: 2, pointRadius: 2 },
            { label: 'Ferretti', data: [1550,1560,1580,1590,1600,1620,1640,1650,1660,1670,1680,1680], borderColor: '#EF4444', tension: 0.3, borderWidth: 2, pointRadius: 2 },
            { label: 'Azimut',   data: [1480,1490,1500,1510,1520,1530,1540,1550,1560,1570,1580,1580], borderColor: '#3B82F6', tension: 0.3, borderWidth: 2, pointRadius: 2 },
            { label: 'Sunseeker',data: [1460,1470,1470,1480,1490,1490,1500,1500,1510,1510,1520,1520], borderColor: '#F59E0B', tension: 0.3, borderWidth: 2, pointRadius: 2 },
          ]
        },
        options: { ...chartOpts, plugins: { legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: v => v + 'K' } } } }
      });
    }
  }

  if (viewId === 'launch-tracker') {
    const bar = document.getElementById('ciLaunchBarChart');
    const seg = document.getElementById('ciLaunchSegmentChart');
    if (bar) {
      chartInstances['ciLaunchBarChart'] = new Chart(bar, {
        type: 'bar',
        data: {
          labels: ['Ferretti', 'Azimut', 'Sunseeker', 'Princess', 'Prestige', 'Absolute'],
          datasets: [{ label: 'Launches (24m)', data: [4, 3, 3, 2, 1, 1], backgroundColor: ['#EF4444','#3B82F6','#F59E0B','#EC4899','#10B981','#7C3AED'], borderRadius: 4 }]
        },
        options: { ...chartOpts, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
      });
    }
    if (seg) {
      chartInstances['ciLaunchSegmentChart'] = new Chart(seg, {
        type: 'doughnut',
        data: {
          labels: ['Flybridge', 'Navetta/Explorer', 'Coupe/Sport', 'Superyacht'],
          datasets: [{ data: [5, 4, 3, 2], backgroundColor: ['#3B82F6','#7C3AED','#F59E0B','#EF4444'] }]
        },
        options: { ...chartOpts, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
      });
    }
  }

  if (viewId === 'sentiment-analyzer') {
    const bar = document.getElementById('ciSentimentBarChart');
    const src = document.getElementById('ciSentimentSourceChart');
    const trend = document.getElementById('ciSentimentTrendChart');
    if (bar) {
      chartInstances['ciSentimentBarChart'] = new Chart(bar, {
        type: 'bar',
        data: {
          labels: ['Absolute', 'Ferretti', 'Azimut', 'Sunseeker', 'Princess'],
          datasets: [
            { label: 'Positive', data: [78, 65, 70, 72, 68], backgroundColor: '#10B981', borderRadius: 4 },
            { label: 'Neutral',  data: [16, 20, 18, 17, 22], backgroundColor: '#F59E0B', borderRadius: 4 },
            { label: 'Negative', data: [6, 15, 12, 11, 10],  backgroundColor: '#EF4444', borderRadius: 4 }
          ]
        },
        options: { ...chartOpts, scales: { x: { stacked: true }, y: { stacked: true } } }
      });
    }
    if (src) {
      chartInstances['ciSentimentSourceChart'] = new Chart(src, {
        type: 'doughnut',
        data: {
          labels: ['Social Media', 'Press/Editorial', 'Owner Forums', 'Dealer Feedback'],
          datasets: [{ data: [42, 28, 18, 12], backgroundColor: ['#3B82F6','#7C3AED','#F59E0B','#10B981'] }]
        },
        options: { ...chartOpts, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
      });
    }
    if (trend) {
      chartInstances['ciSentimentTrendChart'] = new Chart(trend, {
        type: 'line',
        data: {
          labels: ['Nov','Dec','Jan','Feb','Mar','Apr'],
          datasets: [
            { label: 'Absolute',  data: [74,75,76,77,77,78], borderColor: '#7C3AED', tension: 0.3, borderWidth: 2, pointRadius: 3 },
            { label: 'Ferretti',  data: [68,67,66,65,65,65], borderColor: '#EF4444', tension: 0.3, borderWidth: 2, pointRadius: 3 },
            { label: 'Azimut',    data: [71,70,71,70,70,70], borderColor: '#3B82F6', tension: 0.3, borderWidth: 2, pointRadius: 3 },
          ]
        },
        options: { ...chartOpts, plugins: { legend: { position: 'bottom' } }, scales: { y: { min: 50, max: 100, ticks: { callback: v => v + '%' } } } }
      });
    }
  }

  if (viewId === 'demand-intelligence') {
    const trend = document.getElementById('ciDemandTrendChart');
    const region = document.getElementById('ciDemandRegionChart');
    if (trend) {
      chartInstances['ciDemandTrendChart'] = new Chart(trend, {
        type: 'line',
        data: {
          labels: ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
          datasets: [
            { label: 'Total Inquiries', data: [52,61,78,92,85,64,48,42,55,68,74,82], borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3, borderWidth: 2 },
            { label: 'High-Intent', data: [8,12,18,24,20,14,10,8,11,16,19,23], borderColor: '#7C3AED', tension: 0.3, borderWidth: 2, pointRadius: 3 },
          ]
        },
        options: { ...chartOpts, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
      });
    }
    if (region) {
      chartInstances['ciDemandRegionChart'] = new Chart(region, {
        type: 'bar',
        data: {
          labels: ['Mediterranean', 'North America', 'Middle East', 'Asia-Pacific', 'Northern Europe'],
          datasets: [{ label: 'Demand Signals', data: [312, 224, 178, 133, 67], backgroundColor: ['#059669','#3B82F6','#F59E0B','#8B5CF6','#94A3B8'], borderRadius: 4 }]
        },
        options: { ...chartOpts, indexAxis: 'y', plugins: { legend: { display: false } } }
      });
    }
  }

  if (viewId === 'supply-chain-ci') {
    const cost = document.getElementById('ciSupplyCostChart');
    const lead = document.getElementById('ciSupplyLeadChart');
    if (cost) {
      chartInstances['ciSupplyCostChart'] = new Chart(cost, {
        type: 'line',
        data: {
          labels: ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
          datasets: [
            { label: 'Engines',      data: [100,101,102,103,104,104,105,105,106,106,107,106], borderColor: '#EF4444', tension: 0.3, borderWidth: 2 },
            { label: 'Composites',   data: [100,100,101,102,103,103,104,104,105,105,106,105], borderColor: '#F59E0B', tension: 0.3, borderWidth: 2 },
            { label: 'Electronics',  data: [100,102,103,105,106,107,108,108,109,110,110,108], borderColor: '#3B82F6', tension: 0.3, borderWidth: 2 },
            { label: 'Interior/Leather', data: [100,100,100,101,101,101,101,101,101,101,101,101], borderColor: '#10B981', tension: 0.3, borderWidth: 2 },
          ]
        },
        options: { ...chartOpts, plugins: { legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: v => v } } } }
      });
    }
    if (lead) {
      chartInstances['ciSupplyLeadChart'] = new Chart(lead, {
        type: 'bar',
        data: {
          labels: ['Engines (Volvo)', 'Electronics (Garmin)', 'AC (Webasto)', 'Composites', 'Interior (Poltrona Frau)', 'Accessories (Besenzoni)'],
          datasets: [
            { label: 'Current (wks)', data: [22, 18, 14, 10, 8, 6], backgroundColor: '#3B82F6', borderRadius: 4 },
            { label: 'Normal (wks)',   data: [18, 12, 12, 9, 8, 6],  backgroundColor: '#E2E8F0', borderRadius: 4 },
          ]
        },
        options: { ...chartOpts, indexAxis: 'y', plugins: { legend: { position: 'bottom' } } }
      });
    }
  }

  // ─── MARKETING PILOT charts ───
  if (viewId === 'content-engine') {
    const fmt = document.getElementById('mpFormatChart');
    const thm = document.getElementById('mpThemeChart');
    if (fmt) {
      chartInstances['mpFormatChart'] = new Chart(fmt, {
        type: 'bar',
        data: {
          labels: ['LinkedIn Post', 'Long-form Blog', 'YouTube', 'Email', 'Thread (X)', 'Short Video', 'Landing'],
          datasets: [{ label: 'Avg Engagement Index', data: [8.4, 6.9, 5.8, 4.7, 4.2, 3.9, 2.6], backgroundColor: ['#06B6D4','#0369A1','#EF4444','#F59E0B','#6366F1','#EC4899','#94A3B8'], borderRadius: 4 }]
        },
        options: { ...chartOpts, plugins: { legend: { display:false } } }
      });
    }
    if (thm) {
      chartInstances['mpThemeChart'] = new Chart(thm, {
        type: 'doughnut',
        data: {
          labels: ['Post-mortems', 'How-we-do-X', 'Team & hiring', 'Contrarian takes', 'Specific numbers', 'Other'],
          datasets: [{ data: [24, 22, 18, 15, 12, 9], backgroundColor: ['#06B6D4','#0369A1','#22C55E','#EF4444','#F59E0B','#94A3B8'] }]
        },
        options: { ...chartOpts, plugins: { legend: { position: 'right', labels: { font: { size: 11 } } } } }
      });
    }
  }

  if (viewId === 'hook-miner') {
    const cat = document.getElementById('mpHookCategoryChart');
    const ch  = document.getElementById('mpHookChannelChart');
    if (cat) {
      chartInstances['mpHookCategoryChart'] = new Chart(cat, {
        type: 'polarArea',
        data: {
          labels: ['Specific Number', 'How-We-Do-X', 'Contrarian', 'Open-Loop', 'Persona-Aware', 'Imperative'],
          datasets: [{ data: [41, 34, 32, 28, 26, 26], backgroundColor: ['#3B82F6','#F59E0B','#EF4444','#A855F7','#0EA5E9','#374151'] }]
        },
        options: { ...chartOpts, plugins: { legend: { position: 'right', labels: { font: { size: 11 } } } } }
      });
    }
    if (ch) {
      chartInstances['mpHookChannelChart'] = new Chart(ch, {
        type: 'bar',
        data: {
          labels: ['LinkedIn', 'Blog', 'Email', 'YouTube', 'X/Twitter'],
          datasets: [{ label: 'Avg Hook Score', data: [87, 82, 79, 76, 71], backgroundColor: ['#F97316','#DC2626','#F59E0B','#EF4444','#374151'], borderRadius: 4 }]
        },
        options: { ...chartOpts, plugins: { legend: { display:false } }, scales: { y: { beginAtZero: false, min: 60, max: 100 } } }
      });
    }
  }

  if (viewId === 'content-builder') {
    const split = document.getElementById('mpChannelSplitChart');
    if (split) {
      chartInstances['mpChannelSplitChart'] = new Chart(split, {
        type: 'doughnut',
        data: {
          labels: ['LinkedIn', 'Blog', 'Email', 'YouTube'],
          datasets: [{ data: [22, 14, 9, 2], backgroundColor: ['#22C55E','#0369A1','#F59E0B','#EF4444'] }]
        },
        options: { ...chartOpts, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }
      });
    }
  }

  if (viewId === 'creative-brain') {
    const af = document.getElementById('mpAssetFormatChart');
    if (af) {
      chartInstances['mpAssetFormatChart'] = new Chart(af, {
        type: 'bar',
        data: {
          labels: ['Ad Variants', 'LinkedIn Banners', 'Email Headers', 'Video Covers', 'Blog Heros'],
          datasets: [{ label: 'Assets (30d)', data: [68, 42, 36, 24, 16], backgroundColor: '#A855F7', borderRadius: 4 }]
        },
        options: { ...chartOpts, indexAxis: 'y', plugins: { legend: { display: false } } }
      });
    }
  }

  if (viewId === 'auto-publisher') {
    const tc = document.getElementById('mpTimingChart');
    if (tc) {
      chartInstances['mpTimingChart'] = new Chart(tc, {
        type: 'bar',
        data: {
          labels: ['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm'],
          datasets: [
            { label: 'LinkedIn',  data: [2,4,6,9,7,5,3,3,4,4,3,3,2,1,1], backgroundColor: '#0A66C2' },
            { label: 'X/Twitter', data: [1,2,3,4,4,5,6,5,6,4,3,3,5,6,4], backgroundColor: '#0F172A' },
            { label: 'Blog',      data: [1,2,3,5,6,5,3,2,2,2,2,2,1,1,1], backgroundColor: '#374151' },
            { label: 'Email',     data: [2,7,5,3,2,1,1,1,1,1,1,1,1,1,1], backgroundColor: '#F59E0B' },
          ]
        },
        options: { ...chartOpts, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }, scales: { y: { stacked: false, title: { display: true, text: 'Avg engagement' } }, x: { stacked: false } } }
      });
    }
  }
}

function renderAnalyticsCharts() {
  const chartOpts = { responsive: true, maintainAspectRatio: false };

  const engCtx = document.getElementById('analyticsEngagementChart');
  const growCtx = document.getElementById('analyticsGrowthChart');

  if (engCtx) {
    chartInstances['analyticsEngagementChart'] = new Chart(engCtx, {
      type: 'bar',
      data: {
        labels: ['Yacht Tours', 'Lifestyle / Sunset', 'Boat Show', 'Design Detail', 'Owner Stories', 'Behind the Scenes'],
        datasets: [{ label: 'Avg Engagement %', data: [7.8, 6.2, 5.1, 4.4, 3.9, 3.2], backgroundColor: ['#7C3AED','#3B82F6','#F59E0B','#EC4899','#10B981','#94A3B8'], borderRadius: 4 }]
      },
      options: { ...chartOpts, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => v + '%' } } } }
    });
  }

  if (growCtx) {
    chartInstances['analyticsGrowthChart'] = new Chart(growCtx, {
      type: 'line',
      data: {
        labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [
          { label: 'Instagram', data: [128000,131000,134000,138000,142000,145000], borderColor: '#E4405F', tension: 0.3, borderWidth: 2, pointRadius: 3 },
          { label: 'YouTube',   data: [58000,60000,62000,63000,65000,67000], borderColor: '#FF0000', tension: 0.3, borderWidth: 2, pointRadius: 3 },
          { label: 'LinkedIn',  data: [35000,38000,40000,43000,46000,48000], borderColor: '#0A66C2', tension: 0.3, borderWidth: 2, pointRadius: 3 },
          { label: 'Facebook',  data: [25000,25200,25100,24800,24500,24000], borderColor: '#1877F2', tension: 0.3, borderWidth: 2, pointRadius: 3 },
        ]
      },
      options: { ...chartOpts, plugins: { legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: v => (v/1000) + 'K' } } } }
    });
  }
}

// Init App defaults
switchView('dashboard');


// ══════════════════════════════════════════════════════════
//  LEAD PROFILE SLIDE-OUT PANEL
// ══════════════════════════════════════════════════════════

let currentPanelLeadIdx = null;

function openLeadPanel(idx) {
  currentPanelLeadIdx = idx;
  const lead = leadsData[idx];
  const panel = document.getElementById('lead-panel');
  const overlay = document.getElementById('lead-panel-overlay');
  const content = document.getElementById('lead-panel-content');

  content.innerHTML = renderLeadPanel(lead, idx);
  panel.classList.add('open');
  overlay.classList.add('open');
  lucide.createIcons();
}

function closeLeadPanel() {
  document.getElementById('lead-panel').classList.remove('open');
  document.getElementById('lead-panel-overlay').classList.remove('open');
  currentPanelLeadIdx = null;
}

function navigatePanel(dir) {
  if (currentPanelLeadIdx === null) return;
  let next = currentPanelLeadIdx + dir;
  if (next < 0) next = leadsData.length - 1;
  if (next >= leadsData.length) next = 0;
  openLeadPanel(next);
}

// Close on overlay click
document.getElementById('lead-panel-overlay').addEventListener('click', closeLeadPanel);

function renderLeadPanel(lead, idx) {
  const firstName = lead.name.split(' ')[0];
  const initials = lead.name.split(' ').map(n => n[0]).join('');
  const seniority = lead.title.toLowerCase().includes('head') || lead.title.toLowerCase().includes('dir') || lead.title.toLowerCase().includes('senior') ? 'Senior / Director' : 'Manager';

  return `
    <div class="lp-topbar">
      <div class="lp-nav">
        <button class="lp-nav-btn" onclick="navigatePanel(-1)"><i data-lucide="chevron-up" style="width:14px"></i></button>
        <button class="lp-nav-btn" onclick="navigatePanel(1)"><i data-lucide="chevron-down" style="width:14px"></i></button>
        <span class="lp-name">${lead.name}</span>
      </div>
      <div class="lp-actions">
        <button class="lp-nav-btn" title="Print"><i data-lucide="printer" style="width:14px"></i></button>
        <button class="lp-nav-btn" title="Copy link"><i data-lucide="link" style="width:14px"></i></button>
        <button class="lp-nav-btn" onclick="closeLeadPanel()" title="Close"><i data-lucide="x" style="width:14px"></i></button>
      </div>
    </div>

    <div class="lp-body">

      <!-- Profile Card -->
      <div class="lp-profile-card">
        <div class="lp-avatar">${initials}</div>
        <div class="lp-profile-info">
          <h3>${lead.name}</h3>
          <p>${lead.title}</p>
          <p class="lp-org">${lead.org}</p>
        </div>
      </div>

      <!-- Email Interaction -->
      <div class="lp-section">
        <div class="lp-section-title">
          <span>📧 Email Interaction</span>
          <button class="lp-btn lp-btn-primary" onclick="alert('Email sending would be triggered via n8n webhook')">
            <i data-lucide="send" style="width:12px"></i> Send Email
          </button>
        </div>
        <div class="lp-msg-status">
          <div class="lp-detail-row">
            <span class="lp-detail-label">Mail message</span>
            <span class="lp-detail-value"><span class="lp-tag ${lead.mailSent ? 'lp-tag-green' : 'lp-tag-red'}">${lead.mailSent ? 'Sent' : 'Not sent'}</span></span>
          </div>
        </div>
        <div class="lp-msg-field">
          <label>Subject</label>
          <input type="text" class="lp-input" id="lp-email-subject" placeholder="Enter email subject..." value="">
        </div>
        <div class="lp-msg-field">
          <label>Body</label>
          <textarea class="lp-input lp-textarea" id="lp-email-body" placeholder="Type your email message here or ask the AI chatbot to draft one..."></textarea>
        </div>
      </div>

      <hr class="lp-divider">

      <!-- LinkedIn Interaction -->
      <div class="lp-section">
        <div class="lp-section-title">
          <span>💼 LinkedIn Interaction</span>
          <div style="display:flex;gap:6px">
            <button class="lp-btn lp-btn-blue" onclick="alert('LinkedIn connect would be triggered')">
              <i data-lucide="user-plus" style="width:12px"></i> Connect
            </button>
            <button class="lp-btn lp-btn-dark" onclick="alert('LinkedIn message would be sent')">
              <i data-lucide="send" style="width:12px"></i> Send Message
            </button>
          </div>
        </div>
        <div class="lp-msg-status" style="margin-bottom:16px">
          <div class="lp-detail-row" style="margin-bottom:8px">
            <span class="lp-detail-label">LinkedIn Message</span>
            <span class="lp-detail-value"><span class="lp-tag ${lead.liSent ? 'lp-tag-green' : 'lp-tag-red'}">${lead.liSent ? 'Sent' : 'Not sent'}</span></span>
          </div>
        </div>
        <div class="lp-msg-field">
          <label>Subject</label>
          <input type="text" class="lp-input" id="lp-li-subject" placeholder="Enter LinkedIn subject..." value="">
        </div>
        <div class="lp-msg-field">
          <label>LinkedIn Message</label>
          <textarea class="lp-input lp-textarea" id="lp-li-body" placeholder="Type your LinkedIn message here or ask the AI chatbot to draft one..."></textarea>
        </div>
      </div>

      <hr class="lp-divider">

      <!-- Profile Details -->
      <div class="lp-section">
        <div class="lp-section-title"><span>📋 Profile Details</span></div>
        <div class="lp-details">
          <div class="lp-detail-row">
            <span class="lp-detail-label">Email</span>
            <span class="lp-detail-value" style="color:#4776E6">${lead.email}</span>
          </div>
          <div class="lp-detail-row">
            <span class="lp-detail-label">Title</span>
            <span class="lp-detail-value">${lead.title}</span>
          </div>
          <div class="lp-detail-row">
            <span class="lp-detail-label">Current Job Duration</span>
            <span class="lp-detail-value">${lead.dur}</span>
          </div>
          <div class="lp-detail-row">
            <span class="lp-detail-label">Seniority</span>
            <span class="lp-detail-value"><span class="lp-tag lp-tag-purple">${seniority}</span></span>
          </div>
          <div class="lp-detail-row">
            <span class="lp-detail-label">Location</span>
            <span class="lp-detail-value">${lead.city ? `<span class="lp-tag lp-tag-blue">${lead.city}</span>` : '<span style="color:var(--text-light)">Not available</span>'}</span>
          </div>
          <div class="lp-detail-row">
            <span class="lp-detail-label">ICP Score</span>
            <span class="lp-detail-value"><strong style="color:${lead.icpScore >= 80 ? 'var(--success)' : lead.icpScore >= 60 ? 'var(--warning)' : 'var(--danger)'}">${lead.icpScore}</strong> / 100</span>
          </div>
          <div class="lp-detail-row">
            <span class="lp-detail-label">Intent Signal</span>
            <span class="lp-detail-value">${lead.signal}</span>
          </div>
          <div class="lp-detail-row">
            <span class="lp-detail-label">Preferred Channel</span>
            <span class="lp-detail-value"><span class="lp-tag lp-tag-blue">${lead.channel}</span></span>
          </div>
        </div>
      </div>

    </div>
  `;
}


// ══════════════════════════════════════════════════════════
//  AI CHATBOT
// ══════════════════════════════════════════════════════════

let chatbotOpen = false;

function toggleChatbot() {
  chatbotOpen = !chatbotOpen;
  document.getElementById('chatbot-window').classList.toggle('open', chatbotOpen);
  document.getElementById('chatbot-fab').classList.toggle('hidden', chatbotOpen);
  if (chatbotOpen) {
    lucide.createIcons();
    document.getElementById('chatbot-input').focus();
    // Welcome message on first open
    const msgs = document.getElementById('chatbot-messages');
    if (msgs.children.length === 0) {
      addBotMessage(`👋 Hi! I'm your <strong>GrowthAI Assistant</strong>. I can help you draft messages for your leads.\n\nTry things like:\n• "Draft an email for Ed Toombs"\n• "Write a LinkedIn message for Simone"\n• "Edit the email subject to..."\n• "Make the LinkedIn message shorter"`, true);
    }
  }
}

document.getElementById('chatbot-fab').addEventListener('click', toggleChatbot);
document.getElementById('chatbot-close').addEventListener('click', toggleChatbot);

// Send on Enter or click
document.getElementById('chatbot-send').addEventListener('click', handleChatSend);
document.getElementById('chatbot-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleChatSend();
});

function addBotMessage(text, isWelcome) {
  const msgs = document.getElementById('chatbot-messages');
  const div = document.createElement('div');
  div.className = 'cb-msg bot';
  div.innerHTML = `<div class="cb-msg-label">GrowthAI</div><div>${text.replace(/\n/g, '<br>')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatbot-messages');
  const div = document.createElement('div');
  div.className = 'cb-msg user';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatbot-messages');
  const div = document.createElement('div');
  div.className = 'cb-typing';
  div.id = 'cb-typing-indicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('cb-typing-indicator');
  if (el) el.remove();
}

function findLeadByName(query) {
  const q = query.toLowerCase();
  
  // 1) Match by lead name
  const matchByName = leadsData.find(l => {
    const nameParts = l.name.toLowerCase().split(' ');
    return nameParts.some(part => part.length > 2 && q.includes(part)) || q.includes(l.name.toLowerCase());
  });
  if (matchByName) return matchByName;

  // 2) Match by general title & organization (e.g., "CEO of Valagro")
  const matchByTitleOrg = leadsData.find(l => {
    const orgWord = l.org.toLowerCase();
    const cleanTitle = l.title.toLowerCase().split(' ')[0]; // Gets 'ceo', 'director', etc.
    return q.includes(orgWord) && q.includes(cleanTitle);
  });
  return matchByTitleOrg;
}

function generateEmail(lead) {
  const firstName = lead.name.split(' ')[0];
  const subject = `Quick question about ${lead.title.toLowerCase().includes('fixed income') ? 'fixed income data workflows' : 'your team\'s sales process'}`;
  const body = `Hi ${firstName},\n\nI imagine one of the challenges for ${lead.title.toLowerCase()}s at a firm like ${lead.org} is the time it takes to clean, aggregate, and update data before you can truly analyze it. The bottleneck is almost always getting that data ready quickly and reliably, especially when your attention needs to be on trading and portfolio decisions.\n\nTeams like yours tell us that our platform cuts their time-to-analysis in half by automating data integration with modeling workflows. I can show you in 15 minutes how other ${lead.title.toLowerCase().split(' ').pop()} professionals are speeding up these insights.\n\nWould Thursday or Friday afternoon this week work for a quick screen share?\n\nBest regards`;
  return { subject, body };
}

function generateLinkedIn(lead) {
  const firstName = lead.name.split(' ')[0];
  const subject = `Quick question about ${lead.title.toLowerCase().includes('fixed income') ? 'macro data analysis' : 'growth acceleration'}`;
  const body = `Hi ${firstName}, I imagine one challenge for ${lead.title.toLowerCase()}s at ${lead.org} is quickly testing new scenarios to steer your portfolio efficiently. We've seen teams cut time-to-analysis in half by automating data integration with modeling workflows. I can show you in 15 minutes how other professionals are speeding up these insights. Would Thursday or Friday afternoon this week work for a quick screen share?`;
  return { subject, body };
}

function handleChatSend() {
  const input = document.getElementById('chatbot-input');
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = '';

  showTyping();

  setTimeout(() => {
    hideTyping();
    processCommand(text);
  }, 800 + Math.random() * 700);
}

function processCommand(text) {
  const lower = text.toLowerCase();

  // ─── SHOW COMPANYS / LEADS (FROM LOCAL CACHE) ───
  if (lower.includes('empresa') || lower.includes('company') || lower.includes('companies') || lower.includes('contactos')) {
    let companyHtml = '';
    let leadsCounter = 0;

    // Loop through company cache DB
    for (const [domain, company] of Object.entries(companyCacheDB)) {
      companyHtml += `<div style="margin-bottom: 12px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">`;
      companyHtml += `<div style="font-weight: 600; color: #fff; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
                        <span>🏢 ${company.name}</span>
                        <a href="#" onclick="document.getElementById('chatbot-input').value='Draft an email to the CEO of ${company.name.split(' ')[0].replace(/'/g, '&apos;')}'; document.getElementById('chatbot-send').click(); return false;" style="font-size: 10px; background: #6366f1; color: white; padding: 2px 6px; border-radius: 4px; text-decoration: none;">Engage</a>
                      </div>`;
      companyHtml += `<div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px;">${company.industry} • ${company.headcount}</div>`;
      
      if (company.leads && company.leads.length > 0) {
        companyHtml += `<div style="font-size: 11px; font-weight: 600; color: #CBD5E1; margin-bottom: 4px;">🎯 Key Leads:</div>`;
        company.leads.forEach(lead => {
          leadsCounter++;
          const liUrl = `https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(lead.name + ' ' + company.name)}`;
          const actionColor = lead.actionType === 'hot' ? '#ef4444' : lead.actionType === 'warm' ? '#f59e0b' : '#3b82f6';
          
          companyHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; margin-bottom: 2px; border-radius: 4px; background: rgba(0,0,0,0.2);">
              <div style="flex: 1; min-width:0;">
                <div style="font-weight: 500; color: #e2e8f0; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lead.name}</div>
                <div style="font-size: 10px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lead.title}</div>
              </div>
              <div style="display: flex; gap: 4px; align-items: center;">
                <span style="font-size: 9px; padding: 1px 4px; border-radius: 10px; background: ${actionColor}22; color: ${actionColor}; border: 1px solid ${actionColor}44;">Score: ${lead.score}</span>
                <a href="${liUrl}" target="_blank" title="View LinkedIn" style="color: #0A66C2; background: rgba(10, 102, 194, 0.1); padding: 2px; border-radius: 3px; display: inline-flex;"><i data-lucide="linkedin" style="width: 12px; height: 12px;"></i></a>
              </div>
            </div>
          `;
          
          // leadsData is never modified from cache — only the original leads are used
        });
      }
      companyHtml += `</div>`;
    }

    addBotMessage(`📊 <strong>Found ${Object.keys(companyCacheDB).length} Companies and ${leadsCounter} Leads in your database.</strong>\n\nHere is your requested intelligence breakdown:\n\n${companyHtml}`);

    // Process lucid icons in the newly created message
    setTimeout(() => {
      if (window.lucide) window.lucide.createIcons();
    }, 100);
    
    return;
  }

  // ─── CLEAR / HIDE LEADS ───
  if (lower.includes('clear') || lower.includes('hide') || lower.includes('reset') || lower.includes('delete') || lower.includes('remove') || lower.includes('borra')) {
    if (!leadsRevealed) {
      addBotMessage("There are no leads to hide right now. The database is already empty.");
      return;
    }
    leadsRevealed = false;
    
    // Check if the chat should reset the generated messages too (just visually closing panel)
    if (currentPanelLeadIdx !== null) {
      closeLeadPanel();
    }
    
    switchView(state.currentView);
    addBotMessage("🧹 <strong>Leads cleared!</strong> The database has been reset to an empty state. You can now start another demo by asking me to find leads again.");
    return;
  }

  // ─── BRING / FIND / SEARCH LEADS ───
  if (lower.includes('bring') || lower.includes('find leads') || lower.includes('search leads') || lower.includes('get leads') || lower.includes('import leads') || lower.includes('fetch leads') || (lower.includes('leads') && lower.includes('for '))) {

    // Extract company name from message and try to match in cache
    const searchContext = text.replace(/^.*?(for|about|in|related to)\s*/i, '').trim() || 'your specified criteria';
    const searchLower = searchContext.toLowerCase();

    // Find matching company in cache
    let matchedDomain = null;
    let matchedCompany = null;
    for (const [domain, company] of Object.entries(companyCacheDB)) {
      const companyNameLower = company.name.toLowerCase();
      if (companyNameLower.includes(searchLower) || searchLower.includes(companyNameLower.split(' ')[0]) || domain.includes(searchLower)) {
        matchedDomain = domain;
        matchedCompany = company;
        break;
      }
    }

    // Restore original pre-loaded leads (ignore companyCacheDB contacts)
    leadsData.length = 0;
    _originalLeadsData.forEach(l => leadsData.push({ ...l }));

    if (leadsRevealed) {
      leadsRevealed = false;
    }

    addBotMessage(`🔍 Searching for leads matching: <strong>"${searchContext}"</strong>\n\nScanning LinkedIn, company databases, and intent signals...`);

    setTimeout(() => { showTyping(); }, 800);

    setTimeout(() => {
      hideTyping();
      const companyLabel = matchedCompany ? matchedCompany.name : searchContext;
      addBotMessage(`📊 Found <strong>${leadsData.length} high-quality leads</strong> for ${companyLabel}:\n\n• <strong>${leadsData.filter(l => l.icpScore >= 80).length}</strong> leads with ICP Score ≥ 80\n• <strong>${leadsData.filter(l => l.icpScore >= 60 && l.icpScore < 80).length}</strong> leads with ICP Score 60-79\n• Profiles: ${[...new Set(leadsData.map(l => l.title.split('·')[0].trim()))].slice(0, 3).join(', ')} and more\n\nLoading into LeadMiner™...`);
    }, 2500);

    setTimeout(() => { showTyping(); }, 3500);

    setTimeout(() => {
      hideTyping();
      leadsRevealed = true;
      switchView(state.currentView);
      if (state.currentView !== 'leadminer') switchView('leadminer');
      addBotMessage(`✅ <strong>${leadsData.length} leads imported successfully!</strong>\n\nAll leads are now visible in <strong>LeadMiner™</strong>. Click any lead to open their profile, or ask me to <strong>"Draft an email for [Name]"</strong> to get started.`);
    }, 5000);

    return;
  }

  // ─── DRAFT EMAIL ───
  if ((lower.includes('draft') || lower.includes('write') || lower.includes('create') || lower.includes('generate')) && lower.includes('email')) {
    const lead = findLeadByName(lower);
    if (!lead) {
      addBotMessage("I couldn't find that lead. Try using their first or last name, e.g. <strong>\"Draft an email for Ed Toombs\"</strong>");
      return;
    }
    const { subject, body } = generateEmail(lead);
    const idx = leadsData.indexOf(lead);

    // Open panel if not already open for this lead
    if (currentPanelLeadIdx !== idx) openLeadPanel(idx);

    // Fill the fields
    setTimeout(() => {
      const subEl = document.getElementById('lp-email-subject');
      const bodyEl = document.getElementById('lp-email-body');
      if (subEl) subEl.value = subject;
      if (bodyEl) bodyEl.value = body;
    }, 400);

    addBotMessage(`✅ Done! I've drafted an email for <strong>${lead.name}</strong> at ${lead.org}.\n\n📧 <strong>Subject:</strong> ${subject}\n\nThe message is now in the <strong>Email Interaction</strong> panel — you can edit it directly before sending.`);
    return;
  }

  // ─── DRAFT LINKEDIN ───
  if ((lower.includes('draft') || lower.includes('write') || lower.includes('create') || lower.includes('generate')) && (lower.includes('linkedin') || lower.includes('li msg') || lower.includes('li message'))) {
    const lead = findLeadByName(lower);
    if (!lead) {
      addBotMessage("I couldn't find that lead. Try using their first or last name, e.g. <strong>\"Draft a LinkedIn message for Simone\"</strong>");
      return;
    }
    const { subject, body } = generateLinkedIn(lead);
    const idx = leadsData.indexOf(lead);

    if (currentPanelLeadIdx !== idx) openLeadPanel(idx);

    setTimeout(() => {
      const subEl = document.getElementById('lp-li-subject');
      const bodyEl = document.getElementById('lp-li-body');
      if (subEl) subEl.value = subject;
      if (bodyEl) bodyEl.value = body;
    }, 400);

    addBotMessage(`✅ Done! I've drafted a LinkedIn message for <strong>${lead.name}</strong>.\n\n💼 <strong>Subject:</strong> ${subject}\n\nYou can edit it in the <strong>LinkedIn Interaction</strong> panel.`);
    return;
  }

  // ─── DRAFT BOTH ───
  if ((lower.includes('draft') || lower.includes('write') || lower.includes('create')) && (lower.includes('message') || lower.includes('msg')) && !lower.includes('email') && !lower.includes('linkedin')) {
    const lead = findLeadByName(lower);
    if (!lead) {
      addBotMessage("I couldn't find that lead. Please specify a name, e.g. <strong>\"Draft a message for Ed Toombs\"</strong>");
      return;
    }
    const email = generateEmail(lead);
    const li = generateLinkedIn(lead);
    const idx = leadsData.indexOf(lead);

    if (currentPanelLeadIdx !== idx) openLeadPanel(idx);

    setTimeout(() => {
      const eSubEl = document.getElementById('lp-email-subject');
      const eBodyEl = document.getElementById('lp-email-body');
      const lSubEl = document.getElementById('lp-li-subject');
      const lBodyEl = document.getElementById('lp-li-body');
      if (eSubEl) eSubEl.value = email.subject;
      if (eBodyEl) eBodyEl.value = email.body;
      if (lSubEl) lSubEl.value = li.subject;
      if (lBodyEl) lBodyEl.value = li.body;
    }, 400);

    addBotMessage(`✅ I've drafted both an <strong>email</strong> and a <strong>LinkedIn message</strong> for <strong>${lead.name}</strong>.\n\nBoth are now editable in the profile panel on the right.`);
    return;
  }

  // ─── EDIT EMAIL SUBJECT ───
  if (lower.includes('edit') && lower.includes('subject') && lower.includes('email')) {
    const newSubject = text.replace(/.*(?:subject\s+(?:to|as|with|=)\s*)/i, '').replace(/[\"\']/g, '').trim();
    const subEl = document.getElementById('lp-email-subject');
    if (subEl && newSubject) {
      subEl.value = newSubject;
      addBotMessage(`✅ Email subject updated to: <strong>"${newSubject}"</strong>`);
    } else {
      addBotMessage("Please open a lead profile first, then tell me: <strong>\"Edit the email subject to [your subject]\"</strong>");
    }
    return;
  }

  // ─── EDIT LINKEDIN SUBJECT ───
  if (lower.includes('edit') && lower.includes('subject') && lower.includes('linkedin')) {
    const newSubject = text.replace(/.*(?:subject\s+(?:to|as|with|=)\s*)/i, '').replace(/[\"\']/g, '').trim();
    const subEl = document.getElementById('lp-li-subject');
    if (subEl && newSubject) {
      subEl.value = newSubject;
      addBotMessage(`✅ LinkedIn subject updated to: <strong>"${newSubject}"</strong>`);
    } else {
      addBotMessage("Please open a lead profile first, then tell me what to change.");
    }
    return;
  }

  // ─── MAKE SHORTER / LONGER ───
  if (lower.includes('shorter') || lower.includes('concise') || lower.includes('brief')) {
    const target = lower.includes('linkedin') ? 'lp-li-body' : 'lp-email-body';
    const el = document.getElementById(target);
    if (el && el.value) {
      // Trim to first 2 sentences + closing
      const sentences = el.value.split(/(?<=[.!?])\s+/);
      const short = sentences.slice(0, 3).join(' ') + '\n\nBest regards';
      el.value = short;
      addBotMessage(`✅ I've shortened the ${lower.includes('linkedin') ? 'LinkedIn' : 'email'} message. Check the panel — you can keep editing it.`);
    } else {
      addBotMessage("No message to shorten. Draft a message first, then ask me to make it shorter.");
    }
    return;
  }

  // ─── OPEN LEAD PANEL ───
  if (lower.includes('open') || lower.includes('show') || lower.includes('profile')) {
    const lead = findLeadByName(lower);
    if (lead) {
      openLeadPanel(leadsData.indexOf(lead));
      addBotMessage(`✅ Opened profile for <strong>${lead.name}</strong> at ${lead.org}.`);
    } else {
      addBotMessage("I couldn't find that lead. Try: <strong>\"Show profile for Ed Toombs\"</strong>");
    }
    return;
  }

  // ─── HELP / FALLBACK ───
  addBotMessage(`I can help with these commands:\n\n• <strong>"Draft an email for [Name]"</strong> — writes & fills email\n• <strong>"Draft a LinkedIn message for [Name]"</strong> — writes & fills LI msg\n• <strong>"Draft a message for [Name]"</strong> — writes both\n• <strong>"Edit the email subject to [text]"</strong>\n• <strong>"Make the email shorter"</strong>\n• <strong>"Show profile for [Name]"</strong>\n\nTry it now! 🚀`);
}


// ══════════════════════════════════════════════════════════
//  AI COMMAND SEARCH BAR + ⌘K PALETTE
// ══════════════════════════════════════════════════════════

const cmdInput = document.querySelector('.cmd-input');
const cmdBarEl = document.querySelector('.cmd-bar');

// ⌘K / Ctrl+K — focus search bar
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    cmdInput.focus();
    cmdInput.select();
    showCmdResults('');
  }
  if (e.key === 'Escape') {
    hideCmdResults();
    closeAllPanels();
  }
});

cmdInput.addEventListener('focus', () => showCmdResults(cmdInput.value));
cmdInput.addEventListener('input', () => showCmdResults(cmdInput.value));
cmdInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const q = cmdInput.value.trim();
    if (q) { executeCmdQuery(q); }
  }
});

document.addEventListener('click', (e) => {
  const panel = document.getElementById('cmd-results-panel');
  if (panel && !cmdBarEl.contains(e.target) && !panel.contains(e.target)) {
    hideCmdResults();
  }
});

function showCmdResults(query) {
  let panel = document.getElementById('cmd-results-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'cmd-results-panel';
    panel.style.cssText = 'position:fixed;z-index:9999;display:none;';
    document.body.appendChild(panel);
  }
  const rect = cmdBarEl.getBoundingClientRect();
  panel.style.top = `${rect.bottom + 6}px`;
  panel.style.left = `${rect.left}px`;
  panel.style.width = `${rect.width}px`;
  panel.style.display = 'block';

  const q = query.toLowerCase().trim();
  panel.innerHTML = q ? renderCmdResponse(q, query) : renderCmdSuggestions();
  lucide.createIcons({ nodes: [panel] });
}

function hideCmdResults() {
  const panel = document.getElementById('cmd-results-panel');
  if (panel) panel.style.display = 'none';
}

function renderCmdSuggestions() {
  const suggestions = [
    { icon: 'flame',         label: 'Which leads should I contact today?', color: '#EF4444' },
    { icon: 'trophy',        label: 'Show me top ICP prospects',           color: '#F59E0B' },
    { icon: 'mail-question', label: "Who hasn't been contacted yet?",      color: '#3B82F6' },
    { icon: 'bar-chart-2',   label: 'Pipeline summary',                    color: '#8B5CF6' },
    { icon: 'message-square-plus', label: 'Draft an email for [Name]',     color: '#10B981' },
  ];
  return `<div class="cmd-results-panel">
    <div class="cmd-results-header">Suggested queries</div>
    ${suggestions.map(s => `
      <div class="cmd-result-item" onclick="executeCmdQuery(${JSON.stringify(s.label)})">
        <div class="cmd-result-icon" style="background:${s.color}22;color:${s.color}">
          <i data-lucide="${s.icon}" style="width:13px;height:13px"></i>
        </div>
        <span>${s.label}</span>
      </div>`).join('')}
    <div class="cmd-results-hint">Press <kbd style="background:#F1F1F5;border:1px solid #E4E4EB;padding:1px 5px;border-radius:4px;font-size:10px">Enter</kbd> to search &nbsp;·&nbsp; <kbd style="background:#F1F1F5;border:1px solid #E4E4EB;padding:1px 5px;border-radius:4px;font-size:10px">Esc</kbd> to close</div>
  </div>`;
}

function renderCmdResponse(q, originalQuery) {
  const statusColors = { hot:'#EF4444', active:'#F59E0B', 'in-sequence':'#3B82F6', dormant:'#94A3B8' };

  // ── Navigation shortcuts ──
  const navMap = [
    ['leadminer','lead','leads'],
    ['icp-scorer','icp','scorer'],
    ['message-tailor','message tailor','message'],
    ['outreach-flow','outreach'],
    ['smart-nurture','nurture'],
    ['analytics','analytics','metrics'],
    ['company-bio','company bio','bio scanner'],
    ['branding-kit','branding','brand kit'],
    ['brandvoice-optimizer','brandvoice','brand voice'],
    ['content-engine','content engine'],
    ['hook-miner','hook miner','hooks'],
    ['content-builder','content builder','builder'],
    ['creative-brain','creative brain','creative'],
    ['auto-publisher','auto publisher','publisher'],
    ['dashboard','dashboard','home'],
  ];
  for (const [view, ...keys] of navMap) {
    if (keys.some(k => q.includes(`go to ${k}`) || q.includes(`open ${k}`) || q.includes(`show ${k}`) || q.includes(`navigate to ${k}`))) {
      const label = view.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
      return `<div class="cmd-results-panel">
        <div class="cmd-result-item" onclick="switchView('${view}');hideCmdResults();cmdInput.value='';">
          <div class="cmd-result-icon" style="background:#8E54E922;color:#8E54E9"><i data-lucide="navigation" style="width:13px;height:13px"></i></div>
          <div><div style="font-size:13px;font-weight:600">Navigate to ${label}</div></div>
        </div>
      </div>`;
    }
  }

  // ── Today's contacts ──
  if (q.includes('contact today') || q.includes('should i contact') || q.includes('who to contact') || q.includes('contact now')) {
    const leads = leadsData.filter(l => l.status === 'hot').slice(0, 3);
    return renderCmdLeadList(leads, 'Contact Today', 'Highest priority — active engagement signals', statusColors);
  }

  // ── Top ICP ──
  if (q.includes('top icp') || q.includes('top prospect') || q.includes('best lead') || q.includes('highest icp') || q.includes('best prospect')) {
    const leads = [...leadsData].sort((a,b) => b.icpScore - a.icpScore).slice(0, 3);
    return renderCmdLeadList(leads, 'Top ICP Prospects', 'Sorted by ICP match score', statusColors);
  }

  // ── Not contacted ──
  if (q.includes('not contact') || q.includes("hasn't been") || q.includes('no contact') || q.includes('uncontacted') || q.includes('zero touch')) {
    const leads = leadsData.filter(l => !l.mailSent && !l.liSent).slice(0, 4);
    if (!leads.length) return renderCmdInfo('All leads contacted ✅', 'Every lead has at least one touchpoint.');
    return renderCmdLeadList(leads, 'Not Yet Contacted', 'Zero touchpoints — start outreach', statusColors);
  }

  // ── Pipeline summary ──
  if (q.includes('pipeline') || q.includes('summary') || q.includes('overview') || q.includes('stats') || q.includes('how many')) {
    return renderCmdPipelineSummary();
  }

  // ── Highest closing prob ──
  if (q.includes('closing') || q.includes('close') || q.includes('probability') || q.includes('convert') || q.includes('win')) {
    const leads = [...leadsData].sort((a,b) => b.closingProb - a.closingProb).slice(0, 3);
    return renderCmdLeadList(leads, 'Highest Closing Probability', 'Most likely to convert this month', statusColors);
  }

  // ── Dormant ──
  if (q.includes('dormant') || q.includes('inactive') || q.includes('cold lead') || q.includes('stale')) {
    const leads = leadsData.filter(l => l.status === 'dormant');
    return renderCmdLeadList(leads, 'Dormant Leads', 'No recent activity — need re-engagement', statusColors);
  }

  // ── Draft / email — forward to chatbot ──
  if (q.includes('draft') || q.includes('write email') || q.includes('write message') || q.includes('linkedin message')) {
    return renderCmdChatForward(originalQuery);
  }

  // ── Lead name / org search ──
  const matched = leadsData.filter(l =>
    l.name.toLowerCase().includes(q) || l.org.toLowerCase().includes(q) || l.title.toLowerCase().includes(q)
  ).slice(0, 3);
  if (matched.length) return renderCmdLeadList(matched, `Results for "${originalQuery}"`, 'Matching leads from your pipeline', statusColors);

  return renderCmdChatForward(originalQuery);
}

function renderCmdLeadList(leads, title, subtitle, statusColors) {
  return `<div class="cmd-results-panel">
    <div class="cmd-results-header">${title} <span style="font-weight:400;opacity:.7;font-size:10px">${subtitle}</span></div>
    ${leads.map(l => {
      const idx = leadsData.indexOf(l);
      const initials = l.name.split(' ').map(n=>n[0]).join('').slice(0,2);
      return `<div class="cmd-result-item cmd-result-lead" onclick="openLeadFromCmd(${idx})">
        <div class="cmd-result-avatar">${initials}</div>
        <div class="cmd-result-lead-info">
          <div class="cmd-result-lead-name">${l.name} <span style="color:var(--text-muted);font-weight:400">· ${l.org}</span></div>
          <div class="cmd-result-lead-sub">${l.title.split('·')[0].trim()} · ICP ${l.icpScore} · Close ${l.closingProb}%</div>
        </div>
        <span class="cmd-result-status" style="background:${(statusColors[l.status]||'#94A3B8')}22;color:${statusColors[l.status]||'#94A3B8'}">${l.status}</span>
      </div>`;
    }).join('')}
    <div class="cmd-results-action" onclick="switchView('leadminer');hideCmdResults();cmdInput.value='';">
      <i data-lucide="arrow-right" style="width:12px;height:12px"></i> View all in LeadMiner™
    </div>
  </div>`;
}

function renderCmdPipelineSummary() {
  const hot    = leadsData.filter(l => l.status === 'hot').length;
  const active = leadsData.filter(l => l.status === 'active').length;
  const inSeq  = leadsData.filter(l => l.status === 'in-sequence').length;
  const avgICP   = Math.round(leadsData.reduce((a,l) => a + l.icpScore, 0) / leadsData.length);
  const avgClose = Math.round(leadsData.reduce((a,l) => a + l.closingProb, 0) / leadsData.length);
  return `<div class="cmd-results-panel">
    <div class="cmd-results-header">Pipeline Summary</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px">
      <div class="cmd-stat-box" style="border-color:#EF444433;background:#EF44440A">
        <div class="cmd-stat-val" style="color:#EF4444">${hot}</div><div class="cmd-stat-lbl">Hot</div>
      </div>
      <div class="cmd-stat-box" style="border-color:#F59E0B33;background:#F59E0B0A">
        <div class="cmd-stat-val" style="color:#F59E0B">${active}</div><div class="cmd-stat-lbl">Active</div>
      </div>
      <div class="cmd-stat-box" style="border-color:#3B82F633;background:#3B82F60A">
        <div class="cmd-stat-val" style="color:#3B82F6">${inSeq}</div><div class="cmd-stat-lbl">In Sequence</div>
      </div>
    </div>
    <div style="padding:0 12px 12px;display:flex;gap:16px;flex-wrap:wrap">
      <span style="font-size:12px;color:var(--text-muted)">Avg ICP: <strong style="color:var(--text-main)">${avgICP}</strong></span>
      <span style="font-size:12px;color:var(--text-muted)">Avg Close: <strong style="color:var(--text-main)">${avgClose}%</strong></span>
      <span style="font-size:12px;color:var(--text-muted)">Total: <strong style="color:var(--text-main)">${leadsData.length} leads</strong></span>
    </div>
    <div class="cmd-results-action" onclick="switchView('dashboard');hideCmdResults();cmdInput.value='';">
      <i data-lucide="arrow-right" style="width:12px;height:12px"></i> Open Dashboard
    </div>
  </div>`;
}

function renderCmdInfo(title, subtitle) {
  return `<div class="cmd-results-panel">
    <div style="padding:16px;text-align:center">
      <div style="font-size:14px;font-weight:700;color:var(--text-main);margin-bottom:4px">${title}</div>
      <div style="font-size:12px;color:var(--text-muted)">${subtitle}</div>
    </div>
  </div>`;
}

function renderCmdChatForward(query) {
  return `<div class="cmd-results-panel">
    <div class="cmd-result-item" onclick="openChatWithQuery(${JSON.stringify(query)});hideCmdResults();cmdInput.value='';">
      <div class="cmd-result-icon" style="background:#8E54E922;color:#8E54E9"><i data-lucide="bot" style="width:13px;height:13px"></i></div>
      <div>
        <div style="font-size:13px;font-weight:600">Ask GrowthAI Assistant</div>
        <div style="font-size:11px;color:var(--text-muted)">"${query}"</div>
      </div>
    </div>
  </div>`;
}

function executeCmdQuery(query) {
  cmdInput.value = query;
  showCmdResults(query);
}

function openLeadFromCmd(idx) {
  hideCmdResults();
  cmdInput.value = '';
  if (state.currentView !== 'leadminer') {
    switchView('leadminer');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const nav = document.querySelector('[data-view="leadminer"]');
    if (nav) nav.classList.add('active');
    setTimeout(() => openLeadPanel(idx), 120);
  } else {
    openLeadPanel(idx);
  }
}

function openChatWithQuery(query) {
  if (!chatbotOpen) toggleChatbot();
  const input = document.getElementById('chatbot-input');
  if (input) {
    input.value = query;
    setTimeout(handleChatSend, 150);
  }
}


// ══════════════════════════════════════════════════════════
//  NOTIFICATION BELL
// ══════════════════════════════════════════════════════════

const notifData = [
  { icon: 'flame',       color: '#EF4444', title: 'John Mitchell is hot!',       desc: 'Requested pricing for 500-seat deployment — meeting booked Apr 22', time: '2m ago',  view: 'leadminer'    },
  { icon: 'trending-up', color: '#F59E0B', title: 'ICP Score updated',           desc: "Sarah Chen's score jumped to 92 — now your #2 ranked prospect",     time: '18m ago', view: 'icp-scorer'   },
  { icon: 'mail',        color: '#3B82F6', title: 'Sequence completed',          desc: 'Michael Rodriguez replied to your outreach sequence',                time: '1h ago',  view: 'outreach-flow' },
];

let notifPanelOpen = false;

document.getElementById('notif-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  closeAllPanels('notif');
  notifPanelOpen = !notifPanelOpen;
  if (notifPanelOpen) openNotifPanel();
});

function openNotifPanel() {
  let panel = document.getElementById('notif-panel');
  if (!panel) { panel = buildNotifPanel(); document.body.appendChild(panel); }

  const btn = document.getElementById('notif-btn');
  const rect = btn.getBoundingClientRect();
  panel.style.top   = `${rect.bottom + 8}px`;
  panel.style.right = `${window.innerWidth - rect.right}px`;
  panel.style.display = 'block';

  // Clear badge
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';

  lucide.createIcons({ nodes: [panel] });
}

function buildNotifPanel() {
  const panel = document.createElement('div');
  panel.id = 'notif-panel';
  panel.className = 'notif-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div class="notif-panel-header">
      <span>Notifications</span>
      <button class="notif-mark-read" onclick="closeAllPanels()">Mark all read</button>
    </div>
    ${notifData.map(n => `
      <div class="notif-item" onclick="handleNotifClick('${n.view}')">
        <div class="notif-icon" style="background:${n.color}22;color:${n.color}">
          <i data-lucide="${n.icon}" style="width:14px;height:14px"></i>
        </div>
        <div class="notif-content">
          <div class="notif-title">${n.title}</div>
          <div class="notif-desc">${n.desc}</div>
          <div class="notif-time">${n.time}</div>
        </div>
        <div class="notif-dot"></div>
      </div>`).join('')}
    <div class="notif-footer" onclick="closeAllPanels()">All caught up — mark as read</div>
  `;
  return panel;
}

function handleNotifClick(view) {
  closeAllPanels();
  switchView(view);
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const nav = document.querySelector(`[data-view="${view}"]`);
  if (nav) nav.classList.add('active');
}


// ══════════════════════════════════════════════════════════
//  USER PROFILE DROPDOWN
// ══════════════════════════════════════════════════════════

let userMenuOpen = false;

document.getElementById('user-profile-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  closeAllPanels('user');
  userMenuOpen = !userMenuOpen;
  if (userMenuOpen) openUserMenu();
});

function openUserMenu() {
  let panel = document.getElementById('user-menu-panel');
  if (!panel) { panel = buildUserMenu(); document.body.appendChild(panel); }

  const btn = document.getElementById('user-profile-btn');
  const rect = btn.getBoundingClientRect();
  panel.style.top   = `${rect.bottom + 8}px`;
  panel.style.right = `${window.innerWidth - rect.right}px`;
  panel.style.display = 'block';
  lucide.createIcons({ nodes: [panel] });
}

function buildUserMenu() {
  const panel = document.createElement('div');
  panel.id = 'user-menu-panel';
  panel.className = 'user-menu-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div class="user-menu-header">
      <div class="user-menu-name">Valeria Arzenton</div>
      <div class="user-menu-email">Commercial Director · SWL Consulting</div>
    </div>
    <div class="user-menu-item" onclick="switchView('analytics');closeAllPanels();">
      <i data-lucide="bar-chart-2"></i> My Analytics
    </div>
    <div class="user-menu-item" onclick="showToast('Settings panel coming soon.');closeAllPanels();">
      <i data-lucide="settings"></i> Settings
    </div>
    <div class="user-menu-item" onclick="openChatWithQuery('Show me a quick summary of my pipeline');closeAllPanels();">
      <i data-lucide="bot"></i> Ask AI Assistant
    </div>
    <div class="user-menu-item danger" onclick="showToast('Signed out (demo mode — no auth needed).');closeAllPanels();">
      <i data-lucide="log-out"></i> Sign out
    </div>
  `;
  return panel;
}


// ══════════════════════════════════════════════════════════
//  HELP BUTTON
// ══════════════════════════════════════════════════════════

let helpPanelOpen = false;

document.getElementById('help-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  closeAllPanels('help');
  helpPanelOpen = !helpPanelOpen;
  if (helpPanelOpen) openHelpPanel();
});

function openHelpPanel() {
  let panel = document.getElementById('help-panel');
  if (!panel) { panel = buildHelpPanel(); document.body.appendChild(panel); }

  const btn = document.getElementById('help-btn');
  const rect = btn.getBoundingClientRect();
  panel.style.top   = `${rect.bottom + 8}px`;
  panel.style.right = `${window.innerWidth - rect.right}px`;
  panel.style.display = 'block';
  lucide.createIcons({ nodes: [panel] });
}

function buildHelpPanel() {
  const helps = [
    { icon: 'search',         label: 'AI Command Search',    sub: 'Press ⌘K or click the top bar — ask anything in natural language' },
    { icon: 'bot',            label: 'AI Assistant',         sub: 'Click the chat bubble (bottom-right) to draft emails and messages' },
    { icon: 'user-check',     label: 'Lead Profiles',        sub: 'Click any lead row to open the full profile and outreach panel' },
    { icon: 'globe',          label: 'Company Bio Scanner',  sub: 'Enter any domain to scan company info, leads, and signals' },
    { icon: 'megaphone',      label: 'Marketing Pilot',      sub: 'Generate brand-voice content, hooks, visuals, and schedule posts' },
  ];
  const panel = document.createElement('div');
  panel.id = 'help-panel';
  panel.className = 'help-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div class="help-panel-header">Quick Help</div>
    ${helps.map(h => `
      <div class="help-item">
        <i data-lucide="${h.icon}"></i>
        <div>
          <div class="help-item-label">${h.label}</div>
          <div class="help-item-sub">${h.sub}</div>
        </div>
      </div>`).join('')}
  `;
  return panel;
}


// ── Close all dropdown panels when clicking outside ──
document.addEventListener('click', () => closeAllPanels());

function closeAllPanels(except) {
  if (except !== 'notif') {
    notifPanelOpen = false;
    const p = document.getElementById('notif-panel');
    if (p) p.style.display = 'none';
  }
  if (except !== 'user') {
    userMenuOpen = false;
    const p = document.getElementById('user-menu-panel');
    if (p) p.style.display = 'none';
  }
  if (except !== 'help') {
    helpPanelOpen = false;
    const p = document.getElementById('help-panel');
    if (p) p.style.display = 'none';
  }
}
