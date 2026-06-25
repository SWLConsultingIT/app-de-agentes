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
  brandId:    null,
  name: 'SWL Consulting',
  websiteUrl: 'https://www.swlconsulting.com',
  logoSvg:    '',
  industry: 'AI Agents · Automation Consulting · B2B Services',
  tagline: 'Boutique AI agents for revenue operations.',
  mission: 'Diseñamos y operamos agentes de IA hechos a medida para equipos de revenue, automatizando outbound, prospecting, lead intelligence y CRM hygiene con stack propio sobre n8n + Supabase + OpenAI/Claude. Resolvemos en semanas lo que las big consulting cobran en trimestres.',
  vision: 'Ser el partner de confianza en automatización de revenue para equipos LATAM que quieren escalar sin headcount.',
  language: 'es',
  palette: [
    { hex: '#20316D', name: 'Blue Lebane',        role: 'Primary' },
    { hex: '#111827', name: 'Graphite',           role: 'Text / Dark' },
    { hex: '#BFC7E1', name: 'Soft Lavender Blue', role: 'Accent' },
    { hex: '#10B981', name: 'Emerald',            role: 'Success' },
    { hex: '#F59E0B', name: 'Amber',              role: 'Warning' },
    { hex: '#FBFBFE', name: 'White Off',          role: 'Background' },
  ],
  typography: {
    heading: { name: 'Plus Jakarta Sans', size: '28px' },
    subtitle: { name: 'Plus Jakarta Sans', size: '20px' },
    body: { name: 'Inter', size: '16px' },
    mono: { name: 'JetBrains Mono', size: '14px' },
  },
  values: [
    { title: 'Experto sin ser condescendiente', desc: 'Dominamos el sector pero empoderamos al usuario. Hablamos como colega que ya resolvió el problema, no como vendedor genérico de software.', color: '#20316D' },
    { title: 'Empático con el caos',            desc: 'Validamos la frustración antes de ofrecer la solución. Sabemos que consolidar 10 obras en Excel no es falta de disciplina — es la realidad del sector.', color: '#BFC7E1' },
    { title: 'Tecnológico pero accesible',      desc: 'La IA hace el trabajo pesado. El usuario no la ve — ve sus resultados. Resultado siempre por encima de tecnología.', color: '#9499A1' },
  ],
  personas: [
    { code: 'P1', role: 'VP of Sales',           label: 'Primary economic buyer',          size: 'B2B SaaS Series B–D · 50–500 empleados · 5–30 SDRs/AEs',  pains: 'Pipeline coverage debajo del target, SDRs caros y lentos para escalar, CRM con data sucia, forecast que vibra mes a mes',                                  triggers: 'Trimestre perdido, cap de headcount sobre SDRs, mandato del CRO de escalar outbound, board pidiendo plan concreto de AI' },
    { code: 'P2', role: 'Head of RevOps',        label: 'Technical champion · power user', size: 'Dueño del stack · 2–10 personas en RevOps',                pains: 'Stack fragmentado entre Salesforce, Outreach, Apollo y mil tools, lead routing inconsistente, atribución end-to-end rota, reporting manual cada lunes',  triggers: 'Renovación de Salesforce a la vista, rollout de nuevo CRM, evaluación de AI tools, push del board por eficiencia operativa' },
    { code: 'P3', role: 'CMO / Head of Demand',  label: 'Funnel-top decision maker',       size: 'Marketing teams de 10–60 personas · presupuesto $1M–$10M', pains: 'MQLs que no convierten a SQL, atribución multi-touch que nadie cree, CAC creciendo trimestre a trimestre, contenido outbound genérico',                   triggers: 'Recorte de presupuesto, mandato del CFO de bajar CAC, demanda interna de "qué hacemos con AI", lanzamiento de producto nuevo' },
    { code: 'P4', role: 'CRO / VP Revenue',      label: 'Strategic buyer',                 size: 'Reporta a CEO · owns el número',                            pains: 'Silos entre outbound e inbound, sin vista unificada por cuenta, cycle times largos, deal slippage de cuentas estratégicas',                              triggers: 'Plan trimestral no cumplido, integración post-M&A, CEO pidiendo plan AI, churn de un cliente top' },
    { code: 'P5', role: 'Founder / CEO',         label: 'SMB · mid-market buyer',           size: 'Founder-led sales · Series Seed–A · 10–80 empleados',     pains: 'Equipo chico que no escala, agencias externas genéricas que no entregan, founder-led sales tocando techo, dependencia de 1–2 SDRs estrella',             triggers: 'Cierre de Series A, presión de inversores por GTM repetible, founder cansado de hacer outreach manual, contratación de primer Head of Sales' },
    { code: 'P6', role: 'IT / Head of Eng',      label: 'Technical gatekeeper',             size: 'Aprueba o veta vendors de software',                       pains: 'Riesgo de vendor lock-in, seguridad de datos del CRM, complejidad de integración con stack propio, mantenimiento post-implementación',                   triggers: 'Nuevo stack AI a aprobar, mandato de consolidar vendors, audit de seguridad anual, política interna de data residency' },
  ],
  competitors: [],
  // competitors: [
  //   { name: 'Globant',              url: 'https://www.globant.com',                 linkedin_url: 'https://www.linkedin.com/company/globant',         instagram_url: 'https://instagram.com/globant',         tiktok_url: 'https://tiktok.com/@globant',     youtube_url: 'https://youtube.com/@globant',                positioning: 'Tech consulting LATAM · AI + cultura interna fuerte',    tier: 'Premium', diff: 'Eventos propios (Converge) bien producidos. TikTok activo de innovación. Daily LI · 4x/sem IG.' },
  //   { name: 'BairesDev',            url: 'https://www.bairesdev.com',               linkedin_url: 'https://www.linkedin.com/company/bairesdev',       instagram_url: 'https://instagram.com/bairesdev',       tiktok_url: 'https://tiktok.com/@bairesdev',   youtube_url: 'https://youtube.com/@bairesdev',              positioning: 'Top 1% talent · outbound conversion-led',                tier: 'Premium', diff: 'Posts muy directos con CTA — "contratá developers en 48hs". Referente de outbound en LATAM.' },
  //   { name: 'Accenture',            url: 'https://www.accenture.com',               linkedin_url: 'https://www.linkedin.com/company/accenture',       instagram_url: 'https://instagram.com/accenture',       tiktok_url: 'https://tiktok.com/@accenture',   youtube_url: 'https://youtube.com/@accenture',              positioning: 'Tech consulting outcomes-driven · AI at scale',          tier: 'Premium', diff: 'Muy fuerte en TikTok con contenido educativo de AI. Referente de presencia omnicanal enterprise.' },
  //   { name: 'McKinsey & Company',   url: 'https://www.mckinsey.com',                linkedin_url: 'https://www.linkedin.com/company/mckinsey',        instagram_url: 'https://instagram.com/mckinsey',                                                       youtube_url: 'https://youtube.com/@McKinsey',                positioning: 'Strategy consulting · alto ticket · autoridad',          tier: 'Premium', diff: 'Estructura post: insight → dato → conclusión. Minimalismo visual premium. Sin TikTok.' },
  //   { name: 'Deloitte',             url: 'https://www2.deloitte.com',                linkedin_url: 'https://www.linkedin.com/company/deloitte',        instagram_url: 'https://instagram.com/deloitte',                                                       youtube_url: 'https://youtube.com/@DeloitteUS',              positioning: 'Big 4 · Advisory + Tech + Compliance enterprise',        tier: 'Premium', diff: 'Consistencia visual muy alta. Case studies con métricas. Daily LI · 3x/sem IG.' },
  //   { name: 'EPAM Systems',         url: 'https://www.epam.com',                    linkedin_url: 'https://www.linkedin.com/company/epam-systems',    instagram_url: 'https://instagram.com/epamsystems',                                                    youtube_url: 'https://youtube.com/@EPAM',                    positioning: 'Enterprise nearshore tech consulting',                    tier: 'Mid',     diff: 'Institucional, enterprise, tech-heavy. Foco en recruitment + AI capabilities.' },
  //   { name: 'Softtek',              url: 'https://www.softtek.com',                 linkedin_url: 'https://www.linkedin.com/company/softtek',         instagram_url: 'https://instagram.com/softtek',                                                        youtube_url: 'https://youtube.com/@softtek',                 positioning: 'Nearshore LATAM tech consulting',                         tier: 'Mid',     diff: 'Institucional, LATAM-oriented. Posts de cultura + casos enterprise.' },
  //   { name: 'Darwin AI',            url: 'https://www.darwin-ai.com',               linkedin_url: 'https://www.linkedin.com/company/darwin-ai',       instagram_url: 'https://instagram.com/darwin.ai.latam', tiktok_url: 'https://tiktok.com/@darwinai',                                                                positioning: 'AI Agents startup LATAM · dinámico',                     tier: 'Mid',     diff: 'Competidor directo regional. Tono startup. Foco LATAM, escalando rápido.' },
  //   { name: 'Artisan (AI)',         url: 'https://www.artisan.co',                  linkedin_url: 'https://www.linkedin.com/company/artisan-ai',                                                              tiktok_url: 'https://tiktok.com/@artisan_ai',                                                               positioning: 'AI SDR Platform · viral product-led',                     tier: 'Mid',     diff: 'Competidor directo USA en AI agents para sales. Viral en TikTok. Posts product-led benefit-focused.' },
  //   { name: 'Salesforce Agentforce',url: 'https://www.salesforce.com/agentforce',   linkedin_url: 'https://www.linkedin.com/company/salesforce',      instagram_url: 'https://instagram.com/salesforce',      tiktok_url: 'https://tiktok.com/@salesforce',  youtube_url: 'https://youtube.com/@salesforce',             positioning: 'Enterprise AI Agents Platform',                          tier: 'Premium', diff: 'Plataforma de agentes AI integrada al CRM. Tono enterprise futuro-del-trabajo. Presencia omnicanal masiva.' },
  // ],
  channels: [
    { name: 'LinkedIn',           icon: 'linkedin',       color: '#0A66C2', handle: '@arqy',           audience: 'Constructoras + inversores institucionales · canal #1 B2B (Build · Capital · PM)' },
    { name: 'Instagram',          icon: 'instagram',      color: '#E4405F', handle: '@arqy.app',       audience: 'Compradores en pozo + residentes · canal visual (State · Home)' },
    { name: 'WhatsApp Business',  icon: 'message-circle', color: '#25D366', handle: '+54 9 11 ...',     audience: 'Operativo + outbound LATAM (Build · PM · leads regionales)' },
    { name: 'Email / Newsletter', icon: 'mail',           color: '#F59E0B', handle: 'hola@arqy.app',   audience: 'Nurturing post-demo + thought leadership ecosistema' },
  ],
  toneByChannel: [
    { channel: 'LinkedIn',  tone: 'Competente · directo · thought-leadership',  formality: 'Mid-formal', formalityColor: '#FEF3C7,#B45309', pattern: 'Power phrases del ecosistema. Posts founder POV. "La infraestructura digital del real estate". Voseo siempre. Cero corporate blah.' },
    { channel: 'Instagram', tone: 'Aspiracional · visual · cálido',             formality: 'Casual',     formalityColor: '#D1FAE5,#065F46', pattern: 'Reels de obra real, no renders. Comunidad. "No renders. Obra real." Carrusel educativo de pozo. Voseo + emojis sutiles.' },
    { channel: 'WhatsApp',  tone: 'Operativo · ultra directo · empático',       formality: 'Casual',     formalityColor: '#D1FAE5,#065F46', pattern: 'Mensajes cortos. Personalización con nombre propio ("Hola Martín"). 1 dolor + 1 resultado + 1 pregunta. Sin corporate blah.' },
    { channel: 'Email',     tone: 'Newsletter-style · crisp · personal',        formality: 'Mid-formal', formalityColor: '#FEF3C7,#B45309', pattern: 'Asuntos en pregunta ("¿Cuánto tiempo tardás en…?"). Cold email ≤ 150 palabras. Voseo. 3 secciones max en newsletter.' },
  ],
  samples: [
    { title: '"Del caos al control profesional." — Hero ecosistema',                channel: 'LinkedIn',  channelColor: '#EFF6FF,#1D4ED8', perf: 'Power phrase #1',     voiceFit: 98 },
    { title: '"No renders. Obra real." — Arqy State',                              channel: 'Instagram', channelColor: '#FCE7F3,#9D174D', perf: 'Power phrase',        voiceFit: 96 },
    { title: '"Tu rentabilidad no puede esperar al cierre del mes." — Arqy Build', channel: 'Email',     channelColor: '#FEF3C7,#B45309', perf: 'Cold outbound',       voiceFit: 95 },
    { title: '"Por primera vez, el pozo no es un acto de fe." — Capital · State',   channel: 'LinkedIn',  channelColor: '#EFF6FF,#1D4ED8', perf: 'Thought leadership',  voiceFit: 94 },
    { title: '"Menos llamadas, menos papel. Todo en un lugar." — Arqy PM',         channel: 'LinkedIn',  channelColor: '#EFF6FF,#1D4ED8', perf: 'Cold outreach Carlos',voiceFit: 92 },
    { title: '"Optimizá tus flujos operativos con IA predictiva" (anti-ejemplo)',   channel: 'Blog',      channelColor: '#F3F4F6,#374151', perf: 'Corporate blah · prohibido', voiceFit: 12 },
  ],
  marketingPrompt: '',
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

// Remove one color from the brand palette and re-render. The change is held
// in memory only — the user must hit "Save Brand Profile" to persist.
function removePaletteColor(idx) {
  if (!brandKitData.palette[idx]) return;
  if (brandKitData.palette.length <= 1) {
    showToast('La paleta no puede quedar vacía. Agregá un color nuevo antes de borrar el último.', 'error');
    return;
  }
  brandKitData.palette.splice(idx, 1);
  switchView(state.currentView);
}

// Append a new color to the brand palette. Uses the next role label from
// `paletteRoles` when available, falls back to 'Custom'.
function addPaletteColor() {
  const hex = '#6366F1';
  const role = paletteRoles[brandKitData.palette.length] || 'Custom';
  brandKitData.palette.push({ hex, name: hex.toUpperCase(), role });
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


function toggleBkColor() {
  state.bkColorExpanded = !state.bkColorExpanded;
  switchView(state.currentView);
}

function detectSocialIcon(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('tiktok'))                                              return { icon: 'music',          color: '#010101' };
  if (n.includes('youtube'))                                             return { icon: 'youtube',         color: '#FF0000' };
  if (n.includes('instagram'))                                           return { icon: 'instagram',       color: '#E4405F' };
  if (n.includes('linkedin'))                                            return { icon: 'linkedin',        color: '#0A66C2' };
  if (n.includes('twitter') || n === 'x' || n.endsWith(' x') || n.startsWith('x/') || n.includes('x.com')) return { icon: 'twitter', color: '#1DA1F2' };
  if (n.includes('facebook'))                                            return { icon: 'facebook',        color: '#1877F2' };
  if (n.includes('whatsapp'))                                            return { icon: 'message-circle',  color: '#25D366' };
  if (n.includes('email') || n.includes('newsletter') || n.includes('mail')) return { icon: 'mail',      color: '#F59E0B' };
  return null;
}

function getSocialLogo(iconName, color, size) {
  const c = color || '#374151';
  const logos = {
    instagram:        `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    linkedin:         `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    facebook:         `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    youtube:          `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48 9.75,15.02" fill="${c}" stroke="none"/></svg>`,
    twitter:          `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    music:            `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.26 8.26 0 0 0 4.83 1.54V7.05a4.85 4.85 0 0 1-1.07-.36z"/></svg>`,
    'message-circle': `<svg width="18" height="18" viewBox="0 0 24 24" fill="${c}"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    mail:             `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    globe:            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  };
  const svg = logos[iconName] || logos['globe'];
  if (!size || size === 18) return svg;
  return svg.replace('width="18" height="18"', `width="${size}" height="${size}"`);
}

// ── DEV TOGGLE — route ContentBuilder workflows to [DEV-fran] copies ──
// In browser console:  localStorage.setItem('cb_dev','1'); location.reload();
// Affects WF04, WF05, WF06, WF07 only. WF00/WF01/WF08/WF09 untouched.
const CB_DEV = (typeof localStorage !== 'undefined' && localStorage.getItem('cb_dev') === '1');
const _CB_SFX = CB_DEV ? '-dev' : '';
if (CB_DEV) console.log('[ContentBuilder] DEV MODE — routing to [DEV-fran] workflow copies');

// WF11 dev/prod were unified on 2026-05-26 — the dev variant became prod (it has
// the activePlatforms / Normalize TikTok / Build Record fixes), and the previous
// prod was archived as `[ARCHIVED 2026-05-26]`. There is no longer a dev webhook.
// If anyone still has `hm_dev=1` in localStorage from the toggle's lifetime, clear
// it on load so we don't post to the now-404 /webhook/sm-pipeline-dev.
try {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('hm_dev') === '1') {
    localStorage.removeItem('hm_dev');
    console.log('[HookMiner] cleared stale hm_dev flag — WF11 dev was promoted to prod');
  }
} catch (_) { /* localStorage unavailable */ }

// ── SAVE BRAND PROFILE → WF01 ──────────────────────────
const WF00_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/website-scrapper';
const WF01_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/brand-profile-updated';

function buildBrandProfilePayloadFromKit() {
  // Strip UI-only flags (_socialsOpen) before sending to Supabase so we don't pollute the persisted shape.
  const competitors = (brandKitData.competitors || []).map(c => {
    const { _socialsOpen, ...rest } = c;
    return rest;
  });
  return {
    identity: {
      company_name: brandKitData.name,
      website_url:  brandKitData.websiteUrl,
      industry:     brandKitData.industry,
      tagline:      brandKitData.tagline,
      mission:      brandKitData.mission,
      language:     brandKitData.language || 'es',
    },
    palette:          brandKitData.palette.map(c => ({ role: c.role, hex: c.hex })),
    typography:       brandKitData.typography,
    values:           brandKitData.values,
    personas:         brandKitData.personas,
    verticals:        brandKitData.verticals || [],
    competitors,
    channels:         brandKitData.channels,
    tone_by_channel:  brandKitData.toneByChannel,
    content_samples:  brandKitData.samples,
    marketing_prompt: brandKitData.marketingPrompt,
  };
}

async function saveBrandProfile() {
  const btn = document.getElementById('bk-sync-btn');
  if (btn) { btn.textContent = 'Saving…'; btn.disabled = true; }

  if (!brandKitData.brandId) brandKitData.brandId = crypto.randomUUID();

  const profile_payload = buildBrandProfilePayloadFromKit();

  try {
    // 1. Upsert brand row
    await supabaseUpsert('brands', {
      id:         brandKitData.brandId,
      account_id: '11111111-1111-4111-8111-111111111111',
      name:       brandKitData.name,
      industry:   brandKitData.industry,
      updated_at: new Date().toISOString(),
    });

    // 2. Upsert brand profile (data_json holds everything).
    await supabaseUpsert('brand_profiles', {
      brand_id:   brandKitData.brandId,
      data_json:  profile_payload,
      updated_at: new Date().toISOString(),
    }, 'brand_id');

    if (btn) { btn.textContent = 'WF01: Scoring…'; }
    // 3. Fire WF01 for completion scoring
    fetch(WF01_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_id:       brandKitData.brandId,
        profile_payload,
        changed_fields: ['profile_update'],
      }),
    }).catch(e => console.warn('[WF01] pipeline call failed:', e));

    // 4. Sync SocialMediaBios inputs to match the saved brand's channels (same logic as autofillHandlesFromBrandKit)
    socialBiosData.inputs.Instagram = { handle: '', profileUrl: '' };
    socialBiosData.inputs.TikTok    = { handle: '', profileUrl: '' };
    socialBiosData.inputs.LinkedIn  = { handle: '', profileUrl: '' };
    socialBiosData.inputs.Facebook  = { handle: '', profileUrl: '' };
    socialBiosData.inputs.YouTube   = { handle: '', profileUrl: '' };
    for (const c of (brandKitData.channels || [])) {
      if (!c.handle) continue;
      const _clean = c.handle.replace(/^@/, '').trim();
      const _n = (c.name || '').toLowerCase();
      if (/instagram/i.test(_n)) socialBiosData.inputs.Instagram = { handle: _clean, profileUrl: `https://www.instagram.com/${_clean}/` };
      else if (/tiktok/i.test(_n)) socialBiosData.inputs.TikTok = { handle: _clean, profileUrl: `https://www.tiktok.com/@${_clean}` };
      else if (/linkedin/i.test(_n)) socialBiosData.inputs.LinkedIn = { handle: _clean, profileUrl: `https://www.linkedin.com/company/${_clean}/` };
      else if (/facebook/i.test(_n)) socialBiosData.inputs.Facebook = { handle: _clean, profileUrl: `https://www.facebook.com/${_clean}` };
      else if (/youtube/i.test(_n)) socialBiosData.inputs.YouTube = { handle: _clean, profileUrl: `https://www.youtube.com/@${_clean}` };
    }
    // Update DOM inputs to reflect synced channels
    ['LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'YouTube'].forEach(ch => {
      const inp = document.querySelector(`input[oninput*="'${ch}'"]`);
      if (inp) inp.value = socialBiosData.inputs[ch].handle;
    });
    // Refresh the Social Media Bios view to show updated inputs
    if (typeof hydrateSocialBiosView === 'function') {
      hydrateSocialBiosView();
    }

    // 5. Fire WF02 (Social Media Bios scan) — WAIT for completion
    if (btn) { btn.textContent = 'WF02: Scanning channels…'; }
    const channels = Object.entries(socialBiosData.inputs)
      .filter(([_, v]) => v.handle && v.handle.trim())
      .map(([name, v]) => ({ name, handle: v.handle.trim(), profileUrl: v.profileUrl.trim() }));

    if (channels.length > 0) {
      try {
        const res = await fetch(WF_SOCIAL_BIOS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brand_id: brandKitData.brandId,
            channels,
            maxPosts: 10,
            scoringWeights: socialBiosData.scoringWeights,
          }),
        });
        if (res.ok) {
          const text = await res.text();
          if (text && text.length > 5) {
            const data = JSON.parse(text);
            applySocialBiosData(data);
            console.log('[WF02] scan complete');
          }
        }
      } catch (e) {
        console.warn('[WF02] scan failed (non-blocking):', e);
      }
    }

    // 6. Fire WF03 (Research Sync - Competitors) — WAIT for completion with force_refresh
    if (btn) { btn.textContent = 'WF03: Analyzing competitors…'; }

    const channelKeyMap = [
      { channel: 'LinkedIn',  field: 'linkedin_url'  },
      { channel: 'Instagram', field: 'instagram_url' },
      { channel: 'TikTok',    field: 'tiktok_url'    },
      { channel: 'YouTube',   field: 'youtube_url'   },
      { channel: 'X/Twitter', field: 'x_url'         },
      { channel: 'Facebook',  field: 'facebook_url'  },
    ];

    const sources = [];
    for (const c of (brandKitData.competitors || [])) {
      if (!c?.name || /^new competitor$/i.test(c.name)) continue;
      const baseConfig = {
        competitor_tier: c.tier || 'Mid',
        positioning:     c.positioning || '',
        diff:            c.diff || '',
        derived_from:    'branding_bio',
      };
      if (c.url) {
        sources.push({
          brand_id:        brandKitData.brandId,
          source_type:     'website',
          source_url:      c.url,
          source_handle:   c.name,
          competitor_name: c.name,
          channel:         'Website',
          active:          true,
          config_json:     baseConfig,
        });
      }
      for (const { channel, field } of channelKeyMap) {
        if (!c[field]) continue;
        sources.push({
          brand_id:        brandKitData.brandId,
          source_type:     'social',
          source_url:      c[field],
          source_handle:   c.name,
          competitor_name: c.name,
          channel,
          active:          true,
          config_json:     baseConfig,
        });
      }
    }

    if (sources.length > 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/research_sources?brand_id=eq.${brandKitData.brandId}`, {
        method: 'DELETE',
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
      });
      await supabaseUpsert('research_sources', sources);

      fetch(WF03_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: brandKitData.brandId, trigger: 'manual', force_refresh: true }),
      }).catch(e => console.error('[WF03] webhook error:', e));
    }

    if (btn) { btn.innerHTML = '<i data-lucide="check" style="width:14px; vertical-align:middle; margin-right:4px;"></i>Pipeline Complete'; }

    const competitorCount = (brandKitData.competitors || []).filter(c => c?.name && !/^new competitor$/i.test(c.name)).length;
    showToast(`✅ Full pipeline executed: WF01 (scoring) → WF02 (channels) → WF03 (competitors). ${competitorCount} competitor${competitorCount===1?'':'s'} analyzed.`);
    setTimeout(() => { if (btn) { btn.innerHTML = '🚀 Sync to Pipeline'; btn.disabled = false; lucide.createIcons({nodes:[btn]}); } }, 3000);
  } catch (e) {
    if (btn) { btn.innerHTML = '❌ Error — retry'; btn.disabled = false; }
    showToast('Sync failed: ' + e.message);
    console.error('saveBrandProfile error:', e);
  }
}

// ── WF00 Website Scrapper ──────────────────────────────
async function scanCompleteProfile() {
  const urlInput = document.getElementById('bk-scrape-url');
  const btn = document.getElementById('bk-scan-complete-btn');
  const statusEl = document.getElementById('bk-scan-status');

  const url = urlInput?.value?.trim();
  if (!url) { showToast('Enter a website URL.'); return; }

  if (btn) { btn.textContent = '⟳ Scanning…'; btn.disabled = true; }
  if (statusEl) { statusEl.innerHTML = '<span style="color:#6366F1">⟳ Scanning website…</span>'; }

  try {
    // Scan website (WF00)
    const websiteRes = await fetch(WF00_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!websiteRes.ok) throw new Error(`Website scan failed`);

    const websiteText = await websiteRes.text();
    if (!websiteText?.trim()) throw new Error('Empty response');

    let websiteData = JSON.parse(websiteText);
    applyScrapedBrandData(websiteData);

    // If PDF exists, process it too
    if (uploadedPdfFile) {
      if (statusEl) statusEl.innerHTML = '<span style="color:#10B981">✅ Website scanned<br/><span style="color:#6366F1">⟳ Analyzing PDF…</span>';

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const pdfBase64 = btoa(e.target.result);
          const pdfData = await analyzePdfWithGemini(pdfBase64, uploadedPdfFile.name);

          // Merge PDF data
          if (pdfData.values?.length) {
            brandKitData.values = pdfData.values.map((v, i) => ({
              title: v.title || 'Value',
              desc: v.desc || '',
              color: v.color || ['#6366F1','#10B981','#F59E0B','#EC4899','#14B8A6'][i % 5],
            }));
          }
          if (pdfData.vision) brandKitData.vision = pdfData.vision;
          if (pdfData.mission) brandKitData.mission = pdfData.mission;
          if (pdfData.personas?.length) {
            brandKitData.personas = pdfData.personas.map((p, i) => ({
              code: p.code || `P${i + 1}`,
              role: p.role || 'Audience',
              label: p.label || '',
              size: p.size || '',
              pains: p.pains || '',
              triggers: p.triggers || '',
            }));
          }
          if (pdfData.competitors?.length) {
            const incomingComps = pdfData.competitors
              .filter(c => c?.name && !/^new competitor$/i.test(c.name))
              .map(c => ({ name: c.name, url: c.url || '', positioning: c.positioning || '', tier: c.tier || 'Mid', source: 'pdf' }));
            const manual = brandKitData.competitors.filter(c => c.source === 'manual');
            brandKitData.competitors = [...manual, ...incomingComps];
          }

          switchView(state.currentView);
          if (statusEl) statusEl.innerHTML = '<span style="color:#10B981">✅ Website scanned + PDF analyzed. Ready to save!</span>';
          showToast('Scan complete! Website + PDF analyzed.');
        } catch (e) {
          console.error('[PDF error]:', e);
          if (statusEl) statusEl.innerHTML += `<br/><span style="color:#EF4444">PDF: ${e.message}</span>`;
        } finally {
          if (btn) { btn.textContent = 'Scan Complete Profile'; btn.disabled = false; }
        }
      };
      reader.readAsBinaryString(uploadedPdfFile);
    } else {
      // No PDF, just website
      switchView(state.currentView);
      if (statusEl) statusEl.innerHTML = '<span style="color:#10B981">✅ Website scanned. Ready to save!</span>';
      showToast('Website scanned!');
      if (btn) { btn.textContent = 'Scan Complete Profile'; btn.disabled = false; }
    }
  } catch (e) {
    if (statusEl) statusEl.innerHTML = `<span style="color:#EF4444">❌ ${e.message}</span>`;
    console.error('[Scan error]:', e);
    if (btn) { btn.textContent = 'Scan Complete Profile'; btn.disabled = false; }
  }
}

async function scanBrandingBio() {
  // Backward compatibility
  await scanCompleteProfile();
}

async function fetchLogoForUrl(url) {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    // Try Clearbit logo API
    const cbRes = await fetch(`https://logo.clearbit.com/${domain}?size=256`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (cbRes.ok) {
      const blob = await cbRes.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 256; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><image href="${canvas.toDataURL()}" width="256" height="256"/></svg>`;
            resolve(svg);
          };
          img.onerror = () => resolve(null);
          img.src = reader.result;
        };
        reader.readAsDataURL(blob);
      });
    }
    // Fallback: use DuckDuckGo API
    const ddRes = await fetch(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    if (ddRes.ok) {
      const blob = await ddRes.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 256; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFF';
            ctx.fillRect(0, 0, 256, 256);
            ctx.drawImage(img, (256 - img.width) / 2, (256 - img.height) / 2);
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><image href="${canvas.toDataURL()}" width="256" height="256"/></svg>`;
            resolve(svg);
          };
          img.onerror = () => resolve(null);
          img.src = reader.result;
        };
        reader.readAsDataURL(blob);
      });
    }
    return null;
  } catch (e) {
    console.log('[fetchLogoForUrl] error:', e);
    return null;
  }
}

function applyScrapedBrandData(data) {
  // Debug: surface what WF00 actually returned so we can tell whether the new
  // verticals prompt is live on the n8n side.
  console.log('[WF00] response received. verticals field:', data?.verticals, '· keys:', data ? Object.keys(data) : '(null)');
  // Snapshot the previous identity BEFORE we mutate it, so we can decide
  // whether to keep the existing brandId or roll a new one for a new client.
  const _prevBrandId = brandKitData.brandId;
  const _prevWebsite = brandKitData.websiteUrl;
  if (data.name)            brandKitData.name = data.name;
  if (data.websiteUrl)      brandKitData.websiteUrl = data.websiteUrl;
  if (data.industry)        brandKitData.industry = data.industry;
  if (data.tagline)         brandKitData.tagline = data.tagline;
  if (data.mission)         brandKitData.mission = data.mission;
  if (data.language)        brandKitData.language = data.language;
  if (data.values?.length)  brandKitData.values = data.values.map((v, i) => ({
    title: v.title || v.name || 'Value',
    desc:  v.desc || v.description || '',
    color: v.color || ['#6366F1','#10B981','#F59E0B','#EC4899','#14B8A6'][i % 5],
  }));
  if (data.personas?.length) brandKitData.personas = data.personas.map((p, i) => ({
    code:     p.code || `P${i + 1}`,
    role:     p.role || 'Audience',
    label:    p.label || '',
    size:     p.size || '',
    pains:    p.pains || '',
    triggers: p.triggers || '',
  }));
  if (data.palette?.length) brandKitData.palette = data.palette.slice(0, 6).map((c, i) => ({
    hex:  c.hex || brandKitData.palette[i]?.hex || '#6366F1',
    name: c.name || (c.hex || '').toUpperCase(),
    role: paletteRoles[i] || 'Custom',
  }));
  if (data.typography) {
    ['heading', 'subtitle', 'body', 'mono'].forEach(key => {
      if (data.typography[key]) {
        if (typeof data.typography[key] === 'object' && data.typography[key].name) {
          brandKitData.typography[key] = { name: data.typography[key].name, size: data.typography[key].size || '16px' };
        } else if (typeof data.typography[key] === 'string') {
          brandKitData.typography[key] = data.typography[key];
        }
      }
    });
  }
  if (data.channels?.length)  brandKitData.channels = data.channels;
  if (data.logoUrl)           brandKitData.logoUrl  = data.logoUrl;
  if (data.logoSvg)           brandKitData.logoSvg  = data.logoSvg;
  // Auto-fetch logo from URL if not provided by WF00
  if (!data.logoUrl && !data.logoSvg && brandKitData.websiteUrl) {
    fetchLogoForUrl(brandKitData.websiteUrl).then(logo => {
      if (logo) {
        brandKitData.logoSvg = logo;
        hydrateBrandingBioView();
        showToast('Logo auto-detected and loaded.');
      }
    });
  }
  if (data.verticals?.length) brandKitData.verticals = data.verticals.map(v => ({
    name:   v.name || v.title || 'Vertical',
    desc:   v.desc || v.description || '',
    source: 'scraper',
    channels: defaultVerticalChannels(),
  }));
  if (data.competitors?.length) {
    const incoming = data.competitors
      .filter(c => c?.name && !/^new competitor$/i.test(c.name))
      .map(c => ({
        name:          c.name,
        url:           c.url || c.websiteUrl || '',
        positioning:   c.positioning || '',
        tier:          c.tier || 'Mid',
        diff:          c.diff || '',
        linkedin_url:  c.linkedin_url || c.linkedin || '',
        instagram_url: c.instagram_url || c.instagram || '',
        tiktok_url:    c.tiktok_url || c.tiktok || '',
        youtube_url:   c.youtube_url || c.youtube || '',
        x_url:         c.x_url || c.x || '',
        facebook_url:  c.facebook_url || c.facebook || '',
        source:        'ai',
      }));
    // Keep only explicitly manual entries (source:'manual'); discard defaults + previous AI results
    const manual = brandKitData.competitors.filter(c => c.source === 'manual');
    brandKitData.competitors = [...manual, ...incoming];
  }
  // Only roll a fresh brandId if there wasn't one OR the website actually changed
  // (i.e. we're scanning a different client). Re-scanning the same site must
  // keep the existing brand_id, otherwise every Scan/Save creates a duplicate.
  const _websiteChanged = data.websiteUrl && _prevWebsite && data.websiteUrl !== _prevWebsite;
  if (!_prevBrandId || _websiteChanged) {
    brandKitData.brandId = crypto.randomUUID();
    // Persist immediately so reloads and downstream fetches use this brand, not the previous one.
    try { localStorage.setItem(BRAND_ID_STORAGE_KEY, brandKitData.brandId); } catch (_) {}
    console.log('[brand_id] rolled new UUID:', brandKitData.brandId, '(prev=', _prevBrandId, ', websiteChanged=', _websiteChanged, ')');
  } else {
    console.log('[brand_id] keeping existing:', _prevBrandId);
  }
  switchView(state.currentView);
}

// ── PDF Brand Document Upload ──────────────────────────
let uploadedPdfFile = null;

function handleBrandPdfUpload(input) {
  const file = input.files?.[0];
  const statusEl = document.getElementById('bk-pdf-status');
  const processBtn = document.getElementById('bk-pdf-process-btn');

  if (!file) {
    uploadedPdfFile = null;
    if (processBtn) processBtn.disabled = true;
    if (statusEl) statusEl.textContent = '';
    return;
  }

  if (!file.type.includes('pdf')) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#EF4444">❌ Only PDF files are supported</span>';
    if (processBtn) processBtn.disabled = true;
    uploadedPdfFile = null;
    return;
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    if (statusEl) statusEl.innerHTML = '<span style="color:#EF4444">❌ File too large (max 10MB)</span>';
    if (processBtn) processBtn.disabled = true;
    uploadedPdfFile = null;
    return;
  }

  uploadedPdfFile = file;
  if (statusEl) statusEl.innerHTML = `<span style="color:#6366F1">📄 ${escapeHtml(file.name)} ready (${(file.size / 1024).toFixed(1)}KB)</span>`;
  if (processBtn) processBtn.disabled = false;
}

async function processBrandPdf() {
  if (!uploadedPdfFile) return;

  const statusEl = document.getElementById('bk-pdf-status');
  const processBtn = document.getElementById('bk-pdf-process-btn');

  if (processBtn) { processBtn.disabled = true; processBtn.textContent = 'Processing…'; }
  if (statusEl) { statusEl.innerHTML = '<span style="color:#6366F1">⟳ Analyzing PDF with Claude…</span>'; }

  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const pdfBase64 = btoa(e.target.result);

        // Analyze PDF with Gemini directly
        const data = await analyzePdfWithGemini(pdfBase64, uploadedPdfFile.name);

        // Apply extracted values
        if (data.values?.length) {
          brandKitData.values = data.values.map((v, i) => ({
            title: v.title || 'Value',
            desc: v.desc || '',
            color: v.color || ['#6366F1','#10B981','#F59E0B','#EC4899','#14B8A6'][i % 5],
          }));
        }

        if (data.vision) brandKitData.vision = data.vision;
        if (data.mission) brandKitData.mission = data.mission;

        // Apply personas
        if (data.personas?.length) {
          brandKitData.personas = data.personas.map((p, i) => ({
            code: p.code || `P${i + 1}`,
            role: p.role || 'Audience',
            label: p.label || '',
            size: p.size || '',
            pains: p.pains || '',
            triggers: p.triggers || '',
          }));
        }

        // Apply competitors (from PDF, mark as source='pdf' to distinguish from manual)
        if (data.competitors?.length) {
          const incomingComps = data.competitors
            .filter(c => c?.name && !/^new competitor$/i.test(c.name))
            .map(c => ({
              name: c.name,
              url: c.url || '',
              positioning: c.positioning || '',
              tier: c.tier || 'Mid',
              diff: c.diff || '',
              source: 'pdf',
            }));
          // Keep manual entries, add PDF competitors
          const manual = brandKitData.competitors.filter(c => c.source === 'manual');
          brandKitData.competitors = [...manual, ...incomingComps];
        }

        // Refresh view
        switchView(state.currentView);
        if (statusEl) { statusEl.innerHTML = '<span style="color:#10B981">✅ PDF processed — values, vision, personas, competitors extracted.</span>'; }
        showToast('Brand document analyzed. Fields updated below — review and save when ready.');
      } catch (e) {
        console.error('[PDF processing] error:', e);
        if (statusEl) { statusEl.innerHTML = `<span style="color:#EF4444">❌ Failed — ${escapeHtml(e.message)}</span>`; }
      } finally {
        if (processBtn) { processBtn.disabled = false; processBtn.textContent = 'Process'; }
      }
    };
    reader.readAsBinaryString(uploadedPdfFile);
  } catch (e) {
    console.error('[PDF upload] error:', e);
    if (statusEl) { statusEl.innerHTML = `<span style="color:#EF4444">❌ Upload failed</span>`; }
    if (processBtn) { processBtn.disabled = false; processBtn.textContent = 'Process'; }
  }
}

// ══════════════════════════════════════════════════
// WF00.5 — PDF Scrapper
// ══════════════════════════════════════════════════
const WF005_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/pdf-scrapper';

// ══════════════════════════════════════════════════
// WF_SOCIAL_BIOS — SocialMediaBios (owned channels)
// ══════════════════════════════════════════════════
const WF_SOCIAL_BIOS_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/socialmedia-bios';

const socialBiosData = {
  lastScannedAt: null,
  isMock: true, // flipped to false once a real scan from WF02 lands
  selectedChannel: 'all',
  scoringWeights: { engagement: 0.5, reach: 0.3, saves: 0.2 },
  inputs: {
    Instagram: { handle: 'swl.consulting', profileUrl: 'https://www.instagram.com/swl.consulting/' },
    TikTok:    { handle: 'swl.consulting', profileUrl: 'https://www.tiktok.com/@swl.consulting' },
    LinkedIn:  { handle: 'swl-consulting-group', profileUrl: 'https://www.linkedin.com/company/swl-consulting-group/' },
    Facebook:  { handle: '', profileUrl: '' },
  },
  channels: [], // populated by mock or by WF02 scan
};

function loadMockSocialBios() {
  // Demo fallback so the view is never empty when n8n is down.
  // Mirrors the response shape produced by WF02 / Combine Results.
  return {
    brand_id: brandKitData.brandId,
    scanned_at: new Date().toISOString(),
    scoringWeights: socialBiosData.scoringWeights,
    channels: [
      {
        name: 'Instagram', icon: 'instagram', color: '#E4405F',
        handle: '@swl.consulting',
        profileUrl: 'https://www.instagram.com/swl.consulting/',
        enabled: true,
        followers: 880, following: 246, totalPosts: 124, totalViews: 245800, reach: 198400, totalInteractions: 12842, postingCadence: 1.6, avgEngagementRate: 5.1, primaryFormat: 'reel',
        tone: { formal_vs_casual: 75, technical_vs_accessible: 80, serious_vs_playful: 65, humble_vs_bold: 60, short_vs_expansive: 30 },
        toneSummary: 'Conversational and visual — accessible AI explainers, behind-the-scenes of agent builds.',
        voiceRules: {
          always: ['Hook in first 1.5s', 'Show the tool screen, not stock', 'End with a one-line takeaway', 'Caption in Spanish for LATAM reach'],
          never:  ['Talking head with no visuals', 'Jargon-only captions', 'Posts longer than 90s'],
        },
        topPosts: [
          { id: 'ig-1', channel: 'Instagram', snippet: '¿Cómo construir tu primer agente IA en 5 minutos? 🤖 Reel completo.', text: '', format: 'reel', publishedAt: '2026-04-26T19:00:00Z', url: '', metrics: { likes: 412, comments: 38, shares: 22, impressions: 14200, views: 14200 }, engagementRate: 3.3, score: 0.94, whyItWorked: 'Question hook + emoji + practical promise in 6 seconds' },
          { id: 'ig-2', channel: 'Instagram', snippet: 'POV: estás escalando un equipo de ventas pero el CRM te frena. Mirá lo que armamos con n8n.', text: '', format: 'reel', publishedAt: '2026-04-19T20:30:00Z', url: '', metrics: { likes: 318, comments: 26, shares: 18, impressions: 9800, views: 9800 }, engagementRate: 3.7, score: 0.86, whyItWorked: 'POV format + relatable pain + tool reveal' },
        ],
        bottomPosts: [
          { id: 'ig-9', channel: 'Instagram', snippet: 'Foto del equipo en evento corporativo.', text: '', format: 'image', publishedAt: '2026-03-11T15:00:00Z', url: '', metrics: { likes: 24, comments: 1, shares: 0, impressions: 1100, views: 1100 }, engagementRate: 2.3, score: 0.18 },
        ],
        cadenceHeatmap: buildMockHeatmap('Instagram'),
      },
      {
        name: 'TikTok', icon: 'music', color: '#010101',
        handle: '@swl.consulting',
        profileUrl: 'https://www.tiktok.com/@swl.consulting',
        enabled: true,
        followers: 540, following: 185, totalPosts: 89, totalViews: 425600, reach: 378400, totalInteractions: 28947, postingCadence: 3.2, avgEngagementRate: 7.4, primaryFormat: 'video',
        tone: { formal_vs_casual: 90, technical_vs_accessible: 85, serious_vs_playful: 80, humble_vs_bold: 75, short_vs_expansive: 20 },
        toneSummary: 'Casual, fast-paced, native to TikTok — pattern interrupts, screen recordings, plain Spanish.',
        voiceRules: {
          always: ['Pattern interrupt in first 0.8s', 'Screen recording over voice', 'Trend-based audio when relevant', 'On-screen captions baked in'],
          never:  ['Corporate intro screens', 'Voice-only', 'Posts over 60s for educational content'],
        },
        topPosts: [
          { id: 'tt-1', channel: 'TikTok', snippet: '3 herramientas que reemplazan a 5 SDRs (probadas con clientes reales)', text: '', format: 'video', publishedAt: '2026-04-29T22:00:00Z', url: '', metrics: { likes: 1820, comments: 142, shares: 312, impressions: 38400, views: 38400 }, engagementRate: 5.9, score: 0.96, whyItWorked: 'Specific number + bold claim + receipts in description' },
          { id: 'tt-2', channel: 'TikTok', snippet: 'Probé Make vs n8n para un caso real. Acá los resultados 👇', text: '', format: 'video', publishedAt: '2026-04-22T21:30:00Z', url: '', metrics: { likes: 1240, comments: 88, shares: 145, impressions: 24800, views: 24800 }, engagementRate: 5.9, score: 0.89, whyItWorked: 'Comparison hook + tool name recognition + receipts framing' },
        ],
        bottomPosts: [
          { id: 'tt-9', channel: 'TikTok', snippet: 'Felicitaciones a todo el equipo por el cierre de año.', text: '', format: 'video', publishedAt: '2026-03-02T18:00:00Z', url: '', metrics: { likes: 38, comments: 2, shares: 0, impressions: 1400, views: 1400 }, engagementRate: 2.9, score: 0.11 },
        ],
        cadenceHeatmap: buildMockHeatmap('TikTok'),
      },
      {
        name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2',
        handle: 'swl-consulting',
        profileUrl: 'https://www.linkedin.com/company/swl-consulting/',
        enabled: true,
        followers: 1240, following: 312, totalPosts: 98, totalViews: 156200, reach: 868000, totalInteractions: 5936, postingCadence: 2.4, avgEngagementRate: 3.8, primaryFormat: 'carousel',
        tone: { formal_vs_casual: 35, technical_vs_accessible: 60, serious_vs_playful: 40, humble_vs_bold: 70, short_vs_expansive: 70 },
        toneSummary: 'Professional B2B — contrarian hooks, real metrics, founder-led storytelling with numbered insights.',
        voiceRules: {
          always: ['Hook contrarian en línea 1', 'Una métrica concreta por post', 'Numerar lecciones (1/, 2/, 3/)', 'CTA hacia DM o comentario'],
          never:  ['Hype words ("game-changing", "revolutionary")', 'Posts sin métricas', 'Emojis al inicio del título'],
        },
        topPosts: [
          { id: 'li-1', channel: 'LinkedIn', snippet: 'Matamos 40% de nuestros dashboards. Nadie se quejó. Acá las 3 cosas que aprendimos →', text: '', format: 'carousel', publishedAt: '2026-05-02T13:00:00Z', url: '', metrics: { likes: 312, comments: 48, shares: 27, impressions: 12400, views: 12400 }, engagementRate: 3.1, score: 0.93, whyItWorked: 'Contrarian hook + carousel 10-slide breakdown + ending CTA' },
          { id: 'li-2', channel: 'LinkedIn', snippet: 'Caso real: bajamos el ciclo de ventas de 47 a 19 días con 2 agentes IA. Te muestro el stack.', text: '', format: 'carousel', publishedAt: '2026-04-25T14:30:00Z', url: '', metrics: { likes: 246, comments: 33, shares: 19, impressions: 9800, views: 9800 }, engagementRate: 3.0, score: 0.88, whyItWorked: 'Specific metric in hook + carousel architecture diagram' },
        ],
        bottomPosts: [
          { id: 'li-9', channel: 'LinkedIn', snippet: 'Excited to share our new milestone! 🚀', text: '', format: 'image', publishedAt: '2026-03-15T16:00:00Z', url: '', metrics: { likes: 18, comments: 0, shares: 0, impressions: 980, views: 980 }, engagementRate: 1.8, score: 0.12 },
        ],
        cadenceHeatmap: buildMockHeatmap('LinkedIn'),
      },
    ],
  };
}

function buildMockHeatmap(channel) {
  // Creates a plausible 7×24 cadence heatmap so the UI cell colors are not all empty.
  const hotHours = channel === 'TikTok' ? [19, 20, 21, 22] : channel === 'Instagram' ? [12, 13, 19, 20] : [9, 10, 14, 15];
  const matrix = [];
  for (let d = 0; d < 7; d++) {
    const row = [];
    for (let h = 0; h < 24; h++) {
      const weekday = d >= 1 && d <= 5;
      const hot = hotHours.includes(h);
      const count = (hot && weekday) ? 1 + Math.floor(Math.random() * 2) : (Math.random() < 0.06 ? 1 : 0);
      const avgEr = count ? +(2 + Math.random() * 4).toFixed(2) : 0;
      row.push({ count, avgEr });
    }
    matrix.push(row);
  }
  return matrix;
}

async function scanSocialMediaBios() {
  const btn = document.getElementById('smb-scan-btn');
  const statusEl = document.getElementById('smb-scan-status');
  const channels = Object.entries(socialBiosData.inputs)
    .filter(([_, v]) => v.handle && v.handle.trim())
    .map(([name, v]) => ({ name, handle: v.handle.trim(), profileUrl: v.profileUrl.trim() }));

  if (!channels.length) {
    showToast('Add at least one handle (LinkedIn / Instagram / TikTok) first.');
    return;
  }

  // Ensure we always scan under a stable brand_id so results are scoped to this company.
  if (!brandKitData.brandId) {
    brandKitData.brandId = crypto.randomUUID();
    try { localStorage.setItem(BRAND_ID_STORAGE_KEY, brandKitData.brandId); } catch (_) {}
  }

  if (btn) { btn.textContent = 'Scanning…'; btn.disabled = true; }
  if (statusEl) statusEl.innerHTML = '<span style="color:#9333EA">⟳ Scraping channels via Apify — this may take 30–90 seconds…</span>';

  try {
    const res = await fetch(WF_SOCIAL_BIOS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_id: brandKitData.brandId,
        channels,
        maxPosts: 10,
        scoringWeights: socialBiosData.scoringWeights,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text || text.length < 5) throw new Error('Empty response — is the workflow activated in n8n?');
    const data = JSON.parse(text);
    // Validate both old structure (channels) and new structure (profiles + posts)
    const hasChannels = Array.isArray(data.channels) && data.channels.length > 0;
    const hasProfilesPosts = Array.isArray(data.profiles) && data.profiles.length > 0;
    if (!hasChannels && !hasProfilesPosts) throw new Error('No channels returned from scan.');
    applySocialBiosData(data);
    // Persist brand_id so subsequent page reloads still fetch this brand's data.
    try { localStorage.setItem(BRAND_ID_STORAGE_KEY, brandKitData.brandId); } catch (_) {}
    if (statusEl) statusEl.innerHTML = '<span style="color:#10B981">✅ Channels scanned — voice rules updated below.</span>';
    showToast('SocialMediaBios scan complete.');
  } catch (e) {
    console.error('[WF_SOCIAL_BIOS] scan error:', e);
    // If we already have real data on screen, NEVER overwrite it with mock — that would
    // erase what the user already paid Apify credits to scan. Only fall back to mock when
    // there's nothing else to show.
    const hasRealData = !socialBiosData.isMock && Array.isArray(socialBiosData.channels) && socialBiosData.channels.length > 0;
    if (hasRealData) {
      if (statusEl) statusEl.innerHTML = `<span style="color:#EF4444">❌ Scan failed: ${e.message}. Tus datos guardados siguen a la vista.</span>`;
      showToast('Scan failed — pero los datos reales del último scan se mantuvieron.', 'error');
    } else {
      const errorMsg = e.message.includes('404')
        ? '❌ Webhook error 404 — el workflow en n8n no está activado. Verifica que "SocialMediaBios" esté ACTIVO (toggle verde) en n8n.'
        : `❌ Scan failed: ${e.message}`;
      if (statusEl) statusEl.innerHTML = `<span style="color:#EF4444">${errorMsg} Mostrando datos de demo.</span>`;
      applySocialBiosData(loadMockSocialBios(), { isMock: true });
    }
  } finally {
    if (btn) { btn.textContent = 'Scan Channels'; btn.disabled = false; }
  }
}

function applySocialBiosData(data, opts = {}) {
  if (!data) return;

  // Handle both old structure (direct channels) and new Profile + Posts Merge structure
  let channels = data.channels;
  if (!Array.isArray(channels)) {
    // New structure: try to merge profiles + posts
    if (Array.isArray(data.profiles) && Array.isArray(data.posts)) {
      // Merge posts into corresponding profiles by channel
      const profilesByChannel = {};
      for (const p of data.profiles) {
        if (p.name) profilesByChannel[p.name] = p;
      }
      for (const post of data.posts) {
        const channelName = post.channel || post.name;
        if (channelName && profilesByChannel[channelName]) {
          if (!profilesByChannel[channelName].topPosts) profilesByChannel[channelName].topPosts = [];
          profilesByChannel[channelName].topPosts.push(post);
        }
      }
      channels = Object.values(profilesByChannel);
    } else {
      return; // No valid structure found
    }
  }

  if (!Array.isArray(channels)) return;
  socialBiosData.lastScannedAt = data.scanned_at || new Date().toISOString();
  socialBiosData.isMock = !!opts.isMock;
  if (data.scoringWeights) socialBiosData.scoringWeights = data.scoringWeights;
  socialBiosData.channels = channels;
  hydrateSocialBiosView();
  // SMB just landed real channel context — recompute the ContentBuilder visual specs
  // so the Auto-specs chips reflect the actual top format (e.g. "Sidecar" → carousel 1:1)
  // without needing the user to switch tabs.
  if (typeof contentBuilderActiveTab !== 'undefined' && !opts.isMock) {
    Object.keys(contentBuilderCampaign).forEach(ch => {
      contentBuilderCampaign[ch].visualSpecs = null; // force re-derive on next read
    });
    if (document.getElementById('cb-visual-specs')) {
      resetVisualSpecsToDefault(contentBuilderActiveTab);
    }
  }
}

// Returns a compact SocialMediaBios snapshot suitable for including in n8n webhook payloads.
// Pass channel (e.g. 'Instagram') to narrow to one channel, or omit for all channels.
// Returns null when no real data is available (mock data is not forwarded to n8n).
function getSocialBiosForPayload(channel) {
  if (!socialBiosData.channels || !socialBiosData.channels.length) return null;
  const channels = channel
    ? socialBiosData.channels.filter(c => c.name.toLowerCase() === (channel || '').toLowerCase())
    : socialBiosData.channels;
  if (!channels.length) return null;
  return channels.map(c => ({
    channel:       c.name,
    tone:          c.tone          || null,
    toneSummary:   c.toneSummary   || null,
    voiceRules:    c.voiceRules    || null,
    primaryFormat: c.primaryFormat || null,
    avgEngagementRate: c.avgEngagementRate || null,
    topHookSnippets: (c.topPosts || []).slice(0, 3).map(p => ({
      snippet:      p.snippet,
      whyItWorked:  p.whyItWorked || null,
      engagementRate: p.engagementRate || null,
    })),
  }));
}

async function fetchSocialBios(brandId) {
  // Reads the latest scan from public.social_media_analyses (one row per channel)
  // and rebuilds the shape that applySocialBiosData expects.
  // Requires a brandId — without one we can't scope the query and would pull all brands' data.
  if (!brandId) return null;
  try {
    const rows = await supabaseGet(
      `social_media_analyses?brand_id=eq.${brandId}&select=channel,handle,url,analysis_json,updated_at&order=updated_at.desc&limit=20`
    );
    if (!Array.isArray(rows) || !rows.length) return null;
    // Dedupe by channel keeping the most recent.
    const byChannel = {};
    for (const r of rows) {
      if (!byChannel[r.channel]) byChannel[r.channel] = r;
    }
    const channels = Object.values(byChannel).map(r => r.analysis_json);
    const scannedAt = Object.values(byChannel)
      .map(r => r.updated_at).sort().reverse()[0] || new Date().toISOString();
    return { scanned_at: scannedAt, channels };
  } catch (e) {
    console.warn('[SocialMediaBios] fetchSocialBios failed:', e);
    return null;
  }
}

function autofillHandlesFromBrandKit() {
  // READ-ONLY against brandKitData — never mutates it.
  const channels = (brandKitData && brandKitData.channels) || [];
  // Clear all handles first — channels not in this brand must not show SWL defaults
  socialBiosData.inputs.Instagram = { handle: '', profileUrl: '' };
  socialBiosData.inputs.TikTok    = { handle: '', profileUrl: '' };
  socialBiosData.inputs.LinkedIn  = { handle: '', profileUrl: '' };
  socialBiosData.inputs.Facebook  = { handle: '', profileUrl: '' };
  let touched = 0;
  for (const c of channels) {
    if (!c.handle) continue;
    const clean = c.handle.replace(/^@/, '').trim();
    const name = (c.name || '').trim();
    if (/instagram/i.test(name)) {
      socialBiosData.inputs.Instagram = { handle: clean, profileUrl: `https://www.instagram.com/${clean}/` };
      touched++;
    } else if (/tiktok/i.test(name)) {
      socialBiosData.inputs.TikTok = { handle: clean, profileUrl: `https://www.tiktok.com/@${clean}` };
      touched++;
    } else if (/linkedin/i.test(name)) {
      socialBiosData.inputs.LinkedIn = { handle: clean, profileUrl: `https://www.linkedin.com/company/${clean}/` };
      touched++;
    } else if (/facebook/i.test(name)) {
      socialBiosData.inputs.Facebook = { handle: clean, profileUrl: `https://www.facebook.com/${clean}` };
      touched++;
    }
  }
  // Update DOM input values + hide cards for empty handles immediately,
  // without waiting for a full view re-render.
  ['LinkedIn', 'Instagram', 'TikTok', 'Facebook'].forEach(ch => {
    const inp = document.querySelector(`input[oninput*="'${ch}'"]`);
    if (!inp) return;
    inp.value = socialBiosData.inputs[ch].handle;
    const card = inp.closest('.smb-input-card');
    if (card) card.style.display = socialBiosData.inputs[ch].handle ? '' : 'none';
  });
  hydrateSocialBiosView();
  showToast(touched ? `Auto-filled ${touched} handle(s) from Branding Bio.` : 'No matching channels in Branding Bio yet.');
}

function updateSocialBiosInput(channelName, field, value) {
  const slot = socialBiosData.inputs[channelName];
  if (!slot) return;
  if (field === 'handle') {
    const clean = value.replace(/^@/, '').trim();
    slot.handle = clean;
    if (channelName === 'Instagram') slot.profileUrl = clean ? `https://www.instagram.com/${clean}/` : '';
    if (channelName === 'TikTok')    slot.profileUrl = clean ? `https://www.tiktok.com/@${clean}`     : '';
    if (channelName === 'LinkedIn')  slot.profileUrl = clean ? `https://www.linkedin.com/company/${clean}/` : '';
    if (channelName === 'YouTube')   slot.profileUrl = clean ? `https://www.youtube.com/@${clean}` : '';
    if (channelName === 'Facebook')  slot.profileUrl = clean ? `https://www.facebook.com/${clean}` : '';
  }
}

function selectSocialBiosChannel(name) {
  socialBiosData.selectedChannel = name;
  hydrateSocialBiosView();
}

function selectSocialBiosSubtab(subtab, btn) {
  // Hide all subtab content
  document.querySelectorAll('[id^="smb-subtab-"]').forEach(el => el.style.display = 'none');
  // Show selected subtab
  document.getElementById('smb-subtab-' + subtab).style.display = '';

  // Update button styles
  document.querySelectorAll('.smb-subtab').forEach(b => {
    b.style.borderBottomColor = 'transparent';
    b.style.color = 'var(--text-muted)';
  });
  btn.style.borderBottomColor = '#9333EA';
  btn.style.color = '#9333EA';
}

// ── Cross-channel comparison renderer (shown when "Compare all" is active) ──
function renderSocialBiosComparison(channels) {
  const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  if (!channels || !channels.length) {
    setHTML('smb-channel-cards', '<div style="text-align:center;color:var(--text-muted);padding:24px;">No channels yet — run a scan or fill the handles above.</div>');
    setHTML('smb-tone-matrix', '');
    setHTML('smb-best-per-channel', '');
    setHTML('smb-leaderboard', '');
    return;
  }

  // ── 1. Channel snapshot cards ──
  // Highlight the best ER channel with a "Top performer" ribbon.
  const sortedByEr = [...channels].sort((a, b) => (b.avgEngagementRate || 0) - (a.avgEngagementRate || 0));
  const topErChannel = sortedByEr[0]?.name;

  setHTML('smb-channel-cards', channels.map(c => {
    const top = (c.topPosts || [])[0];
    const isTop = c.name === topErChannel;
    const smbIconKey = { LinkedIn: 'linkedin', Instagram: 'instagram', TikTok: 'music', YouTube: 'youtube', Facebook: 'facebook' };
    return `
      <div class="smb-channel-card" style="border-top:3px solid ${c.color};">
        ${isTop ? `<div class="smb-channel-card-ribbon"><i data-lucide="star" style="width:11px;vertical-align:middle;margin-right:3px;"></i>Top performer</div>` : ''}
        <div class="smb-channel-card-head">
          <div class="smb-channel-card-avatar" style="background:${c.color};">${getSocialLogo(smbIconKey[c.name] || 'globe', 'white')}</div>
          <div style="flex:1;min-width:0;">
            <div class="smb-channel-card-title">${c.name}</div>
            <a href="${c.profileUrl}" target="_blank" class="smb-channel-card-handle">${c.handle}</a>
          </div>
          <button class="smb-channel-card-open" onclick="selectSocialBiosChannel('${c.name}')" title="Open ${c.name} detail"><i data-lucide="arrow-up-right" style="width:13px;"></i></button>
        </div>
        <div class="smb-channel-card-stats">
          <div><div class="lbl">Followers</div><div class="val">${c.followers ?? '—'}</div></div>
          <div><div class="lbl">Posts/wk</div><div class="val">${c.postingCadence ?? '—'}</div></div>
          <div><div class="lbl">Avg ER</div><div class="val" style="color:${c.color};">${c.avgEngagementRate ?? '—'}%</div></div>
          <div><div class="lbl">Format</div><div class="val" style="text-transform:capitalize;font-size:13px;">${c.primaryFormat || '—'}</div></div>
        </div>
        <div class="smb-channel-card-tone">${c.toneSummary || 'Run a scan to populate.'}</div>
        ${top ? `
          <div class="smb-channel-card-bestpost">
            <div class="smb-bestpost-label">
              <i data-lucide="trending-up" style="width:11px;vertical-align:middle;margin-right:3px;"></i>Best post · ER ${top.engagementRate ?? 0}%
              ${top.url ? `<a href="${top.url}" target="_blank" rel="noopener" style="margin-left:auto;color:${c.color};font-size:11px;text-decoration:none;display:inline-flex;align-items:center;gap:2px;">View<i data-lucide="external-link" style="width:10px;"></i></a>` : ''}
            </div>
            <div class="smb-bestpost-text">${top.snippet}</div>
          </div>` : ''}
      </div>
    `;
  }).join(''));

  // ── 2. Tone Voice matrix ──
  // One row per tone dimension; each row plots all channels on the same 0-100 axis.
  const toneDims = [
    { key: 'formal_vs_casual',         left: 'Formal',    right: 'Casual'     },
    { key: 'technical_vs_accessible',  left: 'Technical', right: 'Accessible' },
    { key: 'serious_vs_playful',       left: 'Serious',   right: 'Playful'    },
    { key: 'humble_vs_bold',           left: 'Humble',    right: 'Bold'       },
    { key: 'short_vs_expansive',       left: 'Short',     right: 'Expansive'  },
  ];
  setHTML('smb-tone-matrix', `
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px;font-size:11px;">
      ${channels.map(c => `<div style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:${c.color};display:inline-block;"></span><span style="color:var(--text-main);font-weight:600;">${c.name}</span></div>`).join('')}
    </div>
    ${toneDims.map(d => {
      const values = channels.map(c => ({ name: c.name, color: c.color, v: c.tone?.[d.key] ?? 50 }));
      const min = Math.min(...values.map(x => x.v));
      const max = Math.max(...values.map(x => x.v));
      const spread = max - min;
      const variance = spread > 40 ? 'Alta' : spread > 20 ? 'Media' : 'Baja';
      const varianceColor = spread > 40 ? '#EF4444' : spread > 20 ? '#F59E0B' : '#10B981';
      return `
        <div class="smb-tone-row">
          <div class="smb-tone-row-labels">
            <span>${d.left}</span>
            <span style="font-size:10px;color:${varianceColor};font-weight:700;letter-spacing:0.4px;">VARIANZA ${variance.toUpperCase()}</span>
            <span>${d.right}</span>
          </div>
          <div class="smb-tone-track">
            ${values.map(x => `
              <div class="smb-tone-dot" style="left:${x.v}%;background:${x.color};" title="${x.name}: ${x.v}/100">
                <span class="smb-tone-dot-tooltip">${x.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('')}
  `);

  // ── 3. Best post per channel ──
  setHTML('smb-best-per-channel', channels.map(c => {
    const best = (c.topPosts || [])[0];
    if (!best) return `
      <div class="smb-best-card" style="border-left:3px solid ${c.color};">
        <div class="smb-best-card-head" style="color:${c.color};"><strong>${c.name}</strong> · no posts</div>
        <div style="color:var(--text-muted);font-size:12px;">Run a scan to surface the top post.</div>
      </div>
    `;
    return `
      <div class="smb-best-card" style="border-left:3px solid ${c.color};">
        <div class="smb-best-card-head">
          <span style="color:${c.color};font-weight:700;">${c.name}</span>
          <span class="smb-best-card-er">ER ${best.engagementRate ?? 0}%</span>
        </div>
        <div class="smb-best-card-snippet">${best.snippet}</div>
        ${best.whyItWorked ? `<div class="smb-best-card-why">↳ ${best.whyItWorked}</div>` : ''}
        <div class="smb-best-card-meta">
          <span style="text-transform:capitalize;">${best.format}</span>
          <span>· ${best.metrics?.likes ?? 0} likes</span>
          <span>· ${best.metrics?.comments ?? 0} comments</span>
          <span>· ${best.metrics?.shares ?? 0} shares</span>
          ${best.url ? `<a href="${best.url}" target="_blank" rel="noopener" style="margin-left:auto;color:${c.color};font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:3px;">Ver post<i data-lucide="external-link" style="width:11px;"></i></a>` : ''}
        </div>
      </div>
    `;
  }).join(''));

  // ── 4. Leaderboard ──
  const rank = (key, label, fmt, hint) => {
    const sorted = [...channels].sort((a, b) => (b[key] || 0) - (a[key] || 0));
    return `
      <div class="smb-lb-col">
        <div class="smb-lb-col-title">${label}</div>
        <div class="smb-lb-col-hint">${hint}</div>
        ${sorted.map((c, i) => `
          <div class="smb-lb-row ${i === 0 ? 'winner' : ''}">
            <span class="smb-lb-rank">${i + 1}</span>
            <span class="smb-lb-dot" style="background:${c.color};"></span>
            <span class="smb-lb-name">${c.name}</span>
            <span class="smb-lb-val">${fmt(c[key])}</span>
          </div>
        `).join('')}
      </div>
    `;
  };
  setHTML('smb-leaderboard', `
    ${rank('avgEngagementRate', 'Engagement rate',  v => `${v ?? 0}%`,  'Promedio por post')}
    ${rank('followers',         'Alcance potencial', v => v ?? 0,         'Total followers')}
    ${rank('postingCadence',    'Cadencia',          v => `${v ?? 0}/sem`, 'Posts publicados por semana')}
  `);
}

function selectSocialChannel(channelName) {
  // Hide all channel sections
  document.querySelectorAll('.smb-channel-section').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.smb-channel-pill').forEach(el => {
    el.style.borderBottomColor = 'transparent';
    el.style.color = 'var(--text-muted)';
  });

  // Show selected channel
  const selected = document.querySelector(`[data-channel="${channelName}"].smb-channel-section`);
  if (selected) {
    selected.style.display = 'block';
    document.querySelector(`[data-channel="${channelName}"].smb-channel-pill`).style.borderBottomColor = '#6366F1';
    document.querySelector(`[data-channel="${channelName}"].smb-channel-pill`).style.color = '#6366F1';

    // Reset to COMUNIDAD subtab when switching channels
    selectSocialSubtab(channelName, 'community');
  }
}

function selectSocialSubtab(channelName, subtabName) {
  const section = document.querySelector(`[data-channel="${channelName}"].smb-channel-section`);
  if (!section) return;

  // Hide all subtabs
  section.querySelectorAll('.smb-subtab-content').forEach(el => el.style.display = 'none');
  section.querySelectorAll('.smb-subtab').forEach(el => {
    el.style.borderBottomColor = 'transparent';
    el.style.color = 'var(--text-muted)';
  });

  // Show selected subtab
  section.querySelectorAll(`[data-subtab="${subtabName}"]`).forEach(el => {
    if (el.classList.contains('smb-subtab-content')) {
      el.style.display = 'grid';
    } else {
      el.style.borderBottomColor = '#6366F1';
      el.style.color = '#6366F1';
    }
  });
}

function renderSocialChannelsTabs() {
  const tabsPillsContainer = document.getElementById('smb-channel-tabs-pills');
  const contentsContainer = document.getElementById('smb-channel-contents');

  if (!tabsPillsContainer || !contentsContainer) {
    console.error('Containers not found');
    return;
  }

  // Get channels that have handles in socialBiosData.inputs
  const inputChannels = Object.entries(socialBiosData.inputs || {})
    .filter(([_, v]) => v.handle && v.handle.trim())
    .map(([name]) => name);

  console.log('Input channels with handles:', inputChannels);

  // Get the full channel data for these inputs
  const channels = (socialBiosData.channels || [])
    .filter(c => inputChannels.includes(c.name));

  console.log('Matching channels with data:', channels);

  if (!channels.length) {
    tabsPillsContainer.innerHTML = '<p style="padding:16px; color:var(--text-muted); font-size:13px;">📱 <strong>Presiona "Sync to Pipeline"</strong> en Branding Bio para traer datos de tus redes sociales automáticamente</p>';
    contentsContainer.innerHTML = '';
    return;
  }

  // Render tabs
  tabsPillsContainer.innerHTML = channels.map(ch => `
    <button class="smb-channel-pill" data-channel="${ch.name}"
      onclick="selectSocialChannel('${ch.name}')"
      style="padding:10px 18px; border:none; background:transparent; color:var(--text-muted); cursor:pointer; font-weight:600; font-size:14px; border-bottom:3px solid transparent; transition:all .15s; display:flex; align-items:center; gap:6px;">
      <span style="display:inline-flex; align-items:center;">${getSocialLogo(ch.icon, ch.color, 14)}</span>
      ${ch.name}
    </button>
  `).join('');

  // Render channel content sections
  contentsContainer.innerHTML = channels.map(ch => `
    <div class="smb-channel-section" data-channel="${ch.name}" style="display:none; margin-top:24px;">
      <!-- Sub-tabs -->
      <div style="display:flex; gap:16px; margin-bottom:20px; border-bottom:1px solid var(--border); padding-bottom:12px;">
        <button class="smb-subtab active" data-subtab="community" onclick="selectSocialSubtab('${ch.name}', 'community')"
          style="padding:8px 12px; border:none; background:transparent; color:var(--text-muted); cursor:pointer; font-weight:600; font-size:13px; border-bottom:2px solid transparent; transition:all .15s;">COMUNIDAD</button>
        <button class="smb-subtab" data-subtab="account" onclick="selectSocialSubtab('${ch.name}', 'account')"
          style="padding:8px 12px; border:none; background:transparent; color:var(--text-muted); cursor:pointer; font-weight:600; font-size:13px; border-bottom:2px solid transparent; transition:all .15s;">CUENTA</button>
        <button class="smb-subtab" data-subtab="posts" onclick="selectSocialSubtab('${ch.name}', 'posts')"
          style="padding:8px 12px; border:none; background:transparent; color:var(--text-muted); cursor:pointer; font-weight:600; font-size:13px; border-bottom:2px solid transparent; transition:all .15s;">PUBLICACIONES</button>
      </div>

      <!-- COMUNIDAD -->
      <div class="smb-subtab-content community" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
        <div style="padding:20px; border:1px solid #E5CCFF; background:linear-gradient(135deg,#F3E8FF 0%,#F5F3FF 100%); border-radius:8px; text-align:center;">
          <div style="font-size:32px; font-weight:800; color:#6366F1; line-height:1;">${ch.followers || '—'}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:8px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Followers</div>
        </div>
        <div style="padding:20px; border:1px solid #CCF0E9; background:linear-gradient(135deg,#E8F9F5 0%,#F0FDF9 100%); border-radius:8px; text-align:center;">
          <div style="font-size:32px; font-weight:800; color:#10B981; line-height:1;">${ch.following || '—'}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:8px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Following</div>
        </div>
        <div style="padding:20px; border:1px solid #FDD7E8; background:linear-gradient(135deg,#FEF3F7 0%,#FEF9FB 100%); border-radius:8px; text-align:center;">
          <div style="font-size:32px; font-weight:800; color:#EC4899; line-height:1;">${ch.totalPosts || '—'}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:8px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Total Posts</div>
        </div>
      </div>

      <!-- CUENTA -->
      <div class="smb-subtab-content account" style="display:none; grid-template-columns:repeat(3, 1fr); gap:16px;">
        <div style="padding:20px; border:1px solid #BFDBFE; background:linear-gradient(135deg,#EFF6FF 0%,#F0F9FF 100%); border-radius:8px; text-align:center;">
          <div style="font-size:32px; font-weight:800; color:#3B82F6; line-height:1;">${(ch.totalViews || 0).toLocaleString('en-US')}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:8px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Total Views</div>
        </div>
        <div style="padding:20px; border:1px solid #A7F3D0; background:linear-gradient(135deg,#F0FDF4 0%,#F5FBEF 100%); border-radius:8px; text-align:center;">
          <div style="font-size:32px; font-weight:800; color:#22C55E; line-height:1;">${(ch.reach || 0).toLocaleString('en-US')}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:8px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Reach</div>
        </div>
        <div style="padding:20px; border:1px solid #FDBCB4; background:linear-gradient(135deg,#FEF5F1 0%,#FDF9F7 100%); border-radius:8px; text-align:center;">
          <div style="font-size:32px; font-weight:800; color:#F97316; line-height:1;">${(ch.totalInteractions || 0).toLocaleString('en-US')}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:8px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Total Interactions</div>
        </div>
      </div>

      <!-- PUBLICACIONES -->
      <div class="smb-subtab-content posts" style="display:none;">
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
          ${(ch.topPosts || [])
            .sort((a, b) => (b.metrics?.likes || 0) - (a.metrics?.likes || 0))
            .slice(0, 6)
            .map((post, i) => `
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px; background:white;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Post ${i+1}</div>
                <div style="font-size:13px; font-weight:700; color:#6366F1;">${post.engagementRate}% ER</div>
              </div>
              <p style="font-size:13px; color:var(--text-main); margin:0 0 12px 0; line-height:1.5; font-weight:500;">${post.snippet}</p>
              <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:12px;">
                <div style="padding:10px; background:#F3F4F6; border-radius:6px; text-align:center;">
                  <div style="font-size:16px; font-weight:800; color:#EC4899;">${post.metrics?.likes || 0}</div>
                  <div style="font-size:10px; color:var(--text-muted); margin-top:2px; font-weight:600;">Likes</div>
                </div>
                <div style="padding:10px; background:#F3F4F6; border-radius:6px; text-align:center;">
                  <div style="font-size:16px; font-weight:800; color:#3B82F6;">${post.metrics?.views || post.metrics?.impressions || 0}</div>
                  <div style="font-size:10px; color:var(--text-muted); margin-top:2px; font-weight:600;">Views</div>
                </div>
                <div style="padding:10px; background:#F3F4F6; border-radius:6px; text-align:center;">
                  <div style="font-size:16px; font-weight:800; color:#10B981;">${post.metrics?.comments || 0}</div>
                  <div style="font-size:10px; color:var(--text-muted); margin-top:2px; font-weight:600;">Comments</div>
                </div>
              </div>
              <div style="font-size:11px; color:var(--text-muted); padding-top:8px; border-top:1px solid var(--border);">
                ${new Date(post.publishedAt).toLocaleDateString('en-US')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Voice Rules -->
      <div style="margin-top:24px; padding:20px; border:1px solid var(--border); border-radius:8px; background:white;">
        <h3 style="margin:0 0 16px 0; font-size:14px; font-weight:700; color:var(--text-main);"><i data-lucide="volume-2" style="width:16px; vertical-align:middle; margin-right:8px;"></i>Voice Rules for ${ch.name}</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <div>
            <div style="font-size:11px; font-weight:700; color:#10B981; letter-spacing:0.5px; margin-bottom:10px; text-transform:uppercase;">✓ Always</div>
            <ul style="margin:0; padding-left:16px; font-size:12px; line-height:1.8; color:var(--text-muted);">
              ${(ch.voiceRules?.always || []).map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          <div>
            <div style="font-size:11px; font-weight:700; color:#EF4444; letter-spacing:0.5px; margin-bottom:10px; text-transform:uppercase;">✕ Never</div>
            <ul style="margin:0; padding-left:16px; font-size:12px; line-height:1.8; color:var(--text-muted);">
              ${(ch.voiceRules?.never || []).map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function hydrateSocialBiosView() {
  // Bail out silently if the view isn't mounted — switchView will re-call this on next mount.
  if (!document.getElementById('smb-root')) return;

  // Always refetch from Supabase on each hydrate — the n8n workflow can write new analyses
  // between mounts, and a stale in-memory cache would otherwise hide them.
  const stored = await fetchSocialBios(brandKitData.brandId);
  if (stored && stored.channels.length) {
    socialBiosData.lastScannedAt = stored.scanned_at;
    socialBiosData.channels = stored.channels;
    socialBiosData.isMock = false;
  } else if (!socialBiosData.channels || !socialBiosData.channels.length) {
    const mock = loadMockSocialBios();
    socialBiosData.lastScannedAt = mock.scanned_at;
    socialBiosData.channels = mock.channels;
    socialBiosData.isMock = true;
  }

  // Mock-data badge — visible until a real scan from WF02 lands.
  const banner = document.getElementById('smb-mock-banner');
  if (banner) banner.style.display = socialBiosData.isMock ? '' : 'none';

  // Only show channels for which the user provided an input handle
  const activeInputs = Object.entries(socialBiosData.inputs)
    .filter(([_, v]) => v.handle && v.handle.trim())
    .map(([name]) => name);
  const allChannels = socialBiosData.channels;
  const channels = activeInputs.length > 0
    ? allChannels.filter(c => activeInputs.includes(c.name))
    : allChannels;

  let sel = socialBiosData.selectedChannel;
  // Reset to 'all' if the selected channel no longer has a handle
  if (sel !== 'all' && !activeInputs.includes(sel)) {
    socialBiosData.selectedChannel = 'all';
    sel = 'all';
  }

  const visible = sel === 'all' ? channels : channels.filter(c => c.name === sel);
  const focus = visible.length === 1 ? visible[0] : null;

  // ── KPIs ──
  const totalPosts = channels.reduce((s, c) => s + ((c.topPosts || []).length + (c.bottomPosts || []).length + Math.max(0, (c.posts || []).length - (c.topPosts || []).length - (c.bottomPosts || []).length)), 0);
  const allErs = channels.flatMap(c => (c.topPosts || []).map(p => p.engagementRate || 0).concat((c.bottomPosts || []).map(p => p.engagementRate || 0)));
  const avgEr = allErs.length ? +(allErs.reduce((s, v) => s + v, 0) / allErs.length).toFixed(2) : 0;
  const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  setText('smb-stat-channels', String(channels.length));
  setText('smb-stat-posts', String(totalPosts));
  setText('smb-stat-er', `${avgEr}%`);
  setText('smb-stat-variance', focus ? `${Math.round((Math.abs(50 - focus.tone.formal_vs_casual) + Math.abs(50 - focus.tone.serious_vs_playful)) / 2)}%` : '—');
  setText('smb-last-scan', socialBiosData.lastScannedAt ? new Date(socialBiosData.lastScannedAt).toLocaleString() : '—');

  // ── Render channel tabs dynamically (only for platforms with handles) ──
  const CHANNEL_TAB_META = {
    LinkedIn:  { logoArgs: ['linkedin',  '#0A66C2', 14] },
    Instagram: { logoArgs: ['instagram', '#E4405F', 14] },
    TikTok:    { logoArgs: ['music',     '#010101', 14] },
    YouTube:   { logoArgs: ['youtube',   '#FF0000', 14] },
    Facebook:  { logoArgs: ['facebook',  '#1877F2', 14] },
  };
  const tabsContainer = document.getElementById('smb-channel-tabs-container');
  if (tabsContainer) {
    tabsContainer.innerHTML =
      `<div class="smb-channel-tab ${sel === 'all' ? 'active' : ''}" data-channel="all" onclick="selectSocialBiosChannel('all')"><i data-lucide="layout-grid" style="width:13px;vertical-align:middle;margin-right:5px;"></i>Compare all</div>` +
      activeInputs.map(name => {
        const m = CHANNEL_TAB_META[name];
        if (!m) return '';
        return `<div class="smb-channel-tab ${sel === name ? 'active' : ''}" data-channel="${name}" onclick="selectSocialBiosChannel('${name}')"><span style="display:inline-flex;align-items:center;vertical-align:middle;margin-right:5px;">${getSocialLogo(...m.logoArgs)}</span>${name}</div>`;
      }).join('');
  }

  // ── Toggle comparison vs single-channel view ──
  const comparisonRoot = document.getElementById('smb-comparison-view');
  const singleRoot = document.getElementById('smb-single-view');
  const isAll = sel === 'all';
  if (comparisonRoot) comparisonRoot.style.display = isAll ? '' : 'none';
  if (singleRoot) singleRoot.style.display = isAll ? 'none' : '';

  if (isAll) {
    renderSocialBiosComparison(channels);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  // ── Per-channel focus card (Metricool style) ──
  if (focus) {
    // Focus card header
    setHTML('smb-focus-card', `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="width:40px;height:40px;border-radius:10px;background:${focus.color};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">${focus.name.charAt(0)}</div>
        <div style="flex:1;min-width:200px;">
          <div style="font-size:16px;font-weight:700;color:var(--text-main);">${focus.name} · ${focus.handle}</div>
          <a href="${focus.profileUrl}" target="_blank" style="font-size:12px;color:var(--text-muted);text-decoration:none;">${focus.profileUrl}</a>
        </div>
        <div class="smb-kpi-mini"><div class="lbl">Posts/week</div><div class="val">${focus.postingCadence ?? '—'}</div></div>
        <div class="smb-kpi-mini"><div class="lbl">Avg ER</div><div class="val">${focus.avgEngagementRate ?? '—'}%</div></div>
        <div class="smb-kpi-mini"><div class="lbl">Primary format</div><div class="val" style="text-transform:capitalize;">${focus.primaryFormat || '—'}</div></div>
      </div>
    `);

    // COMUNIDAD metrics
    setText('smb-comunidad-followers', (focus.followers ?? 0).toLocaleString());
    setText('smb-comunidad-following', (focus.following ?? 0).toLocaleString());
    setText('smb-comunidad-posts', (focus.totalPosts ?? 0).toLocaleString());

    // CUENTA metrics
    setText('smb-cuenta-views', (focus.totalViews ?? 0).toLocaleString());
    setText('smb-cuenta-reach', (focus.reach ?? 0).toLocaleString());
    setText('smb-cuenta-interactions', (focus.totalInteractions ?? 0).toLocaleString());

    // PUBLICACIONES - all posts ordered by engagement (highest to lowest)
    const allPosts = [
      ...(focus.topPosts || []),
      ...(focus.posts || []).filter(p => !(focus.topPosts || []).find(tp => tp.id === p.id) && !(focus.bottomPosts || []).find(bp => bp.id === p.id)),
      ...(focus.bottomPosts || [])
    ];
    const sortedByEngagement = [...allPosts].sort((a, b) => (b.engagementRate ?? 0) - (a.engagementRate ?? 0));

    setHTML('smb-publicaciones-list', sortedByEngagement.length ? sortedByEngagement.map(p => `
      <div style="padding:16px; border:1px solid var(--border); border-radius:10px; background:var(--bg-secondary);">
        <div style="display:flex; gap:12px;">
          <div style="flex:1; min-width:0;">
            <div style="font-size:13px; font-weight:600; color:var(--text-main); margin-bottom:6px; line-height:1.4;">
              ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener" style="color:var(--text-main); text-decoration:none;">${p.snippet}</a>` : p.snippet}
            </div>
            <div style="display:flex; gap:12px; font-size:11px; color:var(--text-muted); flex-wrap:wrap;">
              <span style="text-transform:capitalize;">📌 ${p.format || 'post'}</span>
              <span>📅 ${p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('es-ES') : '—'}</span>
            </div>
          </div>
          <div style="text-align:right; min-width:max-content;">
            <div style="font-size:28px; font-weight:800; color:${focus.color}; line-height:1;">${p.engagementRate ?? 0}%</div>
            <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">ER</div>
          </div>
        </div>
        <div style="margin-top:10px; display:grid; grid-template-columns:repeat(auto-fit, minmax(60px, 1fr)); gap:8px; font-size:11px;">
          <div style="text-align:center; padding:8px; background:var(--bg-main); border-radius:6px;">
            <div style="font-weight:600; color:var(--text-main);">${p.metrics?.likes ?? 0}</div>
            <div style="color:var(--text-muted); font-size:10px;">❤️ Likes</div>
          </div>
          <div style="text-align:center; padding:8px; background:var(--bg-main); border-radius:6px;">
            <div style="font-weight:600; color:var(--text-main);">${p.metrics?.comments ?? 0}</div>
            <div style="color:var(--text-muted); font-size:10px;">💬 Comments</div>
          </div>
          <div style="text-align:center; padding:8px; background:var(--bg-main); border-radius:6px;">
            <div style="font-weight:600; color:var(--text-main);">${p.metrics?.shares ?? 0}</div>
            <div style="color:var(--text-muted); font-size:10px;">↗️ Shares</div>
          </div>
          <div style="text-align:center; padding:8px; background:var(--bg-main); border-radius:6px;">
            <div style="font-weight:600; color:var(--text-main);">${p.metrics?.impressions ?? 0}</div>
            <div style="color:var(--text-muted); font-size:10px;">👁️ Views</div>
          </div>
        </div>
      </div>
    `).join('') : '<div style="text-align:center; color:var(--text-muted); padding:24px;">No publications yet — run a scan.</div>');
  } else {
    setHTML('smb-focus-card', '<div style="text-align:center;color:var(--text-muted);padding:24px;">Select a channel above to see its profile.</div>');
    setText('smb-comunidad-followers', '—');
    setText('smb-comunidad-following', '—');
    setText('smb-comunidad-posts', '—');
    setText('smb-cuenta-views', '—');
    setText('smb-cuenta-reach', '—');
    setText('smb-cuenta-interactions', '—');
    setHTML('smb-publicaciones-list', '<div style="text-align:center;color:var(--text-muted);padding:24px;">Select a channel to see publications.</div>');
  }

  // Reset subtabs to COMUNIDAD by default
  setTimeout(() => {
    document.querySelectorAll('[id^="smb-subtab-"]').forEach(el => el.style.display = 'none');
    const comunidadTab = document.getElementById('smb-subtab-comunidad');
    if (comunidadTab) comunidadTab.style.display = '';

    document.querySelectorAll('.smb-subtab').forEach(b => {
      b.style.borderBottomColor = 'transparent';
      b.style.color = 'var(--text-muted)';
    });
    const firstSubtab = document.querySelector('[data-subtab="comunidad"]');
    if (firstSubtab) {
      firstSubtab.style.borderBottomColor = '#9333EA';
      firstSubtab.style.color = '#9333EA';
    }
  }, 0);

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── WF03 Research Source Sync ──────────────────────────
const WF03_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/research-sync';

async function syncResearchSources() {
  const btn = document.getElementById('wf03-sync-btn');
  if (btn) { btn.textContent = 'Syncing…'; btn.disabled = true; }
  try {
    // 1. Ensure brand profile exists in Supabase (so WF03 can scope queries by brand_id)
    if (!brandKitData.brandId) {
      brandKitData.brandId = crypto.randomUUID();
      await supabaseUpsert('brands', {
        id: brandKitData.brandId,
        account_id: '11111111-1111-4111-8111-111111111111',
        name: brandKitData.name,
        industry: brandKitData.industry,
        updated_at: new Date().toISOString(),
      });
      await supabaseUpsert('brand_profiles', {
        brand_id: brandKitData.brandId,
        data_json: buildBrandProfilePayloadFromKit(),
        updated_at: new Date().toISOString(),
      }, 'brand_id');
    }

    // 2. Build one research_sources row per (competitor × social channel with explicit URL)
    //    Competitor social handles are loaded MANUALLY in Branding Bio — this module
    //    never auto-discovers them. If a competitor has no IG/TikTok/etc URL filled in,
    //    it simply doesn't get a row for that channel.
    const channelKeyMap = [
      { channel: 'LinkedIn',  field: 'linkedin_url'  },
      { channel: 'Instagram', field: 'instagram_url' },
      { channel: 'TikTok',    field: 'tiktok_url'    },
      { channel: 'YouTube',   field: 'youtube_url'   },
      { channel: 'X/Twitter', field: 'x_url'         },
      { channel: 'Facebook',  field: 'facebook_url'  },
    ];

    const sources = [];
    for (const c of (brandKitData.competitors || [])) {
      if (!c?.name || /^new competitor$/i.test(c.name)) continue;
      const baseConfig = {
        competitor_tier: c.tier || 'Mid',
        positioning:     c.positioning || '',
        diff:            c.diff || '',
        derived_from:    'branding_bio',
      };
      // Website source — WF03 scrapes the homepage for positioning, value-prop, and on-page copy.
      if (c.url) {
        sources.push({
          brand_id:        brandKitData.brandId,
          source_type:     'website',
          source_url:      c.url,
          source_handle:   c.name,
          competitor_name: c.name,
          channel:         'Website',
          active:          true,
          config_json:     baseConfig,
        });
      }
      // Social sources — one row per platform the competitor has a URL for.
      for (const { channel, field } of channelKeyMap) {
        if (!c[field]) continue;
        sources.push({
          brand_id:        brandKitData.brandId,
          source_type:     'social',
          source_url:      c[field],
          source_handle:   c.name,
          competitor_name: c.name,
          channel,
          active:          true,
          config_json:     baseConfig,
        });
      }
    }

    // 3. Wipe stale rows for this brand, then upsert the fresh set
    await fetch(`${SUPABASE_URL}/rest/v1/research_sources?brand_id=eq.${brandKitData.brandId}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    });
    if (sources.length) await supabaseUpsert('research_sources', sources);

    // 4. Fire WF03 — it picks up the rows we just wrote and scrapes per channel
    fetch(WF03_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: brandKitData.brandId, trigger: 'manual' }),
    }).catch(e => console.error('[WF03] webhook error:', e));

    const competitorCount = new Set(sources.map(s => s.competitor_name)).size;
    const websiteCount = sources.filter(s => s.source_type === 'website').length;
    const socialCount  = sources.filter(s => s.source_type === 'social').length;
    if (btn) { btn.textContent = `✅ ${sources.length} sources synced`; }
    showToast(`Sent to WF03: ${websiteCount} website${websiteCount===1?'':'s'} + ${socialCount} social account${socialCount===1?'':'s'} across ${competitorCount} competitor${competitorCount===1?'':'s'}. Scraping in background.`);
    setTimeout(() => hydrateCompetitorsView(), 1500);
    setTimeout(() => { if (btn) { btn.innerHTML = '<i data-lucide="refresh-cw" style="width:13px;vertical-align:middle;margin-right:6px"></i>Sync Web + Socials'; btn.disabled = false; if (typeof lucide !== 'undefined') lucide.createIcons(); } }, 5000);
  } catch (e) {
    if (btn) { btn.textContent = '❌ Error — retry'; btn.disabled = false; }
    showToast('Sync failed: ' + e.message);
    console.error('[WF03] sync error:', e);
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
    body: JSON.stringify({ brand_id: brandKitData.brandId, job_type }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`createQueueJob failed: ${res.status} ${err}`);
  }
  return res.json();
}

// ── Content Queue table — reads content_drafts from Supabase ───
// `onConflict` is required when the upsert target is a unique constraint that is NOT the PK
// (e.g. brand_profiles.brand_id) — PostgREST needs the column name to pick the conflict target.
async function supabaseUpsert(table, data, onConflict) {
  const qs = onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : '';
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${qs}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

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
    // channel comes directly from content_drafts now (WF07 persists it).
    // Keep brief join as fallback for historical rows where channel is null.
    select: 'id,title,channel,status,qa_json,created_at,brief:content_briefs(channel,goal)'
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
    const rows = await fetchContentDrafts(brandKitData.brandId);
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">No drafts yet — click "Build Draft" to generate one.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(r => {
      const qa = parseQaJson(r.qa_json);
      const score = qa.final_score != null ? qa.final_score : '—';
      const scoreColor = (typeof score === 'number' && score >= 85) ? '#10B981' :
                        (typeof score === 'number' && score >= 70) ? '#F59E0B' : '#9CA3AF';
      const channel = r.channel || r.brief?.channel || '—';
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

async function fetchBrandProfile(brandId) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    select: 'data_json,completion_pct,updated_at,brand:brands(name,industry)'
  });
  const rows = await supabaseGet(`brand_profiles?${params}`);
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

// ── CompetitorsView hydration ──────────────────────────
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

function normalizeProfileData(raw) {
  const fallback = buildBrandProfilePayloadFromKit();
  const data = raw && typeof raw === 'object' ? raw : {};
  return {
    ...fallback,
    ...data,
    identity: { ...fallback.identity, ...(data.identity || {}) },
    competitors: Array.isArray(data.competitors) ? data.competitors : fallback.competitors,
    channels: Array.isArray(data.channels) ? data.channels : fallback.channels,
    personas: Array.isArray(data.personas) ? data.personas : fallback.personas,
    values: Array.isArray(data.values) ? data.values : fallback.values,
    tone_by_channel: Array.isArray(data.tone_by_channel) ? data.tone_by_channel : fallback.tone_by_channel,
    content_samples: Array.isArray(data.content_samples) ? data.content_samples : fallback.content_samples,
  };
}

function applyProfileDataToBrandKit(profileData) {
  const data = normalizeProfileData(profileData);
  brandKitData.name = data.identity.company_name || brandKitData.name;
  brandKitData.industry = data.identity.industry || brandKitData.industry;
  brandKitData.tagline = data.identity.tagline || brandKitData.tagline;
  brandKitData.mission = data.identity.mission || brandKitData.mission;
  brandKitData.language = data.identity.language || brandKitData.language || 'es';
  brandKitData.palette = Array.isArray(data.palette)
    ? data.palette.map((c, i) => ({
        hex: c.hex || brandKitData.palette[i]?.hex || '#6366F1',
        name: (c.hex || brandKitData.palette[i]?.hex || '#6366F1').toUpperCase(),
        role: c.role || brandKitData.palette[i]?.role || 'Brand',
      }))
    : brandKitData.palette;
  brandKitData.typography = data.typography || brandKitData.typography;
  brandKitData.values = data.values;
  brandKitData.personas = data.personas;
  brandKitData.competitors = data.competitors;
  brandKitData.channels = data.channels;
  brandKitData.toneByChannel = data.tone_by_channel;
  brandKitData.samples = data.content_samples;
}

// Pin brand_id across page reloads so we don't keep creating duplicate brand rows in Supabase.
// Order: localStorage → existing brand row by name in Supabase → null (let Save & Sync create).
const BRAND_ID_STORAGE_KEY = 'growthai.brandId';

async function resolveBrandId() {
  // 1. Restore from localStorage
  try {
    const stored = localStorage.getItem(BRAND_ID_STORAGE_KEY);
    if (stored && /^[0-9a-f-]{36}$/i.test(stored)) {
      brandKitData.brandId = stored;
      console.log('[brand_id] restored from localStorage:', stored);
      return;
    }
  } catch (_) { /* localStorage unavailable */ }

  // 2. Look up an existing brand row by name (most recent), so reloads of a fresh tab still hit the same brand
  try {
    const targetName = brandKitData.name || 'SWL Consulting';
    const params = new URLSearchParams({
      name: `eq.${targetName}`,
      order: 'updated_at.desc.nullslast,created_at.desc',
      limit: '1',
      select: 'id',
    });
    const rows = await supabaseGet(`brands?${params}`);
    if (rows?.length && rows[0].id) {
      brandKitData.brandId = rows[0].id;
      try { localStorage.setItem(BRAND_ID_STORAGE_KEY, rows[0].id); } catch (_) {}
      console.log('[brand_id] resolved from Supabase:', rows[0].id);
      return;
    }
  } catch (err) {
    console.warn('[brand_id] Supabase lookup failed', err);
  }

  // 3. No existing brand — leave null. saveBrandProfile() will create one on first Save & Sync.
  console.log('[brand_id] no existing brand found; will be created on Save & Sync');
}

async function loadBrandKitFromSupabase() {
  await resolveBrandId();
  if (!brandKitData.brandId) return; // no existing profile, defaults already loaded.
  try {
    const profileRow = await fetchBrandProfile(brandKitData.brandId);
    if (profileRow?.data_json) applyProfileDataToBrandKit(profileRow.data_json);
  } catch (err) {
    console.warn('[Branding Bio] could not load profile from Supabase, using local defaults', err);
  }
}

function firstWords(text, maxWords = 9) {
  return String(text || '').split(/[\s,.;:()]+/).filter(Boolean).slice(0, maxWords).join(' ');
}

function inferSourceUrl(competitor, channelName) {
  if (/linkedin/i.test(channelName)  && competitor.linkedin_url)  return competitor.linkedin_url;
  if (/instagram/i.test(channelName) && competitor.instagram_url) return competitor.instagram_url;
  if (/tiktok/i.test(channelName)    && competitor.tiktok_url)    return competitor.tiktok_url;
  if (/youtube/i.test(channelName)   && competitor.youtube_url)   return competitor.youtube_url;
  if (/twitter|x\b/i.test(channelName) && competitor.x_url)       return competitor.x_url;
  if (/facebook/i.test(channelName)  && competitor.facebook_url)  return competitor.facebook_url;
  if (/blog|newsletter|email|substack/i.test(channelName) && competitor.blog_url) return competitor.blog_url;
  const slug = String(competitor.name || 'competitor').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (/linkedin/i.test(channelName))  return `https://www.linkedin.com/company/${slug}/`;
  if (/instagram/i.test(channelName)) return `https://www.instagram.com/${slug}/`;
  if (/tiktok/i.test(channelName))    return `https://www.tiktok.com/@${slug}`;
  if (/youtube/i.test(channelName))   return `https://www.youtube.com/@${slug}`;
  if (/twitter|x\b/i.test(channelName)) return `https://x.com/${slug}`;
  if (/facebook/i.test(channelName))  return `https://www.facebook.com/${slug}`;
  if (/blog|newsletter|email|substack/i.test(channelName)) return `https://${slug}.com/blog`;
  return competitor.source_url || competitor.url || `https://${slug}.com`;
}

function deriveCompetitorsViewFromProfile(profileData, profileUpdatedAt) {
  const data = normalizeProfileData(profileData);
  const competitors = data.competitors.filter(c => c?.name && !/^new competitor$/i.test(c.name));
  const personas = data.personas.filter(p => p?.role);
  const brandName = data.identity.company_name || brandKitData.name || 'Brand';
  const industry = data.identity.industry || brandKitData.industry || 'your market';
  const now = new Date().toISOString();
  const minutesAgo = m => new Date(Date.now() - m * 60000).toISOString();

  const SOCIAL_POOL = ['LinkedIn', 'Instagram', 'TikTok', 'YouTube', 'X/Twitter', 'Facebook'];
  const competitorChannels = (competitor, idx) => {
    const explicit = [
      competitor.linkedin_url  && 'LinkedIn',
      competitor.instagram_url && 'Instagram',
      competitor.tiktok_url    && 'TikTok',
      competitor.youtube_url   && 'YouTube',
      competitor.x_url         && 'X/Twitter',
      competitor.facebook_url  && 'Facebook',
    ].filter(Boolean);
    if (explicit.length) return explicit;
    const start = idx % SOCIAL_POOL.length;
    return [0, 1, 2].map(k => SOCIAL_POOL[(start + k) % SOCIAL_POOL.length]);
  };

  // One source per (competitor, channel) — the "tracked accounts" we monitor.
  const sources = competitors.flatMap((competitor, idx) =>
    competitorChannels(competitor, idx).map(channelName => ({
      source_type: 'social',
      source_url: inferSourceUrl(competitor, channelName),
      source_handle: competitor.handle || competitor.name,
      competitor_name: competitor.name,
      channel: channelName,
      config_json: {
        derived_from: 'branding_bio',
        competitor_tier: competitor.tier || 'Mid',
        positioning: competitor.positioning || '',
      },
    }))
  );

  // Top posts — 2 per competitor across their channels, so the table compares brands side by side.
  const topPieces = competitors.flatMap((competitor, cIdx) => {
    const persona = personas[cIdx % Math.max(personas.length, 1)] || { role: 'decision makers', pains: '', triggers: '' };
    const pain = firstWords(persona.pains || persona.triggers || data.identity.mission, 10);
    const trigger = firstWords(persona.triggers || persona.pains || data.identity.tagline, 7);
    const channels = competitorChannels(competitor, cIdx);
    const tierBoost = competitor.tier === 'Premium' ? 1.6 : competitor.tier === 'Low' ? 0.55 : 1;
    return channels.slice(0, 2).map((channelName, pIdx) => {
      const k = cIdx * 2 + pIdx;
      const isVideo = /tiktok|youtube|instagram/i.test(channelName);
      const titles = [
        `${competitor.name}: cómo abordan ${pain} en ${channelName}`,
        `${competitor.name} muestra ${trigger} desde adentro (${channelName})`,
      ];
      return {
        title: titles[pIdx % titles.length],
        competitor_name: competitor.name,
        channel: channelName,
        url: inferSourceUrl(competitor, channelName),
        metrics_json: {
          likes:    Math.round((900 + k * 320)  * tierBoost),
          comments: Math.round((24  + k * 11)   * tierBoost),
          shares:   Math.round((18  + k * 8)    * tierBoost),
          views:    Math.round((isVideo ? 24000 : 12000) + k * 6400 * tierBoost),
        },
        analysis_json: {
          derived_from: 'branding_bio',
          theme: pain,
          format: isVideo ? 'Short-form video' : 'Carousel / image post',
          hook_type: trigger,
          probable_performance_reason: `${competitor.name} conecta el dolor de ${persona.role} con una promesa visible en ${channelName}.`,
          relevance_to_brand: `${brandName} puede contestar en el mismo canal con tono propio y prueba concreta.`,
        },
        scraped_at: minutesAgo(20 + k * 17),
      };
    });
  });

  // Snapshot per competitor — aggregates engagement, posts and top channel for the per-card view.
  const snapshots = competitors.map((competitor, idx) => {
    const pieces = topPieces.filter(p => p.competitor_name === competitor.name);
    const totalEng = pieces.reduce((s, p) => s + totalEngagement(p.metrics_json), 0);
    const channelMix = pieces.reduce((acc, p) => {
      acc[p.channel] = (acc[p.channel] || 0) + totalEngagement(p.metrics_json);
      return acc;
    }, {});
    const topChannel = Object.entries(channelMix).sort((a, b) => b[1] - a[1])[0]?.[0] || competitorChannels(competitor, idx)[0];
    const cadence = competitor.tier === 'Premium' ? '5–6 posts/week' : competitor.tier === 'Low' ? '1–2 posts/week' : '3–4 posts/week';
    return {
      name: competitor.name,
      tier: competitor.tier || 'Mid',
      positioning: competitor.positioning || '',
      diff: competitor.diff || '',
      accounts: competitorChannels(competitor, idx).length,
      posts: pieces.length,
      total_engagement: totalEng,
      top_channel: topChannel,
      cadence,
    };
  });

  // Channel mix across competitors — for the doughnut/stacked chart.
  const channelTotals = topPieces.reduce((acc, p) => {
    acc[p.channel] = (acc[p.channel] || 0) + totalEngagement(p.metrics_json);
    return acc;
  }, {});

  const insightSummary = {
    insight_type: 'competitors_summary',
    title: `${competitors.length} competidor${competitors.length === 1 ? '' : 'es'} en ${industry}`,
    channel: '—',
    score: 0,
    payload_json: {
      insight: `${brandName} compite con ${competitors.length} marcas; mayor concentración de engagement: ${Object.keys(channelTotals).sort((a, b) => channelTotals[b] - channelTotals[a])[0] || '—'}.`,
      data: { channel_totals: channelTotals },
    },
    created_at: now,
  };

  return {
    sources,
    topPieces,
    snapshots,
    channelTotals,
    insights: [insightSummary],
    latestRun: {
      run_type: 'profile_derived_research',
      status: 'completed',
      started_at: profileUpdatedAt || minutesAgo(15),
      finished_at: profileUpdatedAt || now,
    },
  };
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

async function hydrateCompetitorsView() {
  try {
    let profileRow = null, dbInsights = [], dbTopPieces = [], dbSources = [], dbLatestRun = null;
    if (brandKitData.brandId) {
      try {
        [profileRow, dbInsights, dbTopPieces, dbSources, dbLatestRun] = await Promise.all([
          fetchBrandProfile(brandKitData.brandId),
          fetchContentInsights(brandKitData.brandId),
          fetchTopCompetitorContent(brandKitData.brandId),
          fetchResearchSources(brandKitData.brandId),
          fetchLatestResearchRun(brandKitData.brandId),
        ]);
      } catch (err) {
        console.warn('[CompetitorsView] Supabase fetch failed, falling back to local brandKit data:', err);
      }
    }

    // Pull the brand's own social analyses so the channel comparison has a "You" row
    // even when the user jumps here without visiting SocialMediaBios first.
    if (!socialBiosData.channels || !socialBiosData.channels.length || socialBiosData.isMock) {
      try {
        const stored = await fetchSocialBios(brandKitData.brandId);
        if (stored && stored.channels?.length) {
          socialBiosData.lastScannedAt = stored.scanned_at;
          socialBiosData.channels = stored.channels;
          socialBiosData.isMock = false;
        }
      } catch (_) { /* leave whatever socialBiosData had before */ }
    }

    const data = normalizeProfileData(profileRow?.data_json);
    const derived = deriveCompetitorsViewFromProfile(data, profileRow?.updated_at);
    const competitors = Array.isArray(data.competitors) ? data.competitors.filter(c => c?.name && !/^new competitor$/i.test(c.name)) : [];
    const brandName   = data.identity?.company_name || profileRow?.brand?.name || 'Brand';

    // Only show DB data for competitors currently defined in Branding Bio — ignore stale scraped data.
    const currentNames = new Set(competitors.map(c => c.name));
    const filteredDbTop = currentNames.size ? dbTopPieces.filter(p => currentNames.has(p.competitor_name)) : dbTopPieces;
    const filteredDbSrc = currentNames.size ? dbSources.filter(s => currentNames.has(s.competitor_name)) : dbSources;

    // Prefer real scraped/analyzed data when Supabase has rows; fall back to synthetic.
    const topPieces = filteredDbTop.length ? filteredDbTop : derived.topPieces;
    const sources   = filteredDbSrc.length ? filteredDbSrc : derived.sources;
    const snapshots = derived.snapshots || [];
    const latestRun = derived.latestRun || dbLatestRun;

    // Header tag — "<N> competitors tracked"
    setText('cv-brand-tag', competitors.length
      ? `${competitors.length} competitor${competitors.length === 1 ? '' : 's'} · ${sources.length} ${sources.length === 1 ? 'channel' : 'channels'}`
      : '0 competitors');

    // Sub-header — last sync + tracked channels
    const lastSync = latestRun?.finished_at || latestRun?.started_at;
    setText('cv-last-sync', `Last sync: ${lastSync ? fmtRelativeTime(lastSync) : 'never'}`);

    const channelSet = new Set(sources.map(s => s.channel).filter(Boolean));
    setText('cv-sources-line',
      channelSet.size ? `Tracked channels: ${[...channelSet].join(', ')} · derived from Branding Bio` : 'Tracked channels: none configured');

    // Stats
    const topPerformer = snapshots.slice().sort((a, b) => b.total_engagement - a.total_engagement)[0];
    setText('cv-stat-competitors', competitors.length ? String(competitors.length) : '—');
    setText('cv-stat-accounts',    sources.length     ? String(sources.length)     : '—');
    setText('cv-stat-top',         topPerformer       ? topPerformer.name          : '—');
    setText('cv-stat-posts',       topPieces.length   ? String(topPieces.length)   : '—');

    // Top Posts per Competitor — sorted desc by engagement, capped at 8 rows
    const topTbody = document.getElementById('cv-top-pieces-tbody');
    if (topTbody) {
      if (!topPieces.length) {
        topTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">
          No competitor posts analyzed yet — execute "Sync to Pipeline" in Branding Bio, then click <strong>Run Comparison</strong> to populate.
        </td></tr>`;
      } else {
        const sorted = [...topPieces].sort((a, b) =>
          totalEngagement(b.metrics_json) - totalEngagement(a.metrics_json));
        topTbody.innerHTML = sorted.slice(0, 8).map(p => {
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
          const title = p.title || '(untitled)';
          const titleCell = p.url
            ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener" style="color:var(--text-main); text-decoration:none; display:inline-flex; align-items:center; gap:4px;">${escapeHtml(title)}<i data-lucide="external-link" style="width:11px; flex-shrink:0; color:#06B6D4;"></i></a>`
            : escapeHtml(title);
          return `<tr>
            <td><strong>${escapeHtml(p.competitor_name || '—')}</strong></td>
            <td style="max-width:380px; font-size:12px;">${titleCell}</td>
            <td><span class="lm-tag" style="${channelTagStyle(channel)}">${escapeHtml(channel)}</span></td>
            <td><strong style="color:#10B981">${fmtCompactNumber(eng)}</strong></td>
            <td style="font-size:12px; color:var(--text-muted)">${escapeHtml(whyShort)}</td>
          </tr>`;
        }).join('');
      }
    }

    // Competitor Snapshot cards — one per competitor with engagement, cadence, top channel
    const snapContainer = document.getElementById('cv-snapshot-container');
    if (snapContainer) {
      if (!snapshots.length) {
        snapContainer.innerHTML = `<div style="grid-column: 1 / -1; padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">
          No competitors mapped yet — add them in <strong>Branding Bio</strong> and they’ll appear here.
        </div>`;
      } else {
        const tierColor = { Premium: '#6366F1', Mid: '#06B6D4', Low: '#94A3B8' };
        const topEng = Math.max(...snapshots.map(s => s.total_engagement), 1);
        snapContainer.innerHTML = snapshots.map(s => {
          const pct = Math.round((s.total_engagement / topEng) * 100);
          const color = tierColor[s.tier] || '#94A3B8';
          return `<div style="padding:14px; border:1px solid var(--border); border-radius:8px; background:white;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <strong style="font-size:14px;">${escapeHtml(s.name)}</strong>
              <span class="lm-tag" style="background:${color}1A;color:${color}">${escapeHtml(s.tier)}</span>
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px; min-height:28px;">${escapeHtml((s.positioning || '—').slice(0, 90))}</div>
            <div style="height:6px; background:#F3F4F6; border-radius:3px; overflow:hidden; margin-bottom:8px;">
              <div style="height:100%; width:${pct}%; background:${color};"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted);">
              <span>${fmtCompactNumber(s.total_engagement)} eng.</span>
              <span>${s.posts} post${s.posts === 1 ? '' : 's'}</span>
              <span>${s.accounts} ${s.accounts === 1 ? 'account' : 'accounts'}</span>
            </div>
            <div style="margin-top:8px; font-size:11px;">
              <span style="color:var(--text-muted);">Top:</span>
              <span class="lm-tag" style="${channelTagStyle(s.top_channel)}">${escapeHtml(s.top_channel)}</span>
              <span style="color:var(--text-muted); margin-left:6px;">· ${escapeHtml(s.cadence)}</span>
            </div>
          </div>`;
        }).join('');
      }
    }

    // Competitor Landscape (positioning bar)
    const sovContainer = document.getElementById('cv-sov-container');
    if (sovContainer) {
      const tierWidth = { Premium: 95, Mid: 60, Low: 35 };
      const tierColor = { Premium: '#6366F1', Mid: '#06B6D4', Low: '#94A3B8' };
      const youColor = '#10B981';
      const rows = [
        { name: brandName, tier: '—', positioning: data.identity?.tagline || data.identity?.mission?.slice(0, 90) || '', self: true, color: youColor, width: 50 },
        ...competitors.map(c => ({
          name: c.name || '—',
          tier: c.tier || 'Mid',
          positioning: c.positioning || '',
          diff: c.diff || '',
          self: false,
          color: tierColor[c.tier] || '#94A3B8',
          width: tierWidth[c.tier] || 50,
        })),
      ];

      if (competitors.length === 0) {
        sovContainer.innerHTML = `<div style="padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">
          No competitors mapped yet — add them in <strong>Branding Bio</strong>.
        </div>`;
      } else {
        sovContainer.innerHTML = rows.map(r => `
          <div style="display:grid; grid-template-columns:180px 1fr 70px; gap:12px; align-items:center; padding:10px 0; border-bottom:1px solid var(--border);">
            <div style="display:flex; gap:8px; align-items:center; font-size:13px; font-weight:${r.self?'700':'500'};">
              <span style="width:8px;height:8px;border-radius:50%;background:${r.color};flex-shrink:0;"></span>
              <span>${escapeHtml(r.name)}${r.self?' <span style="font-size:10px; color:var(--ai-accent);">(you)</span>':''}</span>
            </div>
            <div>
              <div style="height:8px; background:#F3F4F6; border-radius:4px; overflow:hidden;">
                <div style="height:100%; width:${r.width}%; background:${r.color};"></div>
              </div>
              <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${escapeHtml(r.positioning || '—')}</div>
            </div>
            <div style="font-size:11px; text-align:right; color:var(--text-muted); font-weight:600;">${escapeHtml(r.tier)}</div>
          </div>
        `).join('');
      }
    }

    const sovInsight = document.getElementById('cv-sov-insight');
    if (sovInsight) {
      if (competitors.length) {
        const premiumCount = competitors.filter(c => c.tier === 'Premium').length;
        const firstDiff = competitors[0]?.diff || '';
        const diffShort = firstDiff.length > 160 ? firstDiff.slice(0, 160) + '…' : firstDiff;
        sovInsight.innerHTML = `<strong>💡 Insight:</strong> ${premiumCount} premium competitor${premiumCount===1?'':'s'} in the space. ${escapeHtml(diffShort)}`;
      } else {
        sovInsight.innerHTML = `<strong>💡 Insight:</strong> Map your competitors in Branding Bio to surface positioning gaps.`;
      }
    }

    // Tracked Social Accounts — grouped by competitor
    const srcContainer = document.getElementById('cv-sources-container');
    if (srcContainer) {
      if (!sources.length) {
        srcContainer.innerHTML = `<div style="grid-column: 1 / -1; padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">
          No tracked accounts yet. Add competitor URLs in Branding Bio to start monitoring.
        </div>`;
      } else {
        const grouped = sources.reduce((acc, s) => {
          const key = s.competitor_name || s.source_handle || '—';
          (acc[key] = acc[key] || []).push(s);
          return acc;
        }, {});
        srcContainer.innerHTML = Object.entries(grouped).map(([competitor, accounts]) => `
          <div style="padding:10px 12px; border:1px solid var(--border); border-radius:6px;">
            <div style="font-size:12px; font-weight:700; margin-bottom:6px;">${escapeHtml(competitor)}</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              ${accounts.map(a => `<span class="lm-tag" style="${channelTagStyle(a.channel)}">${escapeHtml(a.channel || '—')}</span>`).join('')}
            </div>
          </div>
        `).join('');
      }
    }

    // Charts — driven by the actual snapshot/channel data we just computed.
    if (typeof Chart !== 'undefined') {
      const chartOpts = { responsive: true, maintainAspectRatio: false };
      const palette = ['#06B6D4','#0369A1','#22C55E','#EF4444','#F59E0B','#6366F1','#EC4899','#94A3B8'];

      const fmt = document.getElementById('mpFormatChart');
      if (fmt && snapshots.length) {
        if (chartInstances['mpFormatChart']) chartInstances['mpFormatChart'].destroy();
        const sorted = [...snapshots].sort((a, b) => b.total_engagement - a.total_engagement);
        chartInstances['mpFormatChart'] = new Chart(fmt, {
          type: 'bar',
          data: {
            labels: sorted.map(s => s.name),
            datasets: [{
              label: 'Total engagement (30d)',
              data: sorted.map(s => s.total_engagement),
              backgroundColor: sorted.map((_, i) => palette[i % palette.length]),
              borderRadius: 4,
            }],
          },
          options: { ...chartOpts, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        });
      }

      const thm = document.getElementById('mpThemeChart');
      const channelEntries = Object.entries(derived.channelTotals || {}).sort((a, b) => b[1] - a[1]);
      if (thm && channelEntries.length) {
        if (chartInstances['mpThemeChart']) chartInstances['mpThemeChart'].destroy();
        chartInstances['mpThemeChart'] = new Chart(thm, {
          type: 'doughnut',
          data: {
            labels: channelEntries.map(([c]) => c),
            datasets: [{
              data: channelEntries.map(([, v]) => v),
              backgroundColor: channelEntries.map((_, i) => palette[i % palette.length]),
            }],
          },
          options: { ...chartOpts, plugins: { legend: { position: 'right', labels: { font: { size: 11 } } } } },
        });
      }
    }

    // Channel-by-channel comparison: brand (from social_media_analyses) vs each competitor (from competitor_content)
    renderCompetitorsViewByChannel(topPieces, snapshots, sources, socialBiosData.channels || [], competitors, brandName);

    if (typeof lucide !== 'undefined') lucide.createIcons();
  } catch (err) {
    console.error('[CompetitorsView hydrate] error:', err);
  }
}

// ── New: Render CompetitorsViews organized by channel ──
function renderCompetitorsViewByChannel(topPieces, snapshots, sources, brandChannels, competitors, brandName) {
  try {
    const container = document.getElementById('cv-channel-content-container');
    const tabsContainer = document.getElementById('cv-channel-tabs-container');

    if (!container || !tabsContainer) {
      console.warn('[CV] Missing containers');
      return;
    }

    // Get only channels the brand actually has
    const brandChannelNames = new Set((brandChannels || []).map(c => c.name).filter(Boolean));
    console.log('[CV] Brand channels:', [...brandChannelNames]);

    if (brandChannelNames.size === 0) {
      container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--text-muted);">
        Add social channels to Branding Bio and execute "Sync to Pipeline" to see competitor analysis.
      </div>`;
      tabsContainer.innerHTML = '';
      return;
    }

  // Group competitor posts by channel
  const postsByChannel = {};
  for (const p of (topPieces || [])) {
    if (!p.channel || p.channel === 'Website' || !brandChannelNames.has(p.channel)) continue;
    (postsByChannel[p.channel] = postsByChannel[p.channel] || []).push(p);
  }

    // Order channels
    const channelOrder = ['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'YouTube', 'X/Twitter'];
    const orderedChannels = [...brandChannelNames].sort((a, b) => {
      const ai = channelOrder.indexOf(a); const bi = channelOrder.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    if (orderedChannels.length === 0) {
      container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--text-muted);">No data to display yet.</div>`;
      tabsContainer.innerHTML = '';
      return;
    }

    // Render tabs
    const tabsHtml = orderedChannels.map((ch, idx) => {
    const icon = { Instagram: '📸', TikTok: '🎵', Facebook: '👥', LinkedIn: '💼', YouTube: '▶️', 'X/Twitter': '🐦' }[ch] || '📱';
    return `<button class="cv-channel-tab ${idx === 0 ? 'active' : ''}" onclick="selectCvTab('${ch}')" style="padding:12px 18px; background:${idx === 0 ? '#06B6D4' : 'white'}; color:${idx === 0 ? 'white' : 'var(--text-main)'}; border:none; border-bottom:${idx === 0 ? '3px solid #06B6D4' : '1px solid var(--border)'}; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.2s;">
      <span>${icon}</span> ${ch}
    </button>`;
  }).join('');

    const tabsDiv = tabsContainer.querySelector('div');
    if (tabsDiv) {
      tabsDiv.innerHTML = tabsHtml;
    } else {
      tabsContainer.innerHTML = `<div style="display:flex; flex-wrap:wrap; gap:0;">${tabsHtml}</div>`;
    }

  // Render content sections (all at once, but show/hide via JS)
  const contentHtml = orderedChannels.map((channel, idx) => {
    const posts = postsByChannel[channel] || [];
    const topPost = posts.length > 0 ? posts.sort((a, b) => {
      try {
        return totalEngagement(b.metrics_json) - totalEngagement(a.metrics_json);
      } catch (e) {
        return 0;
      }
    })[0] : null;

    // Group posts by competitor
    const postsByCompetitor = {};
    for (const p of posts) {
      const comp = p.competitor_name || 'Unknown';
      (postsByCompetitor[comp] = postsByCompetitor[comp] || []).push(p);
    }

    const channelColor = { Instagram: '#E4405F', TikTok: '#010101', Facebook: '#1877F2', LinkedIn: '#0A66C2', YouTube: '#FF0000', 'X/Twitter': '#000000' }[channel] || '#666';

    return `<div class="cv-channel-section" data-channel="${channel}" style="display:${idx === 0 ? 'block' : 'none'}; animation:fadeIn 0.2s;">

      <!-- Channel Header -->
      <div style="padding:20px; background:linear-gradient(135deg, ${channelColor}15 0%, ${channelColor}08 100%); border-radius:12px; margin-bottom:20px; border-left:4px solid ${channelColor};">
        <h3 style="margin:0 0 8px 0; font-size:18px; font-weight:700; color:var(--text-main);">${channel}</h3>
        <p style="margin:0; font-size:13px; color:var(--text-muted);">${posts.length} post${posts.length !== 1 ? 's' : ''} analyzed across ${Object.keys(postsByCompetitor).length} competitor${Object.keys(postsByCompetitor).length !== 1 ? 's' : ''}</p>
      </div>

      <!-- Top Post of Channel -->
      ${topPost ? `<div class="card" style="margin-bottom:20px; border-top:3px solid ${channelColor};">
        <h4 style="margin:0 0 12px 0; font-size:14px; font-weight:600;"><i data-lucide="flame" style="width:14px; vertical-align:middle; margin-right:6px; color:${channelColor};"></i>Top Post on ${channel}</h4>
        <div style="padding:12px; background:#FAFBFC; border-radius:8px; margin-bottom:12px;">
          <div style="display:flex; align-items:flex-start; gap:12px;">
            <div style="flex:1;">
              <p style="margin:0 0 6px 0; font-weight:600; color:var(--text-main); font-size:13px;">${escapeHtml(topPost.competitor_name)}</p>
              <p style="margin:0 0 8px 0; font-size:13px; color:var(--text-muted); line-height:1.4;">${escapeHtml(topPost.title || topPost.opening_hook || 'Untitled')}</p>
              <div style="display:flex; gap:16px; font-size:12px; color:var(--text-muted); margin-bottom:10px;">
                <span>❤️ ${fmtCompactNumber(topPost.metrics_json?.likes || 0)} likes</span>
                <span>💬 ${fmtCompactNumber(topPost.metrics_json?.comments || 0)} comments</span>
                <span>↗️ ${fmtCompactNumber(topPost.metrics_json?.shares || 0)} shares</span>
              </div>
              ${topPost.url ? `<a href="${escapeHtml(topPost.url)}" target="_blank" rel="noopener" style="color:#06B6D4; text-decoration:none; font-size:12px; font-weight:600; display:inline-flex; align-items:center; gap:4px;">Ver post <i data-lucide="external-link" style="width:11px;"></i></a>` : ''}
            </div>
          </div>
        </div>
      </div>` : ''}

      <!-- Competitors Side-by-Side -->
      <div class="card">
        <h4 style="margin:0 0 16px 0; font-size:14px; font-weight:600;"><i data-lucide="users" style="width:14px; vertical-align:middle; margin-right:6px;"></i>Competitors on ${channel}</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
          ${Object.entries(postsByCompetitor).map(([compName, compPosts]) => {
            const topCompPost = compPosts.sort((a, b) => totalEngagement(b.metrics_json) - totalEngagement(a.metrics_json))[0];
            const avgEngagement = compPosts.reduce((sum, p) => sum + totalEngagement(p.metrics_json), 0) / compPosts.length;
            return `<div style="padding:14px; border:1px solid var(--border); border-radius:10px; background:white; transition:all 0.2s;">
              <h5 style="margin:0 0 10px 0; font-size:13px; font-weight:700; color:var(--text-main);">${escapeHtml(compName)}</h5>
              <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px; display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                <div><strong>Posts:</strong> ${compPosts.length}</div>
                <div><strong>Avg Eng:</strong> ${fmtCompactNumber(avgEngagement)}</div>
              </div>
              ${topCompPost ? `<div style="padding:10px; background:#F8FAFC; border-radius:6px; border-left:3px solid ${channelColor}; margin-bottom:10px;">
                <p style="margin:0 0 6px 0; font-size:12px; font-weight:600; color:var(--text-main);">${escapeHtml(topCompPost.title?.slice(0, 60) || 'Top post')}</p>
                <div style="display:flex; gap:8px; font-size:10px; color:var(--text-muted);">
                  <span>❤️ ${topCompPost.metrics_json?.likes || 0}</span>
                  <span>💬 ${topCompPost.metrics_json?.comments || 0}</span>
                </div>
                ${topCompPost.url ? `<a href="${escapeHtml(topCompPost.url)}" target="_blank" rel="noopener" style="color:#06B6D4; text-decoration:none; font-size:11px; font-weight:600; margin-top:6px; display:inline-block;">Ver →</a>` : ''}
              </div>` : ''}
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${compPosts.map(p => {
                  const engRate = ((totalEngagement(p.metrics_json) / Math.max(p.metrics_json?.impressions || 1000, 1)) * 100).toFixed(1);
                  return `<span style="font-size:10px; padding:3px 8px; background:${channelColor}15; color:${channelColor}; border-radius:12px; font-weight:600;">${p.channel || 'post'}</span>`;
                }).slice(0, 3).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Comparison: You vs Competitors -->
      <div class="card" style="margin-top:20px;">
        <h4 style="margin:0 0 12px 0; font-size:14px; font-weight:600;"><i data-lucide="bar-chart-2" style="width:14px; vertical-align:middle; margin-right:6px;"></i>You vs Competitors</h4>
        <table class="lm-table" style="margin-top:10px;">
          <thead>
            <tr style="background:#FAFBFC;">
              <th style="text-align:left; font-weight:600; padding:12px;">Account</th>
              <th>Posts</th>
              <th>Avg Engagement</th>
              <th>Top Post</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:2px solid var(--border); font-weight:600;">
              <td style="padding:12px;"><span style="color:#10B981; font-weight:700;">You</span> ${brandName}</td>
              <td style="text-align:center; color:var(--text-muted);">—</td>
              <td style="text-align:center; color:var(--text-muted);">—</td>
              <td style="text-align:center; color:var(--text-muted);">—</td>
            </tr>
            ${Object.entries(postsByCompetitor).map(([compName, compPosts]) => {
              const avgEngagement = compPosts.reduce((sum, p) => sum + totalEngagement(p.metrics_json), 0) / compPosts.length;
              const topCompPost = compPosts.sort((a, b) => totalEngagement(b.metrics_json) - totalEngagement(a.metrics_json))[0];
              return `<tr>
                <td style="padding:12px;">${escapeHtml(compName)}</td>
                <td style="text-align:center; font-size:13px;">${compPosts.length}</td>
                <td style="text-align:center; font-weight:600; color:#06B6D4;">${fmtCompactNumber(avgEngagement)}</td>
                <td style="text-align:center; font-size:12px;">
                  ${topCompPost && topCompPost.url ? `<a href="${escapeHtml(topCompPost.url)}" target="_blank" rel="noopener" style="color:#06B6D4; text-decoration:none; font-weight:600;">Ver post</a>` : '—'}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

    </div>`;
  }).join('');

    container.innerHTML = contentHtml;

    // Add fade-in animation
    const style = document.createElement('style');
    style.textContent = `@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`;
    document.head.appendChild(style);
  } catch (err) {
    console.error('[CV renderByChannel] error:', err);
    const container = document.getElementById('cv-channel-content-container');
    if (container) {
      container.innerHTML = `<div style="padding:40px; text-align:center; color:#EF4444;">
        Error loading competitor analysis: ${err.message}
      </div>`;
    }
  }
}

function selectCvTab(channelName) {
  // Hide all sections
  document.querySelectorAll('.cv-channel-section').forEach(el => el.style.display = 'none');
  // Show selected section
  const section = document.querySelector(`[data-channel="${channelName}"]`);
  if (section) section.style.display = 'block';
  // Update tab styles
  document.querySelectorAll('.cv-channel-tab').forEach(tab => {
    const isActive = tab.textContent.includes(channelName);
    tab.style.background = isActive ? '#06B6D4' : 'white';
    tab.style.color = isActive ? 'white' : 'var(--text-main)';
    tab.style.borderBottom = isActive ? '3px solid #06B6D4' : '1px solid var(--border)';
  });
}

// Selected channel for the comparison card. Persists across hydrates within a session.
let cvSelectedChannel = null;

function selectCvChannel(name) {
  cvSelectedChannel = name;
  // Re-render only the comparison section — no need to re-fetch everything.
  // We can't easily reach `topPieces` here, so we re-hydrate the view.
  hydrateCompetitorsView();
}

function renderCompetitorsChannelComparison(topPieces) {
  const tabsEl = document.getElementById('cv-channel-tabs');
  const bodyEl = document.getElementById('cv-channel-comparison');
  if (!tabsEl || !bodyEl) return;

  // Brand's own channels come from social_media_analyses (loaded by SocialMediaBios) —
  // we read the in-memory snapshot so this view doesn't double-fetch.
  const brandChannels = (typeof socialBiosData !== 'undefined' && socialBiosData?.channels) || [];
  const brandByChannel = {};
  for (const ch of brandChannels) brandByChannel[ch.name] = ch;

  // Group competitor posts by channel.
  const compByChannel = {};
  for (const p of (topPieces || [])) {
    const ch = p.channel;
    if (!ch || ch === 'Website') continue;
    (compByChannel[ch] = compByChannel[ch] || []).push(p);
  }

  // Union of channels with data on either side.
  const allChannels = new Set([...Object.keys(brandByChannel), ...Object.keys(compByChannel)]);
  const order = ['LinkedIn', 'Instagram', 'TikTok', 'YouTube', 'X/Twitter'];
  const channels = [...allChannels].sort((a, b) => {
    const ai = order.indexOf(a); const bi = order.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  if (!channels.length) {
    tabsEl.innerHTML = '';
    bodyEl.innerHTML = `<div style="padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">
      No channel data yet — add your social handles and competitor info in <strong>Branding Bio</strong>, then click <strong>Sync to Pipeline</strong> to analyze everything automatically.
    </div>`;
    return;
  }

  if (!cvSelectedChannel || !channels.includes(cvSelectedChannel)) {
    cvSelectedChannel = channels[0];
  }

  // Tabs
  tabsEl.innerHTML = channels.map(ch => {
    const isActive = ch === cvSelectedChannel;
    const style = isActive
      ? 'background:#06B6D4; color:white; border:1px solid #06B6D4;'
      : 'background:white; color:var(--text-muted); border:1px solid var(--border);';
    return `<button onclick="selectCvChannel('${ch.replace(/'/g, "\\'")}')" style="${style} padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">${escapeHtml(ch)}</button>`;
  }).join('');

  // Body: one row per account (You + each competitor) on the selected channel.
  const ch = cvSelectedChannel;
  const brand = brandByChannel[ch];
  const compPosts = (compByChannel[ch] || []).slice().sort((a, b) =>
    totalEngagement(b.metrics_json) - totalEngagement(a.metrics_json));

  // Best post per competitor for this channel.
  const bestByCompetitor = {};
  for (const p of compPosts) {
    const key = p.competitor_name || '—';
    if (!bestByCompetitor[key]) bestByCompetitor[key] = p;
  }

  const brandRow = brand ? {
    isYou: true,
    name: brandKitData.name || 'You',
    handle: brand.handle || '',
    profileUrl: brand.profileUrl || '',
    score: brand.avgEngagementRate != null ? `ER ${brand.avgEngagementRate}%` : '—',
    topPost: (brand.topPosts || [])[0] || null,
  } : null;

  const competitorRows = Object.entries(bestByCompetitor).map(([name, post]) => ({
    isYou: false,
    name,
    handle: '',
    profileUrl: '',
    score: fmtCompactNumber(totalEngagement(post.metrics_json)) + ' eng.',
    topPost: post,
  }));

  // Sort competitors by raw engagement of their best post, biggest first.
  competitorRows.sort((a, b) =>
    totalEngagement(b.topPost?.metrics_json) - totalEngagement(a.topPost?.metrics_json));

  const rows = brandRow ? [brandRow, ...competitorRows] : competitorRows;

  if (!rows.length) {
    bodyEl.innerHTML = `<div style="padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">
      No data for ${escapeHtml(ch)} yet.
    </div>`;
    return;
  }

  bodyEl.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
      ${rows.map(r => {
        const border = r.isYou ? '#10B981' : '#06B6D4';
        const tag = r.isYou
          ? `<span class="lm-tag" style="background:#ECFDF5; color:#065F46;">You</span>`
          : `<span class="lm-tag" style="background:#EFF6FF; color:#0369A1;">Competitor</span>`;
        const post = r.topPost;
        const postUrl = post?.url || '';
        const snippet = post?.snippet || post?.title || '(no top post yet)';
        const snippetShort = String(snippet).slice(0, 140) + (String(snippet).length > 140 ? '…' : '');
        const why = post?.whyItWorked
          || (post?.analysis_json && (typeof post.analysis_json === 'string'
                ? (() => { try { return JSON.parse(post.analysis_json).probable_performance_reason; } catch { return ''; } })()
                : post.analysis_json.probable_performance_reason))
          || '';
        const whyShort = why ? String(why).slice(0, 110) + (String(why).length > 110 ? '…' : '') : '';
        const linkHtml = postUrl
          ? `<a href="${escapeHtml(postUrl)}" target="_blank" rel="noopener" style="color:${border}; font-size:11px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:3px; margin-top:6px;">Ver post<i data-lucide="external-link" style="width:11px;"></i></a>`
          : '';
        return `
          <div style="padding:14px; border:1px solid var(--border); border-top:3px solid ${border}; border-radius:8px; background:white;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; gap:8px;">
              <strong style="font-size:14px;">${escapeHtml(r.name)}</strong>
              ${tag}
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px; min-height:14px;">
              ${r.handle ? escapeHtml(r.handle) : ''}
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-bottom:6px; letter-spacing:0.5px; text-transform:uppercase; font-weight:600;">Top post</div>
            <div style="font-size:13px; color:var(--text-main); line-height:1.4;">${escapeHtml(snippetShort)}</div>
            ${whyShort ? `<div style="font-size:11px; color:#9333EA; margin-top:6px;">↳ ${escapeHtml(whyShort)}</div>` : ''}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top:1px solid #F3F4F6;">
              <span style="font-size:12px; font-weight:700; color:${border};">${escapeHtml(r.score)}</span>
              ${linkHtml}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ── HookMiner hydration ────────────────────────────────
async function fetchHookLibrary(brandId, channelFilter) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    order: 'score.desc',
    select: 'hook_text,framework,channel,score,evidence_json,created_at'
  });
  if (channelFilter) params.set('channel', `eq.${channelFilter}`);
  return supabaseGet(`hook_library?${params}`);
}

const FRAMEWORK_STYLES = {
  'Contrarian':      { bg: '#FEE2E2', fg: '#991B1B', border: '#EF4444', surface: '#FEF2F8',
                       desc: 'Cuestiona la práctica común. Patrón: "Dejá de [X]" / "No, [thing] no funciona"' },
  'Specific Number': { bg: '#EFF6FF', fg: '#1D4ED8', border: '#3B82F6', surface: '#EFF6FF',
                       desc: 'Cifras concretas. Patrón: "X bajó de Y% a Z%" / "$N invertidos en M"' },
  'Persona-Aware':   { bg: '#DBEAFE', fg: '#1E40AF', border: '#1D4ED8', surface: '#DBEAFE',
                       desc: 'Llama al lector por rol. Patrón: "Si dirigís X..." / "Hola Martín..."' },
  'How-We-Do-X':     { bg: '#FEF3C7', fg: '#B45309', border: '#F59E0B', surface: '#FFF7ED',
                       desc: 'Operacional transparente. Patrón: "Cómo [cliente] hizo [X] en [tiempo]"' },
  'Open-Loop':       { bg: '#F3E8FF', fg: '#6B21A8', border: '#6B21A8', surface: '#F3E8FF',
                       desc: 'Curiosity gap. Patrón: "La pregunta que..." / "El error que..."' },
  'Imperative':      { bg: '#F3F4F6', fg: '#374151', border: '#374151', surface: '#F3F4F6',
                       desc: 'Verbo de acción directo. Patrón: "Cerrá X" / "Mostrale Y"' },
};

function frameworkStyle(name) {
  return FRAMEWORK_STYLES[name] || { bg: '#F3F4F6', fg: '#374151', border: '#94A3B8', surface: '#F8FAFC', desc: '' };
}

function frameworkTag(name) {
  const s = frameworkStyle(name);
  return `<span class="lm-tag" style="background:${s.bg};color:${s.fg}">${escapeHtml(name)}</span>`;
}

async function hydrateHookMinerView() {
  try {
    const filterEl = document.getElementById('hm-channel-filter');
    const channelFilter = filterEl?.value || '';

    // Always fetch the full set for stats; filtered set just for the table
    const [allHooks, filteredHooks] = await Promise.all([
      fetchHookLibrary(brandKitData.brandId, ''),
      channelFilter ? fetchHookLibrary(brandKitData.brandId, channelFilter) : Promise.resolve(null),
    ]);
    const tableHooks = filteredHooks || allHooks;

    // Stats
    const totalHooks = allHooks.length;
    const frameworkCounts = allHooks.reduce((acc, h) => {
      acc[h.framework] = (acc[h.framework] || 0) + 1;
      return acc;
    }, {});
    const frameworks = Object.keys(frameworkCounts);
    const avgScore = totalHooks
      ? Math.round(allHooks.reduce((s, h) => s + (Number(h.score) || 0), 0) / totalHooks)
      : 0;
    const channelCounts = allHooks.reduce((acc, h) => {
      if (h.channel) acc[h.channel] = (acc[h.channel] || 0) + 1;
      return acc;
    }, {});
    const topChannel = Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    setText('hm-brand-tag', totalHooks ? `${totalHooks} hooks · ${frameworks.length} frameworks` : 'No hooks yet');
    setText('hm-stat-hooks',      totalHooks ? String(totalHooks) : '—');
    setText('hm-stat-frameworks', frameworks.length ? String(frameworks.length) : '—');
    setText('hm-stat-avg-score',  totalHooks ? String(avgScore) : '—');
    setText('hm-stat-top-channel', topChannel);

    // Sub-header
    const latestCreatedAt = allHooks.reduce((max, h) => {
      const t = h.created_at ? new Date(h.created_at).getTime() : 0;
      return t > max ? t : max;
    }, 0);
    setText('hm-last-refresh', latestCreatedAt ? `Last refresh: ${fmtRelativeTime(new Date(latestCreatedAt).toISOString())}` : 'Last refresh: never');
    setText('hm-corpus-line', totalHooks
      ? `Derived from ${totalHooks} mined hooks across ${Object.keys(channelCounts).length} channels`
      : 'No corpus yet — click Mine Hooks to start');

    // Library table
    setText('hm-library-title', `Hook Library — Top ${Math.min(tableHooks.length, 10)} of ${totalHooks}`);
    const tbody = document.getElementById('hm-library-tbody');
    if (tbody) {
      if (!tableHooks.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">
          No hooks ${channelFilter ? `for ${escapeHtml(channelFilter)}` : 'yet'} — click <strong>Mine Hooks</strong> to populate.
        </td></tr>`;
      } else {
        tbody.innerHTML = tableHooks.slice(0, 10).map(h => {
          const evidence = h.evidence_json || {};
          const persona = evidence.persona ? String(evidence.persona).split(' ').slice(0, 2).join(' ') : '—';
          return `<tr>
            <td style="max-width:380px;"><strong>"${escapeHtml(h.hook_text || '')}"</strong></td>
            <td>${frameworkTag(h.framework)}</td>
            <td>${escapeHtml(h.channel || '—')}</td>
            <td><strong style="color:#10B981">${Number(h.score) || '—'}</strong></td>
            <td style="font-size:11px; color:var(--text-muted)">${escapeHtml(persona)}</td>
          </tr>`;
        }).join('');
      }
    }

    // Frameworks cards
    setText('hm-frameworks-title', `${frameworks.length} Frameworks Identified`);
    const fwContainer = document.getElementById('hm-frameworks-container');
    if (fwContainer) {
      if (!frameworks.length) {
        fwContainer.innerHTML = `<div style="grid-column: 1 / -1; padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">
          No frameworks yet. Mine hooks to identify recurring patterns.
        </div>`;
      } else {
        const sortedFw = Object.entries(frameworkCounts).sort((a, b) => b[1] - a[1]);
        fwContainer.innerHTML = sortedFw.map(([name, count]) => {
          const s = frameworkStyle(name);
          return `<div style="padding:12px; border-left:3px solid ${s.border}; background:${s.surface}; border-radius:4px;">
            <strong style="font-size:13px;">${escapeHtml(name)} <span style="color:var(--text-muted); font-weight:400;">(${count} hook${count === 1 ? '' : 's'})</span></strong>
            <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">${escapeHtml(s.desc)}</p>
          </div>`;
        }).join('');
      }
    }

    // Recommended hooks — top 4 by score with diversified frameworks
    const recContainer = document.getElementById('hm-recommended-container');
    if (recContainer) {
      if (!allHooks.length) {
        recContainer.innerHTML = `<div style="grid-column: 1 / -1; padding:16px; color:var(--text-muted); font-size:13px; text-align:center;">
          No recommendations yet — mine hooks to populate this week's queue.
        </div>`;
      } else {
        const seenFw = new Set();
        const picks = [];
        for (const h of allHooks) {
          if (picks.length >= 4) break;
          if (seenFw.has(h.framework)) continue;
          picks.push(h);
          seenFw.add(h.framework);
        }
        // If fewer than 4 distinct frameworks, fill with next best regardless
        for (const h of allHooks) {
          if (picks.length >= 4) break;
          if (!picks.includes(h)) picks.push(h);
        }

        const channelTagBg = {
          LinkedIn:  'background:#EFF6FF;color:#1D4ED8',
          WhatsApp:  'background:#D1FAE5;color:#065F46',
          Email:     'background:#FEF3C7;color:#B45309',
          Instagram: 'background:#FCE7F3;color:#9D174D',
          Blog:      'background:#F3F4F6;color:#374151',
        };

        recContainer.innerHTML = picks.map(h => {
          const ev = h.evidence_json || {};
          const forecast = ev.forecast || ev.forecast_engagement || '';
          const reasoning = ev.reasoning || '';
          const reasoningShort = reasoning.length > 110 ? reasoning.slice(0, 110) + '…' : reasoning;
          const channelStyle = channelTagBg[h.channel] || 'background:#F3F4F6;color:#374151';
          return `<div style="padding:14px; border:1px solid var(--border); background:white; border-radius:8px;">
            <div style="display:flex; gap:6px; margin-bottom:8px; flex-wrap:wrap;">
              ${frameworkTag(h.framework)}
              <span class="lm-tag" style="${channelStyle}">${escapeHtml(h.channel || '—')}</span>
              <span class="lm-tag" style="background:#F0FDF4;color:#166534">Score ${Number(h.score) || '—'}</span>
            </div>
            <strong style="font-size:14px;">"${escapeHtml(h.hook_text || '')}"</strong>
            <p style="font-size:12px; color:var(--text-muted); margin-top:6px;">
              ${forecast ? `Engagement forecast: <strong style="color:#10B981;">${escapeHtml(forecast)}</strong>` : ''}
              ${forecast && reasoningShort ? ' · ' : ''}
              ${escapeHtml(reasoningShort)}
            </p>
          </div>`;
        }).join('');
      }
    }
  } catch (err) {
    console.error('[HM hydrate] error:', err);
  }
}

// ── CreativeBrain hydration ────────────────────────────
async function fetchCreativeAssets(brandId, assetTypeFilter) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    order: 'created_at.desc',
    limit: '12',
    select: 'id,asset_type,file_url,prompt_json,qa_json,status,created_at'
  });
  if (assetTypeFilter) params.set('asset_type', `eq.${assetTypeFilter}`);
  return supabaseGet(`creative_assets?${params}`);
}

function prettyAssetType(t) {
  if (!t) return '—';
  return t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

async function hydrateCreativeBrainView() {
  try {
    const filterEl = document.getElementById('cb-format-filter');
    const filter = filterEl?.value || '';

    const [profileRow, allAssets, filteredAssets] = await Promise.all([
      fetchBrandProfile(brandKitData.brandId),
      fetchCreativeAssets(brandKitData.brandId, ''),
      filter ? fetchCreativeAssets(brandKitData.brandId, filter) : Promise.resolve(null),
    ]);
    const galleryAssets = filteredAssets || allAssets;

    const data = profileRow?.data_json || {};
    const brandName = data.identity?.company_name || profileRow?.brand?.name || 'Brand';

    // Header tag + sub-header
    setText('cb-brand-tag', `${brandName} · 12 pieces/week · auto brand-compliance ON`);
    const latestCreated = allAssets[0]?.created_at;
    // ContentBuilder hosts the Visual Creative section now — its own batch label
    setText('cb-creative-last-batch', latestCreated ? `Last batch: ${fmtRelativeTime(latestCreated)}` : 'Last batch: never');
    setText('cb-brand-guide', `Brand guide: ${brandName} · v1`);

    // Stats
    const formatSet = new Set(allAssets.map(a => a.asset_type).filter(Boolean));
    setText('cb-stat-assets',  allAssets.length ? String(allAssets.length) : '—');
    setText('cb-stat-formats', formatSet.size  ? String(formatSet.size)   : '—');

    // Format filter dropdown — populate with distinct asset_types
    if (filterEl) {
      const currentValue = filter;
      const options = ['<option value="">All formats</option>']
        .concat([...formatSet].sort().map(t => {
          const sel = t === currentValue ? ' selected' : '';
          return `<option value="${escapeHtml(t)}"${sel}>${escapeHtml(prettyAssetType(t))}</option>`;
        }));
      filterEl.innerHTML = options.join('');
    }

    // Gallery
    setText('cb-gallery-title', allAssets.length
      ? `Asset Library — ${galleryAssets.length} of ${allAssets.length}${filter ? ` (${prettyAssetType(filter)})` : ''}`
      : 'Asset Library');

    const gallery = document.getElementById('cb-gallery');
    if (gallery) {
      if (!galleryAssets.length) {
        gallery.innerHTML = `<div style="grid-column: 1 / -1; padding:24px; color:var(--text-muted); font-size:13px; text-align:center;">
          No assets ${filter ? `for ${escapeHtml(prettyAssetType(filter))}` : 'yet'} — build a draft above and click <strong>Generate Visual</strong> to render the first one.
        </div>`;
      } else {
        gallery.innerHTML = galleryAssets.map(a => {
          let prompt = a.prompt_json;
          if (typeof prompt === 'string') {
            try { prompt = JSON.parse(prompt); } catch (_) { prompt = {}; }
          }
          prompt = prompt || {};
          const headline    = prompt.headline    || '(no headline)';
          const subheadline = prompt.subheadline || '';
          const label       = prettyAssetType(a.asset_type);
          const hasImg      = a.file_url && a.file_url.startsWith('data:') && a.file_url.length > 100;
          const visualBlock = hasImg
            ? `<div style="aspect-ratio:16/9; background:#0F172A url('${a.file_url.replace(/'/g, "\\'")}') center/cover no-repeat;"></div>`
            : `<div style="aspect-ratio:16/9; background:linear-gradient(135deg, #6366F1 0%, #0F172A 100%); display:flex; align-items:center; justify-content:center; padding:14px; text-align:center;">
                 <span style="color:white; font-weight:700; font-size:13px; line-height:1.4;">${escapeHtml(headline)}</span>
               </div>`;
          const statusTag = (a.status === 'pending_design')
            ? '<span class="lm-tag" style="background:#FEF3C7;color:#B45309">Pending</span>'
            : (a.status === 'approved')
              ? '<span class="lm-tag" style="background:#D1FAE5;color:#065F46">Approved</span>'
              : `<span class="lm-tag" style="background:#F3F4F6;color:#374151">${escapeHtml(a.status || '—')}</span>`;
          return `<div style="border-radius:10px; overflow:hidden; border:1px solid var(--border); cursor:pointer; transition:transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            ${visualBlock}
            <div style="padding:10px 12px; background:white;">
              <div style="font-size:12px; font-weight:600; line-height:1.3; min-height:32px;">${escapeHtml(headline)}</div>
              ${subheadline ? `<div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${escapeHtml(subheadline)}</div>` : ''}
              <div style="font-size:11px; color:var(--text-muted); margin-top:6px;">${escapeHtml(label)}</div>
              <div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;">
                <span class="lm-tag" style="background:#F0FDF4;color:#166534">On-brand</span>
                ${statusTag}
              </div>
            </div>
          </div>`;
        }).join('');
      }
    }
  } catch (err) {
    console.error('[CB hydrate] error:', err);
  }
}

// ── AutoPublisher hydration ────────────────────────────
async function fetchPublishingDrafts(brandId) {
  const params = new URLSearchParams({
    brand_id: `eq.${brandId}`,
    order: 'scheduled_at.desc.nullslast',
    limit: '50',
    select: 'id,title,channel,status,scheduled_at,published_at,reach,engagement_pct,qa_json'
  });
  return supabaseGet(`content_drafts?${params}`);
}


const CHANNEL_TAG_STYLE = {
  LinkedIn:  { bg: '#EFF6FF', fg: '#1D4ED8', dot: '#0A66C2' },
  Email:     { bg: '#FEF3C7', fg: '#B45309', dot: '#F59E0B' },
  Blog:      { bg: '#F3F4F6', fg: '#374151', dot: '#374151' },
  Instagram: { bg: '#FCE7F3', fg: '#9D174D', dot: '#E4405F' },
  WhatsApp:  { bg: '#D1FAE5', fg: '#065F46', dot: '#25D366' },
  YouTube:   { bg: '#FEE2E2', fg: '#991B1B', dot: '#EF4444' },
};
function channelStyle(ch) {
  return CHANNEL_TAG_STYLE[ch] || { bg: '#F3F4F6', fg: '#374151', dot: '#94A3B8' };
}

const STATUS_TAG_STYLE = {
  published: { bg: '#D1FAE5', fg: '#065F46', label: 'Live' },
  approved:  { bg: '#EEF2FF', fg: '#4338CA', label: 'Scheduled' },
  draft:     { bg: '#FEF3C7', fg: '#B45309', label: 'Queue' },
  qa_failed: { bg: '#FEE2E2', fg: '#991B1B', label: 'QA fail' },
  rejected:  { bg: '#FEE2E2', fg: '#991B1B', label: 'Rejected' },
};
function statusTagPub(s) {
  const t = STATUS_TAG_STYLE[s] || { bg: '#F3F4F6', fg: '#374151', label: s || '—' };
  return `<span class="lm-tag" style="background:${t.bg};color:${t.fg}">${t.label}</span>`;
}

function fmtRelativeFuture(iso) {
  if (!iso) return '—';
  const diffSec = (new Date(iso).getTime() - Date.now()) / 1000;
  if (diffSec < -86400) return `${Math.floor(-diffSec/86400)} d ago`;
  if (diffSec < 0)      return `${Math.floor(-diffSec/3600)} h ago`;
  if (diffSec < 60)     return 'now';
  if (diffSec < 3600)   return `in ${Math.floor(diffSec/60)} min`;
  if (diffSec < 86400)  return `in ${Math.floor(diffSec/3600)}h ${Math.floor((diffSec%3600)/60)}m`;
  const days = Math.floor(diffSec/86400);
  return days === 1 ? 'Tomorrow' : `in ${days} days`;
}

function fmtCompact(n) {
  if (n == null || !Number.isFinite(Number(n))) return '—';
  const x = Number(n);
  if (x >= 1000) return (x/1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(x);
}

function fmtDayHeader(d) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return { day: days[d.getDay()], date: String(d.getDate()) };
}

function fmtMonthName(d) {
  return d.toLocaleString('en-US', { month: 'short' });
}

async function hydrateAutoPublisherView() {
  try {
    const allDrafts = await fetchPublishingDrafts(brandKitData.brandId);

    const now = Date.now();
    const oneWeekMs = 7 * 24 * 3600 * 1000;
    const startOfWeek = new Date(now); // Monday-anchored week
    const dayOfWeek = startOfWeek.getDay() || 7; // Sunday=7
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek - 1));
    const endOfWeek = new Date(startOfWeek.getTime() + oneWeekMs);

    // ─── Buckets ───
    const published = allDrafts.filter(d => d.status === 'published' && d.published_at);
    const upcoming  = allDrafts.filter(d => d.status === 'approved' && d.scheduled_at && new Date(d.scheduled_at).getTime() > now);
    const publishedThisWeek = published.filter(d => {
      const t = new Date(d.published_at).getTime();
      return t >= startOfWeek.getTime() && t < endOfWeek.getTime();
    });
    const scheduledNext7d = upcoming.filter(d => new Date(d.scheduled_at).getTime() <= now + oneWeekMs);
    const channelsActive = new Set(allDrafts.map(d => d.channel).filter(Boolean));

    // ─── Header tag + sub-header ───
    const nextItem = upcoming.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))[0];
    const nextWhen = nextItem ? fmtRelativeFuture(nextItem.scheduled_at) : 'no items queued';
    setText('ap-brand-tag', `${channelsActive.size} channel${channelsActive.size === 1 ? '' : 's'} · next publish ${nextWhen}`);

    const lastPub = published.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))[0];
    setText('ap-last-publish', lastPub ? `Last publish: ${fmtRelativeFuture(lastPub.published_at)}` : 'Last publish: never');

    // ─── Stats ───
    const avgEng = publishedThisWeek.length
      ? publishedThisWeek.reduce((s, d) => s + (Number(d.engagement_pct) || 0), 0) / publishedThisWeek.length
      : 0;
    setText('ap-stat-scheduled', scheduledNext7d.length ? String(scheduledNext7d.length) : '—');
    setText('ap-stat-published', publishedThisWeek.length ? String(publishedThisWeek.length) : '—');
    setText('ap-stat-engagement', avgEng > 0 ? `+${avgEng.toFixed(1)}%` : '—');

    // ─── Week range header ───
    const endLabel = new Date(endOfWeek.getTime() - 1);
    const sameMonth = startOfWeek.getMonth() === endLabel.getMonth();
    setText('ap-week-range',
      sameMonth
        ? `${fmtMonthName(startOfWeek)} ${startOfWeek.getDate()} – ${endLabel.getDate()}, ${endLabel.getFullYear()}`
        : `${fmtMonthName(startOfWeek)} ${startOfWeek.getDate()} – ${fmtMonthName(endLabel)} ${endLabel.getDate()}, ${endLabel.getFullYear()}`);

    // ─── Calendar (Mon–Sun this week) ───
    const calendar = document.getElementById('ap-calendar');
    if (calendar) {
      const buckets = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek.getTime() + i * 86400000);
        return { date: d, items: [] };
      });
      [...published, ...upcoming].forEach(d => {
        const t = d.published_at || d.scheduled_at;
        if (!t) return;
        const ts = new Date(t).getTime();
        const idx = Math.floor((ts - startOfWeek.getTime()) / 86400000);
        if (idx >= 0 && idx < 7) {
          buckets[idx].items.push({
            channel: d.channel,
            time: new Date(t).toISOString().slice(11, 16),
            title: d.title,
            status: d.status,
          });
        }
      });

      calendar.innerHTML = buckets.map(b => {
        const head = fmtDayHeader(b.date);
        b.items.sort((a, b) => a.time.localeCompare(b.time));
        const itemsHTML = b.items.length
          ? b.items.map(it => {
              const cs = channelStyle(it.channel);
              const ss = STATUS_TAG_STYLE[it.status] || STATUS_TAG_STYLE.draft;
              const titleShort = (it.title || '').slice(0, 36) + ((it.title || '').length > 36 ? '…' : '');
              return `<div style="padding:6px 8px; background:${ss.bg}; border-radius:4px; margin-bottom:4px; font-size:10px;">
                <div style="display:flex; gap:4px; align-items:center; font-weight:700; color:${ss.fg};">
                  <span style="width:6px;height:6px;border-radius:50%;background:${cs.dot};"></span>${escapeHtml(it.channel || '—')} · ${it.time}
                </div>
                <div style="color:${ss.fg}; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(titleShort)}</div>
              </div>`;
            }).join('')
          : '<div style="font-size:10px; color:var(--text-muted); text-align:center; padding:20px 0;">—</div>';
        return `<div style="border:1px solid var(--border); border-radius:8px; padding:10px; min-height:140px; background:${b.items.length === 0 ? '#F9FAFB' : 'white'};">
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
            <strong style="font-size:12px; color:var(--text-muted);">${head.day}</strong>
            <span style="font-size:16px; font-weight:700;">${head.date}</span>
          </div>
          ${itemsHTML}
        </div>`;
      }).join('');
    }

    // ─── Next-up queue ───
    const queueTbody = document.getElementById('ap-queue-tbody');
    if (queueTbody) {
      const sorted = upcoming.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)).slice(0, 6);
      if (!sorted.length) {
        queueTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:20px;">No items scheduled. Approve a draft in ContentBuilder to queue it.</td></tr>';
      } else {
        queueTbody.innerHTML = sorted.map(d => {
          const cs = channelStyle(d.channel);
          const titleShort = (d.title || '').slice(0, 60) + ((d.title || '').length > 60 ? '…' : '');
          return `<tr>
            <td style="font-size:12px; color:var(--text-muted);">${fmtRelativeFuture(d.scheduled_at)}</td>
            <td><span class="lm-tag" style="background:${cs.bg};color:${cs.fg}">${escapeHtml(d.channel || '—')}</span></td>
            <td style="font-size:12px;"><strong>${escapeHtml(titleShort)}</strong></td>
            <td>${statusTagPub(d.status)}</td>
          </tr>`;
        }).join('');
      }
    }

    // ─── Publish log ───
    const logTbody = document.getElementById('ap-log-tbody');
    if (logTbody) {
      const sorted = published.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).slice(0, 6);
      if (!sorted.length) {
        logTbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:20px;">No publish history yet.</td></tr>';
      } else {
        logTbody.innerHTML = sorted.map(d => {
          const cs = channelStyle(d.channel);
          const titleShort = (d.title || '').slice(0, 60) + ((d.title || '').length > 60 ? '…' : '');
          const eng = d.engagement_pct != null ? `+${Number(d.engagement_pct).toFixed(1)}%` : '—';
          return `<tr>
            <td style="font-size:12px;">${fmtRelativeFuture(d.published_at)}</td>
            <td><span class="lm-tag" style="background:${cs.bg};color:${cs.fg}">${escapeHtml(d.channel || '—')}</span></td>
            <td><strong style="font-size:13px;">${escapeHtml(titleShort)}</strong></td>
            <td><strong>${fmtCompact(d.reach)}</strong></td>
            <td style="color:#10B981;font-weight:600;">${eng}</td>
            <td>${statusTagPub(d.status)}</td>
          </tr>`;
        }).join('');
      }
    }

    // ─── Metricool Publishing Stats ───
    const readyToPublish = upcoming.length;
    const uniqueChannels = new Set(upcoming.map(d => d.channel).filter(Boolean)).size;
    const lastMetricoolPublish = published.find(d => d.metricool_published_at);
    setText('metricool-ready-count', readyToPublish ? String(readyToPublish) : '0');
    setText('metricool-channels-count', uniqueChannels ? String(uniqueChannels) : '0');
    setText('metricool-last-publish', lastMetricoolPublish ? fmtRelativeFuture(lastMetricoolPublish.metricool_published_at) : 'Never');
  } catch (err) {
    console.error('[AP hydrate] error:', err);
  }
}

async function handleGenerateVisualFromCB() {
  const btn = document.getElementById('cb-generate-visual-btn');
  if (!btn) return;
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:13px; animation: spin 1s linear infinite; vertical-align:middle; margin-right:6px"></i> Picking latest draft…';
  lucide.createIcons();

  try {
    // Find the most recent draft for this brand
    const params = new URLSearchParams({
      brand_id: `eq.${brandKitData.brandId}`,
      order: 'created_at.desc',
      limit: '1',
      select: 'id,title,status'
    });
    const drafts = await supabaseGet(`content_drafts?${params}`);

    if (!drafts.length) {
      btn.innerHTML = '<i data-lucide="alert-circle" style="width:13px;vertical-align:middle;margin-right:6px"></i> No drafts yet';
      btn.style.background = '#EF4444';
      showToast('No drafts available. Build a draft in ContentBuilder first.', 'error');
      setTimeout(() => { btn.innerHTML = original; btn.style.background = '#A855F7'; btn.disabled = false; lucide.createIcons(); }, 3500);
      return;
    }

    const draft = drafts[0];
    btn.innerHTML = '<i data-lucide="loader-2" style="width:13px; animation: spin 1s linear infinite; vertical-align:middle; margin-right:6px"></i> Rendering image…';
    lucide.createIcons();

    let result = await generateVisualBrief(draft.id);
    if (Array.isArray(result)) result = result[0];
    if (result && result.json) result = result.json;

    if (result && result.ok && result.asset_id) {
      btn.innerHTML = `<i data-lucide="check" style="width:13px;vertical-align:middle;margin-right:6px"></i> Asset ${result.asset_id.slice(0, 8)} ready`;
      btn.style.background = '#10B981';
      showToast(`Visual generated for draft "${(draft.title || '').slice(0, 40)}…".`);
      // Refresh gallery to show the new asset
      hydrateCreativeBrainView();
    } else {
      btn.innerHTML = '<i data-lucide="alert-circle" style="width:13px;vertical-align:middle;margin-right:6px"></i> Error — retry';
      btn.style.background = '#EF4444';
      showToast('Visual generation failed. See console.', 'error');
      console.warn('[CB Generate Visual] response:', result);
    }
  } catch (err) {
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:13px;vertical-align:middle;margin-right:6px"></i> Error';
    btn.style.background = '#EF4444';
    showToast('Visual generation error. See console.', 'error');
    console.error('[CB Generate Visual] error:', err);
  }

  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '#A855F7';
    btn.disabled = false;
    lucide.createIcons();
  }, 4500);
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
      body: JSON.stringify({
        brand_id:    brandKitData.brandId,
        // Own-channel tone + voice rules so WF04 can contrast competitor style vs our style
        social_bios: getSocialBiosForPayload(),
      }),
    }).catch(e => console.error('[WF04] webhook error:', e));
    if (btn) { btn.textContent = '✅ Queued'; }
    showToast('Content analysis queued — runs in background.');
    setTimeout(() => hydrateCompetitorsView(), 1500);
    setTimeout(() => { if (btn) { btn.textContent = 'Run Analysis'; btn.disabled = false; } }, 3000);
  } catch (e) {
    if (btn) { btn.textContent = '❌ Error — retry'; btn.disabled = false; }
    console.error('[WF04] error:', e);
  }
}

// ── WF05 Hook Miner ────────────────────────────────────
const WF05_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/hook-mining';

// Standard Gemini video analysis prompt (reused across all brand configs)
const STANDARD_ANALYSIS_INSTRUCTION = `# CONCEPT
Overall description of the concept of this video, and what makes it valuable and interesting (1-3 sentences).
-> Clarify the core tension: what belief is challenged, what mistake is exposed, or what outcome is promised.
-> One clear idea only. No subtopics.

# HOOK
Detailed description of the first 5 seconds of the video, what makes it scroll-stopping and attention-grabbing (1-3 sentences).
-> Break it down into:
- VISUAL (what is seen in the first 1-2 seconds: movement, facial expression, contrast, pattern break)
- TEXT (short on-screen statement: danger, promise, or contradiction, max 6-8 words)
- AUDIO (first spoken words: confident, direct, no intro, no context)
-> The hook must create either fear of loss, strong curiosity, or identity relevance.

# RETENTION MECHANISMS
Detailed description of how the creator manages to retain viewers throughout the video (1-7 sentences).
-> Open loops, delayed payoff, micro-escalations, pattern interrupts, forward momentum.

# REWARD
Describe the ultimate value that the viewer gets by watching this video (1-3 sentences).
-> Education (clarity), Entertainment (emotional release), or Inspiration (self-belief / action).

# SCRIPT
Describe the full script of the video (1-20 sentences, as many as needed).
-> Structure: immediate hook → problem framing → why it matters → main insight → clean close.
-> Include scenes, actions, voiceover, exact wording if possible.

OVERALL RULE: THE SHORTER THE ANALYSIS - THE BETTER. Clarity > cleverness.`;

async function runHookMiner() {
  const btn = document.getElementById('wf05-mine-btn');
  if (btn) { btn.textContent = 'Mining…'; btn.disabled = true; }
  try {
    await createQueueJob('hook_mining');
    // fire-and-forget — WF05 runs multi-batch AI processing, don't await response
    fetch(WF05_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_id:    brandKitData.brandId,
        // Own-channel tone/voiceRules so WF05 can adapt competitor hooks to our style
        // when generating new_concepts for each video analysis
        social_bios: getSocialBiosForPayload(),
      }),
    }).catch(e => console.error('[WF05] webhook error:', e));
    if (btn) { btn.textContent = '✅ Queued'; }
    showToast('Hook mining queued — runs in background.');
    setTimeout(() => hydrateHookMinerView(), 1500);
    setTimeout(() => { if (btn) { btn.textContent = 'Mine Hooks'; btn.disabled = false; } }, 3000);
  } catch (e) {
    if (btn) { btn.textContent = '❌ Error — retry'; btn.disabled = false; }
    console.error('[WF05] error:', e);
  }
}

// ── Social Media — Supabase-backed (sm_videos / sm_creators / sm_configs) ──
async function fetchCompetitorVideos() {
  const brandId = brandKitData?.brandId;
  const params = new URLSearchParams({
    order: 'views.desc',
    select: 'id,link,thumbnail,creator,competitor_name,platform,views,likes,comments,analysis,new_concepts,date_posted,date_added,brand_id,starred',
  });
  if (brandId) params.append('brand_id', `eq.${brandId}`);
  return supabaseGet(`sm_videos?${params}`);
}

function classifyHook(text) {
  const t = (text || '').toLowerCase();
  if (/most people think|stop |we killed|never |wrong|myth/.test(t)) return 'Contrarian';
  if (/\d+%|\d+ (to|in|from) \d+|\d+x/.test(t))                     return 'Specific Number';
  if (/how we |how i |the way we /.test(t))                           return 'How-We-Do-X';
  if (/here's|question i ask|mistake most|secret/.test(t))            return 'Open-Loop';
  if (/every (vp|ceo|founder|engineer|agent|client|investor)/.test(t)) return 'Persona-Aware';
  return 'Visual-Led';
}

function calcHookScore(views) {
  if (views > 500000) return 95;
  if (views > 100000) return 88;
  if (views > 50000)  return 82;
  if (views > 10000)  return 75;
  return 68;
}

function parseHooksFromVideos(videos) {
  const FW_COLORS = {
    'Contrarian':      'background:#FEE2E2;color:#991B1B',
    'Specific Number': 'background:#EFF6FF;color:#1D4ED8',
    'How-We-Do-X':     'background:#FEF3C7;color:#B45309',
    'Open-Loop':       'background:#F3E8FF;color:#6B21A8',
    'Persona-Aware':   'background:#DBEAFE;color:#1E40AF',
    'Visual-Led':      'background:#F0FDF4;color:#166534',
  };

  const hooks = [];
  const seen  = new Set();

  function push(text, type, video, scoreDelta) {
    const clean = text.replace(/^["'`«»\s]+|["'`«»\s]+$/g, '').trim();
    const key   = clean.slice(0, 60).toLowerCase();
    if (!clean || clean.length < 10 || seen.has(key)) return;
    seen.add(key);
    const fw = classifyHook(clean);
    const baseScore = calcHookScore(Number(video.views) || 0);
    hooks.push({
      text:       clean,
      type,
      framework:  fw,
      fwStyle:    FW_COLORS[fw] || 'background:#F3F4F6;color:#374151',
      score:      baseScore + (scoreDelta || 0),
      platform:   (video.platform || 'instagram').toLowerCase(),
      creator:    video.creator || video.competitor_name || '—',
      competitor: video.competitor_name || video.creator || '—',
      views:      Number(video.views) || 0,
      thumbnail:  video.thumbnail || '',
      link:       video.link || '#',
      videoId:    video.id || '',
    });
  }

  videos.forEach(video => {
    // ── Gemini analysis ──
    if (video.analysis) {
      const a = video.analysis;
      // **VISUAL HOOK:** / **VISUAL:** / **VISUAL HOOK (Frame N):**
      [...a.matchAll(/\*\*VISUAL[^:*]{0,20}:\*\*\s*([^\n*]{10,220})/gi)].slice(0, 2)
        .forEach(m => push(m[1], 'visual', video, 0));
      // **SPOKEN HOOK:** "..." or «...»
      [...a.matchAll(/\*\*SPOKEN[^:*]{0,20}:\*\*[^"«\n]*["«]([^"»\n]{15,200})["»]/gi)].slice(0, 2)
        .forEach(m => push(m[1], 'spoken', video, +3));
      // -> arrow mechanism lines (reveals hook intent)
      [...a.matchAll(/^->\s*(.{20,160})/gm)].slice(0, 2)
        .forEach(m => push(m[1], 'visual', video, -2));
    }

    // ── Claude new_concepts ──
    if (video.new_concepts) {
      const c = video.new_concepts;
      // Spoken hooks inside concept blocks (highest value — already adapted)
      [...c.matchAll(/\*\*SPOKEN[^:*]{0,20}:\*\*[^"«\n]*["«]([^"»\n]{15,200})["»]/gi)].slice(0, 5)
        .forEach(m => push(m[1], 'concept', video, +6));
      // Visual descriptions inside concept blocks
      [...c.matchAll(/\*\*VISUAL[^:*]{0,20}:\*\*\s*([^\n*]{15,220})/gi)].slice(0, 3)
        .forEach(m => push(m[1], 'concept', video, +3));
    }
  });

  return hooks.sort((a, b) => b.score - a.score || b.views - a.views);
}

// ── HookMiner — global state & per-platform renderers ───────────────

let _hmData = { videos: [], hooks: [], activePlatform: 'all' };

const HM_COMP_COLORS = ['#F97316','#8B5CF6','#0EA5E9','#10B981','#EF4444','#F59E0B','#EC4899','#14B8A6'];
function hmCompColor(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + (name || '').charCodeAt(i)) & 0xffffffff;
  return HM_COMP_COLORS[Math.abs(h) % HM_COMP_COLORS.length];
}

function hmThumbContent(thumbnail, competitorName, platform) {
  const color    = hmCompColor(competitorName);
  const initials = (competitorName || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const platEmoji = { instagram: '📸', tiktok: '🎵', linkedin: '💼', twitter: '🐦' }[(platform || 'instagram').toLowerCase()] || '📱';
  // Placeholder always renders behind; image (if present) floats on top and hides on error
  const placeholder = `<div style="position:absolute;inset:0;background:${color}18;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:1px solid ${color}30;">
    <div style="font-size:18px;font-weight:800;color:${color};line-height:1;">${escapeHtml(initials)}</div>
    <div style="font-size:10px;">${platEmoji}</div>
  </div>`;
  const img = thumbnail
    ? `<img src="${escapeHtml(thumbnail)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;" onerror="this.style.display='none'">`
    : '';
  return placeholder + img;
}

function hmPlatformBadge(platform) {
  const p = (platform || 'instagram').toLowerCase();
  const cfg = {
    instagram: { color: '#E4405F', emoji: '📸', label: 'Instagram' },
    tiktok:    { color: '#010101', emoji: '🎵', label: 'TikTok'    },
    linkedin:  { color: '#0A66C2', emoji: '💼', label: 'LinkedIn'  },
    twitter:   { color: '#1D9BF0', emoji: '🐦', label: 'Twitter/X' },
  };
  const c = cfg[p] || { color: '#6B7280', emoji: '📱', label: platform || 'Social' };
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:${c.color}20;color:${c.color};border:1px solid ${c.color}30;">${c.emoji} ${escapeHtml(c.label)}</span>`;
}

function hmTypeLabel(type) {
  const map = {
    spoken:  '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:#EFF6FF;color:#1D4ED8;">🎤 Spoken</span>',
    visual:  '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:#FFF7ED;color:#C2410C;">👁 Visual</span>',
    concept: '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:#F3E8FF;color:#7C3AED;">✨ AI Concept</span>',
  };
  return map[type] || map.visual;
}

function hmScoreBar(score) {
  const w = Math.max(5, Math.min(100, score));
  const color = score >= 88 ? '#10B981' : score >= 78 ? '#F59E0B' : '#94A3B8';
  return `<div style="display:flex;align-items:center;gap:6px;">
    <div style="width:44px;height:5px;border-radius:3px;background:#F1F5F9;overflow:hidden;flex-shrink:0;">
      <div style="height:100%;width:${w}%;background:${color};border-radius:3px;"></div>
    </div>
    <strong style="font-size:12px;color:${color};">${score}</strong>
  </div>`;
}

function hmShowPlatform(platform, btn) {
  _hmData.activePlatform = platform;
  document.querySelectorAll('.hm-ptab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const content = document.getElementById('hm-platform-content');
  if (!content) return;
  content.innerHTML = hmRenderPlatformContent(platform);
  lucide.createIcons({ nodes: [content] });
}

function hmRenderPlatformContent(platform) {
  const { videos, hooks } = _hmData;
  const pfVideos = platform === 'all' ? videos : videos.filter(v => (v.platform || 'instagram').toLowerCase() === platform);
  const pfHooks  = platform === 'all' ? hooks  : hooks.filter(h => h.platform === platform);

  if (!pfVideos.length) {
    const names = { all: 'ninguna plataforma todavía', instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn', twitter: 'Twitter/X' };
    return `<div style="text-align:center;padding:48px;color:var(--text-muted);">
      <div style="font-size:36px;margin-bottom:12px;">📭</div>
      <strong>No hay videos de ${escapeHtml(names[platform] || platform)}</strong><br>
      <span style="font-size:12px;margin-top:6px;display:block;">Corré el pipeline para comenzar a scrapearlo.</span>
    </div>`;
  }

  const totalViews  = pfVideos.reduce((s, v) => s + (Number(v.views) || 0), 0);
  const avgViews    = Math.round(totalViews / pfVideos.length);
  const competitors = [...new Set(pfVideos.map(v => v.competitor_name).filter(Boolean))];

  // Framework bars
  const fwCounts = {};
  pfHooks.forEach(h => { fwCounts[h.framework] = (fwCounts[h.framework] || 0) + 1; });
  const topFw = Object.entries(fwCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topFwTotal = pfHooks.length || 1;

  const platEmoji = { instagram: '📸', tiktok: '🎵', linkedin: '💼', twitter: '🐦' };

  const topHooksRows = pfHooks.slice(0, 8).map(h => {
    const s = frameworkStyle(h.framework);
    const thumb = `<div style="position:relative;width:36px;height:22px;border-radius:3px;overflow:hidden;flex-shrink:0;margin-right:7px;border:1px solid var(--border);">${hmThumbContent(h.thumbnail, h.competitor, h.platform)}</div>`;
    return `<tr class="hm-hook-row">
      <td style="max-width:260px;padding:8px 10px;">
        <div style="display:flex;align-items:flex-start;">
          ${thumb}
          <div>
            <div style="font-size:12px;font-weight:600;line-height:1.4;">"${escapeHtml(h.text.slice(0, 90))}${h.text.length > 90 ? '…' : ''}"</div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">@${escapeHtml(h.creator)} · ${fmtViews(h.views)} views${h.type === 'concept' ? ' · ✨ AI' : ''}</div>
          </div>
        </div>
      </td>
      <td><span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:${s.bg};color:${s.fg};">${escapeHtml(h.framework)}</span></td>
      <td>${hmScoreBar(h.score)}</td>
    </tr>`;
  }).join('');

  const videoThumbs = pfVideos.slice(0, 10).map(v => {
    const safeId = escapeHtml(v.id || '');
    return `<div style="position:relative;aspect-ratio:9/16;border-radius:8px;overflow:hidden;cursor:pointer;transition:transform .15s;"
        onclick="openSwipeModal('${safeId}','analysis')"
        onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform=''">
      ${hmThumbContent(v.thumbnail, v.competitor_name, v.platform)}
      <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.75));padding:10px 5px 4px;text-align:center;z-index:2;">
        <span style="color:white;font-size:9px;font-weight:700;">▶ ${fmtViews(v.views)}</span>
      </div>
    </div>`;
  }).join('');

  const fwBars = topFw.map(([name, count]) => {
    const s   = frameworkStyle(name);
    const pct = Math.round(count / topFwTotal * 100);
    return `<div style="margin-bottom:9px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
        <span style="font-size:11px;font-weight:700;color:${s.fg};">${escapeHtml(name)}</span>
        <span style="font-size:11px;color:var(--text-muted);">${count} (${pct}%)</span>
      </div>
      <div style="height:7px;border-radius:4px;background:#F1F5F9;overflow:hidden;">
        <div style="height:100%;width:${pct}%;background:${s.border};border-radius:4px;"></div>
      </div>
    </div>`;
  }).join('');

  return `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px;">
      <div class="hm-mini-stat"><div class="hm-mini-stat-val">${pfVideos.length}</div><div class="hm-mini-stat-lbl">Videos</div></div>
      <div class="hm-mini-stat"><div class="hm-mini-stat-val">${fmtViews(avgViews)}</div><div class="hm-mini-stat-lbl">Avg Views</div></div>
      <div class="hm-mini-stat"><div class="hm-mini-stat-val">${pfHooks.length}</div><div class="hm-mini-stat-lbl">Hooks</div></div>
      <div class="hm-mini-stat"><div class="hm-mini-stat-val">${competitors.length}</div><div class="hm-mini-stat-lbl">Competidores</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:24px;align-items:start;">
      <div>
        <h4 style="font-size:13px;font-weight:700;color:var(--text-main);margin:0 0 10px;display:flex;align-items:center;gap:6px;">
          <i data-lucide="zap" style="width:14px;height:14px;color:#F97316;"></i> Top Hooks
        </h4>
        ${pfHooks.length
          ? `<table class="lm-table" style="font-size:12px;"><thead><tr><th>Hook</th><th>Framework</th><th>Score</th></tr></thead><tbody>${topHooksRows}</tbody></table>`
          : `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;background:#F8FAFC;border-radius:8px;">No se extrajeron hooks — el análisis puede estar en un formato no reconocido.</div>`}
      </div>
      <div>
        ${topFw.length ? `<h4 style="font-size:13px;font-weight:700;color:var(--text-main);margin:0 0 10px;display:flex;align-items:center;gap:6px;"><i data-lucide="bar-chart-2" style="width:14px;height:14px;color:#6B7280;"></i> Framework Distribution</h4><div style="margin-bottom:20px;">${fwBars}</div>` : ''}
        <h4 style="font-size:13px;font-weight:700;color:var(--text-main);margin:0 0 10px;display:flex;align-items:center;gap:6px;">
          <i data-lucide="film" style="width:14px;height:14px;color:#6B7280;"></i> Videos Analizados
        </h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:6px;">${videoThumbs}</div>
      </div>
    </div>`;
}

function hmRenderHookTable() {
  const tbody = document.getElementById('hm-hook-tbody');
  if (!tbody) return;
  const fw   = document.getElementById('hm-fw-filter')?.value   || '';
  const plat = document.getElementById('hm-plat-filter')?.value || '';
  const type = document.getElementById('hm-type-filter')?.value || '';

  const filtered = _hmData.hooks.filter(h =>
    (!fw   || h.framework === fw) &&
    (!plat || h.platform  === plat) &&
    (!type || h.type      === type)
  );

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px;">No hay hooks para estos filtros.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.slice(0, 30).map(h => {
    const s = frameworkStyle(h.framework);
    const thumb = `<div style="position:relative;width:36px;height:22px;border-radius:3px;overflow:hidden;flex-shrink:0;margin-right:7px;border:1px solid var(--border);">${hmThumbContent(h.thumbnail, h.competitor, h.platform)}</div>`;
    return `<tr class="hm-hook-row">
      <td style="max-width:320px;">
        <div style="display:flex;align-items:center;">${thumb}
          <div>
            <strong>${escapeHtml(h.text.slice(0, 100))}${h.text.length > 100 ? '…' : ''}</strong>
            <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">@${escapeHtml(h.creator)} · ${fmtViews(h.views)} views</div>
          </div>
        </div>
      </td>
      <td><span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:${s.bg};color:${s.fg};">${escapeHtml(h.framework)}</span></td>
      <td>${hmPlatformBadge(h.platform)}</td>
      <td>${hmTypeLabel(h.type)}</td>
      <td>${hmScoreBar(h.score)}</td>
      <td><a href="${escapeHtml(h.link)}" target="_blank" style="font-size:11px;color:#3B82F6;">Ver ↗</a></td>
    </tr>`;
  }).join('');
}

function hmRenderCompetitors() {
  const grid = document.getElementById('hm-competitors-grid');
  if (!grid) return;
  const { videos, hooks } = _hmData;
  const competitors = [...new Set(videos.map(v => v.competitor_name).filter(Boolean))].sort();

  if (!competitors.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:24px;">No hay competidores analizados aún.</div>`;
    return;
  }

  grid.innerHTML = competitors.map(comp => {
    const cv   = videos.filter(v => v.competitor_name === comp);
    const ch   = hooks.filter(h => h.competitor === comp);
    const tv   = cv.reduce((s, v) => s + (Number(v.views) || 0), 0);
    const avgV = cv.length ? Math.round(tv / cv.length) : 0;
    const plats = [...new Set(cv.map(v => (v.platform || 'instagram').toLowerCase()))];
    const topH  = ch[0];
    const avgSc = ch.length ? Math.round(ch.reduce((s, h) => s + (h.score || 0), 0) / ch.length) : 0;
    const scColor = avgSc >= 88 ? '#10B981' : avgSc >= 78 ? '#F59E0B' : '#94A3B8';

    return `<div class="hm-comp-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px;flex-wrap:wrap;">
        <strong style="font-size:14px;">${escapeHtml(comp)}</strong>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">${plats.map(p => hmPlatformBadge(p)).join('')}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="text-align:center;padding:8px;background:#F8FAFC;border-radius:8px;">
          <div style="font-size:18px;font-weight:800;line-height:1;">${cv.length}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">Videos</div>
        </div>
        <div style="text-align:center;padding:8px;background:#F8FAFC;border-radius:8px;">
          <div style="font-size:18px;font-weight:800;line-height:1;">${fmtViews(avgV)}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">Avg Views</div>
        </div>
        <div style="text-align:center;padding:8px;background:#F8FAFC;border-radius:8px;">
          <div style="font-size:18px;font-weight:800;line-height:1;color:${scColor};">${avgSc || '—'}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">Hook Score</div>
        </div>
      </div>
      ${topH
        ? `<div style="padding:9px 11px;background:#FFF7ED;border-radius:8px;border-left:3px solid #F97316;">
            <div style="font-size:10px;font-weight:700;color:#92400E;margin-bottom:4px;">🏆 Top Hook</div>
            <div style="font-size:12px;font-weight:600;line-height:1.4;">"${escapeHtml(topH.text.slice(0, 80))}${topH.text.length > 80 ? '…' : ''}"</div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">${fmtViews(topH.views)} views · score ${topH.score}</div>
          </div>`
        : `<div style="padding:9px;background:#F8FAFC;border-radius:8px;text-align:center;font-size:11px;color:var(--text-muted);">No se extrajeron hooks</div>`}
    </div>`;
  }).join('');
}

async function hydrateHookMinerView() {
  loadSocialMediaConfigs();

  try {
    const videos = await fetchCompetitorVideos();
    const hooks  = parseHooksFromVideos(videos);

    _hmData = { videos, hooks, activePlatform: _hmData.activePlatform || 'all' };

    const totalViews  = videos.reduce((s, v) => s + (Number(v.views) || 0), 0);
    const competitors = [...new Set(videos.map(v => v.competitor_name).filter(Boolean))];

    setText('hm-stat-hooks',       String(hooks.length));
    setText('hm-stat-videos',      String(videos.length));
    setText('hm-stat-total-views', fmtViews(totalViews));
    setText('hm-stat-competitors', String(competitors.length));
    setText('hm-header-tag',       `${hooks.length} hooks · ${videos.length} videos`);

    const content = document.getElementById('hm-platform-content');
    if (content) {
      content.innerHTML = hmRenderPlatformContent(_hmData.activePlatform);
      lucide.createIcons({ nodes: [content] });
    }

    hmRenderHookTable();
    hmRenderCompetitors();

  } catch (err) {
    console.error('[HookMiner] error:', err);
    setText('hm-header-tag', 'error cargando datos');
  }

  initSwipeFile();
}

// ── ContentBuilder · per-channel state (verticales + visual prompt by tab) ─
// Each channel has its own verticals list and visual prompt — populated lazily
// from CB_CHANNEL_PROFILES the first time the tab is rendered.
const contentBuilderCampaign = {
  Instagram: { verticals: null, visualPrompt: '', agentPrompt: '', visualConcept: '', visualSpecs: null, slideCount: 3 },
  TikTok:    { verticals: null, visualPrompt: '', agentPrompt: '', visualConcept: '', visualSpecs: null, slideCount: 3 },
  LinkedIn:  { verticals: null, visualPrompt: '', agentPrompt: '', visualConcept: '', visualSpecs: null, slideCount: 3 },
};

function getCbCampaign(channel) {
  const ch = channel || contentBuilderActiveTab || 'Instagram';
  const slot = contentBuilderCampaign[ch];
  if (!slot) return { verticals: [], visualPrompt: '', agentPrompt: '', visualConcept: '', visualSpecs: null, slideCount: 3 };
  // Lazy-init verticals from the channel profile defaults
  if (slot.verticals == null) {
    slot.verticals = [...(CB_CHANNEL_PROFILES[ch]?.defaultVerticals || [])];
  }
  return slot;
}

// ── Visual prompt builder ────────────────────────────────────────────────────
// Tech specs (aspect ratio, format, style, etc.) auto-derive from channel + top
// posting format detected in SocialMediaBios. The user can override any spec via
// the dropdowns in the UI. The "concept" (free-text creative idea) is generated
// by the WF09B agent (or written by hand) and concatenated with the specs to
// produce the final prompt sent to WF09 for image generation.

// Static catalog of editable values for each spec — drives the UI dropdowns.
const VISUAL_SPEC_OPTIONS = {
  aspectRatio: ['9:16 (vertical)', '1:1 (square)', '4:5 (portrait)', '1.91:1 (landscape)', '16:9 (wide)'],
  format:      ['Reel cover', 'Carousel slide', 'Single image', 'Story', 'Video thumbnail'],
  style:       ['Photography', 'Illustration', '3D render', 'Mixed media', 'Flat design'],
  quality:     ['8K resolution', '4K resolution', 'HD'],
  lens:        ['35mm f/1.8', '35mm f/1.4', '50mm f/1.4', '85mm f/2.0', '24mm wide', 'macro 100mm'],
  lighting:    ['Soft warm rim lighting', 'Golden hour natural light', 'Studio strobe', 'Hard cinematic', 'Diffused daylight', 'Neon accent'],
  palette:     ['SWL Consulting brand: obsidian black, charcoal grey, gold/amber accents', 'Brand palette from Branding Bio', 'Monochrome', 'High-contrast B&W', 'Pastel soft'],
};

// Per-channel sensible defaults — used when SMB has nothing or when the user
// hasn't tweaked specs yet. Keys must match VISUAL_SPEC_OPTIONS.
// Fallback defaults used ONLY when SocialMediaBios has no data for the channel
// (first-time brand, scan not yet run). Once a real scan exists, deriveVisualSpecs()
// overrides them with whatever top_format the brand's actual feed shows — could be
// carousel, video, single image, reel — depends entirely on the brand.
// These are intentionally neutral; the brand-specific style comes from SMB and Branding Bio.
const CB_CHANNEL_DEFAULT_SPECS = {
  Instagram: { aspectRatio: '1:1 (square)',        format: 'Single image',   style: 'Photography', quality: '8K resolution', lens: '35mm f/1.8', lighting: 'Natural light',             palette: 'Brand palette from Branding Bio' },
  TikTok:    { aspectRatio: '9:16 (vertical)',     format: 'Video thumbnail', style: 'Photography', quality: '8K resolution', lens: '35mm f/1.4', lighting: 'Natural light',            palette: 'Brand palette from Branding Bio' },
  LinkedIn:  { aspectRatio: '1:1 (square)',        format: 'Single image',   style: 'Photography', quality: '8K resolution', lens: '35mm f/1.8', lighting: 'Diffused daylight',         palette: 'Brand palette from Branding Bio' },
};

// Map SMB / Apify "top format" strings → our format dropdown value.
// Apify uses "Sidecar" for Instagram carousels, "Image" for single photos, etc.
const SMB_FORMAT_MAP = {
  reel:        'Reel cover',
  reels:       'Reel cover',
  reel_cover:  'Reel cover',
  video:       'Video thumbnail',
  carousel:    'Carousel slide',
  sidecar:     'Carousel slide',   // Apify Instagram → carousel
  image:       'Single image',
  photo:       'Single image',
  story:       'Story',
  post:        'Single image',     // LinkedIn / generic
  article:     'Single image',
};

// Which formats imply which aspect ratios.
const FORMAT_ASPECT_HINT = {
  'Reel cover':     '9:16 (vertical)',
  'Story':          '9:16 (vertical)',
  'Video thumbnail':'9:16 (vertical)',
  'Carousel slide': '1:1 (square)',
  'Single image':   '1:1 (square)',
};

// Derive specs for a channel using SocialMediaBios context (if available)
// layered on top of the channel defaults.
function deriveVisualSpecs(channel) {
  // Start from neutral channel-level fallback (used only if SMB has nothing yet).
  const base = { ...(CB_CHANNEL_DEFAULT_SPECS[channel] || CB_CHANNEL_DEFAULT_SPECS.Instagram) };
  try {
    const smbChannel = (socialBiosData?.channels || []).find(c => c.name === channel);
    if (smbChannel) {
      // Use the SMB top-format histogram to pick what the brand ACTUALLY posts most.
      // Build a count of formats across topPosts and pick the most frequent — this
      // is more accurate than the single `primaryFormat` field, especially on LinkedIn
      // where Apify labels everything as "post" but `images.length > 1` means carousel.
      const FMT_ALIAS = { sidecar: 'carousel', photo: 'image', reels: 'reel' };
      const norm = (raw) => {
        const k = String(raw || '').toLowerCase().trim();
        return FMT_ALIAS[k] || k;
      };
      const topPosts = Array.isArray(smbChannel.topPosts) ? smbChannel.topPosts : [];
      const counts = {};
      for (const p of topPosts) {
        // Derive a "real" format: if a "post" has 2+ images, treat as carousel.
        let fmt = norm(p.format);
        const imgsLen = Array.isArray(p.images) ? p.images.length : 0;
        if ((fmt === 'post' || fmt === 'image') && imgsLen > 1) fmt = 'carousel';
        if (fmt) counts[fmt] = (counts[fmt] || 0) + 1;
      }
      let topFmt = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
      // Fall back to the channel-level field if topPosts is empty.
      if (!topFmt) {
        topFmt = norm(smbChannel.topFormat || smbChannel.top_format || smbChannel.primaryFormat || smbChannel.format);
      }
      const mappedFormat = SMB_FORMAT_MAP[topFmt];
      if (mappedFormat) {
        base.format = mappedFormat;
        if (FORMAT_ASPECT_HINT[mappedFormat]) base.aspectRatio = FORMAT_ASPECT_HINT[mappedFormat];
      }
    }
    // Brand palette — if Branding Bio has one, prefer "Brand palette from Branding Bio" so n8n can substitute.
    if (Array.isArray(brandKitData?.palette) && brandKitData.palette.length) {
      base.palette = 'Brand palette from Branding Bio';
    }
  } catch (_) { /* SMB might not be hydrated yet — silently use defaults */ }
  return base;
}

// Compose the final prompt string sent to WF09 by concatenating the creative
// concept with the editable specs. Empty values are dropped.
function composeVisualPrompt(concept, specs) {
  const c = (concept || '').trim();
  const s = specs || {};
  const technical = [
    s.aspectRatio, s.format, s.style, s.quality, s.lens, s.lighting, s.palette,
  ].filter(Boolean).join(' · ');
  if (!c && !technical) return '';
  if (!c) return technical;
  if (!technical) return c;
  return `${c}\n\n[Technical specs] ${technical}`;
}

function renderContentBuilderVerticals() {
  const list = document.getElementById('cb-vertical-list');
  if (!list) return;
  const slot = getCbCampaign();
  if (!slot.verticals.length) {
    list.innerHTML = '<span style="font-size:11px; color:var(--text-muted); font-style:italic;">Aún no agregaste verticales para este canal — escribí uno y dale Enter.</span>';
    return;
  }
  list.innerHTML = slot.verticals.map((v, i) => `
    <span class="cb-vertical-tag">
      ${escapeHtml(v)}
      <button onclick="removeContentBuilderVertical(${i})" title="Eliminar">×</button>
    </span>
  `).join('');
}

function addContentBuilderVertical() {
  const input = document.getElementById('cb-vertical-input');
  if (!input) return;
  const raw = (input.value || '').trim();
  if (!raw) return;
  const slot = getCbCampaign();
  const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
  for (const p of parts) {
    if (!slot.verticals.includes(p)) slot.verticals.push(p);
  }
  input.value = '';
  renderContentBuilderVerticals();
}

function removeContentBuilderVertical(idx) {
  const slot = getCbCampaign();
  slot.verticals.splice(idx, 1);
  renderContentBuilderVerticals();
}

// ── ContentBuilder · Brand-wide verticales (productos / unidades de negocio) ─
// Single source of truth = brandKitData.verticals, hydrated by WF00 scraper and
// persisted into brand_profiles.data_json.verticals so WF07 can read them.
// Each vertical carries a `channels` map (Instagram/TikTok/LinkedIn) with
// {enabled, postsPerMonth} so ContentBuilder can build a per-channel × per-vertical
// editorial plan.

// Channel metadata for the per-vertical matrix. Single source of truth for the
// 3 channels ContentBuilder currently supports.
const CB_VERTICAL_CHANNELS = [
  { key: 'Instagram', emoji: '📷', color: '#E1306C', gradient: 'linear-gradient(135deg,#833AB4,#FD1D1D 60%,#FCB045)' },
  { key: 'TikTok',    emoji: '🎵', color: '#0F172A', gradient: 'linear-gradient(135deg,#25F4EE,#FE2C55)' },
  { key: 'LinkedIn',  emoji: '💼', color: '#0A66C2', gradient: 'linear-gradient(135deg,#0A66C2,#004182)' },
];

function defaultVerticalChannels() {
  // Sensible default: all channels enabled at 4 posts/mo. User can tweak per-vertical.
  return CB_VERTICAL_CHANNELS.reduce((acc, c) => {
    acc[c.key] = { enabled: true, postsPerMonth: 4 };
    return acc;
  }, {});
}

function ensureVerticalChannels(v) {
  // Back-fill for older entries (or scraper output) that don't yet carry a channels map.
  if (!v.channels || typeof v.channels !== 'object') v.channels = defaultVerticalChannels();
  for (const c of CB_VERTICAL_CHANNELS) {
    if (!v.channels[c.key]) v.channels[c.key] = { enabled: false, postsPerMonth: 0 };
  }
  return v;
}

// Which vertical (index) is currently expanded — i.e. has the pipeline DOM moved
// underneath it. `null` means the pipeline sits in its default anchor at the bottom.
let cbExpandedVerticalIdx = null;

function renderBrandVerticals() {
  const list = document.getElementById('cb-brand-vertical-list');
  if (!list) return;
  const verticals = (brandKitData.verticals || []).map(ensureVerticalChannels);

  // Detach the pipeline card from wherever it lives so the upcoming innerHTML
  // reset doesn't destroy it. Park it in a hidden limbo div on <body>.
  const pipeline = document.getElementById('cb-pipeline-card');
  if (pipeline) {
    let limbo = document.getElementById('cb-pipeline-limbo');
    if (!limbo) {
      limbo = document.createElement('div');
      limbo.id = 'cb-pipeline-limbo';
      limbo.style.display = 'none';
      document.body.appendChild(limbo);
    }
    limbo.appendChild(pipeline);
  }

  if (!verticals.length) {
    list.innerHTML = '<span style="font-size:11px; color:var(--text-muted); font-style:italic;">El scraper aún no detectó verticales — escribí los productos/unidades de negocio del cliente abajo y dale Enter.</span>';
    cbExpandedVerticalIdx = null;
    reattachPipelineToActiveSlot();
    return;
  }
  list.innerHTML = verticals.map((v, i) => {
    const badgeColor = v.source === 'scraper' ? '#7C3AED' : (v.source === 'manual' ? '#0EA5E9' : '#64748B');
    const badgeBg    = v.source === 'scraper' ? '#F3E8FF' : (v.source === 'manual' ? '#E0F2FE' : '#F1F5F9');
    const badgeText  = v.source === 'scraper' ? 'Detectado' : (v.source === 'manual' ? 'Manual' : 'Default');
    const hasProfile = v.profile && typeof v.profile === 'object' && (v.profile.summary || v.profile.one_paragraph);
    const descText = hasProfile ? (v.profile.summary || v.profile.one_paragraph) : v.desc;
    const desc = descText ? `<span style="color:var(--text-muted)"> — ${escapeHtml(descText)}</span>` : '';

    // Channel matrix: one pill per channel with toggle + posts/month number input
    const totalPosts = CB_VERTICAL_CHANNELS.reduce((s, c) => s + (v.channels[c.key].enabled ? Number(v.channels[c.key].postsPerMonth) || 0 : 0), 0);
    const channelChips = CB_VERTICAL_CHANNELS.map(c => {
      const slot = v.channels[c.key];
      const on = !!slot.enabled;
      const bg = on ? c.gradient : 'white';
      const fg = on ? 'white' : '#64748B';
      const border = on ? 'transparent' : 'var(--border)';
      return `
        <div class="cb-vchan" data-vidx="${i}" data-ch="${c.key}" style="display:inline-flex; align-items:center; gap:6px; padding:5px 4px 5px 10px; background:${bg}; color:${fg}; border:1px solid ${border}; border-radius:999px; font-size:11.5px; font-weight:600;">
          <span onclick="toggleVerticalChannel(${i}, '${c.key}')" style="display:inline-flex; align-items:center; gap:5px; cursor:pointer; user-select:none;">
            <span style="font-size:13px; line-height:1;">${c.emoji}</span>
            <span>${c.key}</span>
            <span style="opacity:${on ? 1 : 0.6}; font-size:10px; padding:1px 6px; border-radius:99px; background:${on ? 'rgba(255,255,255,0.18)' : '#F1F5F9'};">${on ? 'ON' : 'OFF'}</span>
          </span>
          <input type="number" min="0" max="60" value="${slot.postsPerMonth || 0}"
                 onchange="setVerticalChannelPosts(${i}, '${c.key}', this.value)"
                 ${on ? '' : 'disabled'}
                 title="Posts por mes"
                 style="width:38px; padding:2px 4px; border:1px solid ${on ? 'rgba(255,255,255,0.35)' : 'var(--border)'}; border-radius:5px; font-size:11px; font-weight:700; text-align:center; background:${on ? 'rgba(255,255,255,0.18)' : '#F8FAFC'}; color:${on ? 'white' : '#64748B'}; outline:none;" />
          <span style="font-size:10px; opacity:0.85; padding-right:6px;">/mes</span>
        </div>
      `;
    }).join('');

    const isExpanded = cbExpandedVerticalIdx === i;
    const expandBg   = isExpanded ? '#7C3AED' : 'white';
    const expandFg   = isExpanded ? 'white'   : '#7C3AED';
    const expandIcon = isExpanded ? '▲' : '▼';
    const expandText = isExpanded ? 'Cerrar pipeline'
                                  : `Generar contenido para ${escapeHtml(v.name)}`;

    return `
      <div class="cb-brand-vertical-row" style="padding:10px 12px; background:white; border:1px solid ${isExpanded ? '#7C3AED' : '#E9D5FF'}; border-radius:10px;${isExpanded ? ' box-shadow:0 4px 18px rgba(124,58,237,0.18);' : ''}">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span style="font-size:9.5px; font-weight:700; color:${badgeColor}; background:${badgeBg}; padding:2px 6px; border-radius:99px; letter-spacing:0.3px; text-transform:uppercase;">${badgeText}</span>
          <strong style="color:#4C1D95; font-size:13px;">${escapeHtml(v.name)}</strong>
          ${hasProfile ? `<span title="Perfil de contenido generado por WF15 — los agentes lo usan para escribir contenido propio de esta vertical" style="font-size:9.5px; font-weight:700; color:#7C3AED; background:#F3E8FF; border:1px solid #E9D5FF; padding:2px 7px; border-radius:99px; letter-spacing:0.3px;">✦ PERFIL IA</span>` : `<span title="Esta vertical aún no tiene perfil de contenido — dale a 'Perfilar verticales'" style="font-size:9.5px; font-weight:700; color:#92929D; background:#F1F5F9; border:1px solid var(--border); padding:2px 7px; border-radius:99px; letter-spacing:0.3px;">sin perfil</span>`}
          ${desc}
          <span style="margin-left:auto; display:inline-flex; align-items:center; gap:6px;">
            <span style="font-size:10.5px; color:var(--text-muted); background:#FAF5FF; border:1px solid #E9D5FF; padding:2px 8px; border-radius:99px;"><strong style="color:#4C1D95">${totalPosts}</strong> posts/mes</span>
            ${hasProfile ? `<button onclick="viewVerticalProfile(${i})" title="Ver el perfil de contenido" style="background:none;border:1px solid #E9D5FF;color:#7C3AED;cursor:pointer;padding:3px 8px;font-size:11px;border-radius:5px;">ver perfil</button>` : ''}
            <button onclick="editBrandVerticalDesc(${i})" title="Editar descripción" style="background:none;border:1px solid var(--border);color:#7C3AED;cursor:pointer;padding:3px 8px;font-size:11px;border-radius:5px;">edit</button>
            <button onclick="removeBrandVertical(${i})" title="Eliminar" style="background:none;border:1px solid var(--border);color:#991B1B;cursor:pointer;padding:3px 8px;font-size:13px;line-height:1;border-radius:5px;">×</button>
          </span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
          ${channelChips}
        </div>
        <div style="margin-top:10px; display:flex; justify-content:center;">
          <button onclick="toggleVerticalExpansion(${i})" style="display:inline-flex; align-items:center; gap:6px; padding:7px 16px; background:${expandBg}; color:${expandFg}; border:1px solid #7C3AED; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer;">
            <span>${expandIcon}</span>
            <span>${expandText}</span>
          </button>
        </div>
        ${isExpanded ? `<div id="cb-vertical-pipeline-slot-${i}" style="margin-top:12px;"></div>` : ''}
      </div>
    `;
  }).join('');

  // After re-rendering the verticals list, put the pipeline back where it
  // belongs — inside the expanded vertical's slot, or back at the anchor.
  reattachPipelineToActiveSlot();
}

function reattachPipelineToActiveSlot() {
  const pipeline = document.getElementById('cb-pipeline-card');
  if (!pipeline) return;
  if (cbExpandedVerticalIdx !== null) {
    const slot = document.getElementById('cb-vertical-pipeline-slot-' + cbExpandedVerticalIdx);
    if (slot) { slot.appendChild(pipeline); return; }
  }
  const anchor = document.getElementById('cb-pipeline-anchor');
  if (anchor) anchor.appendChild(pipeline);
}

function toggleVerticalExpansion(idx) {
  const v = brandKitData.verticals?.[idx];
  if (!v) return;
  cbWithCellSwitch(() => {
  if (cbExpandedVerticalIdx === idx) {
    // Collapse — go back to "mix all" mode
    cbExpandedVerticalIdx = null;
    cbActiveVertical = null;
  } else {
    // Expand this vertical — also set it as the active vertical so n8n payloads
    // and the channel tab auto-switch reflect the user's intent.
    cbExpandedVerticalIdx = idx;
    cbActiveVertical = v.name;

    // Auto-switch the channel tab to the first channel enabled for this vertical
    // (skip the matrix if everything is disabled).
    ensureVerticalChannels(v);
    const firstEnabled = CB_VERTICAL_CHANNELS.find(c => v.channels[c.key]?.enabled);
    if (firstEnabled && typeof setContentBuilderTab === 'function') {
      setContentBuilderTab(firstEnabled.key);
    }
  }
  renderBrandVerticals();
  renderActiveVerticalSelect();
  // Scroll the expanded row into view so the pipeline is visible without manual scrolling.
  if (cbExpandedVerticalIdx !== null) {
    setTimeout(() => {
      const slot = document.getElementById('cb-vertical-pipeline-slot-' + cbExpandedVerticalIdx);
      if (slot) slot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
  });
}

function toggleVerticalChannel(idx, channelKey) {
  const v = brandKitData.verticals?.[idx];
  if (!v) return;
  ensureVerticalChannels(v);
  const slot = v.channels[channelKey];
  slot.enabled = !slot.enabled;
  if (slot.enabled && (!slot.postsPerMonth || slot.postsPerMonth <= 0)) slot.postsPerMonth = 4;
  renderBrandVerticals();
  persistBrandVerticals();
}

function setVerticalChannelPosts(idx, channelKey, value) {
  const v = brandKitData.verticals?.[idx];
  if (!v) return;
  ensureVerticalChannels(v);
  const n = Math.max(0, Math.min(60, parseInt(value, 10) || 0));
  v.channels[channelKey].postsPerMonth = n;
  if (n === 0) v.channels[channelKey].enabled = false;
  renderBrandVerticals();
  persistBrandVerticals();
}

function addBrandVertical() {
  const nameInput = document.getElementById('cb-brand-vertical-name');
  const descInput = document.getElementById('cb-brand-vertical-desc');
  if (!nameInput) return;
  const name = (nameInput.value || '').trim();
  if (!name) return;
  const desc = (descInput?.value || '').trim();
  brandKitData.verticals = brandKitData.verticals || [];
  if (brandKitData.verticals.some(v => v.name.toLowerCase() === name.toLowerCase())) {
    showToast(`"${name}" ya existe en las verticales.`);
    return;
  }
  brandKitData.verticals.push({ name, desc, source: 'manual', channels: defaultVerticalChannels() });
  nameInput.value = '';
  if (descInput) descInput.value = '';
  renderBrandVerticals();
  persistBrandVerticals();
}

function removeBrandVertical(idx) {
  if (!brandKitData.verticals?.[idx]) return;
  brandKitData.verticals.splice(idx, 1);
  renderBrandVerticals();
  persistBrandVerticals();
}

function editBrandVerticalDesc(idx) {
  const v = brandKitData.verticals?.[idx];
  if (!v) return;
  const newDesc = prompt(`Descripción para "${v.name}" (audiencia + valor en 1 oración):`, v.desc || '');
  if (newDesc === null) return;
  v.desc = newDesc.trim();
  v.source = v.source === 'scraper' ? 'edited' : (v.source || 'manual');
  renderBrandVerticals();
  persistBrandVerticals();
}

// Read-only modal that renders the WF15 content profile for one vertical so the
// user can see exactly what the generator agents now receive.
function viewVerticalProfile(idx) {
  const v = brandKitData.verticals?.[idx];
  if (!v || !v.profile) return;
  const p = v.profile;
  const esc = (s) => escapeHtml(String(s == null ? '' : s));
  const textRow = (label, val) => val ? `<div style="margin-bottom:10px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#7C3AED;margin-bottom:2px;">${label}</div><div style="font-size:13px;color:#1E293B;line-height:1.5;">${esc(val)}</div></div>` : '';
  const listRow = (label, arr) => Array.isArray(arr) && arr.length ? `<div style="margin-bottom:10px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#7C3AED;margin-bottom:4px;">${label}</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${arr.map(x => `<span style="font-size:11.5px;background:#F3E8FF;color:#4C1D95;border:1px solid #E9D5FF;padding:2px 9px;border-radius:99px;">${esc(x)}</span>`).join('')}</div></div>` : '';
  const when = v.profileUpdatedAt ? new Date(v.profileUpdatedAt).toLocaleString() : '';

  const overlay = document.createElement('div');
  overlay.id = 'cb-vprofile-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;';
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div style="background:white;border-radius:14px;max-width:680px;width:100%;max-height:86vh;overflow:auto;box-shadow:0 24px 60px rgba(0,0,0,0.3);">
      <div style="position:sticky;top:0;background:linear-gradient(135deg,#7C3AED,#4C1D95);color:white;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:9.5px;font-weight:700;letter-spacing:0.5px;opacity:0.85;text-transform:uppercase;">✦ Perfil de contenido · WF15</div>
          <div style="font-size:17px;font-weight:700;margin-top:2px;">${esc(v.name)}</div>
        </div>
        <button onclick="document.getElementById('cb-vprofile-modal').remove()" style="background:rgba(255,255,255,0.18);border:none;color:white;width:30px;height:30px;border-radius:8px;font-size:18px;cursor:pointer;line-height:1;">×</button>
      </div>
      <div style="padding:20px;">
        ${textRow('Resumen', p.summary)}
        ${textRow('Audiencia', p.audience)}
        ${textRow('Propuesta de valor', p.value_prop)}
        ${listRow('Pain points', p.pain_points)}
        ${listRow('Proof points', p.proof_points)}
        ${listRow('Vocabulario', p.vocabulary)}
        ${listRow('Ángulos de contenido', p.content_angles)}
        ${textRow('Ajuste de tono', p.tone_shift)}
        ${textRow('Briefing', p.one_paragraph)}
        ${when ? `<div style="margin-top:14px;font-size:10.5px;color:var(--text-muted);">Perfilada ${esc(when)} · fuente: ${esc(v.profile.profiler || 'wf15')}</div>` : ''}
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

// Merge-and-upsert: read current brand_profiles.data_json, replace only the
// `verticals` field, write back. Falls back to no-op if there's no brandId yet
// (e.g. demo state before Branding Bio has been saved).
async function persistBrandVerticals() {
  if (!brandKitData.brandId) return; // nothing to persist against yet
  try {
    const rows = await supabaseGet(`brand_profiles?brand_id=eq.${brandKitData.brandId}&select=data_json`);
    const current = rows?.[0]?.data_json || {};
    current.verticals = brandKitData.verticals || [];
    await supabaseUpsert('brand_profiles', {
      brand_id:   brandKitData.brandId,
      data_json:  current,
      updated_at: new Date().toISOString(),
    }, 'brand_id');
  } catch (e) {
    console.warn('[verticals] persist failed:', e);
  }
}

// Active vertical = which product/business unit the next Generate Brief / Build Draft call targets.
// `null` means "all" (sends the full verticals list to n8n; default behaviour).
let cbActiveVertical = null;

function setActiveVertical(name) {
  cbWithCellSwitch(() => {
    cbActiveVertical = name && name !== '__all__' ? name : null;
  });
}

function renderActiveVerticalSelect() {
  const sel = document.getElementById('cb-active-vertical');
  if (!sel) return;
  const verticals = brandKitData.verticals || [];
  const current = cbActiveVertical;
  const options = ['<option value="__all__">Todas las verticales (mix)</option>']
    .concat(verticals.map(v => `<option value="${escapeHtml(v.name)}"${v.name === current ? ' selected' : ''}>${escapeHtml(v.name)}</option>`));
  sel.innerHTML = options.join('');
  sel.onchange = (e) => setActiveVertical(e.target.value);
}

// Pull verticals from brand_profiles into brandKitData if the local copy is empty
// (e.g. when the user lands on ContentBuilder before scanning the website).
async function hydrateBrandVerticalsFromSupabase() {
  if (!brandKitData.brandId) return;
  if ((brandKitData.verticals || []).length) return; // local copy wins
  try {
    const rows = await supabaseGet(`brand_profiles?brand_id=eq.${brandKitData.brandId}&select=data_json`);
    const remote = rows?.[0]?.data_json?.verticals;
    if (Array.isArray(remote) && remote.length) {
      brandKitData.verticals = remote;
      renderBrandVerticals();
    }
  } catch (e) {
    console.warn('[verticals] hydrate failed:', e);
  }
}

// Pull the per-vertical content profiles WF15 wrote into `vertical_profiles`
// and merge them onto the matching brandKitData.verticals entries (by name).
// This is what makes the generator agents produce vertical-specific content:
// the `profile` object rides along inside `selected_vertical` in every payload.
async function hydrateVerticalProfilesFromSupabase() {
  if (!brandKitData.brandId) return;
  if (!(brandKitData.verticals || []).length) return;
  try {
    const rows = await supabaseGet(`vertical_profiles?brand_id=eq.${brandKitData.brandId}&select=vertical_name,source_url,profile_json,updated_at`);
    if (!Array.isArray(rows) || !rows.length) return;
    const byName = new Map(rows.map(r => [(r.vertical_name || '').toLowerCase().trim(), r]));
    let merged = 0;
    for (const v of brandKitData.verticals) {
      const row = byName.get((v.name || '').toLowerCase().trim());
      if (row && row.profile_json && typeof row.profile_json === 'object') {
        v.profile = row.profile_json;
        v.profileUpdatedAt = row.updated_at || null;
        merged++;
      }
    }
    if (merged) renderBrandVerticals();
  } catch (e) {
    console.warn('[vertical-profiles] hydrate failed:', e);
  }
}

// ── WF15 — Vertical Profiler trigger ────────────────────────────────────────
// Claude reads the brand website and writes a structured content profile per
// vertical into `vertical_profiles`. One call profiles ALL verticals at once.
const WF15_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf15-vertical-profiler';

async function profileBrandVerticals() {
  const btn = document.getElementById('cb-profile-verticals');
  if (!brandKitData.brandId) {
    showToast('Branding Bio aún no fue guardado. Andá a Branding Bio → Save & Sync primero.');
    return;
  }
  const names = (brandKitData.verticals || []).map(v => v.name).filter(Boolean);
  if (!names.length) {
    showToast('No hay verticales para perfilar. Detectá o agregá verticales primero.');
    return;
  }
  const websiteUrl = brandKitData.websiteUrl;
  if (!websiteUrl) {
    showToast('Falta el website del cliente. Cargalo en Branding Bio primero.');
    return;
  }
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" style="width:11px;animation:spin 1s linear infinite;vertical-align:middle;margin-right:5px"></i>Perfilando…';
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });
  }
  try {
    const res = await fetch(WF15_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: brandKitData.brandId, website_url: websiteUrl, vertical_names: names }),
    });
    const bodyText = await res.text();
    let body; try { body = JSON.parse(bodyText); } catch { body = null; }
    if (Array.isArray(body)) body = body[0];
    if (!res.ok || !body?.ok) {
      console.warn('[WF15] unexpected response:', res.status, bodyText.slice(0, 400));
      showToast('WF15 no devolvió perfiles. Revisá el workflow.', 'error');
      return;
    }
    // Pull the freshly-written profiles back and merge them in.
    await hydrateVerticalProfilesFromSupabase();
    showToast(`Perfiladas ${body.upserted} vertical${body.upserted === 1 ? '' : 'es'} ✓ — los agentes ya las usan.`);
  } catch (e) {
    console.error('[WF15] failed:', e);
    showToast('Error al perfilar verticales: ' + (e.message || e), 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="sparkles" style="width:11px;vertical-align:middle;margin-right:5px"></i>Perfilar verticales';
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });
    }
  }
}

// Force a re-pull from brand_profiles — overrides local copy with whatever's
// in Supabase right now. Triggered by the "Sync Branding Bio" button so the user
// can pick up changes made in Branding Bio without reloading the page.
async function syncFromBrandingBio() {
  const btn = document.getElementById('cb-sync-brand');
  if (!brandKitData.brandId) {
    showToast('Branding Bio aún no fue guardado. Andá a Branding Bio → Save & Sync primero.');
    return;
  }
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" style="width:11px;animation:spin 1s linear infinite;vertical-align:middle;margin-right:5px"></i>Sincronizando…';
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });
  }
  try {
    console.log('[sync] brand_id =', brandKitData.brandId, '· local verticales =', (brandKitData.verticals || []).map(v => v.name));
    const rows = await supabaseGet(`brand_profiles?brand_id=eq.${brandKitData.brandId}&select=data_json`);
    const remote = rows?.[0]?.data_json;
    console.log('[sync] remote profile fetched:', remote ? `verticales=${(remote.verticals || []).map(v => v.name).join(', ') || '(empty)'}` : '(no row)');
    if (!remote) {
      showToast('No hay brand profile guardado para este brand_id. Guardá desde Branding Bio.');
      return;
    }
    // Verticals — MERGE remote into local (union by lowercased name). NEVER wipe local
    // entries on sync: if Branding Bio hasn't been re-saved yet, remote could be empty
    // or stale and we'd lose verticales the user just detected/added.
    const remoteVerticals = Array.isArray(remote.verticals) ? remote.verticals : [];
    const localVerticals  = brandKitData.verticals || [];
    const seen = new Set();
    const merged = [];
    for (const v of localVerticals) {
      const key = (v.name || '').toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(v);
    }
    let added = 0;
    for (const r of remoteVerticals) {
      const name = r.name || r.title;
      const key  = (name || '').toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push({
        name,
        desc:     r.desc || r.description || '',
        source:   r.source || 'scraper',
        channels: r.channels,
      });
      added++;
    }
    brandKitData.verticals = merged.map(ensureVerticalChannels);

    // Identity fields — keep ContentBuilder's header / tag chips in sync too
    if (remote.identity?.company_name) brandKitData.name     = remote.identity.company_name;
    if (remote.identity?.industry)     brandKitData.industry = remote.identity.industry;
    if (remote.identity?.tagline)      brandKitData.tagline  = remote.identity.tagline;
    if (Array.isArray(remote.personas) && remote.personas.length) brandKitData.personas = remote.personas;

    renderBrandVerticals();
    renderActiveVerticalSelect();
    // Re-attach WF15 content profiles (remote-added verticals don't carry one).
    hydrateVerticalProfilesFromSupabase();
    if (remoteVerticals.length === 0) {
      showToast(`Branding Bio remoto no tiene verticales guardadas. Conservé tus ${localVerticals.length} vertical${localVerticals.length === 1 ? '' : 'es'} locales — guardá desde Branding Bio para sincronizar.`);
    } else {
      showToast(`Sincronizado: ${remoteVerticals.length} remota(s) · ${added} agregada(s) · total ${brandKitData.verticals.length}.`);
    }
  } catch (e) {
    console.error('[sync] failed:', e);
    showToast('Error al sincronizar: ' + (e.message || e));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:5px"></i>Sync Branding Bio';
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });
    }
  }
}

function useSampleVisualPrompt() {
  const ta = document.getElementById('cb-visual-prompt');
  if (!ta) return;
  const profile = CB_CHANNEL_PROFILES[contentBuilderActiveTab];
  const sample = profile?.visualPromptPlaceholder || '';
  ta.value = sample;
  getCbCampaign().visualPrompt = sample;
}

function useSampleAgentPrompt() {
  const ta = document.getElementById('cb-agent-prompt');
  if (!ta) return;
  const profile = CB_CHANNEL_PROFILES[contentBuilderActiveTab];
  const sample = profile?.agentPromptPlaceholder || '';
  ta.value = sample;
  getCbCampaign().agentPrompt = sample;
}

// ── WF09B — Visual Concept Suggester (per-vertical creative idea) ────────────
const WF09B_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf09b-visual-concept-suggester';

// Returns just the creative concept string (the "what's in the image") so the
// user can edit it. Tech specs stay in the UI dropdowns; they're concatenated
// client-side via composeVisualPrompt() before WF09 fires.
async function suggestVisualConcept() {
  const btn = document.getElementById('btn-suggest-visual');
  const ta  = document.getElementById('cb-visual-concept');
  if (!btn || !ta) return;
  const originalLabel = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:11px;animation:spin 1s linear infinite;vertical-align:middle;margin-right:5px"></i>Pensando…';
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });

  try {
    const channel = contentBuilderActiveTab || 'Instagram';
    const slot    = getCbCampaign(channel);
    const specs   = slot.visualSpecs || deriveVisualSpecs(channel);
    const vertical = cbActiveVertical
      ? (brandKitData.verticals || []).find(v => v.name === cbActiveVertical) || null
      : null;
    // Pull the best-performing recent posts for this channel so the model can
    // STUDY what's already working AND see the actual feed images.
    const smbChannel  = (socialBiosData?.channels || []).find(c => c.name === channel) || null;
    const topPosts    = smbChannel?.topPosts || smbChannel?.posts || [];
    const topPost     = smbChannel?.bestPost || topPosts[0] || null;
    // Extract direct image URLs from top posts so WF09B can fetch them as
    // multimodal reference for the OpenAI suggester.
    const topPostUrls = topPosts
      .map(p => p.imageUrl || p.displayUrl || p.media_url || p.mediaUrl || (Array.isArray(p.images) ? p.images[0] : null))
      .filter(u => typeof u === 'string' && u.startsWith('http'))
      .slice(0, 3);
    const payload = {
      brand_id:        brandKitData.brandId,
      channel,
      vertical:        vertical ? { name: vertical.name, desc: vertical.desc || '', profile: vertical.profile || null } : null,
      specs,
      top_post_urls:   topPostUrls,
      smb_context: smbChannel ? {
        handle:           smbChannel.handle || null,
        top_format:       smbChannel.topFormat || smbChannel.top_format || null,
        engagement_rate:  smbChannel.avgEngagementRate ?? null,
        tone_summary:     smbChannel.toneSummary || null,
        best_post:        topPost ? {
          snippet:    topPost.snippet || '',
          why:        topPost.whyItWorked || '',
          imageUrl:   topPost.imageUrl || topPost.displayUrl || null,
        } : null,
        top_post_urls:    topPostUrls,
      } : null,
    };
    console.log('[WF09B] sending payload:', payload);
    const res = await fetch(WF09B_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const bodyText = await res.text();
    let body;
    try { body = JSON.parse(bodyText); } catch { body = { concept: bodyText }; }
    if (Array.isArray(body)) body = body[0];
    if (body?.json) body = body.json;

    const concept = (body?.concept || body?.visual_concept || body?.text || '').trim();
    if (!concept) {
      showToast('WF09B no devolvió un concepto. Revisá el workflow.', 'error');
      console.warn('[WF09B] empty/unexpected response:', body);
      return;
    }
    ta.value = concept;
    slot.visualConcept = concept;
    refreshVisualPromptPreview();
    showToast('Concepto visual sugerido por IA — editalo si querés.');
  } catch (e) {
    console.error('[WF09B] error:', e);
    showToast('Error sugiriendo concepto: ' + (e.message || e), 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalLabel;
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });
  }
}

// Recompose the read-only preview every time concept or any spec changes.
function refreshVisualPromptPreview() {
  const channel = contentBuilderActiveTab || 'Instagram';
  const slot    = getCbCampaign(channel);
  const preview = document.getElementById('cb-visual-preview');
  if (preview) {
    const text = composeVisualPrompt(slot.visualConcept, slot.visualSpecs);
    const isCarousel = (slot.visualSpecs?.format || '') === 'Carousel slide';
    const slideTag = isCarousel ? `[${slot.slideCount || 3} slides] ` : '';
    preview.textContent = text ? `${slideTag}${text}` : '(sin contenido — completá el concepto o pedile sugerencia a la IA)';
  }
}

// Re-derive specs from channel + SMB and update both state and the UI dropdowns.
function resetVisualSpecsToDefault(channel) {
  const ch   = channel || contentBuilderActiveTab || 'Instagram';
  const slot = getCbCampaign(ch);
  slot.visualSpecs = deriveVisualSpecs(ch);
  renderVisualSpecsControls(ch);
  refreshVisualPromptPreview();
}

function renderVisualSpecsControls(channel) {
  const ch   = channel || contentBuilderActiveTab || 'Instagram';
  const slot = getCbCampaign(ch);
  if (!slot.visualSpecs) slot.visualSpecs = deriveVisualSpecs(ch);
  const container = document.getElementById('cb-visual-specs');
  if (!container) return;
  const keys = ['aspectRatio', 'format', 'style', 'quality', 'lens', 'lighting', 'palette'];
  const labels = {
    aspectRatio: 'Aspect ratio', format: 'Formato', style: 'Estilo',
    quality: 'Calidad', lens: 'Lente', lighting: 'Iluminación', palette: 'Paleta',
  };
  const chips = keys.map(k => {
    const current = slot.visualSpecs[k] || (VISUAL_SPEC_OPTIONS[k]?.[0] ?? '');
    // Include current value as an option even if it's not in the catalog (so user-typed values survive).
    const opts = Array.from(new Set([current, ...(VISUAL_SPEC_OPTIONS[k] || [])])).filter(Boolean);
    return `
      <label class="cb-spec-chip" style="display:inline-flex;flex-direction:column;gap:2px;padding:6px 10px;background:white;border:1px solid var(--border);border-radius:8px;font-size:11px;">
        <span style="text-transform:uppercase;letter-spacing:0.4px;color:var(--text-muted);font-weight:700;font-size:9.5px;">${labels[k]}</span>
        <select data-spec-key="${k}" onchange="updateVisualSpec('${k}', this.value)" style="border:none;background:none;font-size:12px;font-weight:600;color:var(--text-main);outline:none;padding:0;cursor:pointer;max-width:240px;">
          ${opts.map(o => `<option value="${escapeHtml(o)}"${o === current ? ' selected' : ''}>${escapeHtml(o)}</option>`).join('')}
        </select>
      </label>
    `;
  });

  // Slide count chip — only shown when the chosen format is Carousel slide.
  // The visual-gen workflow will read this and generate N images instead of 1.
  const isCarousel = (slot.visualSpecs.format || '') === 'Carousel slide';
  if (isCarousel) {
    const current = slot.slideCount || 3;
    chips.push(`
      <label class="cb-spec-chip" style="display:inline-flex;flex-direction:column;gap:2px;padding:6px 10px;background:#FDF4FF;border:1px solid #E9D5FF;border-radius:8px;font-size:11px;">
        <span style="text-transform:uppercase;letter-spacing:0.4px;color:#6B21A8;font-weight:700;font-size:9.5px;">Slides</span>
        <select onchange="updateSlideCount(this.value)" style="border:none;background:none;font-size:12px;font-weight:700;color:#5B21B6;outline:none;padding:0;cursor:pointer;">
          ${[3, 5, 7].map(n => `<option value="${n}"${n === Number(current) ? ' selected' : ''}>${n} slides</option>`).join('')}
        </select>
      </label>
    `);
  }

  container.innerHTML = chips.join('');
}

function updateVisualSpec(key, value) {
  const ch   = contentBuilderActiveTab || 'Instagram';
  const slot = getCbCampaign(ch);
  if (!slot.visualSpecs) slot.visualSpecs = deriveVisualSpecs(ch);
  slot.visualSpecs[key] = value;
  // Format changed → re-render so the Slides dropdown appears/disappears.
  if (key === 'format') renderVisualSpecsControls(ch);
  refreshVisualPromptPreview();
}

function updateSlideCount(value) {
  const ch   = contentBuilderActiveTab || 'Instagram';
  const slot = getCbCampaign(ch);
  slot.slideCount = Math.max(1, parseInt(value, 10) || 3);
  refreshVisualPromptPreview();
}

function hydrateContentBuilderCampaign() {
  // Activate the current tab so verticales, persona, format and visual prompt all reflect it
  if (typeof setContentBuilderTab === 'function') setContentBuilderTab(contentBuilderActiveTab || 'Instagram');
  // Capture the empty-state HTML of each output container NOW (fresh DOM) so an
  // empty cell restores cleanly even before any brand is saved.
  cbCaptureDefaultsOnce();
  // Brand-wide verticales — render local copy first, then try to pull from Supabase
  renderBrandVerticals();
  renderActiveVerticalSelect();
  hydrateBrandVerticalsFromSupabase()
    .then(() => hydrateVerticalProfilesFromSupabase())
    .then(() => cbHydrateCellsFromSupabase())
    .then(renderActiveVerticalSelect);

  // If SocialMediaBios is still showing mock data (e.g. user landed on ContentBuilder
  // directly without visiting SMB first), try to pull the real analysis from Supabase
  // so the context pills and Auto-specs reflect actual brand data, not seed defaults.
  if (socialBiosData.isMock !== false) {
    fetchSocialBios(brandKitData.brandId).then(stored => {
      if (stored && Array.isArray(stored.channels) && stored.channels.length) {
        socialBiosData.lastScannedAt = stored.scanned_at;
        socialBiosData.channels      = stored.channels;
        socialBiosData.isMock        = false;
        // Re-render the parts of ContentBuilder that depend on SMB context.
        if (typeof hydrateContentBuilderContext === 'function') hydrateContentBuilderContext();
        Object.keys(contentBuilderCampaign).forEach(ch => {
          contentBuilderCampaign[ch].visualSpecs = null;
        });
        if (document.getElementById('cb-visual-specs')) {
          resetVisualSpecsToDefault(contentBuilderActiveTab);
        }
      }
    }).catch(err => console.warn('[ContentBuilder] could not hydrate SMB from Supabase:', err));
  }
}

// ── ContentBuilder · channel profiles (Instagram / TikTok / LinkedIn) ─
const CB_CHANNEL_PROFILES = {
  Instagram: {
    label: 'Instagram',
    emoji: '📷',
    color: '#E1306C',
    gradient: 'linear-gradient(135deg,#833AB4,#FD1D1D 60%,#FCB045)',
    pillBg: '#FCE7F3', pillFg: '#9D174D',
    personas: ['Founders LATAM','Marketing Ops','Creators Tech','Comunidad LATAM'],
    formatLabel: 'Reel cover 1080×1920 (9:16) · alterna con carrusel 1080×1080',
    formatHint: 'Reels verticales con hook en primer frame, carruseles educativos multi-slide, on-brand grid.',
    briefHint: 'Hook visual en 1.5s + valor concreto + caption corto + CTA "guardalo" o "comentá".',
    visualPromptPlaceholder: 'Vertical 9:16 photography for an Instagram Reel cover targeting LATAM founders. Close-up over-the-shoulder shot of a young entrepreneur in a softly lit home-office at golden hour, watching an AI agent build itself on a curved 4K monitor — visible n8n nodes and chat-style logs flowing on screen. Floating UI elements (golden glow particles, holographic data streams) drift out of the screen into the room, suggesting "the agent is alive". Color palette: warm obsidian black background, deep charcoal grey furniture, and bold gold/amber accents (SWL Consulting brand). Subject framed using rule-of-thirds in the lower half to leave clean negative space at the top for caption overlay. Shallow depth of field, cinematic film-grain texture, 8k resolution, shot on 35mm lens at f/1.8, soft warm rim lighting, scroll-stopping Instagram aesthetic, mobile-native composition.',
    agentPromptPlaceholder: 'Sos un copywriter especializado en Instagram para founders LATAM. Generá un caption que abra con un hook visual de 1.5s, entregue un valor concreto en ≤120 palabras y cierre con un CTA de "guardalo" o "comentá". Usá voseo, tono cálido y aspiracional, sin corporate blah. Alineá el caption con la vertical seleccionada y con la escena descrita en el prompt visual — el texto y la imagen tienen que contar la misma historia. Estructura sugerida: línea 1 = hook + emoji sutil · líneas 2-4 = insight/valor · línea final = CTA + 3-5 hashtags relevantes.',
    defaultVerticals: ['Casos de éxito', 'Behind-the-scenes builds', 'Tutoriales agentes IA'],
    apifyEnabled: true,
  },
  TikTok: {
    label: 'TikTok',
    emoji: '🎵',
    color: '#0F172A',
    gradient: 'linear-gradient(135deg,#25F4EE,#FE2C55)',
    pillBg: '#FCE7F3', pillFg: '#9D174D',
    personas: ['Builders LATAM','Indie Founders','Marketing Ops','Creators Tech'],
    formatLabel: 'Vertical video cover 1080×1920 (9:16) · pattern-interrupt en 0.8s',
    formatHint: 'Hook agresivo en el primer frame, screen recordings sobre voz, captions on-screen, duración 30-60s.',
    briefHint: 'Pattern interrupt en frame 1 + claim concreto con número + receipts/screen + CTA "comentá X".',
    visualPromptPlaceholder: 'Vertical 9:16 photography for a TikTok video cover targeting indie builders. Extreme close-up over-the-shoulder of a young creator pointing at a glowing MacBook screen showing an n8n workflow canvas mid-execution, with chat-style logs scrolling fast. Bold golden particles erupt from the screen into the dark room. Color palette: obsidian black background, deep charcoal grey desk, electric gold accents (SWL Consulting brand). Subject pushed to the bottom third, top half reserved for huge text overlay. Hard rim light from the laptop, slight motion blur on the particles, scroll-stopping pattern-interrupt aesthetic, 8k resolution, shot on 35mm lens at f/1.4, hyperreal mobile-native composition.',
    agentPromptPlaceholder: 'Sos un guionista de TikTok para builders indie. Escribí un guion de 30-60s con pattern-interrupt en el primer frame (claim concreto con número), payoff en 5s y receipts/screen recording en el medio. Cerrá con CTA tipo "comentá X para el stack completo". Voseo, ultra directo, cero jerga corporate. El guion tiene que coincidir con la vertical elegida y con la escena del prompt visual — si el visual muestra n8n en pantalla, el guion habla de n8n. Devolveme: (1) hook frame 1, (2) cuerpo con beats numerados, (3) caption corto + 3 hashtags.',
    defaultVerticals: ['Comparativas de tools', 'Tips n8n en 30s', 'Reactions a tendencias IA'],
    apifyEnabled: true,
  },
  LinkedIn: {
    label: 'LinkedIn',
    emoji: '💼',
    color: '#0A66C2',
    gradient: 'linear-gradient(135deg,#0A66C2,#004182)',
    pillBg: '#EFF6FF', pillFg: '#1D4ED8',
    personas: ['VP Engineering','CTO','Head of Sales','Founder B2B','RevOps Lead'],
    formatLabel: 'Single image 1200×627 · alterna con carrusel 1080×1080',
    formatHint: 'Posts largos con storytelling B2B, screenshots de tools, casos de éxito reales con métricas.',
    briefHint: 'Hook contrarian + insight + 3 lecciones numeradas + CTA hacia comentario o DM.',
    visualPromptPlaceholder: 'Professional high-end photography for a LinkedIn corporate post. A modern, minimalist office workspace where digital AI data flows (golden and white particles) are integrated into the architecture. In the background, a subtle, blurred silhouette of a professional looking at a clean holographic dashboard. Color palette: Deep charcoal grey, obsidian black, and gold accents (matching SWL Consulting style). Cinematic lighting, 8k resolution, shot on 35mm lens, sharp focus, corporate tech aesthetic.',
    agentPromptPlaceholder: 'Sos un thought-leader B2B escribiendo para LinkedIn (VPs / CTOs / Heads of Sales en LATAM). Abrí con un hook contrarian de 1 línea, seguí con un insight personal/observación de campo y entregá 3 lecciones numeradas con métricas reales. Cerrá con un CTA hacia comentario o DM. Voseo, tono competente y directo, prohibido jargon ("leverage", "seamless", "transform"). El post tiene que estar anclado en la vertical seleccionada y referenciar el setting de la imagen del prompt visual cuando aporte. Longitud objetivo: 180-260 palabras, párrafos cortos (1-2 líneas), una sola idea por párrafo.',
    defaultVerticals: ['Casos B2B con métricas', 'Lecciones de implementación', 'RevOps con IA'],
    apifyEnabled: true,
  },
};

let contentBuilderActiveTab = 'Instagram';

// Get the configured language for a channel — checks per-channel
// brandKitData.toneByChannel[i].language first, falls back to the brand-wide
// brandKitData.language, then to 'es'.
function getChannelLanguage(channel) {
  const tbc = (brandKitData.toneByChannel || []).find(t => t.channel === channel);
  return (tbc && tbc.language) || brandKitData.language || 'es';
}

// Set the publish-language for one specific channel. Creates a toneByChannel
// entry if the channel didn't have one yet. Invalidates the current agent
// state (brief / caption / visual) so the next generation uses the new lang.
function setChannelLanguage(channel, lang) {
  if (!channel || !lang) return;
  brandKitData.toneByChannel = brandKitData.toneByChannel || [];
  let tbc = brandKitData.toneByChannel.find(t => t.channel === channel);
  if (!tbc) {
    tbc = { channel, tone: '', formality: '', formalityColor: '', pattern: '', language: lang };
    brandKitData.toneByChannel.push(tbc);
  } else {
    tbc.language = lang;
  }
  if (typeof resetCbAgentState === 'function') {
    resetCbAgentState();
    setTimeout(() => updateAgentButtonsEnabled(), 0);
  }
  showToast(`Idioma de ${channel} actualizado a ${lang.toUpperCase()}. Guardá Branding Bio para persistir.`);
}

// Refresh the per-channel language <select> to show the value configured for
// the active channel. Called after tab change or initial render.
function syncChannelLanguageSelector() {
  const sel = document.getElementById('cb-channel-language');
  const lbl = document.getElementById('cb-lang-channel-name');
  if (!sel || !contentBuilderActiveTab) return;
  sel.value = getChannelLanguage(contentBuilderActiveTab);
  if (lbl) lbl.textContent = contentBuilderActiveTab;
}

function setContentBuilderTab(channel) {
  if (!CB_CHANNEL_PROFILES[channel]) return;
  // Switching channel = switching cells. Save the current cell's rendered output
  // and restore the target cell's (instead of wiping). The guard lets nested
  // callers (toggleVerticalExpansion) own the snapshot/restore boundary.
  const _outerSwitch = !_cbCellSwitching && channel !== contentBuilderActiveTab;
  if (_outerSwitch) { _cbCellSwitching = true; cbSnapshotActiveCell(); }
  contentBuilderActiveTab = channel;
  setTimeout(() => syncChannelLanguageSelector(), 0);
  const profile = CB_CHANNEL_PROFILES[channel];

  // Visual state of the tabs
  document.querySelectorAll('.cb-tab').forEach(el => {
    const isActive = el.dataset.channel === channel;
    el.classList.toggle('active', isActive);
    if (isActive) {
      const p = CB_CHANNEL_PROFILES[el.dataset.channel];
      el.style.background = p?.gradient || '';
      el.style.borderColor = p?.color || 'var(--border)';
    } else {
      el.style.background = '';
      el.style.borderColor = '';
    }
  });

  // Pipeline header label
  const hdr = document.getElementById('cb-pipeline-channel');
  if (hdr) {
    hdr.innerHTML = `${profile.emoji} ${profile.label}`;
    hdr.style.color = profile.color;
  }

  // Channel pill in step 2
  const pill = document.getElementById('cb-tag-channel');
  if (pill) {
    pill.textContent = profile.label;
    pill.style.background = profile.gradient;
    pill.style.color = 'white';
  }

  // Persona dropdown — repopulate with channel-relevant options
  const personaSel = document.getElementById('cb-persona');
  if (personaSel) {
    personaSel.innerHTML = profile.personas.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
  }

  // Brief hint shown under Step 1 title
  const briefHint = document.getElementById('cb-brief-style-hint');
  if (briefHint) briefHint.textContent = profile.briefHint;

  // Per-channel visual prompt: load this channel's stored value (or its default placeholder)
  const slot = getCbCampaign(channel);
  if (slot.visualPrompt == null || slot.visualPrompt === '') {
    slot.visualPrompt = profile.visualPromptPlaceholder;
  }
  const ta = document.getElementById('cb-visual-prompt');
  if (ta) {
    ta.placeholder = profile.visualPromptPlaceholder;
    ta.value = slot.visualPrompt;
    // Re-bind input handler so edits persist into this channel's slot
    ta.oninput = () => { getCbCampaign(channel).visualPrompt = ta.value; };
  }

  // Per-channel visual concept (creative idea) + visual specs (auto-derived from
  // channel + SMB top format). Concept is free-text editable; specs are chips.
  if (slot.visualSpecs == null) slot.visualSpecs = deriveVisualSpecs(channel);
  const vcta = document.getElementById('cb-visual-concept');
  if (vcta) {
    vcta.placeholder = profile.visualPromptPlaceholder || '';
    vcta.value = slot.visualConcept || '';
    vcta.oninput = () => {
      getCbCampaign(channel).visualConcept = vcta.value;
      refreshVisualPromptPreview();
    };
  }
  renderVisualSpecsControls(channel);
  refreshVisualPromptPreview();

  // Per-channel verticales — re-render chips for this tab
  renderContentBuilderVerticals();

  // Apify-availability banner (LinkedIn shows a "no Apify yet" warning)
  const apifyBanner = document.getElementById('cb-apify-banner');
  if (apifyBanner) {
    if (profile.apifyEnabled === false) {
      apifyBanner.style.display = '';
      apifyBanner.innerHTML = `<i data-lucide="alert-triangle" style="width:14px;vertical-align:middle;margin-right:6px;color:#F59E0B"></i><strong>${escapeHtml(profile.label)}</strong> aún no tiene acceso vía Apify — el UI está listo pero la generación queda deshabilitada hasta que conectemos el scraper.`;
      lucide.createIcons({ nodes: [apifyBanner] });
    } else {
      apifyBanner.style.display = 'none';
    }
  }

  // Disable generate buttons if Apify is not available for this channel
  ['btn-regenerate','btn-build-draft','btn-generate-visual'].forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    if (profile.apifyEnabled === false) {
      b.disabled = true;
      b.style.opacity = '0.45';
      b.style.cursor = 'not-allowed';
      b.title = `${profile.label} aún no tiene acceso vía Apify`;
    } else {
      b.disabled = false;
      b.style.opacity = '';
      b.style.cursor = '';
      b.title = '';
    }
  });

  // Hidden legacy select kept in sync so handlers that read `cb-channel` still work
  const hidden = document.getElementById('cb-channel');
  if (hidden) hidden.value = channel;

  // Refresh context strip + format recommendation for the new channel
  hydrateContentBuilderContext();

  // Refresh the "Inspired by" line so the user sees current hook/post counts for this channel
  updateContentBuilderInspirationIndicator(channel);

  // Pull the saved briefing for this channel into the textarea so the user sees
  // the locked spec WF06/WF07 will use. Switching tabs swaps briefings — each
  // channel has its own row in user_briefings.
  hydrateUserBriefingForChannel(channel);

  // Restore the target cell's rendered output (snapshot or durable data).
  if (_outerSwitch) {
    Promise.resolve(cbRestoreCell(cbActiveCellKey())).finally(() => { _cbCellSwitching = false; });
  }
}

// Builds context pills + format recommendation from SocialMediaBios analysis
function hydrateContentBuilderContext() {
  const pillsEl = document.getElementById('cb-context-pills');
  const recoEl  = document.getElementById('cb-format-recommendation');
  const recoTxt = document.getElementById('cb-format-reco-text');
  if (!pillsEl) return;

  const sel = contentBuilderActiveTab || (document.getElementById('cb-channel')?.value) || 'LinkedIn';
  // Ensure we have SocialMediaBios data, even if the user never visited that view yet
  if (!socialBiosData.channels?.length && typeof loadMockSocialBios === 'function') {
    const mock = loadMockSocialBios();
    socialBiosData.channels = mock.channels;
    socialBiosData.lastScannedAt = mock.scanned_at;
    socialBiosData.isMock = true;
  }
  const channels = Array.isArray(socialBiosData?.channels) ? socialBiosData.channels : [];
  const channelData = channels.find(c => (c.name || '').toLowerCase() === sel.toLowerCase()) || channels[0];
  const profile = CB_CHANNEL_PROFILES[sel];

  // Compute most-used format from topPosts (if SocialMediaBios has data for this channel).
  // Normalize Apify naming: "Sidecar" → "carousel", "Image" → "image", etc., so all
  // downstream lookups (icons, copy, Auto-specs) speak the same vocabulary.
  const FMT_ALIAS = { sidecar: 'carousel', photo: 'image', reels: 'reel' };
  const normalizeFmt = (raw) => {
    const k = String(raw || '').toLowerCase().trim();
    return FMT_ALIAS[k] || k;
  };
  let topFmt = '—';
  if (channelData) {
    const fmtCounts = {};
    (channelData.topPosts || []).forEach(p => {
      const n = normalizeFmt(p.format);
      if (n) fmtCounts[n] = (fmtCounts[n] || 0) + 1;
    });
    topFmt = Object.entries(fmtCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
          || normalizeFmt(channelData.primaryFormat || channelData.topFormat)
          || '—';
  }

  const fmtIcon = { carousel: 'gallery-horizontal', reel: 'film', video: 'video', image: 'image', story: 'rectangle-vertical' }[topFmt] || 'sparkles';
  const fmtCopyMap = {
    carousel: 'Carrusel multi-slide — el formato que más usa esta marca',
    reel:     'Reel vertical 9:16 — formato dominante en este perfil',
    video:    'Video corto — formato dominante en este perfil',
    image:    'Single image post — formato más frecuente',
    story:    'Story 9:16 — formato dominante',
  };
  const fmtCopy = fmtCopyMap[topFmt] || (profile?.formatHint || `Formato sugerido: ${topFmt}`);

  if (channelData) {
    pillsEl.innerHTML = `
      <span class="cb-context-pill"><span class="lbl">handle</span>${escapeHtml(channelData.handle || '—')}</span>
      <span class="cb-context-pill"><span class="lbl">followers</span>${(channelData.followers || 0).toLocaleString()}</span>
      <span class="cb-context-pill"><span class="lbl">engagement</span>${(channelData.avgEngagementRate ?? 0).toFixed(1)}%</span>
      <span class="cb-context-pill"><span class="lbl">cadencia</span>${(channelData.postingCadence ?? 0)}/sem</span>
      <span class="cb-context-pill"><span class="lbl">top format</span>${escapeHtml(topFmt)}</span>
      ${channelData.toneSummary ? `<span class="cb-context-pill" style="max-width:380px;"><span class="lbl">tono</span><span style="white-space:normal;overflow:hidden;text-overflow:ellipsis">${escapeHtml(channelData.toneSummary)}</span></span>` : ''}
    `;
  } else {
    // SocialMediaBios doesn't have a profile for this channel yet — fall back to channel-profile defaults
    pillsEl.innerHTML = `
      <span class="cb-context-pill" style="background:#FEF3C7;color:#92400E;border-color:#FDE68A">
        <i data-lucide="alert-triangle" style="width:11px;vertical-align:middle;margin-right:4px"></i>SocialMediaBios sin datos para ${escapeHtml(sel)} — usando defaults del canal
      </span>
      ${profile ? `<span class="cb-context-pill"><span class="lbl">formato</span>${escapeHtml(profile.formatLabel)}</span>` : ''}
    `;
  }

  if (recoEl && recoTxt) {
    recoEl.style.display = '';
    const recoFmt = topFmt !== '—' ? topFmt : (profile?.formatLabel || '—');
    recoTxt.innerHTML = `<i data-lucide="${fmtIcon}" style="width:13px;vertical-align:middle;margin:0 4px;color:#7C3AED"></i><strong>${escapeHtml(recoFmt)}</strong> — ${escapeHtml(fmtCopy)}`;
  }
  lucide.createIcons({ nodes: [pillsEl, recoEl].filter(Boolean) });
}

// Legacy shim — old code still calls onContentBuilderChannelChange via the (now-hidden) select
function onContentBuilderChannelChange() {
  const v = document.getElementById('cb-channel')?.value || 'LinkedIn';
  if (CB_CHANNEL_PROFILES[v]) {
    setContentBuilderTab(v);
  } else {
    hydrateContentBuilderContext();
  }
}

async function hydrateContentBuilderInsights() {
  const el = document.getElementById('cb-competitor-insights-body');
  if (!el) return;

  el.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:16px">
    <i data-lucide="loader-2" style="width:14px;animation:spin 1s linear infinite;vertical-align:middle;margin-right:6px"></i>
    Cargando insights de competidores...</div>`;
  lucide.createIcons({ nodes: [el] });

  try {
    const videos = await fetchCompetitorVideos();
    if (!videos.length) {
      el.innerHTML = `<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px;">
        No hay videos analizados. Corré el pipeline primero.</p>`;
      return;
    }

    const hooks = parseHooksFromVideos(videos);
    el.innerHTML = hooks.slice(0, 3).map(h => `
      <div style="display:flex;gap:12px;padding:12px;border:1px solid var(--border);border-radius:8px;background:white;align-items:flex-start;">
        ${h.thumbnail ? `<img src="${escapeHtml(h.thumbnail)}" style="width:64px;height:36px;object-fit:cover;border-radius:4px;flex-shrink:0;border:1px solid var(--border);" onerror="this.style.display='none'">` : ''}
        <div style="flex:1;min-width:0;">
          <div style="display:flex;gap:6px;margin-bottom:4px;flex-wrap:wrap;">
            <span class="lm-tag" style="${h.fwStyle};font-size:10px;">${h.framework}</span>
            <span style="font-size:10px;color:var(--text-muted);">@${escapeHtml(h.creator)} · ${(h.views/1000).toFixed(0)}K views${h.isConcept ? ' · concepto AI' : ''}</span>
          </div>
          <p style="font-size:13px;font-weight:600;margin:0;line-height:1.4;">"${escapeHtml(h.text.slice(0, 110))}${h.text.length > 110 ? '…' : ''}"</p>
        </div>
        <a href="${escapeHtml(h.link)}" target="_blank" style="font-size:11px;color:#3B82F6;white-space:nowrap;flex-shrink:0;">Ver ↗</a>
      </div>
    `).join('');

  } catch (err) {
    el.innerHTML = `<p style="color:var(--text-muted);font-size:12px;padding:12px;">
      <i data-lucide="wifi-off" style="width:12px;vertical-align:middle;margin-right:4px"></i>
      Social media app offline. Iniciá: <code style="background:#F3F4F6;padding:2px 4px;border-radius:3px;">npm run dev</code>
    </p>`;
    lucide.createIcons({ nodes: [el] });
    console.warn('[ContentBuilder] social-media app error:', err);
  }
}

// ── Brand → Social Media App sync ──────────────────────

function buildNewConceptsInstruction(profilePayload) {
  const id       = profilePayload.identity || {};
  const personas = Array.isArray(profilePayload.personas) ? profilePayload.personas : [];
  const tones    = Array.isArray(profilePayload.tone_by_channel) ? profilePayload.tone_by_channel : [];
  const samples  = Array.isArray(profilePayload.content_samples) ? profilePayload.content_samples : [];

  const personaList = personas.length
    ? personas.map(p => `- ${p.role || p.label}: ${[p.pains, p.triggers].filter(Boolean).join('. ')}`).join('\n')
    : '- General business audience';

  const toneList = tones.length
    ? tones.map(t => `- ${t.channel}: ${t.tone || ''} (${t.formality || ''}). ${t.pattern || ''}`).join('\n')
    : '- Professional and direct';

  const sampleRef = samples.length
    ? `\nExisting content references (voice & style to match):\n${samples.slice(0, 3).map(s => `- "${s.title}" on ${s.channel} (voice fit ${s.voiceFit}%)`).join('\n')}`
    : '';

  return `Adapt this video for ${id.company_name || 'the brand'}.

About the brand: ${id.mission || id.tagline || ''}
Industry: ${id.industry || ''}

Target audience:
${personaList}

Brand tone by channel:
${toneList}${sampleRef}

Task:
Give us 3 NEW video concepts inspired by the ORIGINAL reference.
Do not copy the original. Translate the core idea into the ${id.industry || 'brand'} context.
MAINLY iterate and sharpen the HOOKS.

Focus:
- First 3 seconds must stop the target audience from scrolling
- Hooks should challenge a belief, fear, or misconception the audience has
- Match the brand tone per channel (listed above)
- No buzzwords, no exaggeration, no hype

Output format:

# CONCEPT 1
Text description (1-3 sentences)

## HOOK
- VISUAL: what is seen in the first 2 seconds
- SPOKEN: first line said (quote it)
- WHY IT WORKS: why this hook stops a ${personas[0]?.role || 'professional'} from scrolling

## SCRIPT
Scene flow and spoken text (1-20 sentences)

# CONCEPT 2
...

# CONCEPT 3
...`;
}

function extractInstagramUsername(url) {
  if (!url) return null;
  // Handle @handle or plain username
  if (!url.includes('/')) return url.replace(/^@/, '').trim() || null;
  const m = url.match(/instagram\.com\/([A-Za-z0-9._]+)\/?/);
  return m ? m[1] : null;
}

async function discoverInstagramFromUrl(websiteUrl) {
  if (!websiteUrl) return null;
  const RESERVED = new Set(['p', 'reel', 'reels', 'stories', 'explore', 'accounts', 'about', 'help', 'legal', 'privacy', 'terms', 'share']);
  const proxies = [
    'https://corsproxy.io/?' + encodeURIComponent(websiteUrl),
    'https://api.allorigins.win/raw?url=' + encodeURIComponent(websiteUrl),
  ];
  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy, { signal: AbortSignal.timeout(7000) });
      if (!res.ok) continue;
      const html = await res.text();
      if (!html || html.length < 200) continue;
      // Match all hrefs containing instagram.com/username
      const matches = [...html.matchAll(/href=["'][^"']*instagram\.com\/([A-Za-z0-9._]{2,40})[^"']*["']/gi)];
      for (const m of matches) {
        const handle = m[1].split('/')[0].split('?')[0];
        if (!RESERVED.has(handle.toLowerCase())) return handle;
      }
      return null;
    } catch { continue; }
  }
  return null;
}

async function syncCompetitorCreators() {
  const btn = document.getElementById('hm-sync-competitors-btn');
  const statusEl = document.getElementById('hm-pipeline-status');

  const competitors = (brandKitData.competitors || []).filter(c => c?.name && !/^new competitor$/i.test(c.name));

  if (!competitors.length) {
    showToast('No hay competidores en el Branding Bio. Agregá competidores primero.', 'error');
    return;
  }

  if (btn) { btn.disabled = true; btn.innerHTML = '<i data-lucide="loader-2" style="width:12px;animation:spin 1s linear infinite;vertical-align:middle;margin-right:4px"></i>Syncing…'; if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] }); }
  if (statusEl) statusEl.textContent = `Buscando Instagrams de ${competitors.length} competidores…`;

  // Category = brand config name (same as syncBrandToSocialMediaApp uses)
  const category = (brandKitData.name || 'BRAND').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20).toLowerCase();

  try {
    // Wipe creators for this category first so removed BrandingBio competitors
    // don't keep getting scraped on the next pipeline run.
    await fetch(`${SUPABASE_URL}/rest/v1/sm_creators?category=eq.${encodeURIComponent(category)}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    });

    const existingUsernames = new Set();
    let added = 0, skipped = 0, discovered = 0, notFound = 0;
    for (const competitor of competitors) {
      // 1. Try explicit instagram_url first
      let username = extractInstagramUsername(competitor.instagram_url);

      // 2. If not set, scrape their website to find Instagram link
      if (!username && competitor.url) {
        if (statusEl) statusEl.textContent = `Buscando Instagram de "${competitor.name}"…`;
        username = await discoverInstagramFromUrl(competitor.url);
        if (username) discovered++;
      }

      if (!username) { notFound++; continue; }
      if (existingUsernames.has(username.toLowerCase())) { skipped++; continue; }
      await supabaseUpsert('sm_creators', { username, category });
      added++;
      existingUsernames.add(username.toLowerCase());
    }

    // Create/update sm_configs so n8n can find this brand's pipeline config
    const configName = category.toUpperCase();
    const cfgRes = await fetch(`${SUPABASE_URL}/rest/v1/sm_configs?on_conflict=config_name`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        config_name: configName,
        creators_category: category,
        // brand_id is what links every sm_videos row back to this brand. WF11
        // reads it from sm_configs before falling back to the request body, so
        // missing it here is why HookMiner showed 0 after a successful WF11 run.
        brand_id: brandKitData.brandId || null,
        analysis_instruction: STANDARD_ANALYSIS_INSTRUCTION,
        new_concepts_instruction: buildNewConceptsInstruction(brandKitData),
      }),
    });
    if (!cfgRes.ok) throw new Error(`Supabase sm_configs: ${cfgRes.status} ${await cfgRes.text()}`);

    const msg = `${added} nuevo${added !== 1 ? 's' : ''} · ${skipped} ya existía${skipped !== 1 ? 'n' : ''} · ${discovered} descubiertos via web · ${notFound} sin Instagram · config "${configName}" listo`;
    if (btn) { btn.disabled = false; btn.innerHTML = `<i data-lucide="users" style="width:12px;vertical-align:middle;margin-right:4px"></i>✅ Synced (${added + skipped})`; if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] }); }
    if (statusEl) statusEl.textContent = msg;
    showToast(`Sync completo: ${msg}. Ahora corré el pipeline.`);
    loadSocialMediaConfigs();
  } catch (err) {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i data-lucide="users" style="width:12px;vertical-align:middle;margin-right:4px"></i>Sync Competitors'; if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] }); }
    const errMsg = err?.message || String(err);
    if (statusEl) statusEl.textContent = '❌ ' + errMsg;
    showToast('Error: ' + errMsg, 'error');
    console.error('[syncCompetitorCreators]', err);
  }
}

async function syncBrandToSocialMediaApp(profilePayload) {
  const companyName = (profilePayload.identity?.company_name || 'BRAND').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
  const creatorsCategory = companyName.toLowerCase();
  const newConceptsInstruction = buildNewConceptsInstruction(profilePayload);

  // Upsert into sm_configs (merge on config_name)
  await supabaseUpsert('sm_configs', {
    config_name: companyName,
    creators_category: creatorsCategory,
    analysis_instruction: STANDARD_ANALYSIS_INSTRUCTION,
    new_concepts_instruction: newConceptsInstruction,
    brand_id: brandKitData.brandId || null,
  });
  console.log(`[sync] Upserted sm_configs "${companyName}"`);

  // Re-load config selector in Hook Miner if visible
  const sel = document.getElementById('hm-config-select');
  if (sel) loadSocialMediaConfigs();
}

async function loadSocialMediaConfigs() {
  const sel = document.getElementById('hm-config-select');
  if (!sel) return;
  try {
    const configs = await supabaseGet('sm_configs?order=config_name.asc&select=id,config_name,creators_category');
    if (!configs.length) {
      sel.innerHTML = '<option value="">No configs — guardá Branding Bio primero</option>';
      return;
    }
    const currentBrandConfig = (brandKitData?.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
    sel.innerHTML = configs.map(c =>
      `<option value="${escapeHtml(c.config_name)}"${c.config_name === currentBrandConfig ? ' selected' : ''}>${escapeHtml(c.config_name)} · ${escapeHtml(c.creators_category)}</option>`
    ).join('');
  } catch (e) {
    sel.innerHTML = '<option value="">Error cargando configs</option>';
    console.error('[loadSocialMediaConfigs]', e);
  }
}

const SM_PIPELINE_WEBHOOK = 'https://n8n.srv949269.hstgr.cloud/webhook/sm-pipeline';

// Count sm_videos rows for a brand. Uses PostgREST's `count=exact` HEAD response
// header so we don't have to pull the whole table to know the cardinality.
async function countBrandVideos(brandId) {
  if (!brandId) return 0;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/sm_videos?brand_id=eq.${encodeURIComponent(brandId)}&select=id`, {
    method: 'HEAD',
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      Prefer: 'count=exact',
      'Range-Unit': 'items',
      Range: '0-0',
    },
  });
  // PostgREST returns Content-Range: "*/<total>"
  const cr = res.headers.get('content-range') || res.headers.get('Content-Range') || '';
  const m = cr.match(/\/(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

async function runCompetitorPipeline() {
  const sel = document.getElementById('hm-config-select');
  const configName = sel?.value || (brandKitData?.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
  const btn = document.getElementById('hm-run-pipeline-btn');
  const statusEl = document.getElementById('hm-pipeline-status');

  if (!configName) { showToast('Seleccioná un config o cargá un brand en BrandingBio.', 'error'); return; }
  if (!brandKitData?.brandId) {
    showToast('Falta brand_id — guardá Branding Bio antes de correr el pipeline (sino los videos quedan huérfanos y no se ven en HookMiner).', 'error');
    return;
  }

  // Make sure sm_configs for this config has brand_id set, in case it was created
  // by an older code path that didn't store it. WF11 reads brand_id from sm_configs
  // before falling back to the request body, so this prevents future regressions.
  try {
    await supabaseUpsert('sm_configs', {
      config_name: configName,
      brand_id: brandKitData.brandId,
    }, 'config_name');
  } catch (e) {
    console.warn('[sm-pipeline] could not backfill sm_configs.brand_id:', e);
  }

  if (btn) { btn.disabled = true; btn.innerHTML = '<i data-lucide="loader-2" style="width:12px;animation:spin 1s linear infinite;vertical-align:middle;margin-right:4px"></i>Running…'; lucide.createIcons({ nodes: [btn] }); }
  if (statusEl) statusEl.textContent = 'Limpiando videos anteriores…';

  // Delete non-starred videos for this brand so HookMiner only shows the current
  // BrandingBio competitors after the run, not accumulated stale data.
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/sm_videos?brand_id=eq.${encodeURIComponent(brandKitData.brandId)}&starred=eq.false`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    });
  } catch (e) {
    console.warn('[sm-pipeline] could not clear old videos:', e);
  }

  if (statusEl) statusEl.textContent = 'Pipeline iniciado — scrapeando y analizando videos…';

  try {
    // Fire-and-forget to n8n — pipeline runs async (Apify + Gemini + Claude).
    // brand_id MUST be in the body: WF11's `SET Input Params` reads body.brand_id
    // and `CODE Build Record` writes it into every sm_videos row. Without it,
    // rows end up with brand_id='' and the front-end filter (brand_id=eq.<uuid>)
    // returns 0 even after a successful run.
    fetch(SM_PIPELINE_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_id:    brandKitData.brandId,
        config_name: configName,
        max_videos:  10,
        top_k:       5,
        n_days:      60,
        // Channel tone + voiceRules so WF11's Gemini analysis can generate
        // new_concepts adapted to our own channel voice, not generic ideas
        social_bios: getSocialBiosForPayload(),
      }),
    }).catch(e => console.error('[sm-pipeline] webhook error:', e));

    showToast(`Pipeline lanzado para "${configName}" — puede tardar varios minutos.`);
    if (statusEl) statusEl.textContent = '⏳ Pipeline corriendo (Apify → Gemini → Claude → Supabase)…';
    if (btn) { btn.innerHTML = '<i data-lucide="clock" style="width:12px;vertical-align:middle;margin-right:4px"></i>Running…'; lucide.createIcons({ nodes: [btn] }); }

    // Poll sm_videos for new rows instead of guessing with a fixed timeout. The
    // pipeline takes ~6-8 min on a typical run; the old setTimeout(180_000) marked
    // "Videos actualizados" while WF11 was still mid-flight, so the user saw 0
    // TikTok videos and assumed the workflow had failed.
    const startedAt = Date.now();
    const baselineCount = await countBrandVideos(brandKitData.brandId);
    const POLL_MS = 20_000;     // check Supabase every 20s
    const TIMEOUT_MS = 10 * 60_000;  // give up after 10 min
    const QUIET_MS = 90_000;    // declare "done" after this much silence at the same count

    let lastCount = baselineCount;
    let lastChangedAt = Date.now();

    const tick = async () => {
      const elapsed = Date.now() - startedAt;
      let count;
      try { count = await countBrandVideos(brandKitData.brandId); }
      catch (e) { count = lastCount; /* keep retrying */ }
      const newVideos = count - baselineCount;

      if (count !== lastCount) {
        lastCount = count;
        lastChangedAt = Date.now();
        // Refresh UI as new rows land so the user sees them appear progressively.
        try { await initSwipeFile(); } catch (_) {}
        try { await hydrateHookMinerView(); } catch (_) {}
      }

      const minutes = Math.floor(elapsed / 60_000);
      const seconds = Math.floor((elapsed % 60_000) / 1000).toString().padStart(2, '0');
      const quietFor = Date.now() - lastChangedAt;

      const reachedQuiet = newVideos > 0 && quietFor >= QUIET_MS;
      const reachedTimeout = elapsed >= TIMEOUT_MS;
      const done = reachedQuiet || reachedTimeout;

      if (statusEl) {
        if (done) {
          statusEl.textContent = newVideos > 0
            ? `✅ ${newVideos} video${newVideos === 1 ? '' : 's'} nuevo${newVideos === 1 ? '' : 's'} en ${minutes}m${seconds}s`
            : '⚠️ Pipeline terminó sin videos nuevos. Revisá la ejecución en n8n.';
        } else {
          statusEl.textContent = `⏳ ${minutes}m${seconds}s · ${newVideos > 0 ? newVideos + ' nuevo' + (newVideos === 1 ? '' : 's') + ' hasta ahora · ' : ''}polling cada ${POLL_MS/1000}s…`;
        }
      }

      if (done) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i data-lucide="play" style="width:12px;vertical-align:middle;margin-right:4px"></i>Run Pipeline';
          lucide.createIcons({ nodes: [btn] });
        }
        // Always refresh the grid on completion — upserts don't change row count
        // so the poll may have seen 0 "new" rows even though data arrived.
        try { await initSwipeFile(); } catch (_) {}
        try { await hydrateHookMinerView(); } catch (_) {}
        return;
      }
      setTimeout(tick, POLL_MS);
    };
    // First poll after one interval — gives WF11 a moment to start writing.
    setTimeout(tick, POLL_MS);
  } catch (err) {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i data-lucide="play" style="width:12px;vertical-align:middle;margin-right:4px"></i>Run Pipeline'; lucide.createIcons({ nodes: [btn] }); }
    if (statusEl) statusEl.textContent = '❌ Error — revisá el workflow n8n.';
    showToast('No se pudo iniciar el pipeline.', 'error');
    console.error('[runCompetitorPipeline]', err);
  }
}

// ── Creative Library — Swipe File (Foreplay.co style) ───
let _swipeVideos = [];
let _swipeDisplayed = 0;
const SWIPE_PER_PAGE = 20;

function fmtViews(n) {
  n = Number(n) || 0;
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

function renderAnalysisMarkdown(text) {
  if (!text) return '<em style="color:var(--text-muted)">Sin contenido</em>';
  const lines = text.split('\n');
  let html = '';
  let inList = false;
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (inList) { html += '</ul>'; inList = false; }
      continue;
    }
    if (/^# /.test(line)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h4 style="margin:14px 0 5px;font-size:13px;font-weight:700;color:#111827;border-bottom:1px solid #E2E8F0;padding-bottom:4px;text-transform:uppercase;letter-spacing:.5px;">${escapeHtml(line.slice(2).trim())}</h4>`;
    } else if (/^## /.test(line)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h5 style="margin:10px 0 3px;font-size:12px;font-weight:700;color:#374151;">${escapeHtml(line.slice(3).trim())}</h5>`;
    } else if (/^[-*•] /.test(t) || /^->/.test(t)) {
      if (!inList) { html += '<ul style="margin:4px 0 6px;padding-left:16px;font-size:12px;color:#374151;">'; inList = true; }
      const content = t.replace(/^[-*•>]+ ?/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html += `<li style="margin:2px 0;">${content}</li>`;
    } else if (/^\d+[.)]\s/.test(t)) {
      if (inList) { html += '</ul>'; inList = false; }
      const content = t.replace(/^\d+[.)]\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html += `<p style="margin:2px 0 2px 14px;font-size:12px;color:#374151;">• ${content}</p>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      const formatted = t
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      html += `<p style="margin:3px 0;font-size:12px;line-height:1.6;color:#374151;">${formatted}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

function ensureSwipeModal() {
  if (document.getElementById('swipe-modal')) return;
  const el = document.createElement('div');
  el.id = 'swipe-modal';
  el.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.65);overflow-y:auto;padding:24px 16px;';
  el.innerHTML = `
    <div id="swipe-modal-box" style="max-width:740px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.3);">
      <div style="padding:16px 20px 14px;border-bottom:1px solid #E2E8F0;display:flex;align-items:center;gap:14px;">
        <div id="swipe-modal-thumb" style="width:44px;height:60px;border-radius:8px;overflow:hidden;flex-shrink:0;background:#F3F4F6;display:flex;align-items:center;justify-content:center;font-size:22px;">🎬</div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <strong id="swipe-modal-creator" style="font-size:14px;">@creator</strong>
            <a id="swipe-modal-link" href="#" target="_blank" style="color:#6B7280;font-size:11px;text-decoration:none;">ver video ↗</a>
          </div>
          <div id="swipe-modal-stats" style="font-size:11px;color:#6B7280;margin-top:3px;"></div>
          <div id="swipe-modal-config" style="margin-top:4px;"></div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;">
          <button id="swipe-tab-analysis" onclick="swipeModalTab('analysis')"
            style="padding:5px 12px;border-radius:6px;border:1px solid #F97316;font-size:12px;cursor:pointer;font-weight:600;background:#F97316;color:white;">
            🔍 Analysis
          </button>
          <button id="swipe-tab-concepts" onclick="swipeModalTab('concepts')"
            style="padding:5px 12px;border-radius:6px;border:1px solid #E2E8F0;font-size:12px;cursor:pointer;font-weight:600;background:white;color:#374151;">
            ✨ Concepts
          </button>
        </div>
        <button onclick="closeSwipeModal()" style="position:absolute;top:12px;right:14px;background:none;border:none;cursor:pointer;font-size:20px;color:#9CA3AF;line-height:1;padding:0;">✕</button>
      </div>
      <div id="swipe-modal-body" style="padding:20px 24px;max-height:calc(90vh - 130px);overflow-y:auto;"></div>
    </div>`;
  el.addEventListener('click', e => { if (e.target === el) closeSwipeModal(); });
  document.body.appendChild(el);
}

let _swipeModalVideo = null;
let _swipeModalSection = 'analysis';

function openSwipeModal(videoId, section) {
  section = section || 'analysis';
  ensureSwipeModal();
  const video = _swipeVideos.find(v => v.id === videoId);
  if (!video) return;
  _swipeModalVideo = video;

  document.getElementById('swipe-modal-creator').textContent = '@' + video.creator;
  document.getElementById('swipe-modal-link').href = video.link;
  document.getElementById('swipe-modal-stats').textContent =
    '▶ ' + fmtViews(video.views) + ' views · ♥ ' + fmtViews(video.likes) + ' · 💬 ' + fmtViews(video.comments) + (video.datePosted ? ' · ' + video.datePosted : '');
  document.getElementById('swipe-modal-config').innerHTML = (video.competitor_name || video.platform)
    ? `<span style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;background:#FEF3C7;color:#B45309;text-transform:capitalize;">${escapeHtml(video.competitor_name || '')}${video.competitor_name && video.platform ? ' · ' : ''}${escapeHtml(video.platform || '')}</span>`
    : '';

  const thumbEl = document.getElementById('swipe-modal-thumb');
  thumbEl.style.cssText = 'width:44px;height:60px;border-radius:8px;overflow:hidden;flex-shrink:0;position:relative;';
  thumbEl.innerHTML = hmThumbContent(video.thumbnail, video.competitor_name, video.platform);

  swipeModalTab(section);
  document.getElementById('swipe-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function swipeModalTab(section) {
  _swipeModalSection = section;
  const aBtn = document.getElementById('swipe-tab-analysis');
  const cBtn = document.getElementById('swipe-tab-concepts');
  const body = document.getElementById('swipe-modal-body');
  if (aBtn) {
    aBtn.style.background = section === 'analysis' ? '#F97316' : 'white';
    aBtn.style.color = section === 'analysis' ? 'white' : '#374151';
    aBtn.style.borderColor = section === 'analysis' ? '#F97316' : '#E2E8F0';
  }
  if (cBtn) {
    cBtn.style.background = section === 'concepts' ? '#7C3AED' : 'white';
    cBtn.style.color = section === 'concepts' ? 'white' : '#374151';
    cBtn.style.borderColor = section === 'concepts' ? '#7C3AED' : '#E2E8F0';
  }
  if (body && _swipeModalVideo) {
    const content = section === 'analysis' ? _swipeModalVideo.analysis : _swipeModalVideo.new_concepts;
    body.innerHTML = renderAnalysisMarkdown(content);
    if (section === 'concepts' && _swipeModalVideo.id) {
      body.innerHTML += `
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #E5E7EB;">
          <div style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">🎬 Generar video con Kling AI</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${[1,2,3].map(i => `<button data-concept-btn="${i}" onclick="generateVideoFromConcept(${i})"
              style="flex:1;min-width:80px;padding:9px 12px;background:#7C3AED;color:white;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:opacity .15s;"
              onmouseover="this.style.opacity='.8'" onmouseout="this.style.opacity='1'">
              Concept ${i}
            </button>`).join('')}
          </div>
          <div id="swipe-video-status" style="margin-top:10px;font-size:11px;color:#6B7280;min-height:18px;"></div>
        </div>`;
    }
  }
}

function closeSwipeModal() {
  const m = document.getElementById('swipe-modal');
  if (m) m.style.display = 'none';
  document.body.style.overflow = '';
  _swipeModalVideo = null;
}

async function generateVideoFromConcept(conceptIndex) {
  const video = _swipeModalVideo;
  if (!video?.id) return;

  const brandId = brandKitData?.brandId;
  if (!brandId) { showToast('Brand no cargado.', 'error'); return; }

  const platformToChannel = { tiktok: 'TikTok', linkedin: 'LinkedIn', twitter: 'Twitter' };
  const channel = platformToChannel[video.platform] || 'Instagram';

  const statusEl = document.getElementById('swipe-video-status');
  const btns     = document.querySelectorAll('[data-concept-btn]');
  btns.forEach(b => { b.disabled = true; b.style.opacity = '.5'; });
  if (statusEl) statusEl.innerHTML = `<i data-lucide="loader-2" style="width:10px;vertical-align:middle;animation:spin 1s linear infinite;margin-right:4px;"></i>Generando Concept ${conceptIndex} con Kling AI… (~2–3 min)`;
  lucide.createIcons();

  try {
    const videoUrl = await generateVideoViaKling({
      brandId,
      draftId:      '',
      channel,
      videoPrompt:  '',
      duration:     5,
      smVideoId:    video.id,
      conceptIndex,
    });
    if (!videoUrl) throw new Error('WF16 no devolvió URL de video');
    if (statusEl) statusEl.innerHTML =
      `✅ Concept ${conceptIndex} listo · <a href="${escapeHtml(videoUrl)}" target="_blank" style="color:#7C3AED;font-weight:600;">Ver video ↗</a> · <a href="${escapeHtml(videoUrl)}" download="concept-${conceptIndex}.mp4" style="color:#7C3AED;">Descargar</a>`;
    showToast(`Concept ${conceptIndex} generado con Kling ✓`);
  } catch (e) {
    if (statusEl) statusEl.textContent = `❌ Error: ${e.message}`;
    showToast('Error generando video: ' + e.message, 'error');
  } finally {
    btns.forEach(b => { b.disabled = false; b.style.opacity = '1'; });
    lucide.createIcons();
  }
}

async function toggleSwipeStar(videoId, currentStarred) {
  const newStarred = !currentStarred;
  const video = _swipeVideos.find(v => v.id === videoId);
  if (video) video.starred = newStarred;
  const btn = document.querySelector(`[data-star="${CSS.escape(videoId)}"]`);
  if (btn) { btn.textContent = newStarred ? '★' : '☆'; btn.style.color = newStarred ? '#F59E0B' : '#9CA3AF'; }
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/sm_videos?id=eq.${encodeURIComponent(videoId)}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ starred: newStarred }),
    });
  } catch (e) {
    if (video) video.starred = currentStarred;
    if (btn) { btn.textContent = currentStarred ? '★' : '☆'; btn.style.color = currentStarred ? '#F59E0B' : '#9CA3AF'; }
  }
}

function getSwipeFiltered() {
  const configFilter  = document.getElementById('hm-swipe-config')?.value  || '';
  const creatorFilter = document.getElementById('hm-swipe-creator')?.value || '';
  const sort = document.getElementById('hm-swipe-sort')?.value || 'views';

  let videos = _swipeVideos.filter(v =>
    (!configFilter  || v.competitor_name === configFilter) &&
    (!creatorFilter || v.creator         === creatorFilter)
  );

  if (sort === 'views')            videos.sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
  else if (sort === 'starred')     videos.sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0) || (Number(b.views) || 0) - (Number(a.views) || 0));
  else if (sort === 'date-posted') videos.sort((a, b) => (b.date_posted || '').localeCompare(a.date_posted || ''));
  else if (sort === 'date-added')  videos.sort((a, b) => (b.date_added  || '').localeCompare(a.date_added  || ''));
  return videos;
}

function renderSwipeGrid() {
  const grid = document.getElementById('hm-swipe-grid');
  if (!grid) return;

  const filtered = getSwipeFiltered();
  if (!_swipeDisplayed) _swipeDisplayed = SWIPE_PER_PAGE;
  const visible = filtered.slice(0, _swipeDisplayed);

  const subtitle = document.getElementById('hm-swipe-subtitle');
  if (subtitle) subtitle.textContent = filtered.length + ' videos · ' + _swipeVideos.length + ' total';

  if (!visible.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:28px;font-size:13px;">Sin videos para estos filtros.</div>';
    const lm = document.getElementById('hm-swipe-loadmore');
    if (lm) lm.style.display = 'none';
    return;
  }

  grid.innerHTML = visible.map(v => {
    const starColor = v.starred ? '#F59E0B' : '#9CA3AF';
    const starIcon  = v.starred ? '★' : '☆';
    const safeId = escapeHtml(v.id);
    return `<div style="border-radius:12px;overflow:hidden;border:1px solid var(--border);background:white;transition:transform .15s;">
      <a href="${escapeHtml(v.link)}" target="_blank" rel="noopener"
        style="display:block;position:relative;aspect-ratio:9/16;overflow:hidden;text-decoration:none;">
        ${hmThumbContent(v.thumbnail, v.competitor_name, v.platform)}
        <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.6));padding:14px 8px 6px;z-index:2;">
          <span style="color:white;font-size:12px;font-weight:700;">▶ ${fmtViews(v.views)}</span>
        </div>
      </a>
      <div style="padding:8px 10px 10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
          <span style="font-size:12px;font-weight:600;color:var(--text-main);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:calc(100% - 24px);">@${escapeHtml(v.creator)}</span>
          <button data-star="${safeId}" onclick="event.stopPropagation();toggleSwipeStar('${safeId}',${!!v.starred})"
            style="background:none;border:none;cursor:pointer;font-size:16px;color:${starColor};padding:0;line-height:1;flex-shrink:0;">${starIcon}</button>
        </div>
        <div style="font-size:10px;color:var(--text-muted);margin-bottom:7px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-transform:capitalize;">${escapeHtml(v.competitor_name || v.creator || '—')} · ${escapeHtml(v.platform || 'instagram')}</div>
        <div style="display:flex;gap:4px;">
          <button onclick="openSwipeModal('${safeId}','analysis')"
            style="flex:1;padding:4px 0;border:1px solid var(--border);border-radius:5px;font-size:11px;cursor:pointer;background:white;color:#374151;transition:background .12s;"
            onmouseover="this.style.background='#FFF7ED'" onmouseout="this.style.background='white'">🔍 Analysis</button>
          <button onclick="openSwipeModal('${safeId}','concepts')"
            style="flex:1;padding:4px 0;border:1px solid var(--border);border-radius:5px;font-size:11px;cursor:pointer;background:white;color:#374151;transition:background .12s;"
            onmouseover="this.style.background='#F5F3FF'" onmouseout="this.style.background='white'">✨ Concepts</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const remaining = filtered.length - _swipeDisplayed;
  const lm = document.getElementById('hm-swipe-loadmore');
  const remEl = document.getElementById('hm-swipe-remaining');
  if (lm) lm.style.display = remaining > 0 ? 'block' : 'none';
  if (remEl) remEl.textContent = remaining > 0 ? '(' + remaining + ' más)' : '';
}

function loadMoreSwipeVideos() {
  _swipeDisplayed = (_swipeDisplayed || SWIPE_PER_PAGE) + SWIPE_PER_PAGE;
  renderSwipeGrid();
}

async function initSwipeFile() {
  _swipeDisplayed = SWIPE_PER_PAGE;
  _swipeVideos = [];
  try {
    const brandId = brandKitData?.brandId;
    const params = new URLSearchParams({
      order: 'views.desc',
      select: 'id,link,thumbnail,creator,competitor_name,platform,views,likes,comments,analysis,new_concepts,date_posted,date_added,brand_id,starred',
    });
    if (brandId) params.append('brand_id', `eq.${brandId}`);
    _swipeVideos = await supabaseGet(`sm_videos?${params}`);

    const configSel  = document.getElementById('hm-swipe-config');
    const creatorSel = document.getElementById('hm-swipe-creator');
    if (configSel) {
      const configs = [...new Set(_swipeVideos.map(v => v.competitor_name).filter(Boolean))].sort();
      configSel.innerHTML = '<option value="">All Competitors</option>' +
        configs.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    }
    if (creatorSel) {
      const creators = [...new Set(_swipeVideos.map(v => v.creator).filter(Boolean))].sort();
      creatorSel.innerHTML = '<option value="">All Creators</option>' +
        creators.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    }
    renderSwipeGrid();
  } catch (err) {
    const grid = document.getElementById('hm-swipe-grid');
    if (grid) grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:24px;">
      <strong style="color:#EF4444;">No se pudo cargar los videos desde Supabase.</strong><br>
      <span style="font-size:11px;color:var(--text-muted);">Revisá la conexión a Supabase o corré el pipeline para generar videos.</span>
    </div>`;
    const sub = document.getElementById('hm-swipe-subtitle');
    if (sub) sub.textContent = 'error cargando videos';
  }
}

// ── WF06 Brief Generator (ContentBuilder) ──────────────
const WF06_URL = `https://n8n.srv949269.hstgr.cloud/webhook/wf06-brief-generator${_CB_SFX}`;

// ── Inspiration helpers shared by WF06 (brief) and WF07 (draft) ───────────
// These pull top hooks (from WF11 / hook_library) and top competitor posts
// (from WF03 / competitor_content) so the brief generator and draft builder
// can use them as INSPIRATION. The payload always carries `anti_plagiarism: true`
// so the prompt template downstream knows to rewrite in the brand's own voice
// instead of paraphrasing the source.
async function fetchTopHooksForBrief(brandId, channel, limit = 5) {
  if (!brandId) return [];
  try {
    const params = new URLSearchParams({
      brand_id: `eq.${brandId}`,
      order: 'score.desc',
      limit: String(limit),
      select: 'hook_text,framework,channel,score,evidence_json',
    });
    if (channel) params.set('channel', `eq.${channel}`);
    return await supabaseGet(`hook_library?${params}`);
  } catch (e) {
    console.warn('[ContentBuilder] fetchTopHooksForBrief failed:', e);
    return [];
  }
}

async function fetchTopCompetitorPostsForBrief(brandId, channel, limit = 5) {
  if (!brandId) return [];
  try {
    // Pull a wider pool (up to 30 rows) and re-rank client-side by total engagement,
    // because PostgREST can't order by a computed sum across JSON metrics. Newest-first
    // would surface random recent scrapes; the user wants the highest-performing posts
    // as inspiration. `opening_hook` and `content_text` are the actual phrasing the
    // LLM needs to mimic structurally (without paraphrasing verbatim).
    const params = new URLSearchParams({
      brand_id: `eq.${brandId}`,
      order: 'scraped_at.desc',
      limit: '30',
      select: 'title,competitor_name,channel,url,opening_hook,content_text,metrics_json,analysis_json',
    });
    if (channel) params.set('channel', `eq.${channel}`);
    const rows = await supabaseGet(`competitor_content?${params}`);
    return rows
      .sort((a, b) => totalEngagement(b.metrics_json) - totalEngagement(a.metrics_json))
      .slice(0, limit);
  } catch (e) {
    console.warn('[ContentBuilder] fetchTopCompetitorPostsForBrief failed:', e);
    return [];
  }
}

// Build the inspiration block that gets attached to WF06/WF07 payloads.
// Returns an object the caller spreads into its payload.
async function buildInspirationPayload(brandId, channel) {
  const [topHooks, compPosts] = await Promise.all([
    fetchTopHooksForBrief(brandId, channel, 5),
    fetchTopCompetitorPostsForBrief(brandId, channel, 5),
  ]);
  const competitor_inspiration = compPosts.map(p => ({
    competitor_name: p.competitor_name,
    channel:         p.channel,
    title:           p.title,
    url:             p.url,
    opening_hook:    p.opening_hook || null,
    content_excerpt: (p.content_text || '').slice(0, 600) || null,
    metrics:         p.metrics_json,
    engagement:      totalEngagement(p.metrics_json),
    analysis:        p.analysis_json,
  }));
  // Own-channel tone snapshot — narrows inspiration to what resonates on this specific channel.
  const channelBios = getSocialBiosForPayload(channel);
  // Note: flat structure so n8n prompt templates can read each field by name.
  // `anti_plagiarism` tells the brief/draft node to rewrite in brand voice, never paraphrase verbatim.
  // `exclude_visual_hooks` is false — WF16/Kling video generation is active, visual hook
  // frameworks (camera directions, pattern-interrupts) are now meaningful and should be used.
  return {
    top_hooks:              topHooks.length ? topHooks : null,
    competitor_inspiration: competitor_inspiration.length ? competitor_inspiration : null,
    channel_bios:           channelBios || null,
    anti_plagiarism:        true,
    exclude_visual_hooks:   false,
    inspiration_disclaimer: 'Use top_hooks and competitor_inspiration as STRUCTURAL inspiration only (frameworks, pacing, angle, opening phrasing patterns). Adapt to the brand voice, mission and value-prop from business_verticals/brand_profile. Never paraphrase a competitor post verbatim. Video generation is active via WF16/Kling — include visual hook frameworks, pattern-interrupts and camera directions appropriate to each channel (channel_bios.voiceRules is the authoritative source for channel-specific rules).',
  };
}

// ── User Briefing persistence (Supabase: user_briefings) ─────────────────
// One row per (brand_id, channel) — the user's authoritative briefing for that
// channel. WF06/WF07 can read it from Supabase directly, or the app forwards it
// in the payload as `saved_briefing` so the agent treats it as locked spec
// instead of an optional hint.
async function loadUserBriefing(brandId, channel) {
  // Briefing UI was removed — generation runs purely from brand identity +
  // visual-style audit + hooks/competitors. We intentionally ignore any
  // briefing previously saved in Supabase so it can't silently steer the agent.
  return null;
  // eslint-disable-next-line no-unreachable
  if (!brandId || !channel) return null;
  try {
    const params = new URLSearchParams({
      brand_id: `eq.${brandId}`,
      channel:  `eq.${channel}`,
      select:   'briefing_text,updated_at',
      limit:    '1',
    });
    const rows = await supabaseGet(`user_briefings?${params}`);
    return rows[0] || null;
  } catch (e) {
    console.warn('[ContentBuilder] loadUserBriefing failed:', e);
    return null;
  }
}

async function saveUserBriefing(brandId, channel, briefingText) {
  if (!brandId || !channel) throw new Error('brand_id_and_channel_required');
  return supabaseUpsert('user_briefings', {
    brand_id:      brandId,
    channel,
    briefing_text: briefingText || '',
    updated_at:    new Date().toISOString(),
  }, 'brand_id,channel');
}

// Wire the Save button on the ContentBuilder UI. Persists the textarea content
// for the active channel and updates the saved-at indicator.
async function handleSaveUserBriefing() {
  const btn = document.getElementById('btn-save-briefing');
  const txt = document.getElementById('cb-user-brief');
  if (!txt) return;
  const channel = contentBuilderActiveTab || 'Instagram';
  const brandId = brandKitData.brandId;
  if (!brandId) {
    showToast('Guardá Branding Bio antes — falta brand_id.', 'error');
    return;
  }
  const original = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = '<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Guardando...'; lucide.createIcons(); }
  try {
    await saveUserBriefing(brandId, channel, txt.value.trim());
    showToast(`Briefing guardado para ${channel}. El agente lo va a usar como base.`);
    updateBriefingSavedIndicator(new Date().toISOString());
    if (btn) { btn.innerHTML = '<i data-lucide="check" style="width:12px"></i> Guardado'; btn.style.background = '#10B981'; btn.style.color = 'white'; }
    setTimeout(() => {
      if (btn) { btn.disabled = false; btn.innerHTML = original; btn.style.background = ''; btn.style.color = ''; lucide.createIcons(); }
    }, 1800);
  } catch (e) {
    console.error('[ContentBuilder] save briefing failed:', e);
    showToast(`No se pudo guardar: ${e.message || e}`, 'error');
    if (btn) { btn.disabled = false; btn.innerHTML = original; lucide.createIcons(); }
  }
}

// Pull the saved briefing for the active channel into the textarea so the user
// sees what's locked in for n8n. Also paints the "Guardado hace …" indicator.
async function hydrateUserBriefingForChannel(channel) {
  const txt = document.getElementById('cb-user-brief');
  if (!txt) return;
  const ch = channel || contentBuilderActiveTab || 'Instagram';
  const brandId = brandKitData.brandId;
  if (!brandId) {
    updateBriefingSavedIndicator(null);
    return;
  }
  const row = await loadUserBriefing(brandId, ch);
  if (row && row.briefing_text != null) {
    txt.value = row.briefing_text;
    updateBriefingSavedIndicator(row.updated_at);
  } else {
    // No saved briefing for this channel — clear so we don't leak text from another channel
    txt.value = '';
    updateBriefingSavedIndicator(null);
  }
}

function updateBriefingSavedIndicator(updatedAt) {
  const el = document.getElementById('cb-briefing-saved');
  if (!el) return;
  if (!updatedAt) {
    el.textContent = 'Sin guardar — el agente solo va a leer lo que esté escrito al momento de generar.';
    el.style.color = '#9A3412';
    return;
  }
  el.textContent = `Guardado · ${typeof fmtRelativeTime === 'function' ? fmtRelativeTime(updatedAt) : updatedAt}. El agente lo va a usar como base del prompt.`;
  el.style.color = '#15803D';
}

// Update the "Inspirado en:" indicator next to step 1 so the user sees what's
// feeding the brief. Safe to call before the inputs/buttons exist (no-ops).
function updateContentBuilderInspirationIndicator(channel) {
  const el = document.getElementById('cb-inspiration-line');
  if (!el) return;
  // Cheap read from already-cached Supabase responses isn't possible here, so
  // we trigger a quick fetch and update the indicator when it lands. Errors
  // are silent — the indicator just stays at "—" then.
  const brandId = brandKitData.brandId;
  if (!brandId) {
    el.textContent = 'Sin brand_id — guardá Branding Bio para activar la inspiración.';
    return;
  }
  el.textContent = `Inspirado en: top hooks + top posts de competidores para ${channel} (cargando…)`;
  Promise.all([
    fetchTopHooksForBrief(brandId, channel, 5),
    fetchTopCompetitorPostsForBrief(brandId, channel, 5),
  ]).then(([hooks, posts]) => {
    el.textContent = `Inspirado en: ${hooks.length} hook${hooks.length===1?'':'s'} · ${posts.length} post${posts.length===1?'':'s'} de competidores (canal ${channel}) — la marca propia se respeta, sin plagio`;
  }).catch(() => {
    el.textContent = 'Inspiración no disponible (sin datos en hook_library/competitor_content todavía).';
  });
}

async function generateContentBrief(channel = 'LinkedIn', persona = 'VP Engineering') {
  if (!brandKitData.brandId) {
    return { __error: 'brand_id_missing', message: 'Branding Bio aún no fue guardada. Andá a Branding Bio → Save & Sync antes de generar contenido.' };
  }
  try {
    const brandVerticals = (brandKitData.verticals || []).map(v => {
      ensureVerticalChannels(v);
      return { name: v.name, desc: v.desc || '', channels: v.channels, profile: v.profile || null };
    });
    const selectedVertical = cbActiveVertical
      ? brandVerticals.find(v => v.name === cbActiveVertical) || null
      : null;
    const userBriefExtra = (document.getElementById('cb-user-brief')?.value || '').trim();
    const inspiration = await buildInspirationPayload(brandKitData.brandId, channel);
    // Saved briefing has higher authority than the live textarea — if the user
    // hit "Guardar briefing" for this channel, we send it as `saved_briefing`
    // with `briefing_locked: true` so the n8n prompt treats it as the spec to
    // follow, not just an optional hint.
    const savedBrief = await loadUserBriefing(brandKitData.brandId, channel);
    const payload = {
      brand_id: brandKitData.brandId,
      channel,
      persona,
      business_verticals: brandVerticals.length ? brandVerticals : null,
      selected_vertical:  selectedVertical,
      user_brief_extra:   userBriefExtra || null,
      saved_briefing:     savedBrief && savedBrief.briefing_text ? {
        text:       savedBrief.briefing_text,
        updated_at: savedBrief.updated_at,
      } : null,
      briefing_locked:    !!(savedBrief && savedBrief.briefing_text),
      ...inspiration,
    };
    console.log('[WF06] sending payload:', payload);
    const res = await fetch(WF06_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const bodyText = await res.text();
    let body;
    try { body = JSON.parse(bodyText); } catch (_) { body = bodyText; }
    if (!res.ok) {
      return { __error: `http_${res.status}`, message: `WF06 devolvió HTTP ${res.status}. ${typeof body === 'string' ? body.slice(0, 200) : (body?.message || JSON.stringify(body).slice(0, 200))}` };
    }
    return body;
  } catch (err) {
    console.error('[WF06] Error:', err);
    return { __error: 'network', message: `No se pudo contactar a WF06: ${err.message || err}` };
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

  // Surface explicit errors from our wrapper before any unwrapping
  if (result && result.__error) {
    setBtns('<i data-lucide="alert-circle" style="width:12px"></i> Error — retry', '#EF4444', 'white', false);
    showToast(result.message || 'WF06 falló. Ver consola.', 'error');
    console.warn('[WF06] explicit error:', result);
    return;
  }

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

    // Remember the brief_id so WF07 can expand the right brief
    if (result.brief_id) lastGeneratedBriefId = result.brief_id;

    // Render brief into the DOM if backend returned it
    let brief = result.brief;
    if (typeof brief === 'string') {
      try { brief = JSON.parse(brief); } catch (e) { brief = null; }
    }
    if (brief) renderBriefIntoView(brief, channel);

    setTimeout(() => {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i data-lucide="sparkles" style="width:12px"></i> Generate Brief'; btn.style.background = '#22C55E'; btn.style.color = 'white'; }
      if (btnHeader) { btnHeader.disabled = false; btnHeader.innerHTML = '<i data-lucide="sparkles" style="width:13px;vertical-align:middle;margin-right:6px"></i>Generate Brief'; btnHeader.style.background = '#22C55E'; btnHeader.style.color = 'white'; }
      lucide.createIcons();
    }, 3000);
  } else {
    setBtns('<i data-lucide="alert-circle" style="width:12px"></i> Error — retry', '#EF4444', 'white', false);
    const reason = result ? `Respuesta inesperada: ${JSON.stringify(result).slice(0, 160)}` : 'Sin respuesta de WF06.';
    showToast(reason, 'error');
    console.warn('[WF06] response did not match expected shape:', result);
  }
}

// ── WF12 — 3 agentes secuenciales (brief → caption → visual) ───────────
// Mismo webhook que antes, ahora con un parámetro `mode` que routea al
// branch correcto del CODE Compose Prompt en n8n.
//   mode='brief'   → devuelve { brief: {...} } (sin DB write)
//   mode='caption' → devuelve { caption, headline, hashtags, draft_id }
//   mode='visual'  → devuelve { format, slide_count, slide_prompts, visual_prompt }
// Cada paso pasa el output del anterior como contexto al siguiente para que
// el LLM esté anclado al brief aprobado.
const WF12_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf12-agente-unico';

// State per ContentBuilder session — survives between agent calls but resets
// on tab change / view re-entry / new brief.
let lastBriefResult   = null;  // output of mode='brief'
let lastCaptionResult = null;  // output of mode='caption'
let lastVisualResult  = null;  // output of mode='visual'
// Backward-compat — handleApproveQueue / WF13 image gen still read this.
let lastUnifiedResult = null;
// Per-slide state for the "corregir un slide" feature: original prompt + url + ctx
// so the user can regenerate a single slide with a spelling/content correction.
let lastRenderedSlides = [];        // [{ slot, index, kind, prompt, url, error }]
let lastImageGenCtx    = null;      // { brandId, draftId, channel }

function resetCbAgentState() {
  lastBriefResult = null;
  lastCaptionResult = null;
  lastVisualResult = null;
  lastUnifiedResult = null;
}

// ── ContentBuilder · per-cell (channel × vertical) generation memory ─────────
// Each channel×vertical pair keeps its OWN rendered output, so generating for one
// cell never overwrites another's images. In-session fidelity = HTML snapshot of
// the output containers + the generation globals. Durable across page reloads = a
// LIGHT record persisted to cb_cell_state (brief/caption/visual text + draft_id);
// images rehydrate from creative_assets by draft_id on demand (canvas/template
// slides without an asset_id don't survive a reload — Gemini photos do).
const CB_CELL_OUTPUT_IDS = ['cb-brief-body', 'cb-post-body', 'cb-post-hashtags', 'cb-visual-prompt-output', 'visual-brief-body', 'cb-wf09-image-body'];
const cbCellState = {};        // key -> { html:{id:innerHTML}, g:{globals}, data:{light} }
let cbCellDefaults = null;     // empty-state innerHTML per container (captured once)
let cbCurrentCellKey_ = null;  // key currently shown on screen
let _cbCellSwitching = false;  // guard so nested switches don't double snapshot/restore

function cbCellKey(channel, verticalName) {
  return `${channel || contentBuilderActiveTab || 'Instagram'}::${verticalName || '__all__'}`;
}
function cbActiveCellKey() {
  return cbCellKey(contentBuilderActiveTab, cbActiveVertical);
}
function cbCaptureDefaultsOnce() {
  if (cbCellDefaults) return;
  cbCellDefaults = {};
  for (const id of CB_CELL_OUTPUT_IDS) {
    const el = document.getElementById(id);
    cbCellDefaults[id] = el ? el.innerHTML : '';
  }
}
function cbResetOutputsToDefault() {
  cbCaptureDefaultsOnce();
  for (const id of CB_CELL_OUTPUT_IDS) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = cbCellDefaults[id] || '';
  }
}
function cbApplyGlobals(g) {
  lastBriefResult      = g?.brief          || null;
  lastCaptionResult    = g?.caption        || null;
  lastVisualResult     = g?.visual         || null;
  lastUnifiedResult    = g?.unified        || null;
  lastRenderedSlides   = g?.renderedSlides || [];
  lastBuiltDraftId     = g?.draftId        || null;
  lastGeneratedBriefId = g?.briefId        || null;
  lastImageGenCtx      = g?.imageGenCtx    || null;
  _cbCarouselState     = g?.carousel       || { slides: [], active: 0 };
}
function cbSnapshotActiveCell() {
  cbCaptureDefaultsOnce();
  const key = cbCurrentCellKey_ || cbActiveCellKey();
  const html = {};
  for (const id of CB_CELL_OUTPUT_IDS) {
    const el = document.getElementById(id);
    if (el) html[id] = el.innerHTML;
  }
  cbCellState[key] = {
    ...(cbCellState[key] || {}),
    html,
    g: {
      brief: lastBriefResult, caption: lastCaptionResult, visual: lastVisualResult,
      unified: lastUnifiedResult, renderedSlides: lastRenderedSlides,
      draftId: lastBuiltDraftId, briefId: lastGeneratedBriefId,
      imageGenCtx: lastImageGenCtx, carousel: _cbCarouselState,
    },
  };
}
async function cbRestoreCell(key) {
  cbCaptureDefaultsOnce();
  const cell = cbCellState[key];
  if (cell && cell.html) {
    for (const id of CB_CELL_OUTPUT_IDS) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = (id in cell.html) ? cell.html[id] : (cbCellDefaults[id] || '');
    }
    cbApplyGlobals(cell.g);
  } else if (cell && cell.data) {
    // Hydrated from Supabase (text + draft_id) but never rendered this session.
    cbResetOutputsToDefault();
    cbApplyGlobals({});
    await cbRenderCellFromData(cell.data);
  } else {
    cbResetOutputsToDefault();
    cbApplyGlobals({});
  }
  cbCurrentCellKey_ = key;
  if (typeof lucide !== 'undefined') lucide.createIcons();
  if (typeof updateAgentButtonsEnabled === 'function') updateAgentButtonsEnabled();
}
async function cbRenderCellFromData(data) {
  try {
    if (data.brief)   { lastBriefResult = data.brief;     if (typeof renderBrief === 'function') renderBrief(data.brief); }
    if (data.caption) { lastCaptionResult = data.caption; if (typeof renderCaption === 'function') renderCaption(data.caption); }
    if (data.visual)  {
      lastVisualResult = data.visual; lastUnifiedResult = data.visual;
      if (typeof renderVisual === 'function') renderVisual(data.visual);
      if (typeof enableWf09ImageButton === 'function') enableWf09ImageButton(data.visual);
      if (typeof enableVideoButton === 'function') enableVideoButton(data.visual);
    }
    lastBuiltDraftId = data.draftId || null;
    if (data.draftId) await cbRehydrateImagesForDraft(data.draftId);
  } catch (e) { console.warn('[cb-cell] render-from-data failed:', e); }
}
async function cbRehydrateImagesForDraft(draftId) {
  try {
    const rows = await supabaseGet(`creative_assets?draft_id=eq.${draftId}&asset_type=eq.image&order=created_at.asc&select=id,file_url,created_at`);
    if (!Array.isArray(rows) || !rows.length) return;
    const slides = rows.filter(r => r.file_url)
      .map((r, i) => ({ index: i + 1, kind: 'photo', image_url: r.file_url, asset_id: r.id }));
    if (!slides.length) return;
    if (slides.length === 1) renderVisualBriefIntoView(null, slides[0].image_url);
    else renderCarouselIntoView(slides);
  } catch (e) { console.warn('[cb-cell] image rehydrate failed:', e); }
}
// Persist the active cell's LIGHT state (no base64) and mirror it in memory.
async function cbPersistActiveCell() {
  if (!brandKitData.brandId) return;
  const channel = contentBuilderActiveTab || 'Instagram';
  const verticalName = cbActiveVertical || '__all__';
  const data = {
    brief:   lastBriefResult   || null,
    caption: lastCaptionResult || null,
    visual:  lastVisualResult  || null,
    draftId: lastBuiltDraftId  || null,
  };
  const key = cbCellKey(channel, cbActiveVertical);
  cbCellState[key] = { ...(cbCellState[key] || {}), data };
  try {
    await supabaseUpsert('cb_cell_state', {
      brand_id: brandKitData.brandId,
      channel,
      vertical_name: verticalName,
      draft_id: data.draftId,
      state_json: data,
    }, 'brand_id,channel,vertical_name');
  } catch (e) { console.warn('[cb-cell] persist failed:', e); }
}
// Call after any successful generation render: refresh the snapshot + persist.
function cbCommitActiveCell() {
  if (!cbCurrentCellKey_) cbCurrentCellKey_ = cbActiveCellKey();
  try { cbSnapshotActiveCell(); } catch (_) {}
  cbPersistActiveCell();
}
// Snapshot the current screen, run a key-changing mutation, restore the new cell.
// Nested calls (e.g. toggleVerticalExpansion → setContentBuilderTab) just run.
function cbWithCellSwitch(fn) {
  if (_cbCellSwitching) return fn();
  _cbCellSwitching = true;
  cbSnapshotActiveCell();
  let r;
  try { r = fn(); }
  finally {
    const newKey = cbActiveCellKey();
    Promise.resolve(cbRestoreCell(newKey)).finally(() => { _cbCellSwitching = false; });
  }
  return r;
}
// Pull every cell's durable state for this brand and render the active one.
async function cbHydrateCellsFromSupabase() {
  if (!brandKitData.brandId) return;
  try {
    const rows = await supabaseGet(`cb_cell_state?brand_id=eq.${brandKitData.brandId}&select=channel,vertical_name,draft_id,state_json`);
    if (!Array.isArray(rows)) return;
    for (const r of rows) {
      const vName = (r.vertical_name && r.vertical_name !== '__all__') ? r.vertical_name : null;
      const key = cbCellKey(r.channel, vName);
      const data = (r.state_json && typeof r.state_json === 'object') ? r.state_json : {};
      if (!data.draftId) data.draftId = r.draft_id || null;
      cbCellState[key] = { ...(cbCellState[key] || {}), data };
    }
    const activeKey = cbActiveCellKey();
    if (cbCellState[activeKey]?.data) await cbRestoreCell(activeKey);
    else cbCurrentCellKey_ = activeKey;
  } catch (e) { console.warn('[cb-cell] hydrate failed:', e); }
}

async function callWf12({ brandId, channel, mode, userBriefing, priorBrief, draftId }) {
  // Forward the active vertical (with its WF15 content profile) so WF12 can
  // write content SPECIFIC to that vertical instead of generic brand copy.
  const activeV = cbActiveVertical
    ? (brandKitData.verticals || []).find(v => v.name === cbActiveVertical) || null
    : null;
  // Compact SocialMediaBios for this channel so WF12 agents can use real tone/voiceRules
  // instead of falling back to generic brand defaults.
  const channelBiosArr = getSocialBiosForPayload(channel);
  const channelBio = channelBiosArr?.[0] || null;
  const payload = {
    brand_id: brandId,
    channel,
    mode,
    user_briefing: userBriefing && userBriefing.text ? {
      text:   userBriefing.text,
      locked: !!userBriefing.locked,
    } : null,
    prior_brief: priorBrief || null,
    draft_id:    draftId    || null,
    selected_vertical: activeV
      ? { name: activeV.name, desc: activeV.desc || '', profile: activeV.profile || null }
      : null,
    // Own-channel tone profile: tone sliders, toneSummary, voiceRules (always/never),
    // primaryFormat, topHookSnippets — gives WF12 the same context as SocialMediaBios
    channel_bio: channelBio,
  };
  console.log(`[WF12 mode=${mode}] sending payload:`, payload);
  const res = await fetch(WF12_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch (_) { body = text; }
  if (!res.ok) {
    throw new Error(`WF12 HTTP ${res.status}: ${typeof body === 'string' ? body.slice(0,200) : (body?.message || JSON.stringify(body).slice(0,200))}`);
  }
  if (Array.isArray(body)) body = body[0];
  if (body && body.json && typeof body.ok === 'undefined') body = body.json;
  return body;
}

// ── Agent 1 · Brief ────────────────────────────────────────────────────────
async function handleGenerateBrief() {
  const btn = document.getElementById('btn-brief-generate');
  if (!btn) return;
  const channel = contentBuilderActiveTab || 'Instagram';
  const brandId = brandKitData.brandId;
  if (!brandId) {
    showToast('Guardá Branding Bio antes — falta brand_id.', 'error');
    return;
  }

  const savedBrief = await loadUserBriefing(brandId, channel);
  const txtValue = (document.getElementById('cb-user-brief')?.value || '').trim();
  const userBriefing = savedBrief && savedBrief.briefing_text
    ? { text: savedBrief.briefing_text, locked: true }
    : (txtValue ? { text: txtValue, locked: false } : null);

  // New brief invalidates downstream caption + visual.
  lastBriefResult = null;
  lastCaptionResult = null;
  lastVisualResult = null;
  lastUnifiedResult = null;
  updateAgentButtonsEnabled();

  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:12px;animation:spin 1s linear infinite"></i> Armando brief…';
  lucide.createIcons();

  try {
    const result = await callWf12({ brandId, channel, mode: 'brief', userBriefing });
    if (!result || result.ok !== true || !result.brief) {
      throw new Error(`Respuesta inesperada: ${JSON.stringify(result).slice(0, 200)}`);
    }
    lastBriefResult = result;
    renderBrief(result);
    cbCommitActiveCell();
    updateAgentButtonsEnabled();
    showToast('Brief listo — ahora generá el texto o el visual.');
    btn.innerHTML = '<i data-lucide="check" style="width:12px"></i> Listo · regenerar';
    btn.style.background = '#10B981';
  } catch (err) {
    console.error('[WF12 brief] error:', err);
    showToast(`No se pudo armar el brief: ${err.message || err}`, 'error');
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error — reintentar';
    btn.style.background = '#EF4444';
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="sparkles" style="width:12px"></i> Armar brief';
      btn.style.background = '#7C3AED';
      lucide.createIcons();
    }, 2200);
  }
}

function renderBrief(r) {
  const b = r.brief || {};
  const body = document.getElementById('cb-brief-body');
  if (!body) return;
  const list = (arr) => Array.isArray(arr) && arr.length
    ? `<ul style="margin:4px 0 0 18px; padding:0;">${arr.map(x => `<li style="margin-bottom:2px;">${escapeHtml(String(x))}</li>`).join('')}</ul>`
    : '<span style="color:var(--text-muted); font-style:italic;">—</span>';
  const composition = Array.isArray(b.slide_composition) ? b.slide_composition : [];
  const compositionHtml = composition.length ? `
    <div style="grid-column: 1 / -1; padding:12px; background:white; border:1px solid #E9D5FF; border-radius:8px;">
      <div style="font-size:10px; font-weight:700; color:#6B21A8; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Composición del carrusel <span style="color:var(--text-muted); font-weight:500; text-transform:none; letter-spacing:0;">— aprendida de los top posts de la marca</span></div>
      <div style="display:grid; grid-template-columns:repeat(${Math.min(composition.length, 6)}, 1fr); gap:6px;">
        ${composition.map(s => {
          const isPhoto = s.kind === 'photo';
          return `<div style="padding:8px 10px; border:1px solid ${isPhoto ? '#BAE6FD' : '#D8B4FE'}; background:${isPhoto ? '#F0F9FF' : '#FAF5FF'}; border-radius:6px;">
            <div style="font-size:10px; font-weight:700; color:${isPhoto ? '#0369A1' : '#6B21A8'}; margin-bottom:3px;">${s.index} · ${isPhoto ? '📷 photo' : '🎨 designed'}</div>
            <div style="font-size:11px; color:var(--text-main); line-height:1.3;">${escapeHtml((s.purpose || '').slice(0, 90))}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  ` : '';
  body.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
      <div style="padding:12px; background:white; border:1px solid #E9D5FF; border-radius:8px;">
        <div style="display:flex; gap:6px; align-items:center; margin-bottom:8px;">
          ${b.language ? `<span style="font-size:10px; padding:2px 8px; background:#FEF3C7; color:#92400E; border-radius:99px; font-weight:700; text-transform:uppercase;">Lang: ${escapeHtml(b.language)}</span>` : ''}
          <span style="font-size:10px; padding:2px 8px; background:#EEF2FF; color:#4338CA; border-radius:99px; font-weight:700; text-transform:uppercase;">${escapeHtml(b.format_reco || '—')}${b.slide_count_reco ? ' · ' + b.slide_count_reco + ' slides' : ''}</span>
        </div>
        <div style="font-size:10px; font-weight:700; color:#6B21A8; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Objetivo</div>
        <div style="font-size:13px; line-height:1.5;">${escapeHtml(b.objective || '—')}</div>
        <div style="font-size:10px; font-weight:700; color:#6B21A8; text-transform:uppercase; letter-spacing:0.5px; margin:10px 0 4px;">Ángulo</div>
        <div style="font-size:13px; line-height:1.5;">${escapeHtml(b.angle || '—')}</div>
      </div>
      <div style="padding:12px; background:white; border:1px solid #E9D5FF; border-radius:8px;">
        <div style="font-size:10px; font-weight:700; color:#6B21A8; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Tono</div>
        <div style="font-size:12px; line-height:1.5;">${escapeHtml(b.tone_notes || '—')}</div>
        <div style="font-size:10px; font-weight:700; color:#6B21A8; text-transform:uppercase; letter-spacing:0.5px; margin:10px 0 4px;">Paleta</div>
        <div style="font-size:12px; line-height:1.5;">${escapeHtml(b.palette_notes || '—')}</div>
        <div style="font-size:10px; font-weight:700; color:#6B21A8; text-transform:uppercase; letter-spacing:0.5px; margin:10px 0 4px;">Tipografía</div>
        <div style="font-size:12px; line-height:1.5;">${escapeHtml(b.typography_notes || '—')}</div>
      </div>
      ${compositionHtml}
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-top:12px;">
      <div style="padding:10px 12px; background:#FEF3C7; border:1px solid #FDE68A; border-radius:8px;">
        <div style="font-size:10px; font-weight:700; color:#92400E; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Hooks a usar</div>
        <div style="font-size:12px; color:#78350F;">${list(b.hooks_to_use)}</div>
      </div>
      <div style="padding:10px 12px; background:#DBEAFE; border:1px solid #BFDBFE; border-radius:8px;">
        <div style="font-size:10px; font-weight:700; color:#1E40AF; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Estructuras a tomar prestadas</div>
        <div style="font-size:12px; color:#1E3A8A;">${list(b.structures_to_borrow)}</div>
      </div>
      <div style="padding:10px 12px; background:#FEE2E2; border:1px solid #FECACA; border-radius:8px;">
        <div style="font-size:10px; font-weight:700; color:#991B1B; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Evitar</div>
        <div style="font-size:12px; color:#7F1D1D;">${list(b.must_avoid)}</div>
      </div>
    </div>
  `;
  // Update the composed-prompt viewer so the user can see exactly what the LLM read.
  const cp = document.getElementById('cb-composed-prompt');
  if (cp) cp.textContent = r.composed_prompt || '(sin prompt compuesto)';
  const counts = r.counts || {};
  const cpCounts = document.getElementById('cb-composed-prompt-counts');
  if (cpCounts) cpCounts.textContent = `brand_profile: ${counts.brand_profile || 0} · smb: ${counts.smb_analyses || 0} · hooks: ${counts.hooks || 0} · comp_posts: ${counts.competitor_content || 0}`;
  lucide.createIcons();
}

// ── Agent 2 · Caption ──────────────────────────────────────────────────────
async function handleGenerateCaption() {
  const btn = document.getElementById('btn-caption-generate');
  if (!btn) return;
  if (!lastBriefResult || !lastBriefResult.brief) {
    showToast('Armá el brief primero.', 'error');
    return;
  }
  const channel = contentBuilderActiveTab || 'Instagram';
  const brandId = brandKitData.brandId;
  const savedBrief = await loadUserBriefing(brandId, channel);
  const txtValue = (document.getElementById('cb-user-brief')?.value || '').trim();
  const userBriefing = savedBrief && savedBrief.briefing_text
    ? { text: savedBrief.briefing_text, locked: true }
    : (txtValue ? { text: txtValue, locked: false } : null);

  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:12px;animation:spin 1s linear infinite"></i> Escribiendo…';
  lucide.createIcons();

  try {
    const result = await callWf12({
      brandId, channel, mode: 'caption', userBriefing,
      priorBrief: lastBriefResult.brief,
    });
    if (!result || result.ok !== true) throw new Error(`Respuesta inesperada: ${JSON.stringify(result).slice(0, 200)}`);
    lastCaptionResult = result;
    lastBuiltDraftId  = result.draft_id || lastBuiltDraftId;
    // Keep lastUnifiedResult populated so downstream WF13/approval/publish keep working.
    lastUnifiedResult = { ...(lastUnifiedResult || {}), ...result };
    renderCaption(result);
    cbCommitActiveCell();
    updateAgentButtonsEnabled();
    showToast('Caption listo.');
    btn.innerHTML = '<i data-lucide="check" style="width:12px"></i> Listo · regenerar';
    btn.style.background = '#10B981';
  } catch (err) {
    console.error('[WF12 caption] error:', err);
    showToast(`No se pudo escribir el caption: ${err.message || err}`, 'error');
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error — reintentar';
    btn.style.background = '#EF4444';
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="type" style="width:12px"></i> Generar texto del post';
      btn.style.background = '#10B981';
      lucide.createIcons();
    }, 2200);
  }
}

function renderCaption(r) {
  const setText = (id, text) => { const e = document.getElementById(id); if (e) e.textContent = text || '—'; };
  setText('cb-post-body', r.caption || '(sin caption)');
  const hashtagsEl = document.getElementById('cb-post-hashtags');
  if (hashtagsEl) {
    const tags = Array.isArray(r.hashtags) ? r.hashtags : [];
    hashtagsEl.innerHTML = tags.length
      ? tags.map(t => `<span style="display:inline-block; background:#ECFDF5; color:#065F46; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:600; margin-right:4px;">${escapeHtml(String(t).startsWith('#') ? t : '#' + t)}</span>`).join('')
      : '';
  }
  lucide.createIcons();
}

// ── Agent 3 · Visual ───────────────────────────────────────────────────────
async function handleGenerateVisual() {
  const btn = document.getElementById('btn-visual-generate');
  if (!btn) return;
  if (!lastBriefResult || !lastBriefResult.brief) {
    showToast('Armá el brief primero.', 'error');
    return;
  }
  const channel = contentBuilderActiveTab || 'Instagram';
  const brandId = brandKitData.brandId;
  const savedBrief = await loadUserBriefing(brandId, channel);
  const txtValue = (document.getElementById('cb-user-brief')?.value || '').trim();
  const userBriefing = savedBrief && savedBrief.briefing_text
    ? { text: savedBrief.briefing_text, locked: true }
    : (txtValue ? { text: txtValue, locked: false } : null);

  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:12px;animation:spin 1s linear infinite"></i> Componiendo visual…';
  lucide.createIcons();

  try {
    const result = await callWf12({
      brandId, channel, mode: 'visual', userBriefing,
      priorBrief: lastBriefResult.brief,
    });
    if (!result || result.ok !== true) throw new Error(`Respuesta inesperada: ${JSON.stringify(result).slice(0, 200)}`);
    lastVisualResult = result;
    lastUnifiedResult = { ...(lastUnifiedResult || {}), ...result };
    renderVisual(result);
    cbCommitActiveCell();
    enableWf09ImageButton(lastUnifiedResult);
    enableVideoButton(lastUnifiedResult);
    updateAgentButtonsEnabled();
    showToast(`Visual prompt listo${result.slide_count > 1 ? ` — ${result.slide_count} slides` : ''}.`);
    btn.innerHTML = '<i data-lucide="check" style="width:12px"></i> Listo · regenerar';
    btn.style.background = '#10B981';
  } catch (err) {
    console.error('[WF12 visual] error:', err);
    showToast(`No se pudo armar el visual: ${err.message || err}`, 'error');
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error — reintentar';
    btn.style.background = '#EF4444';
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="image" style="width:12px"></i> Generar prompt visual';
      btn.style.background = '#0EA5E9';
      lucide.createIcons();
    }, 2200);
  }
}

function renderVisual(r) {
  const vpOut = document.getElementById('cb-visual-prompt-output');
  // New shape: r.slides[] with per-slide kind ('photo' or 'designed_text').
  // Legacy shape: r.slide_prompts[] (strings).
  const slides = Array.isArray(r.slides) && r.slides.length ? r.slides : null;
  const legacyPrompts = Array.isArray(r.slide_prompts) ? r.slide_prompts.filter(Boolean) : [];

  if (vpOut) {
    if (slides) {
      vpOut.innerHTML = slides.map(s => {
        if (s.kind === 'photo') {
          return `
            <div style="margin-bottom:10px; padding:12px 14px; border:1px solid #E0F2FE; border-radius:6px; background:#F0F9FF;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:10px; font-weight:700; color:#0369A1; text-transform:uppercase; letter-spacing:0.5px;">Slide ${s.index} · 📷 Photo (Gemini)</span>
              </div>
              <div style="font-size:12px; line-height:1.5; color:var(--text-main);">${escapeHtml(s.prompt || '(sin prompt)')}</div>
            </div>`;
        }
        // designed_text — show structured spec
        const items = Array.isArray(s.items) ? s.items : [];
        const itemsHtml = items.length ? `
          <ul style="margin:6px 0 0 18px; padding:0; font-size:12px; color:var(--text-main);">
            ${items.slice(0,4).map(it => `<li style="margin-bottom:3px;"><strong>${escapeHtml(it.title || it.value || it.label || '')}</strong>${it.desc ? ' — ' + escapeHtml(it.desc) : ''}</li>`).join('')}
          </ul>` : '';
        return `
          <div style="margin-bottom:10px; padding:12px 14px; border:1px solid #D8B4FE; border-radius:6px; background:#FAF5FF;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:10px; font-weight:700; color:#6B21A8; text-transform:uppercase; letter-spacing:0.5px;">Slide ${s.index} · 🎨 Designed text · ${escapeHtml(s.variant || 'cards')}</span>
              ${s.tag ? `<span style="font-size:10px; padding:2px 8px; background:#F3E8FF; color:#6B21A8; border-radius:99px; font-weight:600;">${escapeHtml(s.tag)}</span>` : ''}
            </div>
            ${s.headline ? `<div style="font-size:13px; font-weight:700; line-height:1.3; color:var(--text-main); margin-bottom:4px;">${escapeHtml(s.headline)}</div>` : ''}
            ${s.sub ? `<div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">${escapeHtml(s.sub)}</div>` : ''}
            ${itemsHtml}
            ${s.highlight ? `<div style="margin-top:6px; padding:6px 10px; background:#FEF3C7; border-left:3px solid #F59E0B; font-size:12px; color:#78350F;">${escapeHtml(s.highlight)}</div>` : ''}
            ${s.cta_text ? `<div style="margin-top:6px; padding:6px 10px; background:#ECFDF5; border:1px solid #BBF7D0; border-radius:4px; font-size:12px; color:#065F46;"><strong>${escapeHtml(s.cta_tag || 'CTA')}:</strong> ${escapeHtml(s.cta_text)}</div>` : ''}
          </div>`;
      }).join('');
    } else if (legacyPrompts.length > 1) {
      vpOut.innerHTML = legacyPrompts.map((sp, i) => `
        <div style="margin-bottom:10px; padding:10px 12px; border:1px solid #E0F2FE; border-radius:6px; background:#F0F9FF;">
          <div style="font-size:10px; font-weight:700; color:#0369A1; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Slide ${i+1} de ${legacyPrompts.length}</div>
          <div style="font-size:12px; line-height:1.5; color:var(--text-main);">${escapeHtml(sp)}</div>
        </div>
      `).join('');
    } else {
      vpOut.textContent = r.visual_prompt || '(sin visual prompt)';
    }
  }
  const meta = document.getElementById('cb-visual-meta');
  if (meta) {
    const fmtBadge = r.format
      ? `<span style="background:#E0F2FE;color:#0369A1;padding:2px 8px;border-radius:4px;font-weight:700">${escapeHtml(r.format)}${r.slide_count > 1 ? ' · ' + r.slide_count + ' slides' : ''}</span>`
      : '';
    const langBadge = r.language ? `<span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:4px;font-weight:700;margin-left:4px;">lang: ${escapeHtml(r.language)}</span>` : '';
    let mixBadge = '';
    if (slides) {
      const photo = slides.filter(s => s.kind === 'photo').length;
      const designed = slides.filter(s => s.kind === 'designed_text').length;
      mixBadge = `<span style="background:#F3E8FF;color:#6B21A8;padding:2px 8px;border-radius:4px;font-weight:700;margin-left:4px;">${photo} 📷 · ${designed} 🎨</span>`;
    }
    meta.innerHTML = fmtBadge + langBadge + mixBadge;
  }
  lucide.createIcons();
}

// Enable/disable the 3 agent buttons based on what's been generated so far.
function updateAgentButtonsEnabled() {
  const briefDone = !!(lastBriefResult && lastBriefResult.brief);
  const capBtn  = document.getElementById('btn-caption-generate');
  const visBtn  = document.getElementById('btn-visual-generate');
  if (capBtn) {
    capBtn.disabled = !briefDone;
    capBtn.title = briefDone ? '' : 'Armá el brief primero.';
    capBtn.style.opacity = briefDone ? '1' : '0.55';
  }
  if (visBtn) {
    visBtn.disabled = !briefDone;
    visBtn.title = briefDone ? '' : 'Armá el brief primero.';
    visBtn.style.opacity = briefDone ? '1' : '0.55';
  }
}

function handleCopyVisualPrompt() {
  const el = document.getElementById('cb-visual-prompt-output');
  if (!el || !el.textContent) return;
  navigator.clipboard.writeText(el.textContent).then(
    () => showToast('Visual prompt copiado al portapapeles.'),
    () => showToast('No se pudo copiar.', 'error'),
  );
}

// ── Slide lightbox ─────────────────────────────────────────────────────────
// Fullscreen overlay to view a carousel slide at its real resolution.
// Click outside or press Esc to close. Left/Right arrows navigate between
// slides; clicking the slide itself closes the lightbox.
function openSlideLightbox(urls, startIndex = 0) {
  if (!Array.isArray(urls) || !urls.length) return;
  let idx = Math.max(0, Math.min(startIndex, urls.length - 1));

  const overlay = document.createElement('div');
  overlay.id = 'cb-lightbox';
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(8,8,12,0.92);
    z-index:9999; display:flex; align-items:center; justify-content:center;
    padding:40px; cursor:zoom-out; user-select:none;
    animation: cbLbFadeIn 0.15s ease-out;
  `;
  overlay.innerHTML = `
    <style>
      @keyframes cbLbFadeIn { from { opacity:0 } to { opacity:1 } }
      #cb-lightbox .cb-lb-btn {
        position:absolute; top:50%; transform:translateY(-50%);
        width:48px; height:48px; border-radius:50%;
        background:rgba(255,255,255,0.10); color:white; border:none;
        font-size:24px; font-weight:700; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        transition:background .15s, transform .15s;
      }
      #cb-lightbox .cb-lb-btn:hover { background:rgba(255,255,255,0.22); }
      #cb-lightbox .cb-lb-btn:active { transform:translateY(-50%) scale(0.92); }
      #cb-lightbox .cb-lb-btn.prev { left:24px; }
      #cb-lightbox .cb-lb-btn.next { right:24px; }
      #cb-lightbox .cb-lb-close {
        position:absolute; top:20px; right:24px;
        width:40px; height:40px; border-radius:50%;
        background:rgba(255,255,255,0.10); color:white; border:none;
        font-size:22px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
      }
      #cb-lightbox .cb-lb-close:hover { background:rgba(255,255,255,0.22); }
      #cb-lightbox .cb-lb-dl {
        position:absolute; top:20px; right:74px;
        width:40px; height:40px; border-radius:50%;
        background:rgba(255,255,255,0.10); color:white; border:none;
        font-size:18px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
      }
      #cb-lightbox .cb-lb-dl:hover { background:rgba(255,255,255,0.22); }
      #cb-lightbox .cb-lb-counter {
        position:absolute; top:24px; left:50%; transform:translateX(-50%);
        color:rgba(255,255,255,0.8); font-size:13px; font-weight:600;
        background:rgba(0,0,0,0.35); padding:6px 14px; border-radius:99px;
        letter-spacing:0.5px;
      }
      #cb-lightbox img.cb-lb-img {
        max-width:min(92vw, 1080px); max-height:88vh;
        width:auto; height:auto; object-fit:contain;
        border-radius:8px; box-shadow:0 24px 60px rgba(0,0,0,0.5);
        background:#0A0A0A; cursor:zoom-out;
      }
    </style>
    <button class="cb-lb-close" type="button" title="Cerrar (Esc)">✕</button>
    <button class="cb-lb-dl" type="button" title="Descargar este slide">⬇</button>
    <span class="cb-lb-counter"></span>
    <button class="cb-lb-btn prev" type="button" title="Slide anterior (←)" ${urls.length < 2 ? 'style="display:none"' : ''}>‹</button>
    <img class="cb-lb-img" alt="slide" />
    <button class="cb-lb-btn next" type="button" title="Slide siguiente (→)" ${urls.length < 2 ? 'style="display:none"' : ''}>›</button>
  `;
  document.body.appendChild(overlay);

  const img      = overlay.querySelector('.cb-lb-img');
  const counter  = overlay.querySelector('.cb-lb-counter');
  const prevBtn  = overlay.querySelector('.cb-lb-btn.prev');
  const nextBtn  = overlay.querySelector('.cb-lb-btn.next');
  const closeBtn = overlay.querySelector('.cb-lb-close');

  const render = () => {
    img.src = urls[idx];
    counter.textContent = `${idx + 1} / ${urls.length}`;
  };
  render();

  const close = () => {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
  };
  const prev = (e) => { e?.stopPropagation(); idx = (idx - 1 + urls.length) % urls.length; render(); };
  const next = (e) => { e?.stopPropagation(); idx = (idx + 1) % urls.length; render(); };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft')  prev(e);
    else if (e.key === 'ArrowRight') next(e);
  };

  // Click outside the image closes; clicking buttons/image does not.
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === img) close();
  });
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  const dlBtn = overlay.querySelector('.cb-lb-dl');
  if (dlBtn) dlBtn.addEventListener('click', (e) => { e.stopPropagation(); downloadDataUrl(urls[idx], `slide-${idx + 1}.png`); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
}

// ── WF13 — Image Generation from WF12's visual_prompt ──────────────────────
// The unified agent (WF12) outputs the visual_prompt as text. This handler
// takes that prompt + the draft_id and fires WF13, a thin workflow that
// pipes the prompt straight into Gemini 2.5 Flash Image ("nanobanana") and
// returns the image as a data: URL. WF09 (the legacy creative brain that
// also routed through OpenAI) is bypassed entirely — see the architectural
// note in MEMORY.md → wf13-image-gen for why.
const WF13_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf13-image-gen';
const WF14_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf14-visual-style';
const WF16_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf16-video-gen';

function getVideoAspectRatio(channel) {
  const c = (channel || '').toLowerCase();
  if (c.includes('tiktok') || c.includes('reel') || c.includes('story')) return '9:16';
  if (c.includes('youtube') || c.includes('linkedin'))                    return '16:9';
  return '1:1';
}

// Fetches the highest-scoring hook from hook_library for the given brand+channel,
// optionally filtered by the active vertical name. Returns the hook_text string or null.
async function fetchTopHookForVideo(brandId, channel) {
  if (!brandId) return null;
  try {
    const params = new URLSearchParams({
      brand_id: `eq.${brandId}`,
      order:    'score.desc',
      limit:    '1',
      select:   'hook_text,framework,channel',
    });
    if (channel) params.set('channel', `eq.${channel}`);
    const rows = await supabaseGet(`hook_library?${params}`);
    return rows?.[0]?.hook_text || null;
  } catch (e) {
    console.warn('[video] fetchTopHookForVideo failed:', e);
    return null;
  }
}

// GenHQ Video Prompting Framework — "Burger Formula" + Kling 3.0 Five Layers
// Source: CURSO - GENHQ.pdf
// Formula: [Medium] + [Shot] + [Angle] + [Movement] + [Focus] + [Subject] + [Lighting] + [Color]
// Kling layers: Scene → Characters → Action → Camera → Audio & Style
// hookText (optional): top hook concept from HookMiner's hook_library — used to guide
// the opening visual narrative without overriding the core visual composition.
function buildKlingPrompt(visualPrompt, channel, hookType, hookText) {
  const c = (channel || '').toLowerCase();

  let medium, shot, angle, movement, focus, lighting, color, audio;

  if (c.includes('tiktok') || c.includes('reel') || c.includes('story')) {
    // TikTok/Reels: authentic, energetic, vertical, handheld UGC feel
    medium   = 'Smartphone camera footage, organic film texture, vertical frame 9:16';
    shot     = 'MCU (Medium Close Up), subject fills frame';
    angle    = 'Eye level, slight upward tilt for energy and presence';
    movement = 'Handheld camera with natural slight tremor, occasional push in toward subject';
    focus    = 'Shallow focus, subject razor sharp, background soft bokeh';
    lighting = 'Natural warm light, practical ring light, authentic and unfiltered';
    color    = 'Warm vibrant tones, high saturation, punchy contrast';
    audio    = 'Upbeat energy, natural ambient sound, fast-paced rhythm';
  } else if (c.includes('instagram')) {
    // Instagram: aesthetic, polished, editorial, aspirational
    medium   = 'Editorial photography quality, cinematic 1:1 format, film-inspired grain';
    shot     = 'MID (Medium Shot) to MCU, elegant composition with breathing room';
    angle    = 'Slight high angle, graceful and flattering';
    movement = 'Smooth steadicam dolly, slow and deliberate 0.3x speed, cinematic glide';
    focus    = 'Shallow focus with dreamy bokeh, selective deep focus on hero detail';
    lighting = 'Golden hour natural light, soft diffused glow, warm and aspirational';
    color    = 'Warm aesthetic tones, slightly desaturated film look, complementary palette';
    audio    = 'Soft ambient, subtle lo-fi texture, elegant and emotional';
  } else if (c.includes('linkedin')) {
    // LinkedIn: authoritative, professional, B2B trust signals
    medium   = 'Professional corporate video, clean production value, 16:9 widescreen';
    shot     = 'MID (Medium Shot), confident framing with environment visible';
    angle    = 'Eye level, slightly low angle to convey authority and trustworthiness';
    movement = 'Slow deliberate dolly in, stable tripod or slider movement, no shake';
    focus    = 'Deep focus throughout, everything sharp and clear';
    lighting = 'Professional studio lighting, high key, clean shadows, neutral and trustworthy';
    color    = 'Cool professional palette, neutral tones, slight blue-cool grade';
    audio    = 'Subtle corporate ambient, clean and minimal background score';
  } else if (c.includes('youtube')) {
    // YouTube: cinematic, high production, storytelling-first
    medium   = 'Cinematic film quality, wide 16:9 format, anamorphic lens character';
    shot     = 'MLS (Medium Long Shot) establishing, cutting to CU for emphasis';
    angle    = 'Dynamic varied angles: eye level then low angle for drama';
    movement = 'Cinematic orbit (arc around subject) combined with slow dolly in';
    focus    = 'Deep focus opening, rack focus (RF) to subject for dramatic emphasis';
    lighting = 'Dramatic cinematic motivated lighting, high contrast, chiaroscuro depth';
    color    = 'Rich cinematic color grade, lifted blacks, deep shadows, film LUT applied';
    audio    = 'Cinematic score, layered SFX, dramatic build';
  } else {
    medium   = 'Cinematic quality footage';
    shot     = 'MID (Medium Shot)';
    angle    = 'Eye level';
    movement = 'Smooth steadicam movement';
    focus    = 'Shallow focus, subject sharp';
    lighting = 'Natural cinematic lighting, motivated sources';
    color    = 'Balanced warm-neutral color palette';
    audio    = 'Subtle ambient background';
  }

  // Hook-type specific camera direction (from hook miner data)
  let hookCamera = '';
  const h = (hookType || '').toLowerCase();
  if (h.includes('contrarian') || h.includes('stop') || h.includes('wrong')) {
    hookCamera = 'Quick dramatic push in on subject face at moment of revelation. Dutch angle for tension.';
  } else if (h.includes('number') || h.includes('specific')) {
    hookCamera = 'Clean static shot then slow zoom in for emphasis on key information.';
  } else if (h.includes('how') || h.includes('we do')) {
    hookCamera = 'Tracking shot following subject through action, over-the-shoulder perspective.';
  } else if (h.includes('open') || h.includes('loop') || h.includes('secret')) {
    hookCamera = 'Slow orbit around subject, building anticipation. Rack focus from environment to face.';
  } else if (h.includes('persona') || h.includes('every')) {
    hookCamera = 'Dolly in combined with slight low angle, empowering and direct.';
  }

  // Hook-concept opening direction (from HookMiner's hook_library) — brief narrative
  // anchor that aligns the visual with the content angle without constraining composition.
  const hookConceptLine = hookText
    ? `Opening concept anchored on: "${hookText.slice(0, 120).replace(/"/g, '\'')}".`
    : '';

  // Assemble Kling 3.0 five-layer prompt
  const prompt = [
    // Layer 1: Scene
    `Scene: ${medium}.`,
    // Layer 2: Characters + Subject (+ HookMiner concept anchor when available)
    `${shot}. ${angle}. ${visualPrompt}. ${hookConceptLine}`.trim(),
    // Layer 3: Action + Movement
    `Camera: ${movement}. ${hookCamera}`.trim(),
    // Layer 4: Focus + Lighting + Color
    `Focus: ${focus}. Lighting: ${lighting}. Color: ${color}.`,
    // Layer 5: Audio & Style
    `Style: ${audio}. Photorealistic, ultra high quality, no text overlay, no watermark, no subtitles, no UI elements.`,
  ].join(' ');

  return prompt;
}

// Checks if WF14 visual style profiling already ran for this brand+channel.
// If not, triggers WF14 and waits. Returns true if WF14 actually ran, false if already cached.
async function ensureVisualStyleProfiled(brandId, channel) {
  try {
    const rows = await supabaseGet(
      `social_media_analyses?brand_id=eq.${brandId}&channel=eq.${encodeURIComponent(channel)}&select=analysis_json&limit=1`
    );
    const aj = rows?.[0]?.analysis_json;
    const parsed = typeof aj === 'string' ? JSON.parse(aj) : (aj || {});
    if (parsed?.visualStyle?.style_vibe_fragment) return false; // already profiled
  } catch(_) { /* check failed — run WF14 anyway to be safe */ }

  const res = await fetch(WF14_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ brand_id: brandId, channel, max_images: 5 }),
  });
  if (!res.ok) throw new Error(`WF14 falló (HTTP ${res.status}) — verificá que el workflow esté activo en n8n`);
  return true;
}

async function generateVideoViaKling({ brandId, draftId, channel, videoPrompt, duration, smVideoId, conceptIndex }) {
  const payload = {
    brand_id:        brandId,
    draft_id:        draftId,
    channel,
    video_prompt:    videoPrompt,
    aspect_ratio:    getVideoAspectRatio(channel),
    duration:        duration || '5',
    negative_prompt: 'text overlay, watermark, logo, subtitle, low quality, blurry, distorted, flickering',
  };
  if (smVideoId)    payload.sm_video_id   = smVideoId;
  if (conceptIndex) payload.concept_index = conceptIndex;
  const res = await fetch(WF16_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`WF16 HTTP ${res.status}`);
  const text = await res.text();
  let result; try { result = JSON.parse(text); } catch (_) { result = {}; }
  if (Array.isArray(result)) result = result[0];
  return result?.video_url || result?.url || null;
}

function enableWf09ImageButton(unifiedResult) {
  const btn = document.getElementById('btn-generate-image-wf09');
  if (!btn) return;
  const ok = !!(unifiedResult && unifiedResult.visual_prompt && unifiedResult.visual_prompt !== '(no visual_prompt parsed)');
  btn.disabled = !ok;
  btn.title = ok ? 'Genera el video con Kling AI (fal.ai) usando el visual prompt del agente.'
                 : 'Primero generá el contenido arriba para tener un visual prompt.';
  if (ok) {
    const channel = unifiedResult.channel || contentBuilderActiveTab || 'Instagram';
    const ar = getVideoAspectRatio(channel);
    const arBadge = document.getElementById('cb-video-ar-badge');
    if (arBadge) arBadge.textContent = ar;
  }
}

// Generate one image for ONE photo prompt via WF13. Returns the data/URL or null.
async function generateOnePhotoViaWf13({ brandId, draftId, channel, prompt, index }) {
  const payload = {
    brand_id:      brandId,
    draft_id:      draftId,
    channel,
    slide_prompts: [prompt],
    visual_prompt: prompt,
    source:        'wf12-agent3-photo',
    slide_index:   index,
  };
  const res = await fetch(WF13_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const text = await res.text();
  let result; try { result = JSON.parse(text); } catch (_) { result = text; }
  if (Array.isArray(result)) result = result[0];
  if (result && result.json && typeof result.ok === 'undefined') result = result.json;
  if (!res.ok) throw new Error(`WF13 HTTP ${res.status}`);
  const urls = Array.isArray(result?.image_urls) && result.image_urls.length
    ? result.image_urls
    : (result?.image_url ? [result.image_url] : []);
  return urls[0] || null;
}

async function handleGenerateImageFromUnified() {
  const btn  = document.getElementById('btn-generate-image-wf09');
  const body = document.getElementById('cb-wf09-image-body');
  const meta = document.getElementById('cb-wf09-image-meta');
  if (!btn || !body) return;

  if (!lastVisualResult || !lastVisualResult.slides && !lastVisualResult.visual_prompt) {
    showToast('Falta el visual prompt — generá el Agente 3 (visual) primero.', 'error');
    return;
  }

  // Source of truth = structured slides[] from WF12 mode=visual.
  // Fallback to legacy slide_prompts[] / visual_prompt for backward compat.
  let slides = Array.isArray(lastVisualResult.slides) && lastVisualResult.slides.length
    ? lastVisualResult.slides
    : null;
  if (!slides) {
    const legacyPrompts = Array.isArray(lastVisualResult.slide_prompts) && lastVisualResult.slide_prompts.length
      ? lastVisualResult.slide_prompts
      : [lastVisualResult.visual_prompt];
    slides = legacyPrompts.map((p, i) => ({ index: i + 1, kind: 'photo', prompt: p }));
  }

  const draftId = lastVisualResult.draft_id || lastCaptionResult?.draft_id || lastBuiltDraftId || null;
  const channel = lastVisualResult.channel || contentBuilderActiveTab || 'Instagram';
  const brandId = brandKitData.brandId;
  const palette    = lastVisualResult.brand_defaults?.palette;
  const typography = lastVisualResult.brand_defaults?.typography;
  const toneFlags  = lastVisualResult.brand_defaults?.tone_flags || lastBriefResult?.brand_defaults?.tone_flags || [];

  // Remember the context so a single slide can be regenerated with a correction.
  lastImageGenCtx = { brandId, draftId, channel, palette, typography, toneFlags };

  const photoCount    = slides.filter(s => s.kind === 'photo').length;
  const designedCount = slides.filter(s => s.kind === 'designed_text').length;
  const totalSlides   = slides.length;

  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader-2" style="width:12px;animation:spin 1s linear infinite"></i> Renderizando…`;
  body.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;color:var(--text-muted);font-size:12px;">
      <div><i data-lucide="loader-2" style="width:14px;animation:spin 1s linear infinite;vertical-align:middle"></i> Procesando ${totalSlides} slides — visual generado por Gemini + texto con fuentes reales (ortografía perfecta).</div>
      <div id="cb-wf09-progress" style="font-size:11px; color:#6B21A8;"></div>
    </div>`;
  lucide.createIcons();
  const progressEl = document.getElementById('cb-wf09-progress');

  try {
    // Render each slide according to its kind. Photo slides run sequentially to
    // avoid hammering Gemini; designed slides are instant (client-side canvas).
    const results = new Array(slides.length);
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      if (progressEl) progressEl.textContent = `Slide ${s.index}/${totalSlides} — ${s.bg_prompt ? '🎨 Gemini visual + texto' : (s.kind === 'photo' ? '📷 Gemini' : '🎨 canvas')}…`;
      if (s.kind === 'photo' && !s.bg_prompt) {
        const url = await generateOnePhotoViaWf13({ brandId, draftId, channel, prompt: s.prompt, index: s.index });
        results[i] = url ? { index: s.index, kind: 'photo', url } : { index: s.index, kind: 'photo', error: 'no image returned' };
      } else {
        // Hybrid (or legacy designed_text): Gemini text-free background (when
        // bg_prompt is present) + code-rendered text overlay via html2canvas.
        const dataUrl = await renderDesignedSlide(s, s.index, totalSlides, { palette, typography, toneFlags, brandId, draftId, channel });
        results[i] = dataUrl
          ? { index: s.index, kind: 'designed_text', url: dataUrl }
          : { index: s.index, kind: 'designed_text', error: 'canvas render failed' };
      }
    }

    const usable = results.filter(r => r.url);
    if (!usable.length) {
      body.innerHTML = `<div style="color:#991B1B;font-size:12px;">No se pudo generar ningún slide. Errores: ${escapeHtml(JSON.stringify(results.filter(r => r.error)))}</div>`;
      throw new Error('Ningún slide renderizado');
    }

    const gridCols = usable.length === 1 ? '1fr' : (usable.length === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(180px, 1fr))');
    // Store full-res URLs in order on the body element so the lightbox click handler
    // can read them by index without serializing data URLs into onclick attributes.
    // Persist per-slide state so a single slide can be regenerated with a correction.
    lastRenderedSlides = results.map((r, i) => ({
      slot:   i,
      index:  r.index,
      kind:   r.kind,
      spec:   slides[i] || null,
      prompt: (slides[i] && (slides[i].bg_prompt || slides[i].prompt)) || '',
      url:    r.url || null,
      error:  r.error || null,
    }));

    const slidesGrid = results.map((r, i) => {
      if (r.error) return `<div class="cb-slide-cell" data-slide-idx="${i}" style="padding:24px;border:1px dashed #FCA5A5;border-radius:8px;text-align:center;color:#991B1B;font-size:11px;background:#FEF2F2;">Slide ${r.index} falló<br><small>${escapeHtml(r.error)}</small></div>`;
      const isDesigned = r.kind === 'designed_text';
      return `
        <div class="cb-slide-thumb" data-slide-idx="${i}" style="position:relative;border-radius:8px;overflow:hidden;border:1px solid ${isDesigned ? '#D8B4FE' : '#BAE6FD'};background:${isDesigned ? '#FAF5FF' : '#F0F9FF'};cursor:zoom-in;transition:transform .12s, box-shadow .12s;">
          <div style="position:absolute;top:6px;left:6px;background:rgba(0,0,0,0.72);color:white;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;z-index:2;">${r.index}/${totalSlides} · ${isDesigned ? '🎨' : '📷'}</div>
          <img src="${escapeHtml(r.url)}" alt="slide ${r.index}" style="width:100%;display:block;aspect-ratio:1/1;object-fit:cover;background:#FAFBFC;pointer-events:none;" />
        </div>`;
    }).join('');

    const fixOptions = lastRenderedSlides
      .map(s => `<option value="${s.slot}">Slide ${s.index}${s.error ? ' (falló)' : ''}</option>`)
      .join('');

    body.innerHTML = `
      <div style="width:100%;display:flex;flex-direction:column;gap:10px;">
        <div id="cb-slides-grid" style="display:grid;grid-template-columns:${gridCols};gap:8px;">${slidesGrid}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
          <span style="font-size:11px;color:#6B21A8;font-weight:600;"><i data-lucide="sparkles" style="width:11px;vertical-align:middle;margin-right:4px"></i>${usable.length} slide${usable.length === 1 ? '' : 's'} · visual Gemini + texto real (ortografía perfecta) · ${escapeHtml(channel)}</span>
          <div style="display:flex;align-items:center;gap:12px;">
            <button id="cb-download-all" title="Descarga cada slide como PNG a tu compu — no se pierden al regenerar" style="padding:7px 14px;border:none;border-radius:8px;background:#16A34A;color:white;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;"><i data-lucide="download" style="width:12px;vertical-align:middle;margin-right:4px"></i>Descargar todas</button>
            <span style="font-size:10.5px;color:var(--text-muted);font-style:italic;">Click un slide para verlo grande</span>
          </div>
        </div>
        <div id="cb-fix-section" style="margin-top:4px;padding:12px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;">
          <div style="font-size:11px;font-weight:700;color:#9A3412;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">
            <i data-lucide="wand-2" style="width:13px;vertical-align:middle;margin-right:4px"></i>Regenerar el visual de un slide
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <select id="cb-fix-slide" style="padding:8px 10px;border:1px solid #FDBA74;border-radius:8px;font-size:12px;background:white;color:#7C2D12;">${fixOptions}</select>
            <input id="cb-fix-note" type="text" placeholder='opcional: cómo querés el fondo · ej: la mano robótica del otro lado, más oscuro' style="flex:1;min-width:260px;padding:8px 10px;border:1px solid #FDBA74;border-radius:8px;font-size:12px;" />
            <button id="cb-fix-btn" style="padding:8px 14px;border:none;border-radius:8px;background:#EA580C;color:white;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">
              <i data-lucide="refresh-cw" style="width:12px;vertical-align:middle;margin-right:4px"></i>Regenerar slide
            </button>
          </div>
          <div style="font-size:10.5px;color:#9A3412;margin-top:6px;font-style:italic;">El texto ya sale perfecto (lo pone el código con las fuentes de la marca). Esto vuelve a generar el <b>fondo visual</b> de Gemini de ese slide — dejá la nota vacía para otra variación, o escribí cómo querés el visual.</div>
        </div>
      </div>`;
    // Wire click → lightbox for each thumbnail (urls read live from state so corrections show).
    body.querySelectorAll('.cb-slide-thumb').forEach(el => {
      el.addEventListener('mouseenter', () => { el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 6px 18px rgba(99,102,241,0.18)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; el.style.boxShadow = ''; });
      el.addEventListener('click', () => {
        const slot = Number(el.dataset.slideIdx);
        const urls = lastRenderedSlides.map(s => s.url).filter(Boolean);
        const before = lastRenderedSlides.slice(0, slot).filter(s => s.url).length;
        openSlideLightbox(urls, before);
      });
    });
    // Wire the correction section.
    const fixBtn = document.getElementById('cb-fix-btn');
    if (fixBtn) fixBtn.addEventListener('click', () => {
      const slot = Number(document.getElementById('cb-fix-slide')?.value);
      const note = (document.getElementById('cb-fix-note')?.value || '').trim();
      regenerateSlideWithCorrection(slot, note);
    });
    const dlBtn = document.getElementById('cb-download-all');
    if (dlBtn) dlBtn.addEventListener('click', () => downloadAllSlides(channel));
    if (meta) {
      meta.style.display = '';
      const errs = results.filter(r => r.error).length;
      meta.innerHTML = `<span><strong>renderizados:</strong> ${usable.length}/${totalSlides}</span> · <span><strong>draft_id:</strong> ${draftId ? draftId.slice(0,8) + '…' : '—'}</span>${errs ? ` · <span style="color:#991B1B"><strong>${errs} con error</strong></span>` : ''}`;
    }
    showToast(`Carrusel listo — ${usable.length}/${totalSlides} slides.`);
    btn.innerHTML = `<i data-lucide="check" style="width:12px"></i> ${usable.length}/${totalSlides} listos`;
    btn.style.background = '#10B981';
    cbCommitActiveCell();
  } catch (err) {
    console.error('[image-gen] error:', err);
    showToast(`Falló la generación: ${err.message || err}`, 'error');
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error — reintentar';
    btn.style.background = '#EF4444';
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = original;
      btn.style.background = '#8B5CF6';
      enableWf09ImageButton(lastVisualResult || lastUnifiedResult);
      lucide.createIcons();
    }, 2500);
    lucide.createIcons();
  }
}

// ── WF16 Video Generation (Kling AI via fal.ai) ──────────────────────────────

async function enableVideoButton(unifiedResult) {
  const btn = document.getElementById('btn-generate-video-wf16');
  if (!btn) return;
  const ok = !!(unifiedResult?.visual_prompt && unifiedResult.visual_prompt !== '(no visual_prompt parsed)');
  btn.disabled = !ok;
  if (!ok) return;

  const channel  = unifiedResult.channel || contentBuilderActiveTab || 'Instagram';
  const hookType = unifiedResult.hook_type || lastBriefResult?.hook_type || '';

  // Update aspect ratio badge
  const arBadge = document.getElementById('cb-video-ar-badge');
  if (arBadge) arBadge.textContent = getVideoAspectRatio(channel);

  // Pull top hook from HookMiner's hook_library for this channel so the Kling prompt
  // is anchored to a proven competitor hook concept adapted for our brand.
  const topHookText = await fetchTopHookForVideo(brandKitData.brandId, channel).catch(() => null);

  // Build GenHQ-structured Kling prompt and show in editable textarea
  const prompt = buildKlingPrompt(unifiedResult.visual_prompt, channel, hookType, topHookText);
  const promptWrap = document.getElementById('cb-video-prompt-wrap');
  const promptText = document.getElementById('cb-video-prompt-text');
  if (promptWrap) promptWrap.style.display = '';
  if (promptText) promptText.value = prompt;
}

async function handleGenerateVideo() {
  const btn  = document.getElementById('btn-generate-video-wf16');
  const body = document.getElementById('cb-video-body');
  const meta = document.getElementById('cb-video-meta');
  if (!btn || !body) return;

  if (!lastVisualResult?.visual_prompt) {
    showToast('Falta el visual prompt — generá el Agente 3 (visual) primero.', 'error');
    return;
  }

  const channel  = lastVisualResult.channel || contentBuilderActiveTab || 'Instagram';
  const brandId  = brandKitData.brandId;
  const draftId  = lastVisualResult.draft_id || lastCaptionResult?.draft_id || lastBuiltDraftId || null;
  const duration = document.getElementById('cb-video-duration')?.value || '5';
  const ar       = getVideoAspectRatio(channel);
  const hookType = lastBriefResult?.hook_type || '';
  // Use edited prompt from textarea if available, otherwise build fresh with top hook
  const promptTextarea = document.getElementById('cb-video-prompt-text');
  let prompt = promptTextarea?.value?.trim();
  if (!prompt) {
    const topHookText = await fetchTopHookForVideo(brandId, channel).catch(() => null);
    prompt = buildKlingPrompt(lastVisualResult.visual_prompt, channel, hookType, topHookText);
  }

  const origLabel = btn.innerHTML;
  btn.disabled = true;

  // Phase 1 — Visual style check (WF14)
  btn.innerHTML = `<i data-lucide="loader-2" style="width:12px;animation:spin 1s linear infinite"></i> Preparando…`;
  body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:32px;color:var(--text-muted);font-size:12px;">
      <i data-lucide="scan-eye" style="width:28px;color:#7C3AED;"></i>
      <div style="text-align:center;">
        <div style="font-weight:600;color:#5B21B6;margin-bottom:4px;">Verificando estilo visual del canal…</div>
        <div style="font-size:11px;color:#7C3AED;margin-top:2px;">WF14 analiza las imágenes reales del perfil para que Kling use los colores y estética correctos</div>
        <div style="margin-top:6px;font-size:10px;color:#A78BFA;">Solo corre la primera vez por canal — después usa el caché</div>
      </div>
    </div>`;
  lucide.createIcons();

  try {
    const ranWF14 = await ensureVisualStyleProfiled(brandId, channel);
    if (ranWF14) showToast('Estilo visual del canal perfilado ✓', 'success');

    // Phase 2 — Kling video generation
    btn.innerHTML = `<i data-lucide="loader-2" style="width:12px;animation:spin 1s linear infinite"></i> Generando…`;
    body.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:32px;color:var(--text-muted);font-size:12px;">
        <i data-lucide="loader-2" style="width:28px;animation:spin 1s linear infinite;color:#D97706;"></i>
        <div style="text-align:center;">
          <div style="font-weight:600;color:#92400E;margin-bottom:4px;">Generando video con Kling AI…</div>
          <div>Aspect ratio: <strong>${ar}</strong> · Duración: <strong>${duration}s</strong> · Canal: <strong>${escapeHtml(channel)}</strong></div>
          <div style="margin-top:6px;font-size:11px;color:#B45309;">⏱ Esto tarda entre 2 y 4 minutos — no cerrés la página</div>
        </div>
      </div>`;
    lucide.createIcons();

    const videoUrl = await generateVideoViaKling({ brandId, draftId, channel, videoPrompt: prompt, duration });
    if (!videoUrl) throw new Error('WF16 no devolvió una URL de video');

    body.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <video src="${escapeHtml(videoUrl)}" controls playsinline
          style="width:100%;max-width:${ar === '9:16' ? '280px' : '100%'};max-height:480px;border-radius:10px;border:1px solid #FDE68A;margin:0 auto;display:block;background:#000;">
          Tu navegador no soporta video HTML5.
        </video>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-size:11px;color:#92400E;font-weight:600;">
            <i data-lucide="video" style="width:11px;vertical-align:middle;margin-right:4px;"></i>
            Kling AI · ${ar} · ${duration}s · ${escapeHtml(channel)}
          </span>
          <a href="${escapeHtml(videoUrl)}" download="video-${channel.toLowerCase()}.mp4"
             style="padding:6px 14px;background:#D97706;color:white;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">
            <i data-lucide="download" style="width:11px;vertical-align:middle;margin-right:4px;"></i>Descargar
          </a>
        </div>
      </div>`;
    lucide.createIcons();
    if (meta) { meta.textContent = `Video generado · ${ar} · ${duration}s`; meta.style.display = ''; }
    showToast('Video generado con Kling AI ✓');
  } catch (e) {
    body.innerHTML = `<div style="color:#991B1B;font-size:12px;padding:16px;text-align:center;">❌ Error generando video: ${escapeHtml(e.message)}<br><small>Revisá que PIAPI_KEY y ANTHROPIC_API_KEY estén configuradas en n8n y que WF16 esté activo.</small></div>`;
    showToast('Error generando video: ' + e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = origLabel;
    lucide.createIcons();
  }
}

// Regenerate ONE slide with a user correction (spelling fix / what to remove or add).
// Appends the correction to that slide's original Gemini prompt and swaps the image in place.
async function regenerateSlideWithCorrection(slot, note) {
  if (!Number.isInteger(slot) || !lastRenderedSlides[slot]) {
    showToast('Elegí un slide para corregir.', 'error');
    return;
  }
  const slide = lastRenderedSlides[slot];
  if (!slide.prompt) {
    showToast('Ese slide no tiene prompt para regenerar.', 'error');
    return;
  }
  const ctx = lastImageGenCtx || {};

  const fixBtn  = document.getElementById('cb-fix-btn');
  const origBtn = fixBtn ? fixBtn.innerHTML : '';
  if (fixBtn) {
    fixBtn.disabled = true;
    fixBtn.innerHTML = '<i data-lucide="loader-2" style="width:12px;animation:spin 1s linear infinite"></i> Regenerando…';
    lucide.createIcons();
  }

  try {
    let url = null;
    if (slide.spec && slide.spec.bg_prompt) {
      // HYBRID: re-roll the Gemini background; the text stays code-rendered and
      // perfectly spelled. The note steers the background VISUAL.
      const specCopy = { ...slide.spec };
      if (note) specCopy.bg_prompt = `${specCopy.bg_prompt} . Adjustment for the background visual: ${note}. Still NO text, letters or words anywhere in the image.`;
      url = await renderDesignedSlide(specCopy, slide.index, lastRenderedSlides.length, {
        palette: ctx.palette, typography: ctx.typography, toneFlags: ctx.toneFlags,
        brandId: ctx.brandId, draftId: ctx.draftId, channel: ctx.channel,
      });
      if (url) lastRenderedSlides[slot].spec = specCopy;
    } else {
      // Legacy all-Gemini composite: regenerate from the corrected prompt.
      const correctedPrompt =
        `${slide.prompt}\n\nUSER CORRECTION (apply literally, keep the SAME visual style, palette, layout and medium): ${note}. ` +
        `Re-render this slide fixing the text exactly as specified — every rendered word spelled correctly with proper Spanish accents. ` +
        `Render ONLY the meaningful headline/body words; never render hex codes, hashtags or font names as text.`;
      url = await generateOnePhotoViaWf13({
        brandId: ctx.brandId, draftId: ctx.draftId, channel: ctx.channel,
        prompt: correctedPrompt, index: slide.index,
      });
    }
    if (!url) throw new Error('No se generó la imagen');

    lastRenderedSlides[slot].url = url;
    lastRenderedSlides[slot].error = null;

    const cell = document.querySelector(`#cb-slides-grid [data-slide-idx="${slot}"]`);
    const img = cell ? cell.querySelector('img') : null;
    if (img) {
      img.src = url;
    } else if (cell) {
      // The slot was an error cell — turn it into a real thumbnail.
      cell.outerHTML = `
        <div class="cb-slide-thumb" data-slide-idx="${slot}" style="position:relative;border-radius:8px;overflow:hidden;border:1px solid #BAE6FD;background:#F0F9FF;cursor:zoom-in;">
          <div style="position:absolute;top:6px;left:6px;background:rgba(0,0,0,0.72);color:white;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;z-index:2;">${slide.index} · 📷</div>
          <img src="${escapeHtml(url)}" alt="slide ${slide.index}" style="width:100%;display:block;aspect-ratio:1/1;object-fit:cover;background:#FAFBFC;pointer-events:none;" />
        </div>`;
      const newCell = document.querySelector(`#cb-slides-grid .cb-slide-thumb[data-slide-idx="${slot}"]`);
      if (newCell) newCell.addEventListener('click', () => {
        const urls = lastRenderedSlides.map(s => s.url).filter(Boolean);
        const before = lastRenderedSlides.slice(0, slot).filter(s => s.url).length;
        openSlideLightbox(urls, before);
      });
    }

    const noteInput = document.getElementById('cb-fix-note');
    if (noteInput) noteInput.value = '';
    showToast(`Slide ${slide.index} regenerado.`);
  } catch (e) {
    console.error('[fix-slide] error:', e);
    showToast(`No se pudo regenerar el slide: ${e.message || e}`, 'error');
  } finally {
    if (fixBtn) { fixBtn.disabled = false; fixBtn.innerHTML = origBtn; lucide.createIcons(); }
  }
}

// Trigger a browser download of a data: (or http) URL.
function downloadDataUrl(url, filename) {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) { console.error('[download] failed', e); }
}

// Download every rendered slide as a PNG so the carousel is never lost on
// regeneration. Files land in the browser's downloads folder.
async function downloadAllSlides(channel) {
  const slides = (lastRenderedSlides || []).filter(s => s.url);
  if (!slides.length) { showToast('No hay imágenes para descargar.', 'error'); return; }
  const slug = String(channel || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'post';
  const stamp = new Date().toISOString().slice(0, 10);
  for (const s of slides) {
    downloadDataUrl(s.url, `${slug}-${stamp}-slide-${s.index}.png`);
    await new Promise(r => setTimeout(r, 350));  // avoid the browser blocking the burst
  }
  showToast(`Descargando ${slides.length} imagen${slides.length === 1 ? '' : 'es'} — revisá tu carpeta de descargas.`);
}

// ── WF07 Content Builder + QA (LEGACY — reemplazado por WF12, queda por compat) ──
const WF07_URL = `https://n8n.srv949269.hstgr.cloud/webhook/wf07-content-builder${_CB_SFX}`;
// Reuses brandKitData.brandId

// Tracks the most recent draft built by WF07 so the Approve/Discard buttons
// know which entity_id to send to WF08.
let lastBuiltDraftId = null;

// brief_id of the last brief generated by WF06 — WF07 expects it to know
// which brief to expand. Cleared when channel changes (see setContentBuilderTab).
let lastGeneratedBriefId = null;

async function generateDraft() {
  try {
    const channel = contentBuilderActiveTab || document.getElementById('cb-channel')?.value || 'LinkedIn';
    const slot = getCbCampaign(channel);
    const verticals = [...(slot.verticals || [])];

    // Brand-wide verticals (productos / unidades de negocio) — single source of truth in brandKitData,
    // hydrated by WF00 scraper and editable in the Verticales del cliente card.
    const brandVerticals = (brandKitData.verticals || []).map(v => {
      ensureVerticalChannels(v);
      return { name: v.name, desc: v.desc || '', channels: v.channels, profile: v.profile || null };
    });
    const selectedVertical = cbActiveVertical
      ? brandVerticals.find(v => v.name === cbActiveVertical) || null
      : null;

    // Forward the same inspiration block to WF07 so the draft builder has hooks +
    // competitor posts directly — independent of whether WF06's brief carried them
    // (it stopped populating hook_id at some point per project memory).
    const userBriefExtra = (document.getElementById('cb-user-brief')?.value || '').trim();
    const inspiration = await buildInspirationPayload(brandKitData.brandId, channel);
    // Same saved-briefing contract as WF06 — see generateContentBrief() for details.
    const savedBrief = await loadUserBriefing(brandKitData.brandId, channel);

    const payload = {
      brand_id: brandKitData.brandId,
      brief_id: lastGeneratedBriefId,
      channel,
      verticals: verticals.length ? verticals : null,
      business_verticals: brandVerticals.length ? brandVerticals : null,
      selected_vertical: selectedVertical,
      user_brief_extra:  userBriefExtra || null,
      saved_briefing:    savedBrief && savedBrief.briefing_text ? {
        text:       savedBrief.briefing_text,
        updated_at: savedBrief.updated_at,
      } : null,
      briefing_locked:   !!(savedBrief && savedBrief.briefing_text),
      ...inspiration,
    };
    console.log('[WF07] sending payload:', payload);
    const res = await fetch(WF07_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
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

  if (!lastGeneratedBriefId) {
    showToast('Generá el brief primero (paso 1) antes de construir el draft.', 'error');
    return;
  }

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
  bodyEl.style.background = 'white';
  bodyEl.style.borderStyle = 'solid';
  bodyEl.style.borderColor = '#22C55E';
  const metaEl = document.getElementById('cb-generated-meta');
  if (metaEl) metaEl.textContent = 'Generated just now · Draft';
  markCbStep(2, 'done');
  markCbStep(3, 'active');
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
        brand_id: brandKitData.brandId,
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

async function generateVisualBrief(draftId, extra = {}) {
  try {
    // Read from the ACTIVE tab's per-channel slot (verticals + visual prompt now live inside each tab)
    const channel = contentBuilderActiveTab || document.getElementById('cb-channel')?.value || 'Instagram';
    const slot = getCbCampaign(channel);
    // Single source of truth: the user's briefing textarea drives EVERYTHING — brief (WF06),
    // draft (WF07) and visual (WF09). Falls back to per-channel stored values for backward
    // compatibility, then to the channel default placeholder.
    const userBrief    = (document.getElementById('cb-user-brief')?.value || '').trim();
    const conceptInput = userBrief
                      || (slot.visualConcept || '').trim()
                      || (slot.visualPrompt  || '').trim();
    const specs        = slot.visualSpecs || deriveVisualSpecs(channel);
    const composed     = conceptInput ? composeVisualPrompt(conceptInput, specs) : '';
    const verticals = [...(slot.verticals || [])];
    const brandVerticals = (brandKitData.verticals || []).map(v => {
      ensureVerticalChannels(v);
      return { name: v.name, desc: v.desc || '', channels: v.channels, profile: v.profile || null };
    });
    const selectedVertical = cbActiveVertical
      ? brandVerticals.find(v => v.name === cbActiveVertical) || null
      : null;

    // Carousel awareness — when the format is "Carousel slide", WF09 should generate N images
    // and use the brand's top-performing IG posts as visual references for style consistency.
    const isCarousel = (specs?.format || '') === 'Carousel slide';
    const slideCount = isCarousel ? Math.max(1, Number(slot.slideCount) || 3) : 1;

    // Reference images from SocialMediaBios: pull the URLs of the top-performing posts on this
    // channel so n8n can pass them to the image model as style references. Image URLs may live
    // under different keys depending on what Apify wrote (imageUrl / displayUrl / mediaUrl / url).
    const smbChannel  = (socialBiosData?.channels || []).find(c => c.name === channel) || null;
    const refImages   = (smbChannel?.topPosts || [])
      .map(p => p.imageUrl || p.displayUrl || p.media_url || p.mediaUrl || p.url)
      .filter(Boolean)
      .slice(0, 3);

    const payload = {
      brand_id:        brandKitData.brandId,
      draft_id:        draftId,
      visual_prompt:   composed || null,
      visual_concept:  conceptInput || null,
      visual_specs:    specs || null,
      slide_count:     slideCount,
      reference_images: refImages.length ? refImages : null,
      channel:         channel || null,
      verticals:       verticals.length ? verticals : null,
      business_verticals: brandVerticals.length ? brandVerticals : null,
      selected_vertical:  selectedVertical,
      ...extra,
    };
    console.log('[WF09] sending payload:', payload);

    const res = await fetch(WF09_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[WF09] Error:', err);
    return null;
  }
}

// Legacy WF09 carousel renderer — its button `btn-generate-visual` was removed
// when the 3-agent pipeline replaced the monolithic unified flow. Kept here as
// dead-code fallback until we delete the surrounding helpers it references.
// Renamed to stop colliding (function hoisting) with the new Agent-3 handler.
async function handleGenerateVisualLegacyWF09() {
  const btn = document.getElementById('btn-generate-visual');
  if (!btn) return;
  if (!lastBuiltDraftId) {
    showToast('Build (and ideally approve) a draft first.', 'error');
    return;
  }

  const channel = contentBuilderActiveTab || 'Instagram';
  const slot    = getCbCampaign(channel);
  const specs   = slot.visualSpecs || deriveVisualSpecs(channel);
  const isCarousel = (specs?.format || '') === 'Carousel slide';
  const totalSlides = isCarousel ? Math.max(1, Number(slot.slideCount) || 3) : 1;

  btn.disabled = true;
  const original = btn.innerHTML;
  lucide.createIcons();

  // Carousel architecture: SWL's IG carousels are 60%+ designed-text slides, not photos.
  //   - Slide 1: AI photo (hero) via WF09 → Gemini.
  //   - Slides 2..N: template-rendered designed slides (tag + headline + cards/stats/CTA)
  //     using WF09C for content + client-side html2canvas for typography-perfect rendering.
  const slides = [];

  // Pre-fetch slide content specs for slides 2..N from WF09C (one call, returns full array).
  let slideSpecs = [];
  if (isCarousel && totalSlides > 1) {
    btn.innerHTML = `<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Breaking down draft…`;
    lucide.createIcons();
    slideSpecs = await fetchCarouselSlideSpecs(totalSlides);
    console.log('[WF09C] slide specs:', slideSpecs);
  }

  for (let i = 1; i <= totalSlides; i++) {
    btn.innerHTML = totalSlides > 1
      ? `<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Slide ${i}/${totalSlides}…`
      : `<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite"></i> Generating image…`;
    lucide.createIcons();

    if (i === 1 || !isCarousel) {
      // Hero photo via Gemini.
      let result = await generateVisualBrief(lastBuiltDraftId, {
        slide_index: i,
        slide_total: totalSlides,
      });
      if (Array.isArray(result)) result = result[0];
      if (result && result.json) result = result.json;
      console.log(`[WF09] slide ${i}/${totalSlides} response:`, result);

      if (result && result.ok && (result.asset_id || result.image_url)) {
        let asset = result.asset;
        if (typeof asset === 'string') { try { asset = JSON.parse(asset); } catch { asset = null; } }
        slides.push({
          index: i,
          kind: 'photo',
          asset_id: result.asset_id || null,
          image_url: result.image_url || null,
          asset,
        });
      } else {
        console.warn(`[WF09] slide ${i} failed:`, result);
      }
    } else {
      // Template-rendered designed slide (text-heavy).
      const spec = slideSpecs.find(s => Number(s.slide_index) === i)
                || slideSpecs[i - 2]   // positional fallback
                || null;
      if (!spec) {
        console.warn(`[WF09C] no spec for slide ${i}; skipping`);
        continue;
      }
      const dataUrl = await renderSwlTextSlide(spec, i, totalSlides);
      if (dataUrl) {
        slides.push({
          index: i,
          kind: 'template',
          asset_id: null,
          image_url: dataUrl,
          spec,
        });
      }
    }
  }

  if (slides.length === 0) {
    btn.innerHTML = '<i data-lucide="alert-circle" style="width:12px"></i> Error';
    btn.style.background = '#EF4444';
    btn.style.color = 'white';
    showToast('No slide could be generated. See console.', 'error');
  } else {
    btn.innerHTML = totalSlides > 1
      ? `<i data-lucide="check" style="width:12px"></i> ${slides.length}/${totalSlides} slides ready`
      : `<i data-lucide="check" style="width:12px"></i> Image ready`;
    btn.style.background = '#10B981';
    btn.style.color = 'white';
    if (slides.length === 1) {
      // Backward compatible: single image goes through the existing renderer.
      renderVisualBriefIntoView(slides[0].asset, slides[0].image_url);
    } else {
      renderCarouselIntoView(slides);
    }
    cbCommitActiveCell();
    showToast(`Generated ${slides.length}/${totalSlides} slide(s).`);
    setTimeout(() => hydrateCreativeBrainView(), 500);
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
  const body = document.getElementById('visual-brief-body');
  if (!body) return;
  markCbStep(3, 'done');

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

// ── Carousel viewer ──────────────────────────────────────────────────────────
// Renders N generated slides as a main image + thumbnail strip + prev/next
// navigation. Used when format === Carousel slide and we generated multiple.
let _cbCarouselState = { slides: [], active: 0 };

function renderCarouselIntoView(slides) {
  const body = document.getElementById('visual-brief-body');
  if (!body) return;
  markCbStep(3, 'done');
  _cbCarouselState = { slides: slides || [], active: 0 };

  body.innerHTML = `
    <div style="margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
      <div>
        <strong style="font-size:14px;color:#0369A1;">Carousel · ${slides.length} slide${slides.length === 1 ? '' : 's'}</strong>
        <span style="font-size:11.5px;color:var(--text-muted);margin-left:8px;">Cohesive style aplicado a todas las slides</span>
      </div>
      <span id="cb-carousel-counter" style="font-size:11.5px;color:var(--text-muted);font-weight:600;">1 / ${slides.length}</span>
    </div>

    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
      <button onclick="cbCarouselNav(-1)" style="background:white;border:1px solid var(--border);border-radius:50%;width:32px;height:32px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
        <i data-lucide="chevron-left" style="width:16px;"></i>
      </button>
      <div style="flex:1;border-radius:10px;overflow:hidden;border:1px solid #BAE6FD;background:#F0F9FF;">
        <img id="cb-carousel-main" src="${slides[0]?.image_url || ''}" alt="Slide 1"
          style="width:100%;display:block;max-height:480px;object-fit:cover;"
          onerror="this.parentElement.innerHTML='<div style=padding:20px;text-align:center;color:#64748B;font-size:13px>Image URL expired — regenerate to get a new one.</div>'">
      </div>
      <button onclick="cbCarouselNav(1)" style="background:white;border:1px solid var(--border);border-radius:50%;width:32px;height:32px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
        <i data-lucide="chevron-right" style="width:16px;"></i>
      </button>
    </div>

    <div id="cb-carousel-thumbs" style="display:flex;gap:6px;overflow-x:auto;padding:4px 0 10px 0;">
      ${slides.map((s, i) => `
        <button onclick="cbCarouselGo(${i})" data-slide-idx="${i}"
          style="flex:0 0 84px;height:84px;border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid ${i === 0 ? '#0369A1' : 'transparent'};padding:0;background:none;position:relative;">
          <img src="${s.image_url || ''}" alt="Slide ${i + 1}" style="width:100%;height:100%;object-fit:cover;display:block;">
          <span style="position:absolute;bottom:2px;right:4px;background:rgba(0,0,0,0.65);color:white;font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;">${i + 1}</span>
        </button>
      `).join('')}
    </div>

    <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">
      <i data-lucide="info" style="width:11px;vertical-align:middle;margin-right:3px"></i>
      Cada slide se generó con un brief específico (slide ${slides.length > 1 ? '1 = hook, intermedias = desarrollo, última = CTA' : 'única'}) compartiendo paleta y estilo del IG de la marca.
    </div>
  `;
  lucide.createIcons();
}

function cbCarouselGo(idx) {
  const { slides } = _cbCarouselState;
  if (!slides.length) return;
  const i = Math.max(0, Math.min(slides.length - 1, idx));
  _cbCarouselState.active = i;
  const main = document.getElementById('cb-carousel-main');
  if (main) {
    main.src = slides[i]?.image_url || '';
    main.alt = `Slide ${i + 1}`;
  }
  const counter = document.getElementById('cb-carousel-counter');
  if (counter) counter.textContent = `${i + 1} / ${slides.length}`;
  // Update thumbnail highlight.
  document.querySelectorAll('#cb-carousel-thumbs button[data-slide-idx]').forEach(btn => {
    btn.style.borderColor = Number(btn.dataset.slideIdx) === i ? '#0369A1' : 'transparent';
  });
}

function cbCarouselNav(delta) {
  const { slides, active } = _cbCarouselState;
  if (!slides.length) return;
  const next = (active + delta + slides.length) % slides.length;
  cbCarouselGo(next);
}

// ── WF09C — Carousel slide specs (breaks the draft into N-1 text slides) ───
const WF09C_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf09c-carousel-slides';

async function fetchCarouselSlideSpecs(slideCount) {
  // Gather what WF09C needs to write coherent slides. Best-effort: missing fields
  // fall back to brandKit / draft text.
  const draftEl = document.getElementById('cb-post-body');
  const draftText = (draftEl?.textContent || '').trim();
  const channel  = contentBuilderActiveTab || 'Instagram';
  const slot     = getCbCampaign(channel);
  const vertical = cbActiveVertical
    ? (brandKitData.verticals || []).find(v => v.name === cbActiveVertical) || null
    : null;
  const smbChannel = (socialBiosData?.channels || []).find(c => c.name === channel) || null;

  try {
    const res = await fetch(WF09C_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slide_count:    slideCount,
        brand_name:     brandKitData.name || '',
        brand_tagline:  brandKitData.tagline || '',
        brand_handle:   smbChannel?.handle || '',
        vertical_name:  vertical?.name || '',
        vertical_desc:  vertical?.desc || '',
        vertical_profile: vertical?.profile || null,
        channel,
        draft_text:     draftText,
        agent_prompt:   slot.agentPrompt || '',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let body = await res.json();
    if (Array.isArray(body)) body = body[0];
    if (body?.json) body = body.json;
    return Array.isArray(body?.slides) ? body.slides : [];
  } catch (e) {
    console.error('[WF09C] failed:', e);
    return [];
  }
}

// ── Carousel text-slide template renderer ──────────────────────────────────
// Image-gen models (Gemini, DALL-E, SDXL) cannot render readable typography —
// they hallucinate letters and produce gibberish for anything beyond ~3 words.
// So we build text-heavy slides client-side as HTML and rasterize them with
// html2canvas at 1080×1080, using the BRAND's real palette + typography from
// brand_profiles.data_json. Result: pixel-perfect text in the brand's fonts.

const SWL_PALETTE = {
  bg:        '#0A0A0A',
  bgCard:    '#161616',
  cardBorder:'#D4A857',
  text:      '#FFFFFF',
  textMuted: '#B8B8B8',
  accent:    '#D4A857',
  accentBg:  '#3A2E12',
  tagBg:     '#D4A857',
  tagText:   '#1A1A1A',
};

// Derive a slide-renderer palette from brand_profiles.data_json.palette
// (the source of truth for any brand). Each entry has shape { hex, role }.
// Recognized roles (best-effort): primary, secondary, accent, background, text.
// Returns a palette compatible with the renderSwlTextSlide template — when the
// brand has no palette defined, falls back to SWL_PALETTE so the demo still works.
function buildPaletteFromBrand(brandPalette) {
  if (!Array.isArray(brandPalette) || !brandPalette.length) return { ...SWL_PALETTE };
  const byRole = {};
  brandPalette.forEach(p => {
    if (p && p.hex) byRole[(p.role || '').toLowerCase()] = p.hex;
  });
  // Pick by role with fallbacks to positional index.
  const accent = byRole.accent || byRole.primary || byRole.secondary || brandPalette[0]?.hex || SWL_PALETTE.accent;
  const bg     = byRole.background || byRole.dark || byRole.secondary || (brandPalette.find(p => /background|dark|black/i.test(p.role || ''))?.hex) || SWL_PALETTE.bg;
  const text   = byRole.text || byRole.light || byRole.white || (brandPalette.find(p => /text|light|white/i.test(p.role || ''))?.hex) || SWL_PALETTE.text;
  // Heuristic: if accent is light and bg is also light, swap text to dark for contrast.
  const isLight = (hex) => {
    const m = String(hex || '').replace('#','').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return false;
    const [r,g,b] = [m[1],m[2],m[3]].map(h => parseInt(h, 16));
    return (0.299*r + 0.587*g + 0.114*b) > 160;
  };
  const finalText = isLight(bg) ? '#1A1A1A' : (text || '#FFFFFF');
  const finalTextMuted = isLight(bg) ? '#4B5563' : '#B8B8B8';
  // Compute an "accent on background" tint by mixing accent at ~22% with bg.
  const mix22 = (() => {
    const m1 = String(accent).replace('#','').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    const m2 = String(bg).replace('#','').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m1 || !m2) return SWL_PALETTE.accentBg;
    const mk = (h1, h2) => Math.round(parseInt(h1,16)*0.22 + parseInt(h2,16)*0.78).toString(16).padStart(2,'0');
    return `#${mk(m1[1],m2[1])}${mk(m1[2],m2[2])}${mk(m1[3],m2[3])}`;
  })();
  return {
    bg, bgCard: bg, cardBorder: accent,
    text: finalText, textMuted: finalTextMuted,
    accent, accentBg: mix22,
    tagBg: accent, tagText: isLight(accent) ? '#1A1A1A' : '#FFFFFF',
  };
}

// Build CSS font-family stack from brand typography (with safe fallbacks).
function buildFontStackFromBrand(brandTypography, role = 'heading') {
  const safe = "'Inter','Helvetica Neue',-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif";
  const fam = brandTypography && brandTypography[role];
  if (!fam) return safe;
  return `'${fam}', ${safe}`;
}

// Render a headline where SOME words are highlighted in the brand accent color.
// `accentWords` is an array of words/phrases the visual agent picked for emphasis
// (e.g. ["signs","Business","Ready","AI"] → "<span>4 </span><accent>signs</accent>...").
// Matching is case-insensitive and whole-token only — won't accidentally tint
// substrings inside longer words.
// Pick the most CHROMATIC palette color for accent text/tags. Brand palettes
// often mislabel roles (e.g. SWL tags its gold as "Text/Dark" and white as
// "Accent"), so role-based picking gives an invisible white accent. Choosing
// the highest-chroma hex reliably lands on the real brand color (the gold).
function pickAccentColor(brandPalette, fallback) {
  if (!Array.isArray(brandPalette)) return fallback;
  let best = null, bestChroma = -1;
  for (const p of brandPalette) {
    const m = String((p && p.hex) || '').replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) continue;
    const [r, g, b] = [m[1], m[2], m[3]].map(h => parseInt(h, 16));
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    if (chroma > bestChroma) { bestChroma = chroma; best = p.hex; }
  }
  return (best && bestChroma > 28) ? best : fallback;
}

function renderTwoColorHeadline(headline, accentWords, accentColor) {
  const text = String(headline || '');
  if (!text) return '';
  if (!Array.isArray(accentWords) || !accentWords.length) return escapeHtml(text);

  // Normalize accent terms — lowercased + trimmed; strip punctuation for matching.
  const accentSet = new Set(
    accentWords
      .map(w => String(w || '').trim().toLowerCase().replace(/^[¿¡"'(\[]+|[.,;:!?")\]]+$/g, ''))
      .filter(Boolean)
  );

  // Split keeping whitespace so we can rebuild the headline as-is.
  const tokens = text.split(/(\s+)/);
  return tokens.map(tok => {
    if (!tok.trim()) return tok; // preserve spaces
    const norm = tok.toLowerCase().replace(/^[¿¡"'(\[]+|[.,;:!?")\]]+$/g, '');
    if (accentSet.has(norm)) {
      return `<span style="color:${accentColor};">${escapeHtml(tok)}</span>`;
    }
    return escapeHtml(tok);
  }).join('');
}

// ── Doodle library — vectorial decorations tinted with brand accent ────────
// Two sets:
//   SKETCHY    — organic / hand-drawn / slight wobble  → for playful, casual brands
//   GEOMETRIC  — clean / precise / symmetric           → for formal, corporate brands
// Each entry is a function(color, sizePx) → SVG markup string. The visual
// agent emits decorations[{ type, position, size }] per designed slide; the
// renderer picks SKETCHY or GEOMETRIC based on the brand tone flags.
const DOODLES_SKETCHY = {
  arrow_curve: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round">
      <path d="M 10 20 Q 30 60 50 50 Q 70 40 80 70" />
      <path d="M 70 60 L 80 72 L 88 60" />
    </svg>`,
  asterisk: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round">
      <path d="M 50 15 L 49 50" /><path d="M 50 85 L 51 50" />
      <path d="M 18 32 L 50 50" /><path d="M 82 68 L 50 50" />
      <path d="M 18 68 L 50 50" /><path d="M 82 32 L 50 50" />
    </svg>`,
  squiggle: (c, s) => `
    <svg viewBox="0 0 200 40" width="${s}" height="${s * 0.2}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round">
      <path d="M 5 20 Q 25 5 45 22 Q 65 38 85 18 Q 105 2 125 22 Q 145 38 165 18 Q 185 5 195 22" />
    </svg>`,
  circle: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round">
      <path d="M 50 15 Q 90 14 88 52 Q 86 88 48 88 Q 12 86 12 50 Q 13 16 50 15 Z" />
    </svg>`,
  underline_wavy: (c, s) => `
    <svg viewBox="0 0 300 30" width="${s}" height="${s * 0.1}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round">
      <path d="M 5 15 Q 30 3 55 15 Q 80 27 105 15 Q 130 3 155 15 Q 180 27 205 15 Q 230 3 255 15 Q 280 27 295 15" />
    </svg>`,
  scribble: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round">
      <path d="M 20 30 Q 35 20 50 30 Q 65 40 80 30 M 20 45 Q 35 55 50 45 Q 65 35 80 45 M 20 60 Q 35 70 50 60 Q 65 50 80 60 M 20 75 Q 35 65 50 75 Q 65 85 80 75" />
    </svg>`,
  star: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round">
      <path d="M 50 12 L 60 38 L 88 42 L 67 60 L 74 88 L 50 73 L 26 88 L 33 60 L 12 42 L 40 38 Z" />
    </svg>`,
  dots_scatter: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="${c}" stroke="none">
      <circle cx="20" cy="28" r="3"/><circle cx="42" cy="18" r="2.5"/><circle cx="68" cy="32" r="4"/>
      <circle cx="84" cy="22" r="2.5"/><circle cx="18" cy="58" r="2.5"/><circle cx="38" cy="68" r="3.5"/>
      <circle cx="62" cy="52" r="2.5"/><circle cx="82" cy="68" r="3"/><circle cx="50" cy="82" r="2.5"/>
    </svg>`,
  exclaim_circle: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round">
      <path d="M 50 12 Q 88 14 88 50 Q 88 87 50 88 Q 12 87 12 50 Q 12 13 50 12 Z" />
      <path d="M 50 28 L 50 58" /><circle cx="50" cy="72" r="3" fill="${c}"/>
    </svg>`,
  brackets: (c, s) => `
    <svg viewBox="0 0 120 80" width="${s}" height="${s * 0.66}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round">
      <path d="M 25 12 Q 12 12 12 25 L 12 55 Q 12 68 25 68" />
      <path d="M 95 12 Q 108 12 108 25 L 108 55 Q 108 68 95 68" />
    </svg>`,
};

const DOODLES_GEOMETRIC = {
  arrow_curve: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter">
      <path d="M 15 75 L 75 25" />
      <path d="M 55 25 L 75 25 L 75 45" />
    </svg>`,
  asterisk: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="4">
      <path d="M 50 15 L 50 85" /><path d="M 15 50 L 85 50" />
      <path d="M 25 25 L 75 75" /><path d="M 75 25 L 25 75" />
    </svg>`,
  squiggle: (c, s) => `
    <svg viewBox="0 0 200 40" width="${s}" height="${s * 0.2}" fill="none" stroke="${c}" stroke-width="3">
      <path d="M 5 20 L 30 20 L 50 8 L 70 32 L 90 8 L 110 32 L 130 8 L 150 32 L 170 8 L 195 20" />
    </svg>`,
  circle: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="3">
      <circle cx="50" cy="50" r="38" />
    </svg>`,
  underline_wavy: (c, s) => `
    <svg viewBox="0 0 300 20" width="${s}" height="${s * 0.067}" fill="${c}" stroke="none">
      <rect x="5" y="8" width="290" height="4" rx="2" />
    </svg>`,
  scribble: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="3">
      <rect x="18" y="18" width="64" height="64" rx="6" />
      <path d="M 18 50 L 82 50" /><path d="M 50 18 L 50 82" />
    </svg>`,
  star: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="${c}" stroke="none">
      <path d="M 50 10 L 58 42 L 90 50 L 58 58 L 50 90 L 42 58 L 10 50 L 42 42 Z" />
    </svg>`,
  dots_scatter: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="${c}" stroke="none">
      <circle cx="25" cy="25" r="3"/><circle cx="50" cy="25" r="3"/><circle cx="75" cy="25" r="3"/>
      <circle cx="25" cy="50" r="3"/><circle cx="50" cy="50" r="3"/><circle cx="75" cy="50" r="3"/>
      <circle cx="25" cy="75" r="3"/><circle cx="50" cy="75" r="3"/><circle cx="75" cy="75" r="3"/>
    </svg>`,
  exclaim_circle: (c, s) => `
    <svg viewBox="0 0 100 100" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="3">
      <circle cx="50" cy="50" r="38" />
      <path d="M 50 28 L 50 58" stroke-linecap="square"/><circle cx="50" cy="72" r="3" fill="${c}"/>
    </svg>`,
  brackets: (c, s) => `
    <svg viewBox="0 0 120 80" width="${s}" height="${s * 0.66}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="square">
      <path d="M 25 12 L 12 12 L 12 68 L 25 68" />
      <path d="M 95 12 L 108 12 L 108 68 L 95 68" />
    </svg>`,
};

// Size keyword → pixels. Tuned for 1080×1080 slides — a "medium" doodle is
// ~15% of the slide width so it reads at thumbnail size too.
const DOODLE_SIZES = { small: 90, medium: 160, large: 240, xl: 340 };
// Position keyword → absolute style anchor (within slide root = 1080×1080).
const DOODLE_POSITIONS = {
  'top-left':     'top:90px;    left:70px;',
  'top-right':    'top:90px;    right:70px;',
  'bottom-left':  'bottom:90px; left:70px;',
  'bottom-right': 'bottom:90px; right:70px;',
  'mid-left':     'top:50%;     left:50px;  transform:translateY(-50%);',
  'mid-right':    'top:50%;     right:50px; transform:translateY(-50%);',
  'center':       'top:50%;     left:50%;   transform:translate(-50%,-50%);',
};

// Pick which set to use based on tone flags. Sketchy if any "playful" or "casual"
// or "expansive" flag is present; geometric for "formal" / "serious" / "technical".
function pickDoodleSet(toneFlags) {
  if (!Array.isArray(toneFlags) || !toneFlags.length) return DOODLES_GEOMETRIC;
  const txt = toneFlags.join(' ').toLowerCase();
  const sketchyHits  = (txt.match(/\b(playful|casual|expansive|bold)\b/g) || []).length;
  const geometricHits = (txt.match(/\b(formal|serious|technical|humble|short)\b/g) || []).length;
  return sketchyHits > geometricHits ? DOODLES_SKETCHY : DOODLES_GEOMETRIC;
}

// Build a Lucide-icon doodle. The visual agent picks an icon NAME (e.g. "cpu",
// "brain", "zap", "code", "git-branch") matching the slide message + brand industry.
// We use Lucide's own createIcons() pipeline to render the SVG — that way we're
// resilient to internal icon-shape changes between Lucide versions (UMD bundle
// from unpkg@latest can swap between tuple-arrays, objects, factory functions).
function buildLucideIconSvg(iconName, color, sizePx) {
  if (typeof lucide === 'undefined') return '';

  // Off-screen container so the temporary <i> doesn't visually flash.
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden;width:0;height:0;overflow:hidden;';
  const i = document.createElement('i');
  // Lucide accepts both kebab-case and snake-case via the data-lucide attribute.
  i.setAttribute('data-lucide', String(iconName || '').toLowerCase().replace(/[_\s]+/g, '-'));
  host.appendChild(i);
  document.body.appendChild(host);

  try {
    if (typeof lucide.createIcons === 'function') {
      // Scoping the run to `host` would be ideal but the public API scans the
      // whole document. Cost is small — it's a single DOM pass.
      lucide.createIcons();
    }
    const svg = host.querySelector('svg');
    if (!svg) {
      console.warn(`[buildLucideIconSvg] Lucide did not render icon "${iconName}"`);
      return '';
    }
    svg.setAttribute('width', String(sizePx));
    svg.setAttribute('height', String(sizePx));
    svg.setAttribute('stroke', color);
    svg.removeAttribute('class');
    return svg.outerHTML;
  } catch (e) {
    console.warn('[buildLucideIconSvg] error:', e);
    return '';
  } finally {
    host.remove();
  }
}

// ── Stock photo fetcher (Unsplash) ─────────────────────────────────────────
// The Visual agent can emit photo_overlay slides with a `background_query`.
// We fetch a matching photo from Unsplash and use it as the slide background.
// Access key is asked once and cached in localStorage — same pattern as a
// "configure once, works forever" Canva-style integration.
const UNSPLASH_API = 'https://api.unsplash.com';
const UNSPLASH_KEY_STORAGE = 'cb_unsplash_access_key';

function getUnsplashKey() {
  return localStorage.getItem(UNSPLASH_KEY_STORAGE) || '';
}
function setUnsplashKey(key) {
  if (key && typeof key === 'string') localStorage.setItem(UNSPLASH_KEY_STORAGE, key.trim());
}
async function promptForUnsplashKey() {
  const existing = getUnsplashKey();
  if (existing) return existing;
  const key = window.prompt(
    'Unsplash Access Key\n\nPegá tu Access Key (crear en unsplash.com/developers — gratis, 5 min).\nSe guarda en este browser, no se sube a ningún lado.'
  );
  if (!key) return '';
  setUnsplashKey(key);
  return key.trim();
}

// In-memory cache so we don't re-fetch the same query within a session.
const _stockPhotoCache = new Map();

async function fetchStockPhoto(query) {
  if (!query || typeof query !== 'string') return null;
  const cleanQuery = query.trim().slice(0, 200);
  if (_stockPhotoCache.has(cleanQuery)) return _stockPhotoCache.get(cleanQuery);

  const key = await promptForUnsplashKey();
  if (!key) {
    console.warn('[unsplash] no access key — skipping background photo');
    return null;
  }

  try {
    const url = `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=10&orientation=squarish&content_filter=high`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Client-ID ${key}`, 'Accept-Version': 'v1' },
    });
    if (!res.ok) {
      console.warn(`[unsplash] HTTP ${res.status} — query="${cleanQuery}"`);
      if (res.status === 401) {
        // Clear the bad key so the user gets re-prompted.
        localStorage.removeItem(UNSPLASH_KEY_STORAGE);
      }
      return null;
    }
    const body = await res.json();
    if (!Array.isArray(body.results) || !body.results.length) {
      console.warn(`[unsplash] no results for query="${cleanQuery}"`);
      _stockPhotoCache.set(cleanQuery, null);
      return null;
    }
    // Pick the top result. Use the `regular` size (~1080px wide) — perfect for our 1080×1080 slides.
    const photo = body.results[0];
    const out = {
      url:        photo.urls.regular || photo.urls.full,
      thumb:      photo.urls.small,
      photographer: photo.user?.name || null,
      photographer_url: photo.user?.links?.html || null,
      unsplash_url: photo.links?.html || null,
    };
    _stockPhotoCache.set(cleanQuery, out);
    return out;
  } catch (e) {
    console.error('[unsplash] fetch error:', e);
    return null;
  }
}

// Load an image into a data URL so html2canvas can rasterize it without CORS issues.
async function loadImageAsDataUrl(url) {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn('[loadImageAsDataUrl] fetch failed, falling back to direct URL:', e);
    return url;
  }
}

// Render absolutely-positioned decoration overlays for one slide. Returns HTML.
// Supports two doodle "types" of inputs:
//   • Built-in geometric/sketchy names — arrow_curve, asterisk, squiggle, etc.
//   • `lucide_icon` + d.icon (any Lucide icon name) → renders the Lucide SVG.
function renderDecorations(decorations, accentColor, toneFlags) {
  if (!Array.isArray(decorations) || !decorations.length) return '';
  const set = pickDoodleSet(toneFlags);
  return decorations.map(d => {
    const sizePx = DOODLE_SIZES[d.size || 'medium'] || DOODLE_SIZES.medium;
    const posCSS = DOODLE_POSITIONS[d.position || 'bottom-right'] || DOODLE_POSITIONS['bottom-right'];
    const rotate = typeof d.rotate === 'number' ? d.rotate : 0;
    const baseTransform = posCSS.match(/transform:([^;]+);/)?.[1] || '';
    const finalTransform = rotate ? `${baseTransform} rotate(${rotate}deg)` : baseTransform;
    const cssWithoutTransform = posCSS.replace(/transform:[^;]+;/, '');

    let svg = '';
    if (d.type === 'lucide_icon' && d.icon) {
      svg = buildLucideIconSvg(d.icon, accentColor, sizePx);
    }
    if (!svg) {
      // Fallback to built-in geometric / sketchy library.
      const builder = set[d.type] || set.asterisk;
      svg = builder(accentColor, sizePx);
    }
    return `<div style="position:absolute; ${cssWithoutTransform}${finalTransform ? `transform:${finalTransform};` : ''} opacity:${d.opacity || 0.85}; pointer-events:none; z-index:0;">${svg}</div>`;
  }).join('');
}

// `spec` shape: { tag, headline, sub, items, variant: 'cards'|'stats'|'cta'|'headline_only', highlight, cta_tag, cta_text, brand_handle }
// `opts` shape: { palette?: brand_profiles.data_json.palette[], typography?: { heading, body, mono } }
async function renderDesignedSlide(spec, slideIndex, slideTotal, opts = {}) {
  if (typeof html2canvas === 'undefined') {
    console.warn('[renderDesignedSlide] html2canvas not loaded');
    return null;
  }
  const P = buildPaletteFromBrand(opts.palette);
  const headingFont = buildFontStackFromBrand(opts.typography, 'heading');
  const bodyFont    = buildFontStackFromBrand(opts.typography, 'body');
  const variant = spec.variant || 'cards';
  const items = Array.isArray(spec.items) ? spec.items : [];

  // photo_overlay variant — Canva-style: real stock photo background with a
  // semi-transparent overlay and text on top. The visual agent picks this for
  // hero / closing / context-setting slides where a photo adds value.
  let bgImageDataUrl = null;
  // HYBRID (primary path for WF12 visual slides): Gemini generates a TEXT-FREE
  // brand background and code overlays the text → perfect spelling, always.
  if (spec.bg_prompt && opts.brandId) {
    try {
      const bgUrl = await generateOnePhotoViaWf13({
        brandId: opts.brandId, draftId: opts.draftId, channel: opts.channel,
        prompt: spec.bg_prompt, index: slideIndex,
      });
      if (bgUrl) bgImageDataUrl = bgUrl;  // WF13 already returns a data: URL
    } catch (e) { console.warn('[hybrid bg] Gemini failed, falling back to flat bg', e); }
  }
  // LEGACY: Unsplash stock photo for the old photo_overlay variant.
  if (!bgImageDataUrl && variant === 'photo_overlay' && spec.background_query) {
    const photo = await fetchStockPhoto(spec.background_query);
    if (photo?.url) bgImageDataUrl = await loadImageAsDataUrl(photo.url);
  }

  let itemsHtml = '';
  if (variant === 'stats') {
    itemsHtml = items.map(it => `
      <div style="text-align:center;padding:18px 12px;">
        <div style="font-size:88px;font-weight:800;color:${P.accent};line-height:1;margin-bottom:8px;font-family:${headingFont};">${escapeHtml(it.value || '—')}</div>
        <div style="font-size:22px;font-weight:700;color:${P.text};margin-bottom:6px;font-family:${headingFont};">${escapeHtml(it.label || it.title || '')}</div>
        <div style="font-size:15px;color:${P.textMuted};line-height:1.4;max-width:480px;margin:0 auto;font-family:${bodyFont};">${escapeHtml(it.desc || '')}</div>
      </div>
    `).join('');
  } else if (variant === 'cta') {
    // Auto-size card: padding sized to content, no forced height. Card is wrapped
    // in a container that pushes it to the bottom-third so the headline above
    // has breathing room without leaving a giant empty box.
    itemsHtml = `
      <div style="display:flex; flex-direction:column; justify-content:flex-end; flex:1; margin-top:32px;">
        <div style="padding:28px 32px; background:${P.accentBg}; border:2px solid ${P.accent}; border-radius:14px; display:inline-block;">
          ${spec.cta_tag ? `<div style="font-size:18px;color:${P.accent};font-weight:700;letter-spacing:0.5px;margin-bottom:8px;text-transform:uppercase;font-family:${headingFont};">${escapeHtml(spec.cta_tag)}</div>` : ''}
          <div style="font-size:32px;font-weight:800;color:${P.text};line-height:1.2;font-family:${headingFont};">${escapeHtml(spec.cta_text || spec.headline || '')}</div>
        </div>
      </div>
    `;
  } else if (variant === 'headline_only') {
    itemsHtml = '';  // headline alone — sub already rendered below the headline
  } else {
    // cards (default)
    itemsHtml = items.map(it => `
      <div style="padding:20px 22px;background:transparent;border:2px solid ${P.cardBorder};border-radius:12px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          ${it.emoji ? `<span style="font-size:24px;">${escapeHtml(it.emoji)}</span>` : ''}
          <span style="font-size:22px;font-weight:700;color:${P.text};font-family:${headingFont};">${escapeHtml(it.title || '')}</span>
        </div>
        <div style="font-size:15px;color:${P.textMuted};line-height:1.45;font-family:${bodyFont};">${escapeHtml(it.desc || '')}</div>
      </div>
    `).join('');
  }

  const highlightHtml = spec.highlight ? `
    <div style="margin-top:28px;padding:18px 22px;background:${P.accentBg};border-left:4px solid ${P.accent};border-radius:8px;">
      <span style="color:${P.accent};font-weight:600;font-size:15px;line-height:1.5;font-family:${bodyFont};">${escapeHtml(spec.highlight)}</span>
    </div>` : '';

  // Decorations — vectorial doodles tinted with brand accent, absolutely
  // positioned over the slide. The visual agent picks type/position/size based
  // on slide variant + brand tone (see WF12 visual mode prompt).
  const toneFlags = (opts.toneFlags || opts.brandDefaults?.tone_flags || []);
  const decorationsHtml = renderDecorations(spec.decorations || [], P.accent, toneFlags);

  const root = document.createElement('div');

  // HYBRID — full-bleed Gemini visual + gradient scrim + code-rendered text
  // (perfect spelling, real brand fonts). Primary path for WF12 visual slides.
  if (spec.bg_prompt && bgImageDataUrl) {
    // Accent = the brand's most chromatic color (gold for SWL), not the
    // (often mislabeled) "accent" role which can be white/invisible.
    const accentText = pickAccentColor(opts.palette, P.accent);
    const hItems = (() => {
      if (variant === 'stats' && items.length) {
        return `<div style="display:flex;gap:34px;flex-wrap:wrap;margin-top:8px;">` + items.slice(0, 3).map(it => `
          <div style="min-width:150px;">
            <div style="font-size:80px;font-weight:800;color:${accentText};line-height:1;font-family:${headingFont};">${escapeHtml(it.value || '')}</div>
            <div style="font-size:20px;font-weight:700;color:#fff;margin-top:4px;font-family:${headingFont};">${escapeHtml(it.label || it.title || '')}</div>
            ${it.desc ? `<div style="font-size:14px;color:rgba(255,255,255,0.78);margin-top:2px;font-family:${bodyFont};">${escapeHtml(it.desc)}</div>` : ''}
          </div>`).join('') + `</div>`;
      }
      if (variant === 'cards' && items.length) {
        return `<div style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">` + items.slice(0, 4).map(it => `
          <div style="padding:16px 20px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-left:3px solid ${accentText};border-radius:12px;">
            <div style="font-size:22px;font-weight:700;color:#fff;font-family:${headingFont};">${escapeHtml(it.title || '')}</div>
            ${it.desc ? `<div style="font-size:15px;color:rgba(255,255,255,0.8);margin-top:3px;font-family:${bodyFont};">${escapeHtml(it.desc)}</div>` : ''}
          </div>`).join('') + `</div>`;
      }
      return '';
    })();
    const hCta = spec.cta_text ? `
      <div style="margin-top:8px;padding:20px 26px;background:${accentText};border-radius:14px;align-self:flex-start;">
        ${spec.cta_tag ? `<div style="font-size:15px;color:#1A1A1A;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;font-family:${headingFont};margin-bottom:4px;">${escapeHtml(spec.cta_tag)}</div>` : ''}
        <div style="font-size:30px;font-weight:800;color:#1A1A1A;line-height:1.15;font-family:${headingFont};">${escapeHtml(spec.cta_text)}</div>
      </div>` : '';
    // Full-bleed Gemini visual; a strong bottom band guarantees the code text is
    // always crisp (no "baches"), while the top of the frame shows the visual.
    root.style.cssText = `position:fixed;left:-9999px;top:0;width:1080px;height:1080px;background:#0c0c0d url('${bgImageDataUrl}') center/cover no-repeat;font-family:${bodyFont};overflow:hidden;`;
    root.innerHTML = `
      <div style="position:absolute;top:0;left:0;right:0;height:200px;background:linear-gradient(to bottom, rgba(6,6,8,0.55), rgba(6,6,8,0));z-index:1;"></div>
      <div style="position:absolute;top:52px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center;z-index:3;">
        ${spec.tag ? `<span style="padding:8px 16px;background:${accentText};color:#1A1A1A;font-size:14px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;border-radius:5px;font-family:${headingFont};">${escapeHtml(spec.tag)}</span>` : '<span></span>'}
        <span style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;background:${accentText};color:#1A1A1A;font-size:16px;font-weight:800;border-radius:99px;font-family:${headingFont};">${slideIndex}/${slideTotal}</span>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:0;z-index:2;padding:160px 64px 64px;background:linear-gradient(to top, rgba(5,5,7,0.97) 58%, rgba(5,5,7,0.80) 80%, rgba(5,5,7,0) 100%);display:flex;flex-direction:column;gap:16px;">
        <h1 style="font-size:66px;font-weight:800;line-height:1.07;margin:0;letter-spacing:-1px;font-family:${headingFont};color:#fff;">${renderTwoColorHeadline(spec.headline || '', spec.headline_accent_words || [], accentText)}</h1>
        ${spec.sub ? `<p style="font-size:23px;color:rgba(255,255,255,0.9);line-height:1.4;margin:0;max-width:900px;font-family:${bodyFont};">${escapeHtml(spec.sub)}</p>` : ''}
        ${hItems}
        ${hCta}
      </div>`;
  } else if (variant === 'photo_overlay') {
    const photoFraction = typeof spec.photo_fraction === 'number'
      ? Math.max(0.2, Math.min(0.7, spec.photo_fraction))
      : 0.5; // default: photo takes top 50% of the slide
    const overlayColor = spec.overlay_color || '#7A7A7A';  // SWL uses ~50% gray
    const overlayOpacity = typeof spec.overlay_opacity === 'number' ? spec.overlay_opacity : 0.85;
    const photoHeightPx = Math.round(1080 * photoFraction);

    root.style.cssText = `
      position:fixed;left:-9999px;top:0;width:1080px;height:1080px;
      background:${P.bg};color:#FFFFFF;
      font-family:${bodyFont};
      overflow:hidden;
    `;
    root.innerHTML = `
      ${decorationsHtml}
      <!-- Photo top half -->
      <div style="position:absolute; top:0; left:0; right:0; height:${photoHeightPx}px; background:${bgImageDataUrl ? `url('${bgImageDataUrl}') center/cover no-repeat` : `linear-gradient(135deg, ${P.bg}, ${P.accent})`}; z-index:0;"></div>
      <!-- Gray overlay on bottom half (or full slide) -->
      <div style="position:absolute; top:${photoHeightPx}px; left:0; right:0; bottom:0; background:${overlayColor}; opacity:${overlayOpacity}; z-index:0;"></div>
      <!-- Tag pill + slide counter on top of photo -->
      <div style="position:absolute; top:60px; left:64px; right:64px; display:flex; justify-content:space-between; align-items:center; z-index:2;">
        ${spec.tag ? `<span style="display:inline-block;padding:8px 16px;background:${P.tagBg};color:${P.tagText};font-size:14px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;border-radius:5px;font-family:${headingFont};box-shadow:0 2px 8px rgba(0,0,0,0.3);">${escapeHtml(spec.tag)}</span>` : '<span></span>'}
        <span style="display:inline-flex;align-items:center;justify-content:center;width:54px;height:54px;background:${P.accent};color:${P.tagText};font-size:16px;font-weight:700;border-radius:99px;font-family:${headingFont};box-shadow:0 2px 8px rgba(0,0,0,0.3);">${slideIndex}/${slideTotal}</span>
      </div>
      <!-- Text content on bottom half (over the gray overlay) -->
      <div style="position:absolute; top:${photoHeightPx + 60}px; left:0; right:0; bottom:60px; padding:0 64px; z-index:2; display:flex; flex-direction:column; gap:20px;">
        <h1 style="font-size:72px;font-weight:800;line-height:1.05;margin:0;letter-spacing:-1px;font-family:${headingFont};color:#FFFFFF;text-shadow:0 2px 6px rgba(0,0,0,0.25);">${renderTwoColorHeadline(spec.headline || '', spec.headline_accent_words || [], P.accent)}</h1>
        ${spec.sub ? `<p style="font-size:22px;color:rgba(255,255,255,0.95);line-height:1.4;margin:0;max-width:920px;font-family:${bodyFont};text-shadow:0 1px 3px rgba(0,0,0,0.2);">${escapeHtml(spec.sub)}</p>` : ''}
        ${spec.items && spec.items.length ? `<div style="margin-top:8px;display:flex;flex-direction:column;gap:10px;">${spec.items.slice(0, 3).map(it => `
          <div style="padding:14px 20px; background:rgba(255,255,255,0.10); backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,0.18); border-radius:14px;">
            <div style="font-size:20px;font-weight:700;color:#FFFFFF;font-family:${headingFont};">${escapeHtml(it.title || '')}</div>
            ${it.desc ? `<div style="font-size:15px;color:rgba(255,255,255,0.85);margin-top:3px;font-family:${bodyFont};">${escapeHtml(it.desc)}</div>` : ''}
          </div>`).join('')}</div>` : ''}
        ${spec.cta_text ? `<div style="margin-top:auto; padding:20px 24px; background:${P.accent}; border-radius:12px; display:inline-block; align-self:flex-start;"><div style="font-size:16px;color:${P.tagText};font-weight:700;letter-spacing:0.5px;margin-bottom:4px;text-transform:uppercase;font-family:${headingFont};">${escapeHtml(spec.cta_tag || '')}</div><div style="font-size:24px;font-weight:800;color:${P.tagText};line-height:1.2;font-family:${headingFont};">${escapeHtml(spec.cta_text)}</div></div>` : ''}
      </div>
    `;
  } else {
    root.style.cssText = `
      position:fixed;left:-9999px;top:0;width:1080px;height:1080px;
      background:${P.bg};color:${P.text};
      font-family:${bodyFont};
      padding:${variant === 'headline_only' ? '120px 80px' : '72px 64px'};box-sizing:border-box;
      display:flex;flex-direction:column;gap:${variant === 'headline_only' ? '40px' : '24px'};
      ${variant === 'headline_only' ? 'justify-content:center;' : ''}
      overflow:hidden;
    `;
    const headlineSize = variant === 'headline_only' ? '72px' : '52px';
    const renderedHeadline = renderTwoColorHeadline(spec.headline || '', spec.headline_accent_words || [], P.accent);
    root.innerHTML = `
      ${decorationsHtml}
      <div style="display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1;">
        ${spec.tag ? `<span style="display:inline-block;padding:6px 14px;background:${P.tagBg};color:${P.tagText};font-size:14px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;border-radius:5px;font-family:${headingFont};">${escapeHtml(spec.tag)}</span>` : '<span></span>'}
        <span style="display:inline-flex;align-items:center;justify-content:center;width:54px;height:54px;background:${P.accentBg};color:${P.accent};font-size:16px;font-weight:700;border-radius:99px;font-family:${headingFont};">${slideIndex}/${slideTotal}</span>
      </div>

      <h1 style="font-size:${headlineSize};font-weight:800;color:${P.text};line-height:1.12;margin:0;letter-spacing:-0.5px;max-width:920px;font-family:${headingFont};position:relative;z-index:1;">${renderedHeadline}</h1>

      ${spec.sub ? `<p style="font-size:${variant === 'headline_only' ? '24px' : '20px'};color:${P.textMuted};line-height:1.4;margin:0;max-width:880px;font-family:${bodyFont};position:relative;z-index:1;">${escapeHtml(spec.sub)}</p>` : ''}

      ${itemsHtml ? `<div style="flex:1;display:${variant === 'stats' ? 'flex' : variant === 'cta' ? 'flex' : 'grid'};${variant === 'stats' ? 'flex-direction:column;justify-content:center;gap:32px;' : variant === 'cta' ? 'flex-direction:column;' : 'grid-template-columns:1fr 1fr;gap:18px;align-content:start;'}margin-top:18px;position:relative;z-index:1;">${itemsHtml}</div>` : ''}

      ${highlightHtml ? `<div style="position:relative;z-index:1;">${highlightHtml}</div>` : ''}

      <div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;color:${P.textMuted};font-size:14px;font-weight:600;letter-spacing:0.4px;font-family:${bodyFont};position:relative;z-index:1;">
        <span>${escapeHtml(spec.brand_handle || '')}</span>
      </div>
    `;
  }
  document.body.appendChild(root);

  try {
    const canvas = await html2canvas(root, {
      backgroundColor: P.bg,
      scale: 1,
      width: 1080,
      height: 1080,
      logging: false,
    });
    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error('[renderDesignedSlide] failed:', e);
    return null;
  } finally {
    root.remove();
  }
}

// Backward-compat alias — older code paths still reference this name.
async function renderSwlTextSlide(spec, slideIndex, slideTotal) {
  return renderDesignedSlide(spec, slideIndex, slideTotal, {});
}

// ── WF10 Auto Publisher (simulation) ───────────────────
const WF10_URL = 'https://n8n.srv949269.hstgr.cloud/webhook/wf10-auto-publish';

async function simulatePublish(draftId) {
  try {
    const res = await fetch(WF10_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_id: brandKitData.brandId, draft_id: draftId })
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

// Publish all approved/scheduled content with Metricool
async function publishAllWithMetricool() {
  const statusEl = document.getElementById('metricool-status');
  const statusText = document.getElementById('metricool-status-text');

  if (!statusEl || !statusText) {
    console.error('[Metricool] UI elements not found');
    return;
  }

  try {
    statusEl.style.display = 'block';
    statusText.innerHTML = '<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite; vertical-align:middle; margin-right:6px;"></i>Fetching approved content...';
    lucide.createIcons();

    // Fetch all approved drafts ready to publish
    const allDrafts = await fetchPublishingDrafts(brandKitData?.brandId || 'swl-consulting');
    const readyToPublish = Array.isArray(allDrafts)
      ? allDrafts.filter(d => d.status === 'approved')
      : [];

    if (!readyToPublish.length) {
      statusText.innerHTML = '⚠️ No approved content to publish. Approve drafts in ContentBuilder first.';
      statusEl.style.background = '#FEF3C7';
      statusEl.style.borderColor = '#FBBF24';
      statusText.style.color = '#92400E';
      setTimeout(() => { statusEl.style.display = 'none'; }, 5000);
      return;
    }

    statusText.innerHTML = `<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite; vertical-align:middle; margin-right:6px;"></i>Preparing ${readyToPublish.length} post(s) for Metricool...`;
    lucide.createIcons();

    // Prepare payload for Metricool
    const payload = {
      posts: readyToPublish.map(d => ({
        id: d.id,
        title: d.title || 'Untitled',
        content: d.caption || d.brief || '',
        image_url: d.visual_url || '',
        channels: [d.channel || 'linkedin'],
        scheduled_time: d.scheduled_at,
        metadata: {
          source: 'ContentBuilder',
          brand: brandKitData?.name || 'SWL Consulting',
          draft_id: d.id
        }
      }))
    };

    statusText.innerHTML = `<i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite; vertical-align:middle; margin-right:6px;"></i>Sending ${readyToPublish.length} post(s) to Metricool...`;
    lucide.createIcons();

    // Send to Metricool via backend endpoint
    const response = await fetch('http://localhost:3000/api/metricool/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.ok) {
      const publishedCount = result.published_count || readyToPublish.length;
      statusText.innerHTML = `<i data-lucide="check-circle" style="width:12px; color:#10B981; vertical-align:middle; margin-right:6px;"></i><strong>${publishedCount} post(s)</strong> sent to Metricool successfully!`;
      statusEl.style.background = '#ECFDF5';
      statusEl.style.borderColor = '#6EE7B7';
      statusText.style.color = '#047857';

      // Update counters
      setTimeout(() => hydrateAutoPublisherView(), 500);

      showToast(`✓ ${publishedCount} post(s) published via Metricool (using SWL Consulting account).`);
      lucide.createIcons();
    } else {
      const errorMsg = result.error || result.message || 'Unknown error';
      throw new Error(errorMsg);
    }
  } catch (err) {
    console.error('[Metricool] publish error:', err);
    const errMsg = err.message || 'Failed to publish';
    statusText.innerHTML = `<i data-lucide="alert-circle" style="width:12px; color:#EF4444; vertical-align:middle; margin-right:6px;"></i><strong>Error:</strong> ${errMsg}`;
    statusEl.style.background = '#FEE2E2';
    statusEl.style.borderColor = '#FECACA';
    statusText.style.color = '#DC2626';
    showToast(`Metricool publish error: ${errMsg}`, 'error');
    lucide.createIcons();
  }

  setTimeout(() => { statusEl.style.display = 'none'; }, 8000);
}

// Mark a pipeline step as done/active visually
function markCbStep(num, state /* 'done' | 'active' | 'idle' */) {
  const el = document.getElementById(`cb-step-${num}`);
  if (!el) return;
  el.classList.remove('done', 'active');
  if (state === 'done' || state === 'active') el.classList.add(state);
}

// Render the brief returned by WF06 into Step 1
function renderBriefIntoView(brief, channel) {
  const stepBody = document.getElementById('cb-step-1-body');
  if (!stepBody) return;

  const pill = (label, val) => val ? `<div style="margin-bottom:8px;"><span style="font-size:10px; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.5px;">${escapeHtml(label)}</span><div style="font-size:13px; color:var(--text-main); line-height:1.5; margin-top:2px;">${escapeHtml(val)}</div></div>` : '';

  const bodyParas = Array.isArray(brief.body) ? brief.body.filter(Boolean) : [];
  stepBody.classList.remove('empty');
  stepBody.innerHTML = `
    ${pill('Hook', brief.hook)}
    ${pill('Opening', brief.opening)}
    ${bodyParas.length ? `<div style="margin-bottom:8px;"><span style="font-size:10px; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.5px;">Body</span><div style="font-size:13px; color:var(--text-main); line-height:1.5; margin-top:2px;">${bodyParas.map(p => `<p style="margin:4px 0;">${escapeHtml(p)}</p>`).join('')}</div></div>` : ''}
    ${pill('CTA', brief.cta)}
  `;

  markCbStep(1, 'done');
  markCbStep(2, 'active');

  if (channel) {
    const channelEl = document.getElementById('cb-tag-channel');
    if (channelEl) channelEl.textContent = channel;
  }
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

function updateBrandTypography(key, value) {
  // Handle both new (object) and old (string) formats
  if (typeof brandKitData.typography[key] === 'object') {
    brandKitData.typography[key].name = value;
  } else {
    brandKitData.typography[key] = value;
  }
}

function updateBrandFontSize(kind, size) {
  // Ensure typography[kind] is an object with name and size
  if (typeof brandKitData.typography[kind] === 'string') {
    const name = brandKitData.typography[kind];
    brandKitData.typography[kind] = { name, size: size || '16px' };
  } else if (typeof brandKitData.typography[kind] === 'object') {
    brandKitData.typography[kind].size = size;
  }
}

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
  if (typeof brandKitData.typography[kind] === 'object') {
    brandKitData.typography[kind].name = name;
  } else {
    brandKitData.typography[kind] = name;
  }
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

function updateChannelName(idx, name) {
  if (!brandKitData.channels?.[idx]) return;
  brandKitData.channels[idx].name = name;
  const detected = detectSocialIcon(name);
  if (detected) {
    brandKitData.channels[idx].icon  = detected.icon;
    brandKitData.channels[idx].color = detected.color;
    const iconEl = document.getElementById('bk-ch-icon-' + idx);
    if (iconEl) iconEl.innerHTML = getSocialLogo(detected.icon, detected.color);
  }
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

// Toggle the social-URLs sub-row open/closed for a competitor.
// `_socialsOpen` is a UI-only flag that survives a re-render but is not persisted to Supabase.
function toggleCompetitorSocials(idx) {
  const c = brandKitData.competitors?.[idx];
  if (!c) return;
  c._socialsOpen = !c._socialsOpen;
  switchView(state.currentView);
}

// Discover social URLs for a competitor by calling WF00 (Website Scrapper) with their URL.
// WF00 runs server-side so there are no CORS issues.
async function discoverSocialsForCompetitor(idx) {
  const c = brandKitData.competitors?.[idx];
  if (!c?.url) { showToast('Add the website URL first.'); return; }
  showToast(`Scanning ${c.name}'s website via WF00…`);

  try {
    const res = await fetch(WF00_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: c.url }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text?.trim()) throw new Error('Empty response from WF00');
    const data = JSON.parse(text);

    // WF00 returns channels: [{ name, icon, handle, ... }]
    // Map each channel name to the competitor's social URL field.
    let found = 0;
    for (const ch of (data.channels || [])) {
      const mapping = _competitorChannelMapping(ch.name);
      if (!mapping) continue;
      if (c[mapping.field]) continue; // don't overwrite manual entries
      const raw = (ch.handle || '').replace(/^@/, '').trim();
      if (!raw) continue;
      c[mapping.field] = raw.startsWith('http') ? raw : mapping.prefix + raw;
      found++;
    }

    showToast(found
      ? `Found ${found} social channel(s) for ${c.name}.`
      : `No social channels found for ${c.name}'s website.`);
  } catch (e) {
    showToast(`Scan failed: ${e.message}`);
    console.error('[WF00 competitor socials]', e);
  }
  switchView(state.currentView);
}

function _competitorChannelMapping(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('linkedin'))  return { field: 'linkedin_url',  prefix: 'https://linkedin.com/company/' };
  if (n.includes('instagram')) return { field: 'instagram_url', prefix: 'https://instagram.com/' };
  if (n.includes('tiktok'))    return { field: 'tiktok_url',    prefix: 'https://tiktok.com/@' };
  if (n.includes('youtube'))   return { field: 'youtube_url',   prefix: 'https://youtube.com/@' };
  if (n.includes('twitter') || n === 'x' || /\bx\b/.test(n)) return { field: 'x_url', prefix: 'https://x.com/' };
  return null;
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
    'social-media-bios':   { name: 'SocialMediaBios', sub: 'Marketing Pilot · Analyzes your owned social channels — tone, top posts and channel-specific voice rules' },
    'competitors-views':      { name: 'CompetitorsViews', sub: 'Marketing Pilot · Analyzes your competitors’ social media accounts and compares their content, engagement and channel performance' },
    'hook-miner':          { name: 'HookMiner', sub: 'Marketing Pilot · Extracts the hooks and opening frameworks that drive the most engagement, ranked by channel' },
    'content-builder':     { name: 'ContentBuilder', sub: 'Marketing Pilot · Generates publish-ready posts AND on-brand visual creatives in a single flow — driven by verticals, channels and a visual prompt' },
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
  } else if (['price-intelligence','launch-tracker','sentiment-analyzer','demand-intelligence','supply-chain-ci','competitors-views','hook-miner','content-builder','auto-publisher'].includes(viewId)) {
    setTimeout(() => renderCICharts(viewId), 50);
  } else if (viewId === 'analytics') {
    setTimeout(() => renderAnalyticsCharts(), 50);
  }

  if (viewId === 'content-builder') {
    resetCbAgentState();
    setTimeout(() => updateAgentButtonsEnabled(), 60);
    setTimeout(() => refreshContentQueue(), 80);
    setTimeout(() => hydrateContentBuilderInsights(), 120);
    setTimeout(() => hydrateContentBuilderCampaign(), 80);
    setTimeout(() => hydrateContentBuilderContext(), 100);
  }

  if (viewId === 'hook-miner') {
    setTimeout(() => hydrateHookMinerView(), 80);
  }

  if (viewId === 'social-media-bios') {
    // Silently sync handles from brandKitData so SMB always starts with the latest brand channels.
    // Always clear first — channels not in this brand must not show SWL defaults.
    socialBiosData.inputs.Instagram = { handle: '', profileUrl: '' };
    socialBiosData.inputs.TikTok    = { handle: '', profileUrl: '' };
    socialBiosData.inputs.LinkedIn  = { handle: '', profileUrl: '' };
    socialBiosData.inputs.Facebook  = { handle: '', profileUrl: '' };
    (brandKitData.channels || []).forEach(c => {
      if (!c.handle) return;
      const _clean = c.handle.replace(/^@/, '').trim();
      const _n = (c.name || '').toLowerCase();
      if (_n.includes('instagram')) socialBiosData.inputs.Instagram = { handle: _clean, profileUrl: `https://www.instagram.com/${_clean}/` };
      else if (_n.includes('tiktok')) socialBiosData.inputs.TikTok = { handle: _clean, profileUrl: `https://www.tiktok.com/@${_clean}` };
      else if (_n.includes('linkedin')) socialBiosData.inputs.LinkedIn = { handle: _clean, profileUrl: `https://www.linkedin.com/company/${_clean}/` };
      else if (_n.includes('facebook')) socialBiosData.inputs.Facebook = { handle: _clean, profileUrl: `https://www.facebook.com/${_clean}` };
    });
    setTimeout(() => hydrateSocialBiosView(), 80);
  }

  if (viewId === 'competitors-views') {
    setTimeout(() => hydrateCompetitorsView(), 80);
  }

  if (viewId === 'auto-publisher') {
    setTimeout(() => hydrateAutoPublisherView(), 80);
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
    //  Flow: branding-kit → social-media-bios → competitors-views → hook-miner → content-builder (text + visual) → auto-publisher
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
          .section-divider { margin:40px 0; padding:24px 0; border-top:2px solid var(--border); }
          .section-header { font-size:18px; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:10px; }
        </style>

        <div class="agent-header" style="background: linear-gradient(135deg, #6366F1 0%, #4338CA 100%)">
          <div class="agent-bigicon">🎯</div>
          <div class="agent-header-text">
            <h2>Branding Bio</h2>
            <p>Foundation input del Marketing Pilot. Primero tu empresa: identidad, misión, visión, valores, colores, tipografía, redes. Abajo los competidores. Todo lo que agregues acá alimenta a SocialMediaBios, CompetitorsViews, ContentBuilder y CreativeBrain.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Editing live</div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════ -->
        <!-- SECTION 1: COMPANY PROFILE (OUR BRAND) -->
        <!-- ═══════════════════════════════════════════════════ -->

        <!-- ═══════════════════════════════════════════════════ -->
        <!-- SECTION 1: YOUR COMPANY -->
        <!-- ═══════════════════════════════════════════════════ -->

        <div style="margin-top:32px; margin-bottom:24px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:12px;">
            <h2 style="margin:0; font-size:28px; font-weight:800; color:#0F172A; display:flex; align-items:center; gap:12px;">
              <i data-lucide="building-2" style="width:32px; height:32px; color:#6366F1;"></i>
              YOUR COMPANY
            </h2>
            <button id="bk-sync-btn" onclick="saveBrandProfile()" style="padding:12px 24px; background:linear-gradient(135deg, #10B981 0%, #059669 100%); color:white; border:none; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s; white-space:nowrap; box-shadow:0 4px 12px rgba(16,185,129,0.4); text-transform:uppercase; letter-spacing:0.5px;">🚀 Sync to Pipeline</button>
          </div>
          <p style="margin:8px 0 0 0; font-size:14px; color:var(--text-muted); max-width:600px;">Fill in all your company information: brand identity, values, visual branding, and social channels. This powers every agent in the Marketing Pilot.</p>
        </div>

        <!-- Complete Profile Scan (URL + PDF) -->
        <div class="card" style="margin-top:24px; border:1px solid #C7D2FE; background:linear-gradient(135deg,#EEF2FF 0%,#F5F3FF 100%);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="zap"></i> Complete Profile Scan</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">AI-powered</span>
          </div>
          <p style="font-size:13px; color:var(--text-muted); margin:0 0 14px 0;">Scan your website URL and optionally upload a brand document. AI will extract all company information in one go.</p>

          <!-- URL Input -->
          <div style="margin-bottom:14px;">
            <label class="bk-label">Website URL</label>
            <input type="text" id="bk-scrape-url" value="${brandKitData.websiteUrl}" oninput="updateBrandField('websiteUrl', this.value)" placeholder="https://www.yourcompany.com" style="width:100%; padding:10px 12px; border:1px solid #C7D2FE; border-radius:6px; font-size:14px; outline:none; font-family:var(--font-main); background:white;" />
          </div>

          <!-- PDF Input -->
          <div style="margin-bottom:14px;">
            <label class="bk-label">Brand Document (Optional)</label>
            <input type="file" id="bk-pdf-upload" accept=".pdf" onchange="handleBrandPdfUpload(this)" style="width:100%; padding:10px 12px; border:1px dashed #C7D2FE; border-radius:6px; font-size:14px; outline:none; font-family:var(--font-main); background:white;" />
            <div id="bk-pdf-filename" style="font-size:11px; color:var(--text-muted); margin-top:6px;"></div>
          </div>

          <!-- Single Scan Button -->
          <div style="display:flex; gap:10px;">
            <button id="bk-scan-complete-btn" onclick="scanCompleteProfile()" style="flex:1; padding:12px 20px; background:linear-gradient(135deg, #6366F1 0%, #4338CA 100%); color:white; border:none; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap;">
              <i data-lucide="scan" style="width:14px;vertical-align:middle;margin-right:6px"></i>Scan Complete Profile
            </button>
          </div>

          <!-- Status Messages -->
          <div id="bk-scan-status" style="margin-top:12px; font-size:12px; min-height:40px;"></div>
        </div>

        <!-- 1. About Us -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="award"></i> 1. About Us</h3>
            ${brandKitData.websiteUrl ? '<span class="lm-tag" style="background:#D1FAE5;color:#065F46">✓ Auto-filled</span>' : '<span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>'}
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
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">
            <div>
              <label class="bk-label">Mission / What We Do</label>
              <textarea class="bk-input area" oninput="updateBrandField('mission', this.value)" placeholder="1-3 sentences about what you do and who you serve">${brandKitData.mission}</textarea>
            </div>
            <div>
              <label class="bk-label">Vision</label>
              <textarea class="bk-input area" oninput="updateBrandField('vision', this.value)" placeholder="Where you want to be in the future">${brandKitData.vision || ''}</textarea>
            </div>
          </div>
        </div>

        <!-- 2. Core Values -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="heart"></i> 2. Core Values</h3>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
            ${brandKitData.values.map((v, i) => `
              <div style="padding:14px; border-left:3px solid ${v.color}; background:${v.color}11; border-radius:6px; position:relative;">
                <button class="bk-row-action" onclick="removeBrandListItem('values', ${i})" style="position:absolute; top:8px; right:8px;" title="Remove">✕</button>
                <input class="bk-input" type="text" value="${v.title}" oninput="updateBrandListItem('values', ${i}, 'title', this.value)" style="background:transparent; border:none; padding:0; font-size:14px; font-weight:700;">
                <textarea class="bk-input area" oninput="updateBrandListItem('values', ${i}, 'desc', this.value)" style="background:transparent; border:none; padding:4px 0 0 0; font-size:12px; color:var(--text-muted); min-height:44px; font-weight:400;">${v.desc}</textarea>
              </div>
            `).join('')}
          </div>
          <button class="bk-add-btn" onclick="addBrandListItem('values', { title:'New value', desc:'What does this value mean in practice?', color:'#6366F1' })" style="margin-top:12px;">+ Add value</button>
        </div>

        <!-- 3. Color Palette -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="palette"></i> 3. Color Palette</h3>
            <div style="display:flex; gap:8px; align-items:center;">
              ${brandKitData.websiteUrl ? '<span class="lm-tag" style="background:#D1FAE5;color:#065F46">✓ Auto-filled</span>' : ''}
              <button onclick="toggleBkColor()" style="padding:4px 12px; background:${state.bkColorExpanded ? '#6366F1' : 'transparent'}; color:${state.bkColorExpanded ? 'white' : '#6366F1'}; border:1px solid #6366F1; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">${state.bkColorExpanded ? '✓ Done' : '✎ Customize'}</button>
            </div>
          </div>

          <!-- Always visible: read-only swatches -->
          <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:12px; ${state.bkColorExpanded ? 'margin-bottom:20px;' : ''}">
            ${brandKitData.palette.map((c, i) => `
              <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                <div style="height:54px; background:${c.hex};"></div>
                <div style="padding:7px 10px;">
                  <div style="font-size:10px; color:var(--text-muted);">${c.role}</div>
                  <div style="font-size:11px; font-weight:700; font-family:monospace; margin-top:1px;">${c.hex.toUpperCase()}</div>
                </div>
              </div>
            `).join('')}
          </div>

          ${state.bkColorExpanded ? `
            <div style="border-top:1px solid var(--border); padding-top:18px; margin-bottom:18px;">
              <label class="bk-label">Quick presets — click to apply</label>
              <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
                ${brandPresets.map((p, i) => `
                  <div class="bk-preset" onclick="applyBrandPreset(${i})">
                    <div class="bk-preset-strip">${p.palette.map(h => `<span style="background:${h}"></span>`).join('')}</div>
                    <div class="bk-preset-name">${p.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <label class="bk-label">Fine-tune — click any swatch to change · × to delete · + Add color to add more</label>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:14px;">
              ${brandKitData.palette.map((c, i) => `
                <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden; position:relative;">
                  <button type="button" onclick="removePaletteColor(${i})" title="Borrar este color" style="position:absolute; top:6px; right:6px; z-index:2; width:22px; height:22px; border-radius:50%; border:none; background:rgba(0,0,0,0.55); color:white; font-size:12px; font-weight:700; cursor:pointer; line-height:1; display:flex; align-items:center; justify-content:center;">×</button>
                  <div id="bk-swatch-${i}" style="height:70px; background:${c.hex}; position:relative; cursor:pointer;">
                    <input type="color" value="${c.hex}" oninput="updatePaletteColor(${i}, this.value)" style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; border:none; padding:0;">
                  </div>
                  <div style="padding:8px 10px;">
                    <div style="font-size:11px; color:var(--text-muted);">${c.role}</div>
                    <div id="bk-hex-${i}" style="font-size:11px; font-weight:600; font-family:monospace;">${c.hex.toUpperCase()}</div>
                  </div>
                </div>
              `).join('')}
              <button type="button" onclick="addPaletteColor()" title="Add a color to the palette" style="border:2px dashed var(--border); border-radius:8px; background:#FAFBFC; cursor:pointer; padding:0; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:115px; color:var(--text-muted); font-family:var(--font-main); transition:border-color .15s, color .15s;" onmouseover="this.style.borderColor='#6366F1';this.style.color='#6366F1'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'">
                <div style="font-size:28px; font-weight:300; line-height:1;">+</div>
                <div style="font-size:11px; font-weight:600; margin-top:6px; letter-spacing:0.3px;">Add color</div>
              </button>
            </div>
          ` : ''}
        </div>

        <!-- 4. Typography -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="type"></i> 4. Typography</h3>
            ${brandKitData.websiteUrl ? '<span class="lm-tag" style="background:#D1FAE5;color:#065F46">✓ Auto-filled</span>' : '<span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>'}
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px;">
              <label class="bk-label">Título</label>
              <input class="bk-input bk-font-input" data-kind="heading" type="text" value="${typeof brandKitData.typography.heading === 'string' ? brandKitData.typography.heading : brandKitData.typography.heading.name}" oninput="updateBrandFontInput(this, 'heading')" list="bk-fonts" style="font-family:'${typeof brandKitData.typography.heading === 'string' ? brandKitData.typography.heading : brandKitData.typography.heading.name}', sans-serif; font-size:20px; font-weight:700;">
              <div style="display:flex; gap:8px; align-items:center; margin-top:10px; font-size:11px;">
                <label style="flex:0;">Size:</label>
                <input type="text" value="${typeof brandKitData.typography.heading === 'string' ? '28px' : brandKitData.typography.heading.size}" oninput="updateBrandFontSize('heading', this.value)" placeholder="28px" style="flex:1; padding:6px 8px; border:1px solid var(--border); border-radius:4px; font-size:12px;">
              </div>
              <div class="font-preview" data-kind="heading" style="font-size:20px; margin-top:10px; font-family:'${typeof brandKitData.typography.heading === 'string' ? brandKitData.typography.heading : brandKitData.typography.heading.name}', sans-serif; font-weight:700;">Sample headline</div>
            </div>
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px;">
              <label class="bk-label">Subtítulo</label>
              <input class="bk-input bk-font-input" data-kind="subtitle" type="text" value="${typeof brandKitData.typography.subtitle === 'string' ? brandKitData.typography.subtitle : (brandKitData.typography.subtitle?.name || 'Plus Jakarta Sans')}" oninput="updateBrandFontInput(this, 'subtitle')" list="bk-fonts" style="font-family:'${typeof brandKitData.typography.subtitle === 'string' ? brandKitData.typography.subtitle : (brandKitData.typography.subtitle?.name || 'Plus Jakarta Sans')}', sans-serif; font-size:16px; font-weight:700;">
              <div style="display:flex; gap:8px; align-items:center; margin-top:10px; font-size:11px;">
                <label style="flex:0;">Size:</label>
                <input type="text" value="${typeof brandKitData.typography.subtitle === 'string' ? '20px' : (brandKitData.typography.subtitle?.size || '20px')}" oninput="updateBrandFontSize('subtitle', this.value)" placeholder="20px" style="flex:1; padding:6px 8px; border:1px solid var(--border); border-radius:4px; font-size:12px;">
              </div>
              <div class="font-preview" data-kind="subtitle" style="font-size:16px; margin-top:10px; font-family:'${typeof brandKitData.typography.subtitle === 'string' ? brandKitData.typography.subtitle : (brandKitData.typography.subtitle?.name || 'Plus Jakarta Sans')}', sans-serif; font-weight:700;">Sample subheading</div>
            </div>
            <div style="padding:16px; border:1px solid var(--border); border-radius:8px;">
              <label class="bk-label">Body</label>
              <input class="bk-input bk-font-input" data-kind="body" type="text" value="${typeof brandKitData.typography.body === 'string' ? brandKitData.typography.body : brandKitData.typography.body.name}" oninput="updateBrandFontInput(this, 'body')" list="bk-fonts" style="font-family:'${typeof brandKitData.typography.body === 'string' ? brandKitData.typography.body : brandKitData.typography.body.name}', sans-serif; font-size:20px; font-weight:600;">
              <div style="display:flex; gap:8px; align-items:center; margin-top:10px; font-size:11px;">
                <label style="flex:0;">Size:</label>
                <input type="text" value="${typeof brandKitData.typography.body === 'string' ? '16px' : brandKitData.typography.body.size}" oninput="updateBrandFontSize('body', this.value)" placeholder="16px" style="flex:1; padding:6px 8px; border:1px solid var(--border); border-radius:4px; font-size:12px;">
              </div>
              <div class="font-preview" data-kind="body" style="font-size:13px; margin-top:10px; font-family:'${typeof brandKitData.typography.body === 'string' ? brandKitData.typography.body : brandKitData.typography.body.name}', sans-serif;">Regular paragraph body text.</div>
            </div>
          </div>
          <datalist id="bk-fonts">${BRAND_FONTS_SANS.concat(BRAND_FONTS_SERIF, BRAND_FONTS_DISPLAY).map(f => `<option value="${f}">`).join('')}</datalist>
        </div>

        <!-- 5. Logos & Assets -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="image"></i> 5. Logos & Assets</h3>
            <span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Auto-generated preview</span>
          </div>
          <div style="display:grid; grid-template-columns:${brandKitData.logoUrl ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)'}; gap:14px;">
            ${brandKitData.logoUrl
              ? `
              <div style="border:2px solid #10B981; border-radius:8px; overflow:hidden;">
                <div style="aspect-ratio:3/2; background:white; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border); padding:8px;"><img src="${brandKitData.logoUrl}" alt="Logo" style="max-width:100%; max-height:100%; object-fit:contain;" /></div>
                <div style="padding:8px 10px; font-size:11px; color:#10B981; font-weight:600;">✓ Logo · White</div>
              </div>
              <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                <div style="aspect-ratio:3/2; background:${brandKitData.palette[0]?.hex || '#6366F1'}; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border); padding:8px;"><img src="${brandKitData.logoUrl}" alt="Logo" style="max-width:100%; max-height:100%; object-fit:contain; filter:brightness(0) invert(1);" /></div>
                <div style="padding:8px 10px; font-size:11px; color:var(--text-muted);">Primary BG</div>
              </div>
              <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                <div style="aspect-ratio:3/2; background:${brandKitData.palette[1]?.hex || '#0F172A'}; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border); padding:8px;"><img src="${brandKitData.logoUrl}" alt="Logo" style="max-width:100%; max-height:100%; object-fit:contain; filter:brightness(0) invert(1);" /></div>
                <div style="padding:8px 10px; font-size:11px; color:var(--text-muted);">Secondary BG</div>
              </div>
              <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                <div style="aspect-ratio:3/2; background:${brandKitData.palette[4]?.hex || '#333333'}; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border); padding:8px;"><img src="${brandKitData.logoUrl}" alt="Logo" style="max-width:100%; max-height:100%; object-fit:contain; filter:brightness(0) invert(1);" /></div>
                <div style="padding:8px 10px; font-size:11px; color:var(--text-muted);">Dark BG</div>
              </div>
              `
              : brandKitData.logoSvg
              ? `
              <div style="border:2px solid #6366F1; border-radius:8px; overflow:hidden;">
                <div style="aspect-ratio:3/2; background:white; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border); padding:12px; overflow:hidden;">${brandKitData.logoSvg}</div>
                <div style="padding:8px 10px; font-size:11px; color:#6366F1; font-weight:600;">✓ Extracted SVG</div>
              </div>`
              : `
              <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                <div style="aspect-ratio:3/2; background:${brandKitData.palette[5]?.hex || '#F8FAFC'}; display:flex; align-items:center; justify-content:center; border-bottom:1px solid var(--border); color:var(--text-muted); font-size:11px; cursor:pointer;">+ Upload</div>
                <div style="padding:8px 10px; font-size:11px; color:var(--text-muted);">Custom logo</div>
              </div>`}
          </div>
        </div>


        <!-- 6. Social Channels -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="share-2"></i> 6. Social Channels</h3>
            ${brandKitData.websiteUrl && brandKitData.channels.some(c => c.handle && c.handle !== '@yourhandle')
              ? '<span class="lm-tag" style="background:#D1FAE5;color:#065F46">✓ Auto-filled</span>'
              : '<span class="lm-tag" style="background:#EEF2FF;color:#4338CA">✎ Editable</span>'}
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
            ${brandKitData.channels.map((c, i) => `
              <div style="padding:14px; border:1px solid var(--border); border-radius:8px; position:relative;">
                <button class="bk-row-action" onclick="removeBrandListItem('channels', ${i})" style="position:absolute; top:8px; right:8px;" title="Remove">✕</button>
                <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
                  <div id="bk-ch-icon-${i}" style="width:34px; height:34px; border-radius:8px; background:#F3F4F6; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${getSocialLogo(c.icon, c.color)}</div>
                  <div style="flex:1; min-width:0;">
                    <input class="bk-input" type="text" value="${c.name}" oninput="updateChannelName(${i}, this.value)" placeholder="E.g. TikTok" style="font-size:13px; font-weight:700; padding:2px 6px;" />
                    <input class="bk-input" type="text" value="${c.handle}" oninput="updateBrandListItem('channels', ${i}, 'handle', this.value)" placeholder="@handle or URL" style="font-size:12px; font-family:monospace; padding:2px 6px; margin-top:4px;" />
                  </div>
                </div>
                <input class="bk-input" type="text" value="${c.audience || ''}" oninput="updateBrandListItem('channels', ${i}, 'audience', this.value)" placeholder="Audience description" style="font-size:11px; width:100%; box-sizing:border-box;" />
              </div>
            `).join('')}
          </div>
          <button class="bk-add-btn" onclick="addBrandListItem('channels', { name:'New channel', icon:'globe', color:'#6366F1', handle:'@handle', audience:'' })" style="margin-top:12px;">+ Add channel</button>
        </div>

        <!-- ═══════════════════════════════════════════════════ -->
        <!-- SECTION 2: COMPETITORS -->
        <!-- ═══════════════════════════════════════════════════ -->

        <div style="margin-top:48px; margin-bottom:24px; padding-bottom:20px; border-bottom:3px solid #DC2626;">
          <h2 style="margin:0; font-size:28px; font-weight:800; color:#0F172A; display:flex; align-items:center; gap:12px;">
            <i data-lucide="swords" style="width:32px; height:32px; color:#DC2626;"></i>
            COMPETITORS
          </h2>
          <p style="margin:8px 0 0 0; font-size:14px; color:var(--text-muted); max-width:600px;">Add and analyze your competitors. The system will scrape their websites, social media, and positioning so you can see what's working in your space.</p>
        </div>

        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 class="card-title" style="margin:0;">Competitors Tracked</h3>
            ${(() => {
              const aiCount = brandKitData.competitors.filter(c => c.source === 'ai').length;
              const total   = brandKitData.competitors.filter(c => c?.name && !/^new competitor$/i.test(c.name)).length;
              if (aiCount >= 5)  return `<span class="lm-tag" style="background:#D1FAE5;color:#065F46">🤖 ${aiCount} auto-detected · ${total} total</span>`;
              if (aiCount > 0)   return `<span class="lm-tag" style="background:#EEF2FF;color:#4338CA">🤖 ${aiCount} auto-detected · ${total} total</span>`;
              return `<span class="lm-tag" style="background:#FEF3C7;color:#92400E">⚠ Sin scan — agregar manual</span>`;
            })()}
          </div>
          <div style="background:#EEF2FF; border:1px solid #C7D2FE; border-radius:8px; padding:10px 14px; margin-bottom:14px; font-size:12px; color:#3730A3; display:flex; gap:8px; align-items:flex-start;">
            <i data-lucide="info" style="width:13px; flex-shrink:0; margin-top:1px; color:#6366F1;"></i>
            <span>Click <strong>Scan Your Website</strong> (in YOUR COMPANY) for AI to auto-detect 5+ competitors. Then you can remove ones that don't fit or add more manually. Fill in social media URLs so the system can scrape each channel.</span>
          </div>
          <table class="lm-table">
            <thead><tr><th style="width:18%;">Competitor</th><th style="width:20%;">Website URL</th><th style="width:24%;">Positioning</th><th style="width:12%;">Tier</th><th>Differentiator</th><th style="width:90px;">Socials</th><th style="width:40px;"></th></tr></thead>
            <tbody>
              ${brandKitData.competitors.map((c, i) => {
                const socialCount = ['linkedin_url','instagram_url','tiktok_url','youtube_url','x_url','facebook_url'].filter(k => c[k]).length;
                const isOpen = !!c._socialsOpen;
                const aiBadge = c.source === 'ai'
                  ? `<span title="Auto-detected by AI" style="display:inline-block;margin-left:5px;font-size:9px;font-weight:700;background:#EEF2FF;color:#4338CA;border-radius:4px;padding:1px 4px;vertical-align:middle;">AI</span>`
                  : '';
                return `
                <tr>
                  <td><div style="display:flex;align-items:center;gap:4px;"><input class="bk-input" type="text" value="${c.name}" oninput="updateBrandListItem('competitors', ${i}, 'name', this.value)" style="padding:6px 8px; font-size:13px; flex:1;">${aiBadge}</div></td>
                  <td><input class="bk-input" type="text" value="${c.url||''}" oninput="updateBrandListItem('competitors', ${i}, 'url', this.value)" placeholder="https://…" style="padding:6px 8px; font-size:12px; font-weight:400;"></td>
                  <td><input class="bk-input" type="text" value="${c.positioning}" oninput="updateBrandListItem('competitors', ${i}, 'positioning', this.value)" style="padding:6px 8px; font-size:12px; font-weight:400;"></td>
                  <td>
                    <select class="bk-input" onchange="updateBrandListItem('competitors', ${i}, 'tier', this.value)" style="padding:6px 8px; font-size:12px; font-weight:600;">
                      <option ${c.tier==='Premium'?'selected':''}>Premium</option>
                      <option ${c.tier==='Mid'?'selected':''}>Mid</option>
                      <option ${c.tier==='Low'?'selected':''}>Low</option>
                    </select>
                  </td>
                  <td><input class="bk-input" type="text" value="${c.diff}" oninput="updateBrandListItem('competitors', ${i}, 'diff', this.value)" style="padding:6px 8px; font-size:12px; font-weight:400; color:var(--text-muted);"></td>
                  <td>
                    <button class="bk-socials-toggle ${isOpen?'open':''} ${socialCount?'has-data':''}" onclick="toggleCompetitorSocials(${i})" title="Edit social URLs">
                      <i data-lucide="${isOpen?'chevron-up':'chevron-down'}" style="width:11px;vertical-align:middle;"></i>
                      ${socialCount ? `${socialCount}/6` : '+ add'}
                    </button>
                  </td>
                  <td><button class="bk-row-action" onclick="removeBrandListItem('competitors', ${i})" title="Remove">✕</button></td>
                </tr>
                ${isOpen ? `
                <tr class="bk-socials-subrow">
                  <td colspan="7" style="background:#FAFBFC; padding:14px 18px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                      <div style="font-size:11px; font-weight:700; color:var(--text-muted); letter-spacing:0.4px; text-transform:uppercase;">Social channels for ${escapeHtml(c.name)}</div>
                      <button class="bk-socials-discover" onclick="discoverSocialsForCompetitor(${i})" ${!c.url?'disabled':''} title="${c.url?'Scan website to discover socials':'Add website URL first'}">
                        <i data-lucide="search" style="width:11px;vertical-align:middle;margin-right:4px;"></i>Discover
                      </button>
                    </div>
                    <div class="bk-socials-grid">
                      <div class="bk-social-input">
                        <label><i data-lucide="linkedin" style="width:12px;color:#0A66C2"></i> LinkedIn</label>
                        <input class="bk-input" type="text" value="${c.linkedin_url||''}" oninput="updateBrandListItem('competitors', ${i}, 'linkedin_url', this.value)" placeholder="linkedin.com/company/…" />
                      </div>
                      <div class="bk-social-input">
                        <label><i data-lucide="instagram" style="width:12px;color:#E4405F"></i> Instagram</label>
                        <input class="bk-input" type="text" value="${c.instagram_url||''}" oninput="updateBrandListItem('competitors', ${i}, 'instagram_url', this.value)" placeholder="instagram.com/…" />
                      </div>
                      <div class="bk-social-input">
                        <label><i data-lucide="music" style="width:12px;color:#000"></i> TikTok</label>
                        <input class="bk-input" type="text" value="${c.tiktok_url||''}" oninput="updateBrandListItem('competitors', ${i}, 'tiktok_url', this.value)" placeholder="tiktok.com/@…" />
                      </div>
                      <div class="bk-social-input">
                        <label><i data-lucide="youtube" style="width:12px;color:#FF0000"></i> YouTube</label>
                        <input class="bk-input" type="text" value="${c.youtube_url||''}" oninput="updateBrandListItem('competitors', ${i}, 'youtube_url', this.value)" placeholder="youtube.com/@…" />
                      </div>
                      <div class="bk-social-input">
                        <label><i data-lucide="twitter" style="width:12px;color:#1DA1F2"></i> X / Twitter</label>
                        <input class="bk-input" type="text" value="${c.x_url||''}" oninput="updateBrandListItem('competitors', ${i}, 'x_url', this.value)" placeholder="x.com/…" />
                      </div>
                      <div class="bk-social-input">
                        <label>${getSocialLogo('facebook','#1877F2',12)} Facebook</label>
                        <input class="bk-input" type="text" value="${c.facebook_url||''}" oninput="updateBrandListItem('competitors', ${i}, 'facebook_url', this.value)" placeholder="facebook.com/…" />
                      </div>
                    </div>
                  </td>
                </tr>` : ''}
              `;}).join('')}
            </tbody>
          </table>
          <button class="bk-add-btn" onclick="addBrandListItem('competitors', { name:'New competitor', url:'', positioning:'How they position', tier:'Mid', diff:'What sets them apart', linkedin_url:'', instagram_url:'', tiktok_url:'', youtube_url:'', x_url:'', facebook_url:'', source:'manual' })" style="margin-top:12px;">+ Add competitor manually</button>
        </div>
      </div>
    `,

    'social-media-bios': `
      <div id="smb-root" class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #D946EF 0%, #9333EA 100%)">
          <div class="agent-bigicon">📱</div>
          <div class="agent-header-text">
            <h2>SocialMediaBios</h2>
            <p>Analyzes your owned social channels (LinkedIn · Instagram · TikTok · Facebook · YouTube) to surface tone by channel, top-performing posts, and channel-specific voice rules — then hands off to CompetitorsViews to benchmark against the brands you compete with.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Ready</div><br>
          </div>
        </div>

        <!-- Mock-data warning banner (hidden after first real scan) -->
        <div id="smb-mock-banner" style="margin-top:16px; padding:12px 16px; background:#FFFBEB; border:1px solid #FCD34D; border-radius:10px; display:flex; gap:10px; align-items:flex-start;">
          <i data-lucide="alert-triangle" style="width:18px; flex-shrink:0; margin-top:1px; color:#D97706;"></i>
          <div style="flex:1; font-size:13px; color:#92400E;">
            <strong>LIVE DATA</strong> — automatically pulled from your social channels when you click "Sync to Pipeline" in Branding Bio. Channels scan via WF02 and show voice, engagement, and top-performing posts.
          </div>
        </div>

        <!-- Input row: handles + actions -->
        <div class="card" style="margin-top:24px; padding:20px 24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:14px;">
            <div>
              <h3 class="card-title" style="margin:0;"><i data-lucide="link-2"></i> Owned Channels</h3>
              <p style="margin:4px 0 0; font-size:12px; color:var(--text-muted);">Last scan: <span id="smb-last-scan">—</span></p>
            </div>
            <div style="display:flex; gap:8px;">
              <p style="margin:0; color:var(--text-muted); font-size:13px;"><em>Automatically synced via "Sync to Pipeline" button in Branding Bio</em></p>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:12px;">
            <div class="smb-input-card">
              <label><span style="display:inline-flex;align-items:center;vertical-align:middle;margin-right:5px;">${getSocialLogo('linkedin','#0A66C2',16)}</span> LinkedIn company slug</label>
              <input type="text" value="${socialBiosData.inputs.LinkedIn.handle}" oninput="updateSocialBiosInput('LinkedIn','handle',this.value)" placeholder="swl-consulting" />
              <span class="smb-hint">linkedin.com/company/<b>&lt;slug&gt;</b></span>
            </div>
            <div class="smb-input-card">
              <label><span style="display:inline-flex;align-items:center;vertical-align:middle;margin-right:5px;">${getSocialLogo('instagram','#E4405F',16)}</span> Instagram handle</label>
              <input type="text" value="${socialBiosData.inputs.Instagram.handle}" oninput="updateSocialBiosInput('Instagram','handle',this.value)" placeholder="swl.consulting" />
              <span class="smb-hint">instagram.com/<b>&lt;handle&gt;</b></span>
            </div>
            <div class="smb-input-card">
              <label><span style="display:inline-flex;align-items:center;vertical-align:middle;margin-right:5px;">${getSocialLogo('music','#010101',16)}</span> TikTok handle</label>
              <input type="text" value="${socialBiosData.inputs.TikTok.handle}" oninput="updateSocialBiosInput('TikTok','handle',this.value)" placeholder="swl.consulting" />
              <span class="smb-hint">tiktok.com/@<b>&lt;handle&gt;</b></span>
            </div>
            <div class="smb-input-card" style="${socialBiosData.inputs.Facebook?.handle ? '' : 'display:none'}">
              <label><span style="display:inline-flex;align-items:center;vertical-align:middle;margin-right:5px;">${getSocialLogo('facebook','#1877F2',16)}</span> Facebook page</label>
              <input type="text" value="${socialBiosData.inputs.Facebook?.handle || ''}" oninput="updateSocialBiosInput('Facebook','handle',this.value)" placeholder="swlconsulting" />
              <span class="smb-hint">facebook.com/<b>&lt;page&gt;</b></span>
            </div>
          </div>
          <div id="smb-scan-status" style="margin-top:12px; font-size:12px;"></div>
        </div>

        <!-- KPI strip -->
        <div class="agent-stats" style="margin-top:16px;">
          <div class="agent-stat"><div class="agent-stat-label">Channels analyzed</div><div class="agent-stat-value" id="smb-stat-channels">—</div></div>
          <div class="agent-stat"><div class="agent-stat-label">Posts indexed</div><div class="agent-stat-value" id="smb-stat-posts">—</div></div>
          <div class="agent-stat"><div class="agent-stat-label">Avg engagement rate</div><div class="agent-stat-value" id="smb-stat-er">—</div></div>
          <div class="agent-stat"><div class="agent-stat-label">Tone divergence</div><div class="agent-stat-value" id="smb-stat-variance">—</div></div>
        </div>

        <!-- Channel selector pills — rendered dynamically by hydrateSocialBiosView() based on which handles are filled -->
        <div id="smb-channel-tabs-container" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:18px;"></div>

        <!-- ═══════ Comparison view (visible when "all" selected) ═══════ -->
        <div id="smb-comparison-view">
          <!-- Channel snapshot cards: side-by-side -->
          <div id="smb-channel-cards" class="smb-channel-cards"></div>

          <!-- Tone fingerprint: cross-channel matrix -->
          <div class="card" style="margin-top:16px; padding:20px 24px;">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
              <h3 class="card-title" style="margin:0;"><i data-lucide="git-compare-arrows"></i> Tone fingerprint · canal por canal</h3>
              <span style="font-size:11px;color:var(--text-muted);">Cada punto = posición del canal en el eje (0–100). Distancia entre puntos = qué tan distinto suena cada canal.</span>
            </div>
            <div id="smb-tone-matrix"></div>
          </div>

          <!-- Best post per channel showcase -->
          <div class="card" style="margin-top:16px; padding:20px 24px;">
            <h3 class="card-title" style="margin:0 0 14px;"><i data-lucide="trophy"></i> El post que mejor performó en cada canal</h3>
            <div id="smb-best-per-channel" class="smb-best-grid"></div>
          </div>

          <!-- Channel leaderboard -->
          <div class="card" style="margin-top:16px; padding:20px 24px;">
            <h3 class="card-title" style="margin:0 0 14px;"><i data-lucide="award"></i> Channel leaderboard · dónde duplicar la apuesta</h3>
            <div id="smb-leaderboard" class="smb-leaderboard"></div>
          </div>
        </div>

        <!-- ═══════ Single-channel view (visible when a channel is selected) ═══════ -->
        <div id="smb-single-view" style="display:none;">
          <!-- Focus card -->
          <div class="card" style="margin-top:16px; padding:20px 24px;">
            <div id="smb-focus-card"></div>
          </div>

          <!-- Metricool subtabs -->
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:24px; border-bottom:2px solid var(--border); padding-bottom:12px;">
            <button class="smb-subtab active" data-subtab="comunidad" onclick="selectSocialBiosSubtab('comunidad', this)" style="padding:8px 16px; background:none; border:none; border-bottom:3px solid transparent; color:var(--text-muted); font-weight:600; cursor:pointer; transition:all 0.2s;">
              <i data-lucide="users" style="width:14px; vertical-align:middle; margin-right:6px;"></i>Comunidad
            </button>
            <button class="smb-subtab" data-subtab="cuenta" onclick="selectSocialBiosSubtab('cuenta', this)" style="padding:8px 16px; background:none; border:none; border-bottom:3px solid transparent; color:var(--text-muted); font-weight:600; cursor:pointer; transition:all 0.2s;">
              <i data-lucide="bar-chart-2" style="width:14px; vertical-align:middle; margin-right:6px;"></i>Cuenta
            </button>
            <button class="smb-subtab" data-subtab="publicaciones" onclick="selectSocialBiosSubtab('publicaciones', this)" style="padding:8px 16px; background:none; border:none; border-bottom:3px solid transparent; color:var(--text-muted); font-weight:600; cursor:pointer; transition:all 0.2s;">
              <i data-lucide="trending-up" style="width:14px; vertical-align:middle; margin-right:6px;"></i>Publicaciones
            </button>
          </div>

          <!-- COMUNIDAD tab -->
          <div id="smb-subtab-comunidad" class="card" style="margin-top:16px; padding:40px 24px;">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:24px;">
              <div style="text-align:center;">
                <div style="font-size:48px; font-weight:800; color:#9333EA; line-height:1; margin-bottom:8px;" id="smb-comunidad-followers">—</div>
                <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Seguidores</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:48px; font-weight:800; color:#06B6D4; line-height:1; margin-bottom:8px;" id="smb-comunidad-following">—</div>
                <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Siguiendo</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:48px; font-weight:800; color:#10B981; line-height:1; margin-bottom:8px;" id="smb-comunidad-posts">—</div>
                <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Publicaciones</div>
              </div>
            </div>
          </div>

          <!-- CUENTA tab -->
          <div id="smb-subtab-cuenta" class="card" style="margin-top:16px; padding:40px 24px; display:none;">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:24px;">
              <div style="text-align:center;">
                <div style="font-size:48px; font-weight:800; color:#F59E0B; line-height:1; margin-bottom:8px;" id="smb-cuenta-views">—</div>
                <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Visualizaciones</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:48px; font-weight:800; color:#EC4899; line-height:1; margin-bottom:8px;" id="smb-cuenta-reach">—</div>
                <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Alcance</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:48px; font-weight:800; color:#8B5CF6; line-height:1; margin-bottom:8px;" id="smb-cuenta-interactions">—</div>
                <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Interacciones</div>
              </div>
            </div>
          </div>

          <!-- PUBLICACIONES tab -->
          <div id="smb-subtab-publicaciones" class="card" style="margin-top:16px; padding:20px 24px; display:none;">
            <div id="smb-publicaciones-list" style="display:grid; gap:16px;"></div>
          </div>
        </div>
      </div>
    `,

    'competitors-views': `
      <div class="view-section active">
        <div class="agent-header" style="background: linear-gradient(135deg, #06B6D4 0%, #0369A1 100%)">
          <div class="agent-bigicon">🔭</div>
          <div class="agent-header-text">
            <h2>MarketMirror</h2>
            <p>Real-time analysis of competitor performance across the channels you actually use. See what's working, what content resonates, and exactly where you can win.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Live</div><br>
            <span class="agent-tag" id="cv-brand-tag">0 competitors</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:12px; flex-wrap:wrap;">
          <span style="font-size:12px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i><span id="cv-last-sync">Synced: never</span></span>
          <button id="wf04-analyze-btn" onclick="runContentAnalysis()" style="padding:9px 16px; background:#06B6D4; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px;"><i data-lucide="zap" style="width:13px;"></i>Run Deeper Analysis</button>
        </div>

        <!-- Channel Tabs -->
        <div style="margin-top:20px; border-bottom:2px solid var(--border); overflow-x:auto;" id="cv-channel-tabs-container">
          <div style="display:flex; flex-wrap:wrap; gap:0;">
            <!-- Tabs injected here -->
          </div>
        </div>

        <!-- Channel Content (organized by channel) -->
        <div style="margin-top:24px;" id="cv-channel-content-container">
          <!-- Content injected here -->
        </div>

        <!-- Legacy sections (hidden, but kept for compatibility) -->
        <div style="display:none;">
          <div id="cv-top-pieces-tbody"></div>
          <div id="cv-snapshot-container"></div>
          <div id="cv-sov-container"></div>
          <div id="cv-sov-insight"></div>
          <div id="cv-sources-container"></div>
          <div id="cv-stat-competitors"></div>
          <div id="cv-stat-accounts"></div>
          <div id="cv-stat-top"></div>
          <div id="cv-stat-posts"></div>
          <div id="cv-channel-tabs"></div>
          <div id="cv-channel-comparison"></div>
        </div>
      </div>
    `,

    'hook-miner': `
      <div class="view-section active">
        <style>
          .hm-ptab { padding:9px 16px; border:none; background:none; font-size:13px; font-weight:600; color:var(--text-muted); cursor:pointer; border-bottom:3px solid transparent; transition:all .15s; white-space:nowrap; }
          .hm-ptab:hover { color:var(--text-main); }
          .hm-ptab.active { color:#F97316; border-bottom-color:#F97316; }
          .hm-mini-stat { padding:12px 10px; background:#F8FAFC; border-radius:10px; text-align:center; border:1px solid var(--border); }
          .hm-mini-stat-val { font-size:22px; font-weight:800; color:var(--text-main); line-height:1; }
          .hm-mini-stat-lbl { font-size:10px; color:var(--text-muted); margin-top:4px; }
          .hm-comp-card { padding:14px; border:1px solid var(--border); border-radius:10px; background:white; transition:box-shadow .15s; }
          .hm-comp-card:hover { box-shadow:0 4px 14px rgba(0,0,0,.07); }
          .hm-hook-row:hover td { background:#FFF7ED; }
        </style>

        <!-- Header -->
        <div class="agent-header" style="background: linear-gradient(135deg, #F97316 0%, #DC2626 100%)">
          <div class="agent-bigicon">🎣</div>
          <div class="agent-header-text">
            <h2>HookMiner</h2>
            <p>Analiza los videos de tus competidores y extrae hooks de apertura, frameworks narrativos y patrones de engagement — clasificados por plataforma y listos para ContentBuilder.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Active</div><br>
            <span class="agent-tag" id="hm-header-tag">conectando…</span>
          </div>
        </div>

        <!-- Pipeline control bar -->
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-top:12px;gap:10px;padding:12px 14px;background:#FFF7ED;border:1px solid rgba(249,115,22,.2);border-radius:10px;">
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <span style="font-size:12px;font-weight:600;color:#92400E;">Pipeline config:</span>
            <select id="hm-config-select" style="padding:5px 10px;border:1px solid #FCD34D;border-radius:6px;font-size:12px;background:white;color:var(--text-main);">
              <option>Cargando configs…</option>
            </select>
            <button id="hm-sync-competitors-btn" onclick="syncCompetitorCreators()" style="padding:6px 12px;background:white;color:#92400E;border:1px solid #FCD34D;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">
              <i data-lucide="users" style="width:12px;vertical-align:middle;margin-right:4px"></i>Sync Competitors
            </button>
            <button id="hm-run-pipeline-btn" onclick="runCompetitorPipeline()" style="padding:6px 14px;background:#F97316;color:white;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">
              <i data-lucide="play" style="width:12px;vertical-align:middle;margin-right:4px"></i>Run Pipeline
            </button>
            <span id="hm-pipeline-status" style="font-size:11px;color:var(--text-muted);">Guardá Branding Bio para auto-generar config →</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="agent-stats" style="margin-top:16px;">
          <div class="agent-stat"><div class="agent-stat-val" id="hm-stat-hooks">—</div><div class="agent-stat-lbl">Hooks Extraídos</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="hm-stat-videos">—</div><div class="agent-stat-lbl">Videos Analizados</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="hm-stat-total-views">—</div><div class="agent-stat-lbl">Vistas Analizadas</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="hm-stat-competitors">—</div><div class="agent-stat-lbl">Competidores</div></div>
        </div>

        <!-- Platform Tabs -->
        <div class="card" style="margin-top:24px;padding-top:0;overflow:hidden;">
          <div style="display:flex;gap:0;border-bottom:1px solid var(--border);padding:0 8px;background:#FAFAFA;border-radius:12px 12px 0 0;overflow-x:auto;">
            <button class="hm-ptab active" onclick="hmShowPlatform('all',this)">🌐 All Platforms</button>
            <button class="hm-ptab" onclick="hmShowPlatform('instagram',this)">📸 Instagram</button>
            <button class="hm-ptab" onclick="hmShowPlatform('tiktok',this)">🎵 TikTok</button>
            <button class="hm-ptab" onclick="hmShowPlatform('linkedin',this)">💼 LinkedIn</button>
            <button class="hm-ptab" onclick="hmShowPlatform('twitter',this)">🐦 Twitter/X</button>
          </div>
          <div id="hm-platform-content" style="padding:20px;min-height:180px;">
            <div style="text-align:center;color:var(--text-muted);padding:40px;">
              <i data-lucide="loader-2" style="width:20px;animation:spin 1s linear infinite;vertical-align:middle;margin-right:8px;"></i>
              Cargando análisis…
            </div>
          </div>
        </div>

        <!-- Full Hook Library -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="book-open"></i> Hook Library</h3>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <select id="hm-fw-filter" onchange="hmRenderHookTable()" style="padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;background:white;">
                <option value="">All Frameworks</option>
                <option>Contrarian</option>
                <option>Specific Number</option>
                <option>How-We-Do-X</option>
                <option>Open-Loop</option>
                <option>Persona-Aware</option>
                <option>Visual-Led</option>
              </select>
              <select id="hm-plat-filter" onchange="hmRenderHookTable()" style="padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;background:white;">
                <option value="">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter/X</option>
              </select>
              <select id="hm-type-filter" onchange="hmRenderHookTable()" style="padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;background:white;">
                <option value="">All Types</option>
                <option value="spoken">Spoken</option>
                <option value="visual">Visual</option>
                <option value="concept">AI Concept</option>
              </select>
            </div>
          </div>
          <table class="lm-table">
            <thead><tr><th>Hook</th><th>Framework</th><th>Platform</th><th>Tipo</th><th>Score</th><th>Link</th></tr></thead>
            <tbody id="hm-hook-tbody">
              <tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px;">Cargando…</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Competitor Leaderboard -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="trophy"></i> Competitor Leaderboard</h3>
          <div id="hm-competitors-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:14px;">
            <div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px;">Cargando…</div>
          </div>
        </div>

        <!-- Creative Library — Swipe File -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
            <div>
              <h3 class="card-title" style="margin:0;"><i data-lucide="film" style="width:16px;height:16px;vertical-align:middle;margin-right:6px"></i>Creative Library — Swipe File</h3>
              <p style="font-size:11px;color:var(--text-muted);margin:4px 0 0 0;" id="hm-swipe-subtitle">conectando…</p>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <select id="hm-swipe-config" onchange="renderSwipeGrid()" style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:white;">
                <option value="">All Competitors</option>
              </select>
              <select id="hm-swipe-creator" onchange="renderSwipeGrid()" style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:white;">
                <option value="">All Creators</option>
              </select>
              <select id="hm-swipe-sort" onchange="renderSwipeGrid()" style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:white;">
                <option value="views">Most Views</option>
                <option value="starred">Starred First</option>
                <option value="date-posted">Date Posted</option>
                <option value="date-added">Date Added</option>
              </select>
            </div>
          </div>
          <div id="hm-swipe-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:10px;">
            <div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:28px;font-size:13px;">
              <i data-lucide="loader-2" style="width:14px;animation:spin 1s linear infinite;vertical-align:middle;margin-right:6px"></i>
              Cargando videos…
            </div>
          </div>
          <div id="hm-swipe-loadmore" style="text-align:center;margin-top:14px;display:none;">
            <button onclick="loadMoreSwipeVideos()" style="padding:6px 20px;border:1px solid var(--border);border-radius:6px;font-size:12px;cursor:pointer;background:white;color:var(--text-main);">
              Ver más <span id="hm-swipe-remaining"></span>
            </button>
          </div>
        </div>

      </div>
    `,

    'content-builder': `
      <div class="view-section active">
        <style>
          .cb-chip { padding:6px 12px; border:1px solid var(--border); border-radius:999px; background:white; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.15s; user-select:none; }
          .cb-chip:hover { border-color:#22C55E; }
          .cb-chip.active { background:#22C55E; color:white; border-color:#22C55E; }
          .cb-chip .chip-dot { display:inline-block; width:8px; height:8px; border-radius:50%; vertical-align:middle; margin-right:6px; }
          .cb-vertical-tag { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; background:#F0FDF4; color:#166534; border:1px solid #BBF7D0; border-radius:999px; font-size:12px; font-weight:600; }
          .cb-vertical-tag button { background:none; border:none; color:#166534; cursor:pointer; padding:0; font-size:14px; line-height:1; }

          /* Pipeline stepper */
          .cb-step { border:1px solid var(--border); border-radius:12px; background:white; margin-bottom:12px; overflow:hidden; transition:border-color 0.2s, box-shadow 0.2s; }
          .cb-step.done { border-color:#22C55E; box-shadow:0 0 0 1px rgba(34,197,94,0.08); }
          .cb-step.active { border-color:#0EA5E9; box-shadow:0 4px 14px rgba(14,165,233,0.12); }
          .cb-step-head { display:flex; align-items:center; gap:14px; padding:14px 16px; background:linear-gradient(180deg, #F8FAFC, white); }
          .cb-step.done .cb-step-head { background:linear-gradient(180deg, #F0FDF4, white); }
          .cb-step-num { width:32px; height:32px; border-radius:50%; background:#E2E8F0; color:#475569; font-weight:800; font-size:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s; }
          .cb-step.done .cb-step-num { background:#22C55E; color:white; }
          .cb-step.active .cb-step-num { background:#0EA5E9; color:white; }
          .cb-step-title { flex:1; min-width:0; }
          .cb-step-title strong { display:block; font-size:14px; font-weight:700; color:var(--text-main); }
          .cb-step-title .cb-step-sub { display:block; font-size:11px; color:var(--text-muted); margin-top:2px; }
          .cb-step-title .cb-step-sub code { background:#F1F5F9; padding:1px 6px; border-radius:4px; font-size:10.5px; color:#475569; }
          .cb-step-btn { padding:8px 14px; border:none; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:6px; }
          .cb-step-btn.s1 { background:#22C55E; color:white; }
          .cb-step-btn.s2 { background:#7C3AED; color:white; }
          .cb-step-btn.s3 { background:#0EA5E9; color:white; }
          .cb-step-btn:hover { filter:brightness(1.08); }
          .cb-step-btn:disabled { opacity:0.6; cursor:not-allowed; }
          .cb-step-body { padding:14px 16px 16px; border-top:1px solid var(--border); }
          .cb-step-body.empty { color:var(--text-muted); font-size:12px; font-style:italic; }
          .cb-context-pill { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; background:white; border:1px solid #F3E8FF; border-radius:999px; font-size:11px; font-weight:600; color:#6B21A8; }
          .cb-context-pill .lbl { color:#A78BFA; font-weight:500; margin-right:2px; }

          /* Channel tabs */
          .cb-tabs-row { display:flex; gap:0; border-bottom:2px solid var(--border); margin-bottom:16px; padding:0; }
          .cb-tab { flex:1; padding:14px 18px; background:white; border:none; border-top:1px solid var(--border); border-left:1px solid var(--border); border-right:1px solid var(--border); border-bottom:none; border-radius:10px 10px 0 0; font-size:13px; font-weight:700; color:var(--text-muted); cursor:pointer; display:flex; align-items:center; gap:8px; justify-content:center; transition:all 0.2s; margin-bottom:-2px; position:relative; }
          .cb-tab + .cb-tab { margin-left:6px; }
          .cb-tab:hover { color:var(--text-main); background:#FAFBFC; }
          .cb-tab.active { color:white; }
          .cb-tab .tab-emoji { font-size:16px; }
          .cb-tab .tab-sub { font-size:10px; font-weight:500; opacity:0.8; display:block; margin-top:2px; }
        </style>

        <div class="agent-header" style="background: linear-gradient(135deg, #22C55E 0%, #15803D 100%)">
          <div class="agent-bigicon">✍️</div>
          <div class="agent-header-text">
            <h2>ContentBuilder</h2>
            <p>End-to-end content engine — combines your brand voice, CompetitorsViews insights and HookMiner frameworks to produce publish-ready posts AND on-brand visual creatives in a single flow. Define verticals, pick channels, ship.</p>
          </div>
          <div class="agent-header-meta">
            <div class="agent-status"><span style="width:8px;height:8px;background:#34D399;border-radius:50%;display:inline-block"></span> Producing</div><br>
            <span class="agent-tag" id="cb-brand-tag">12 pieces/week · auto brand-compliance ON</span>
          </div>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i><span id="cb-last-batch">Last batch: Today, 09:50 AM</span></span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Uses: SocialMediaBios voice · CompetitorsViews insights · HookMiner frameworks</span>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">47</div><div class="agent-stat-lbl">Pieces Generated (30d)</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">89%</div><div class="agent-stat-lbl">First-Draft Approval Rate</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="cb-stat-assets">—</div><div class="agent-stat-lbl">Visual Assets (30d)</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">86 hrs</div><div class="agent-stat-lbl">Team Hours Saved (30d)</div></div>
        </div>

        <!-- ─── Verticales del cliente (productos / unidades de negocio) ─── -->
        <div class="card" style="margin-top:24px; border:1px solid #E9D5FF; background:linear-gradient(180deg,#FAF5FF 0%, white 70%);">
          <div style="display:flex; justify-content:space-between; align-items:start; gap:12px; flex-wrap:wrap; margin-bottom:10px;">
            <div>
              <h3 class="card-title" style="margin:0;"><i data-lucide="layers"></i> Verticales del cliente</h3>
              <p style="font-size:12px; color:var(--text-muted); margin:4px 0 0 0; max-width:680px;">
                Productos, unidades de negocio o campañas que el cliente quiere comunicar. El <strong>WebScrapper</strong> los detecta del website y los guarda en <code style="font-size:11px;background:#F1F5F9;padding:1px 6px;border-radius:4px;">brand_profiles.data_json.verticals</code>. Editalos abajo — ContentBuilder genera 1 post × <em>vertical × canal</em>.
              </p>
            </div>
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <button id="cb-sync-brand" onclick="syncFromBrandingBio()" title="Pull desde brand_profiles — sobreescribe la copia local con lo último guardado en Branding Bio" style="display:inline-flex; align-items:center; padding:6px 12px; background:#6366F1; color:white; border:none; border-radius:6px; font-size:11.5px; font-weight:700; cursor:pointer; white-space:nowrap;"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:5px"></i>Sync Branding Bio</button>
              <button id="cb-profile-verticals" onclick="profileBrandVerticals()" title="WF15 — Claude lee el website y escribe un perfil de contenido por vertical (audiencia, pain points, vocabulario, ángulos). Los agentes generadores lo consumen para producir contenido propio de cada vertical." style="display:inline-flex; align-items:center; padding:6px 12px; background:#7C3AED; color:white; border:none; border-radius:6px; font-size:11.5px; font-weight:700; cursor:pointer; white-space:nowrap;"><i data-lucide="sparkles" style="width:11px;vertical-align:middle;margin-right:5px"></i>Perfilar verticales</button>
              <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Vertical activa</label>
              <select id="cb-active-vertical" style="font-size:12px; padding:6px 10px; border:1px solid #E9D5FF; border-radius:6px; background:white; color:#4C1D95; font-weight:600;">
                <option value="__all__">Todas las verticales (mix)</option>
              </select>
            </div>
          </div>

          <div id="cb-brand-vertical-list" style="display:flex; flex-direction:column; gap:8px; min-height:32px; margin-bottom:14px;"></div>

          <div style="display:grid; grid-template-columns: 1fr 2fr auto; gap:8px; align-items:center;">
            <input id="cb-brand-vertical-name" type="text" placeholder="Nombre de la vertical (ej. Hamburguesas)" style="padding:8px 10px; border:1px solid var(--border); border-radius:6px; font-size:12px; outline:none; font-family:var(--font-main); background:white;" onkeydown="if(event.key==='Enter'){addBrandVertical();event.preventDefault()}" />
            <input id="cb-brand-vertical-desc" type="text" placeholder="Descripción corta — audiencia + valor (opcional)" style="padding:8px 10px; border:1px solid var(--border); border-radius:6px; font-size:12px; outline:none; font-family:var(--font-main); background:white;" onkeydown="if(event.key==='Enter'){addBrandVertical();event.preventDefault()}" />
            <button onclick="addBrandVertical()" style="padding:8px 14px; background:#7C3AED; color:white; border:none; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:6px;"><i data-lucide="plus" style="width:12px"></i> Add vertical</button>
          </div>
          <p style="margin:10px 0 0 0; font-size:10.5px; color:var(--text-muted);">
            <i data-lucide="info" style="width:10px;vertical-align:middle;margin-right:3px"></i>
            Las verticales viajan en el payload a <code style="font-size:10px;background:#F1F5F9;padding:1px 5px;border-radius:3px;">wf07-content-builder</code> y <code style="font-size:10px;background:#F1F5F9;padding:1px 5px;border-radius:3px;">wf09-creative-brain</code> para que el copy y el visual sean específicos del producto seleccionado.
          </p>
        </div>

        <!-- Competitor Insights from Social Media App -->
        <div class="card" style="margin-top:24px; border:1px solid rgba(249,115,22,0.25); background:linear-gradient(180deg,white,#FFF7ED);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="video"></i> Hooks de Competidores — inspiración de videos virales analizados</h3>
            <span onclick="switchView('hook-miner')" style="font-size:12px;color:#F97316;cursor:pointer;white-space:nowrap;">Ver todos en HookMiner →</span>
          </div>
          <div id="cb-competitor-insights-body" style="display:flex; flex-direction:column; gap:10px;">
            <div style="text-align:center;color:var(--text-muted);padding:16px;">Cargando…</div>
          </div>
        </div>

        <!-- ─────────────────────────────────────────── -->
        <!-- Generation Pipeline — 3 sequential n8n steps -->
        <!-- The pipeline card lives in this HIDDEN anchor until the user expands
             a vertical above. On expand, JS moves the DOM into that vertical's
             slot. On collapse, it comes back here (still hidden). -->
        <!-- ─────────────────────────────────────────── -->
        <div id="cb-pipeline-anchor" style="display:none;">
        <div id="cb-pipeline-card" class="card" style="border:1px solid rgba(34,197,94,0.25); background:linear-gradient(180deg,#FAFFF7 0%,#FFFFFF 80%);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:10px; flex-wrap:wrap;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="git-branch"></i> Pipeline de generación — <span id="cb-pipeline-channel" style="color:#0A66C2">💼 LinkedIn</span></h3>
            <select id="cb-persona" style="font-size:12px; padding:6px 10px; border:1px solid var(--border); border-radius:6px;">
              <option value="VP Engineering" selected>VP Engineering</option>
              <option value="CTO">CTO</option>
              <option value="Head of Sales">Head of Sales</option>
              <option value="Founder B2B">Founder B2B</option>
              <option value="RevOps Lead">RevOps Lead</option>
            </select>
          </div>

          <!-- Hidden legacy select kept in sync with the active tab so existing handlers still read cb-channel -->
          <select id="cb-channel" style="display:none;">
            <option value="LinkedIn" selected>LinkedIn</option>
            <option value="Facebook">Facebook</option>
            <option value="TikTok">TikTok</option>
          </select>

          <!-- 3 channel tabs -->
          <div class="cb-tabs-row">
            <button class="cb-tab active" data-channel="Instagram" onclick="setContentBuilderTab('Instagram')">
              <span class="tab-emoji">📷</span>
              <span>Instagram<span class="tab-sub">reel 9:16 + carrusel</span></span>
            </button>
            <button class="cb-tab" data-channel="TikTok" onclick="setContentBuilderTab('TikTok')">
              <span class="tab-emoji">🎵</span>
              <span>TikTok<span class="tab-sub">reel cover 9:16 + hook 0.8s</span></span>
            </button>
            <button class="cb-tab" data-channel="LinkedIn" onclick="setContentBuilderTab('LinkedIn')">
              <span class="tab-emoji">💼</span>
              <span>LinkedIn<span class="tab-sub">post B2B + carrusel</span></span>
            </button>
          </div>

          <!-- Per-channel language picker — overrides brand-wide language for this channel -->
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:10px; padding:10px 14px; background:#FAFBFC; border:1px solid var(--border); border-radius:8px; margin-bottom:12px; font-size:12px;">
            <span style="color:var(--text-muted);"><i data-lucide="languages" style="width:13px;vertical-align:middle;margin-right:4px"></i>Idioma para <strong id="cb-lang-channel-name" style="color:var(--text-main);">este canal</strong>:</span>
            <select id="cb-channel-language" onchange="setChannelLanguage(contentBuilderActiveTab, this.value)" style="padding:5px 8px; border:1px solid var(--border); border-radius:6px; font-size:12px; font-family:var(--font-main); cursor:pointer; background:white;">
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="fr">Français</option>
              <option value="it">Italiano</option>
              <option value="de">Deutsch</option>
            </select>
            <span style="color:var(--text-muted); font-size:10.5px;">— guardá Branding Bio para persistir</span>
          </div>

          <!-- Per-channel Apify availability banner (LinkedIn shows warning) -->
          <div id="cb-apify-banner" style="display:none; padding:10px 14px; background:#FFFBEB; border:1px solid #FDE68A; border-radius:8px; margin-bottom:12px; font-size:12px; color:#92400E;"></div>

          <p style="font-size:12px; color:var(--text-muted); margin:0 0 14px 0;">
            3 pasos secuenciales conectados a n8n. Cada paso es un webhook independiente. El brief, el copy y el visual cambian según el canal — el agente lee el análisis de <strong>SocialMediaBios</strong> almacenado en Supabase para producir contenido que matchea el perfil real.
          </p>

          <!-- ─── 3 agentes secuenciales (WF12 con mode= brief/caption/visual) ───
               1. Brief: lee Branding Bio + SMB + HookMiner + CompetitorsViews y
                  produce el brief estructurado.
               2. Texto: toma el brief + las publicaciones top de la marca + los
                  hooks ganadores y escribe el caption.
               3. Visual: toma el brief + paleta + tipografía y escribe los
                  visual prompts (cita hex codes literales).
               Cada paso tiene su propio botón. Caption y Visual quedan
               deshabilitados hasta que el Brief exista. -->

          <!-- AGENTE 1 · BRIEF -->
          <div class="cb-step" id="cb-step-brief" style="border:1px solid #E9D5FF; background:linear-gradient(180deg,#FAF5FF 0%,white 70%);">
            <div class="cb-step-head">
              <span class="cb-step-num" style="background:#7C3AED">1</span>
              <div class="cb-step-title">
                <strong>Agente 1 · Brief — qué se va a publicar y por qué</strong>
                <span class="cb-step-sub">Lee <strong>Branding Bio</strong> (paleta + tipografía), <strong>SocialMediaBios</strong> (voz + top posts), <strong>HookMiner</strong> (hooks ganadores) y <strong>CompetitorsViews</strong> (estructuras virales) → produce objetivo, ángulo, tono, paleta, hooks a usar y qué evitar.</span>
              </div>
              <button id="btn-brief-generate" class="cb-step-btn" style="background:#7C3AED;color:white;" onclick="handleGenerateBrief()">
                <i data-lucide="sparkles" style="width:12px"></i> Armar brief
              </button>
            </div>
            <div class="cb-step-body">
              <details id="cb-composed-prompt-wrap" style="margin-bottom:14px; border:1px solid var(--border); border-radius:8px; background:#FAFBFC;">
                <summary style="padding:10px 14px; cursor:pointer; font-size:12px; font-weight:700; color:#6B21A8; user-select:none;">
                  <i data-lucide="file-code" style="width:11px;vertical-align:middle;margin-right:5px"></i>Ver el contexto que el agente leyó (<span id="cb-composed-prompt-counts" style="color:var(--text-muted);font-weight:400;">aún no generado</span>)
                </summary>
                <pre id="cb-composed-prompt" style="margin:0; padding:14px; font-size:11px; line-height:1.5; color:#1F2937; white-space:pre-wrap; word-break:break-word; max-height:420px; overflow-y:auto; background:#FAFBFC; border-top:1px solid var(--border);">— Sin generar todavía. Click en "Armar brief" para ver qué fuentes leyó el agente.</pre>
              </details>
              <div id="cb-brief-body" style="min-height:140px; padding:16px; border:1px dashed #DDD6FE; border-radius:8px; background:#FAFBFC; color:var(--text-muted); font-size:12px; font-style:italic; text-align:center; display:flex; align-items:center; justify-content:center;">
                Sin brief todavía. El agente lee tus 4 fuentes y produce objetivo, ángulo, tono, paleta y hooks recomendados.
              </div>
            </div>
          </div>

          <!-- AGENTE 2 · TEXTO -->
          <div class="cb-step" id="cb-step-caption" style="margin-top:14px; border:1px solid #BBF7D0; background:linear-gradient(180deg,#F0FDF4 0%,white 70%);">
            <div class="cb-step-head">
              <span class="cb-step-num" style="background:#10B981">2</span>
              <div class="cb-step-title">
                <strong>Agente 2 · Texto del post — anclado al brief</strong>
                <span class="cb-step-sub">Toma el brief de arriba + las publicaciones top de la marca + los hooks ganadores → escribe el caption respetando voz, ALWAYS / NEVER y formato del canal.</span>
              </div>
              <button id="btn-caption-generate" class="cb-step-btn" style="background:#10B981;color:white;opacity:0.55;" onclick="handleGenerateCaption()" disabled title="Armá el brief primero.">
                <i data-lucide="type" style="width:12px"></i> Generar texto del post
              </button>
            </div>
            <div class="cb-step-body">
              <div style="padding:14px; border:1px solid var(--border); border-radius:8px; background:white;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <strong style="font-size:12px; color:#1F2937;"><i data-lucide="type" style="width:12px;vertical-align:middle;margin-right:4px;color:#10B981"></i>Caption</strong>
                  <span id="cb-tag-channel" class="lm-tag" style="background:linear-gradient(135deg,#833AB4,#FD1D1D 60%,#FCB045);color:white;font-weight:700;font-size:10px;">Instagram</span>
                </div>
                <p id="cb-post-body" style="font-size:13px; line-height:1.6; color:var(--text-main); white-space:pre-line; margin:0; min-height:120px;">Sin caption todavía. Armá el brief primero, después generá el texto.</p>
                <div id="cb-post-hashtags" style="margin-top:10px; line-height:1.8;"></div>
              </div>
            </div>
          </div>

          <!-- AGENTE 3 · VISUAL PROMPT -->
          <div class="cb-step" id="cb-step-visual" style="margin-top:14px; border:1px solid #BAE6FD; background:linear-gradient(180deg,#F0F9FF 0%,white 70%);">
            <div class="cb-step-head">
              <span class="cb-step-num" style="background:#0EA5E9">3</span>
              <div class="cb-step-title">
                <strong>Agente 3 · Visual prompt — anclado al brief</strong>
                <span class="cb-step-sub">Toma el brief + paleta exacta (hex) + tipografía → escribe el visual prompt (single o slide_prompts[] para carrusel) que después se manda a Gemini.</span>
              </div>
              <button id="btn-visual-generate" class="cb-step-btn" style="background:#0EA5E9;color:white;opacity:0.55;" onclick="handleGenerateVisual()" disabled title="Armá el brief primero.">
                <i data-lucide="image" style="width:12px"></i> Generar prompt visual
              </button>
            </div>
            <div class="cb-step-body">
              <div style="padding:14px; border:1px solid var(--border); border-radius:8px; background:white;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <strong style="font-size:12px; color:#1F2937;"><i data-lucide="image" style="width:12px;vertical-align:middle;margin-right:4px;color:#0EA5E9"></i>Visual prompt</strong>
                  <div style="display:flex; gap:8px; align-items:center;">
                    <span id="cb-visual-meta" style="font-size:10px;"></span>
                    <button id="btn-copy-visual" onclick="handleCopyVisualPrompt()" style="font-size:10px; padding:3px 8px; border:1px solid var(--border); border-radius:4px; background:white; cursor:pointer;"><i data-lucide="copy" style="width:10px"></i> copy</button>
                  </div>
                </div>
                <div id="cb-visual-prompt-output" style="font-size:13px; line-height:1.6; color:var(--text-main); white-space:pre-line; margin:0; min-height:120px;">Sin visual prompt todavía. Armá el brief primero, después generá el visual.</div>
              </div>
            </div>
          </div>

          <!-- Image Generation — WF13 takes the visual_prompt from WF12 and produces a real image via Gemini nanobanana -->
          <div class="cb-step" id="cb-step-image" style="border:1px solid #DDD6FE; background:linear-gradient(180deg,#FAF5FF 0%,white 70%); margin-top:14px;">
            <div class="cb-step-head">
              <span class="cb-step-num" style="background:#8B5CF6">🎨</span>
              <div class="cb-step-title">
                <strong>Imagen — generación real con Gemini nanobanana</strong>
                <span class="cb-step-sub">webhook <code>wf13-image-gen</code> · toma el <em>visual_prompt</em> de arriba y lo manda directo a Gemini 2.5 Flash Image (sin pasar por OpenAI)</span>
              </div>
              <button id="btn-generate-image-wf09" class="cb-step-btn" style="background:#8B5CF6;color:white;" onclick="handleGenerateImageFromUnified()" disabled title="Primero generá el contenido arriba para tener un visual prompt.">
                <i data-lucide="image" style="width:12px"></i> Generar imagen
              </button>
            </div>
            <div class="cb-step-body">
              <div id="cb-wf09-image-body" style="min-height:120px; display:flex; align-items:center; justify-content:center; padding:24px; border:1px dashed var(--border); border-radius:8px; background:#FAFBFC; color:var(--text-muted); font-size:12px; font-style:italic; text-align:center;">
                Generá el contenido arriba primero. Cuando esté listo, este botón se habilita y WF13 va a usar el visual prompt generado por el agente.
              </div>
              <div id="cb-wf09-image-meta" style="margin-top:10px; font-size:11px; color:var(--text-muted); display:none;"></div>
            </div>
          </div>

          <!-- Video generation step — WF16 Kling AI -->
          <div class="cb-step" id="cb-step-video" style="border:1px solid #FDE68A; background:linear-gradient(180deg,#FFFBEB 0%,white 70%); margin-top:14px;">
            <div class="cb-step-head">
              <span class="cb-step-num" style="background:#D97706">🎬</span>
              <div class="cb-step-title">
                <strong>Video — Kling AI via fal.ai</strong>
                <span class="cb-step-sub">webhook <code>wf16-video-gen</code> · aspect ratio auto según canal · tarda ~2–3 min · requiere FAL_API_KEY en n8n</span>
              </div>
              <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
                <span id="cb-video-ar-badge" style="font-size:11px;font-weight:700;background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:20px;white-space:nowrap;">—</span>
                <select id="cb-video-duration" style="font-size:11px;border:1px solid #FDE68A;border-radius:6px;padding:3px 6px;background:white;color:#92400E;cursor:pointer;">
                  <option value="5">5 seg</option>
                  <option value="10">10 seg</option>
                </select>
                <button id="btn-generate-video-wf16" class="cb-step-btn" style="background:#D97706;color:white;" onclick="handleGenerateVideo()" disabled title="Primero generá el contenido arriba para tener un visual prompt.">
                  <i data-lucide="video" style="width:12px"></i> Generar video
                </button>
              </div>
            </div>
            <div class="cb-step-body">
              <!-- Kling prompt preview (editable) — shown after visual agent runs -->
              <div id="cb-video-prompt-wrap" style="display:none; margin-bottom:10px;">
                <div style="font-size:11px; font-weight:700; color:#92400E; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px;">
                  <i data-lucide="film" style="width:11px;vertical-align:middle;margin-right:4px;"></i>Kling Prompt — GenHQ Framework · editable antes de generar
                </div>
                <textarea id="cb-video-prompt-text"
                  style="width:100%;box-sizing:border-box;min-height:90px;font-size:11px;line-height:1.6;padding:10px;border:1px solid #FDE68A;border-radius:8px;background:#FFFDF5;color:#78350F;resize:vertical;font-family:inherit;"
                  placeholder="El prompt para Kling aparece acá cuando el Agente 3 (visual) esté listo…"></textarea>
                <div style="font-size:10px;color:#B45309;margin-top:3px;">Medium · Shot · Angle · Movement · Focus · Subject · Lighting · Color · Audio — Kling 3.0 five-layer structure</div>
              </div>
              <div id="cb-video-body" style="min-height:140px; display:flex; align-items:center; justify-content:center; padding:24px; border:1px dashed #FDE68A; border-radius:8px; background:#FFFBEB; color:var(--text-muted); font-size:12px; font-style:italic; text-align:center;">
                Generá la imagen primero (paso anterior). Cuando tengás el visual prompt listo, este botón se habilita y WF16 genera el video con Kling AI.
              </div>
              <div id="cb-video-meta" style="margin-top:10px; font-size:11px; color:var(--text-muted); display:none;"></div>
            </div>
          </div>

          <!-- Decision row -->
          <div style="display:flex; gap:10px; padding-top:16px; margin-top:6px; border-top:1px dashed var(--border); align-items:center; flex-wrap:wrap;">
            <span style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-right:6px;">Decisión:</span>
            <button class="btn-sm btn-primary" id="btn-approve-queue" onclick="handleApproveQueue()"><i data-lucide="check" style="width:12px"></i> Approve & queue</button>
            <button class="btn-sm btn-ai" id="btn-publish" onclick="handlePublish()" style="background:#059669;color:white;border:none;"><i data-lucide="send" style="width:12px"></i> Publish</button>
            <button class="btn-sm" id="btn-discard-draft" onclick="handleDiscardDraft()" style="border:1px solid var(--border); margin-left:auto; color:#991B1B;"><i data-lucide="trash-2" style="width:12px"></i> Discard</button>
          </div>
        </div>
        </div><!-- /#cb-pipeline-anchor -->

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
              <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">vs SocialMediaBios voice rules</div>
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
            <span class="agent-tag" id="ap-brand-tag">— channels · next publish —</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:12px;">
          <div style="display:flex; gap:12px;">
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i><span id="ap-last-publish">Last publish: —</span></span>
            <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Source: ContentBuilder approved queue</span>
          </div>
          <button onclick="switchView('content-builder')" style="padding:8px 16px; background:#0EA5E9; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap;"><i data-lucide="send" style="width:13px;vertical-align:middle;margin-right:6px"></i>Publish Next Draft</button>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val" id="ap-stat-scheduled">—</div><div class="agent-stat-lbl">Scheduled (next 7d)</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="ap-stat-published">—</div><div class="agent-stat-lbl">Published this week</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981" id="ap-stat-engagement">—</div><div class="agent-stat-lbl">Avg engagement (published)</div></div>
          <div class="agent-stat"><div class="agent-stat-val" id="ap-stat-success">98.6%</div><div class="agent-stat-lbl">Publish success rate</div></div>
        </div>

        <!-- Week calendar -->
        <div class="card" style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-title" style="margin:0;"><i data-lucide="calendar"></i> Publishing Calendar — This Week</h3>
            <span id="ap-week-range" style="font-size:12px; padding:4px 10px; color:var(--text-muted);">—</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:8px;" id="ap-calendar">
            <div style="grid-column: 1 / -1; padding:24px; color:var(--text-muted); font-size:13px; text-align:center;">Loading…</div>
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
              <tbody id="ap-queue-tbody">
                <tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:20px;">Loading…</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Publish log -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="check-circle"></i> Recent Publish Log</h3>
          <table class="lm-table" style="margin-top:10px;">
            <thead><tr><th>Published</th><th>Channel</th><th>Piece</th><th>Reach</th><th>Engagement</th><th>Status</th></tr></thead>
            <tbody id="ap-log-tbody">
              <tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:20px;">Loading…</td></tr>
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

        <!-- Metricool Publishing -->
        <div class="card" style="margin-top:24px; border:2px solid #6366F1; background:#EEF2FF;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <h3 class="card-title" style="margin:0; color:#4F46E5;"><i data-lucide="send" style="color:#6366F1;"></i> Publish All with Metricool</h3>
              <p style="font-size:12px; color:var(--text-muted); margin:6px 0 0 0;">Send all approved & scheduled content to Metricool for unified cross-platform publishing (using SWL Consulting API key)</p>
            </div>
            <button onclick="publishAllWithMetricool()" style="padding:10px 20px; background:#6366F1; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; display:flex; gap:8px; align-items:center;"><i data-lucide="zap" style="width:14px;"></i>Publish Queue</button>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px; margin-top:12px;">
            <div style="padding:12px; background:white; border-radius:6px; border:1px solid #E5E7EB;">
              <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase; margin-bottom:4px;">Ready to Publish</div>
              <div style="font-size:20px; font-weight:700; color:#6366F1;" id="metricool-ready-count">—</div>
            </div>
            <div style="padding:12px; background:white; border-radius:6px; border:1px solid #E5E7EB;">
              <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase; margin-bottom:4px;">Channels</div>
              <div style="font-size:20px; font-weight:700; color:#6366F1;" id="metricool-channels-count">—</div>
            </div>
            <div style="padding:12px; background:white; border-radius:6px; border:1px solid #E5E7EB;">
              <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase; margin-bottom:4px;">Last Publish</div>
              <div style="font-size:12px; font-weight:600; color:#6366F1;" id="metricool-last-publish">—</div>
            </div>
          </div>

          <div style="margin-top:12px; padding:12px; background:white; border-radius:6px; border-left:3px solid #6366F1;">
            <div style="font-size:12px; color:var(--text-muted);"><strong>ℹ️ How it works:</strong> Click "Publish Queue" to send all approved & scheduled posts to Metricool. Posts will be distributed across connected channels using optimal timing and Metricool's engagement algorithms.</div>
          </div>

          <div id="metricool-status" style="margin-top:12px; display:none; padding:12px; background:#F0F9FF; border:1px solid #0EA5E9; border-radius:6px;">
            <div style="font-size:12px; color:#0369A1;"><i data-lucide="loader-2" style="width:12px; animation: spin 1s linear infinite; vertical-align:middle; margin-right:6px;"></i><span id="metricool-status-text">Publishing to Metricool...</span></div>
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
  // competitors-views charts are rendered inside hydrateCompetitorsView with real per-competitor data.

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
loadBrandKitFromSupabase().finally(() => switchView('dashboard'));


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
    ['social-media-bios','social media bios','social bios','social media','channel voice'],
    ['competitors-views','competitors views','competitorsviews','competitors','content engine'],
    ['hook-miner','hook miner','hooks'],
    ['content-builder','content builder','builder','creative brain','creative','visual creative'],
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


// ── Analyze PDF with Gemini API ──
async function analyzePdfWithGemini(pdfBase64, filename) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'x-goog-api-key': 'AIzaSyAxzPBo9l3JcreA2twy6Yb5sAFeu9krm-M',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{
          text: 'You are a brand analysis expert. Extract ONLY information that explicitly exists in the PDF. Return ONLY valid JSON with no markdown or extra text.'
        }]
      },
      contents: [{
        role: "user",
        parts: [
          {
            inline_data: {
              mime_type: "application/pdf",
              data: pdfBase64
            }
          },
          { text: "Analyze this brand document and extract all information." }
        ]
      }]
    })
  });

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

  const result = await response.json();
  const text = result.content?.parts?.[0]?.text || '';

  console.log('[Gemini response]', text.slice(0, 500));

  // Try to extract JSON (may be wrapped in markdown)
  let jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch) jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error('[Gemini] No JSON found. Full response:', text);
    throw new Error('No JSON found in Gemini response');
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(jsonStr);
}

// ── Social OAuth Modal ──
function showSocialAuthModal() {
  const modal = document.createElement('div');
  modal.id = 'social-auth-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 32px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  `;

  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="font-size: 24px; font-weight: 700; color: #0A0A0A; margin: 0 0 8px 0;">Conecta tus redes sociales</h2>
      <p style="color: #888880; font-size: 14px; margin: 0;">Autoriza el acceso para obtener estadísticas y trackear tu presencia</p>
    </div>

    <div style="display: grid; gap: 12px; margin-bottom: 24px;">
      <button onclick="startMetaOAuth('instagram')" style="
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 14px 16px;
        background: #E4405F;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
      ">
        <span style="font-size: 20px;">📷</span> Conectar Instagram
      </button>

      <button onclick="startMetaOAuth('facebook')" style="
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 14px 16px;
        background: #1877F2;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
      ">
        <span style="font-size: 20px;">f</span> Conectar Facebook
      </button>

      <button onclick="closeSocialAuthModal()" style="
        width: 100%;
        padding: 14px 16px;
        background: #E8E6E0;
        color: #0A0A0A;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
      ">
        Cerrar
      </button>
    </div>

    <p style="font-size: 12px; color: #888880; text-align: center; margin: 0;">
      Tus credenciales están seguras. Solo usamos datos públicos de tus redes.
    </p>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
}

function closeSocialAuthModal() {
  const modal = document.getElementById('social-auth-modal');
  if (modal) modal.remove();
}

function startMetaOAuth(platform) {
  const appId = '1323180832719303';
  const redirectUri = window.location.hostname === 'localhost'
    ? 'http://localhost:8000/auth/instagram/callback'
    : 'https://app-de-agentes.vercel.app/auth/instagram/callback';

  const scope = platform === 'instagram'
    ? 'instagram_basic,instagram_graph_user_profile,pages_read_engagement,pages_manage_metadata'
    : 'pages_manage_posts,pages_read_engagement,pages_manage_metadata';

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${platform}`;

  window.location.href = authUrl;
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
