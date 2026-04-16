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
    'brandvoice-optimizer': { name: 'BrandVoice Optimizer', sub: 'Marketing Pilot · Codifies your brand voice into reusable rules the rest of the agents follow' },
    'content-engine':      { name: 'ContentEngine', sub: 'Marketing Pilot · Analyzes top-performing content in your industry and surfaces what actually gets engagement' },
    'hook-miner':          { name: 'HookMiner', sub: 'Marketing Pilot · Extracts the hooks and opening frameworks that drive the most engagement, ranked by channel' },
    'content-builder':     { name: 'ContentBuilder', sub: 'Marketing Pilot · Generates publish-ready posts, emails and copies calibrated to your voice and audience' },
    'creative-brain':      { name: 'CreativeBrain', sub: 'Marketing Pilot · Renders multi-format creatives (banners, templates, ad variants) on-brand at scale' },
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
  } else if (['price-intelligence','launch-tracker','sentiment-analyzer','demand-intelligence','supply-chain-ci'].includes(viewId)) {
    setTimeout(() => renderCICharts(viewId), 50);
  } else if (viewId === 'analytics') {
    setTimeout(() => renderAnalyticsCharts(), 50);
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
    //  Autonomous content engine: brand voice → insights → hooks → content → creatives
    // ═══════════════════════════════════════════════════

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
            <span class="agent-tag">Brand: Acme Corp</span>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last calibration: Today, 08:12 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Sources: 42 sample posts · 6 landing pages · brand deck</span>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">28</div><div class="agent-stat-lbl">Voice Rules Coded</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">96%</div><div class="agent-stat-lbl">Brand Consistency Score</div></div>
          <div class="agent-stat"><div class="agent-stat-val">42</div><div class="agent-stat-lbl">Sample Pieces Analyzed</div></div>
          <div class="agent-stat"><div class="agent-stat-val">5</div><div class="agent-stat-lbl">Tone Dimensions</div></div>
        </div>

        <!-- Brand Profile -->
        <div class="kpi-grid" style="grid-template-columns:2fr 1fr; margin-top:24px;">
          <div class="card">
            <h3 class="card-title"><i data-lucide="sparkles"></i> Brand Profile — Acme Corp</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:14px;">
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Industry</div>
                <div style="font-size:14px; font-weight:600;">Enterprise SaaS · B2B</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Target Audience</div>
                <div style="font-size:14px; font-weight:600;">VPs of Engineering · CTOs · Tech Leaders</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Primary Channels</div>
                <div style="display:flex; gap:4px; margin-top:4px;"><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Email</span><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">YouTube</span></div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Core Values</div>
                <div style="font-size:14px; font-weight:600;">Craft · Reliability · Developer-first</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Palette</div>
                <div style="display:flex; gap:6px; margin-top:6px;">
                  <span style="width:28px;height:28px;background:#6366F1;border-radius:6px;display:inline-block;border:1px solid #E5E7EB"></span>
                  <span style="width:28px;height:28px;background:#0F172A;border-radius:6px;display:inline-block;border:1px solid #E5E7EB"></span>
                  <span style="width:28px;height:28px;background:#F59E0B;border-radius:6px;display:inline-block;border:1px solid #E5E7EB"></span>
                  <span style="width:28px;height:28px;background:#F8FAFC;border-radius:6px;display:inline-block;border:1px solid #E5E7EB"></span>
                </div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Production Goal</div>
                <div style="font-size:14px; font-weight:600;">12 pieces / week</div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title"><i data-lucide="sliders"></i> Tone Dimensions</h3>
            <div style="margin-top:16px;">
              ${['Formal ↔ Casual|72', 'Technical ↔ Accessible|65', 'Serious ↔ Playful|40', 'Humble ↔ Bold|68', 'Short ↔ Expansive|55'].map(t => {
                const [label, val] = t.split('|');
                return `<div style="margin-bottom:14px;">
                  <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;"><span>${label}</span><span style="color:var(--ai-accent); font-weight:600;">${val}%</span></div>
                  <div style="height:6px; background:#F3F4F6; border-radius:3px; overflow:hidden;"><div style="height:100%; width:${val}%; background:linear-gradient(90deg, #EC4899, #BE185D);"></div></div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Voice Rules -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="check-circle-2"></i> Voice Rules (28 coded — excerpt)</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px;">
            <div style="padding:12px; border-left:3px solid #10B981; background:#F0FDF4; border-radius:4px;"><strong style="font-size:13px;">Always:</strong><ul style="font-size:12px; margin-top:6px; padding-left:16px; color:#065F46;"><li>Reference concrete customer outcomes (not features)</li><li>Use active voice in openers</li><li>End posts with a specific CTA, not a generic one</li><li>Name the persona you're writing to</li></ul></div>
            <div style="padding:12px; border-left:3px solid #EF4444; background:#FEF2F8; border-radius:4px;"><strong style="font-size:13px;">Never:</strong><ul style="font-size:12px; margin-top:6px; padding-left:16px; color:#991B1B;"><li>Use marketing jargon ("synergy", "leverage", "disruption")</li><li>Open with "In today's fast-paced world…"</li><li>Use more than 2 adjectives in a row</li><li>Reference the customer's competitors by name</li></ul></div>
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
            <span class="agent-tag">Enterprise SaaS · 142 pieces analyzed</span>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last sync: Today, 09:40 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Sources: LinkedIn, Substack, Medium, YouTube, X/Twitter</span>
        </div>

        <div class="agent-stats">
          <div class="agent-stat"><div class="agent-stat-val">142</div><div class="agent-stat-lbl">Top Pieces Analyzed (30d)</div></div>
          <div class="agent-stat"><div class="agent-stat-val">7</div><div class="agent-stat-lbl">Formats Identified</div></div>
          <div class="agent-stat"><div class="agent-stat-val" style="color:#10B981">+4.2x</div><div class="agent-stat-lbl">Avg Engagement vs Baseline</div></div>
          <div class="agent-stat"><div class="agent-stat-val">12</div><div class="agent-stat-lbl">Content Gaps Surfaced</div></div>
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
          <h3 class="card-title"><i data-lucide="flame"></i> Top-Performing Pieces — Enterprise SaaS (last 30 days)</h3>
          <table class="lm-table" style="margin-top:14px;">
            <thead><tr><th>Piece</th><th>Author / Brand</th><th>Format</th><th>Engagement</th><th>Why it worked</th></tr></thead>
            <tbody>
              <tr><td><strong>"We killed 40% of our features — here's what happened"</strong></td><td>Linear · Karri Saarinen</td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td><strong style="color:#10B981">18.4K</strong></td><td style="font-size:12px; color:var(--text-muted)">Contrarian hook · specific number · founder POV</td></tr>
              <tr><td><strong>"Stop building dashboards nobody looks at"</strong></td><td>Amplitude Blog</td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span></td><td><strong style="color:#10B981">12.1K</strong></td><td style="font-size:12px; color:var(--text-muted)">Imperative headline · real anti-pattern · actionable</td></tr>
              <tr><td><strong>"The 5-minute daily standup we replaced with one Slack thread"</strong></td><td>Notion Team</td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span></td><td><strong style="color:#10B981">9.8K</strong></td><td style="font-size:12px; color:var(--text-muted)">Specific process · time-to-value in headline</td></tr>
              <tr><td><strong>"How we debugged a 2ms latency spike — full post-mortem"</strong></td><td>Vercel Engineering</td><td><span class="lm-tag" style="background:#FEE2E2;color:#991B1B">YouTube</span></td><td><strong style="color:#10B981">7.2K</strong></td><td style="font-size:12px; color:var(--text-muted)">Technical depth · post-mortem format · visual</td></tr>
              <tr><td><strong>"3 onboarding emails that tripled our activation rate"</strong></td><td>Intercom Blog</td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Email</span></td><td><strong style="color:#10B981">6.5K</strong></td><td style="font-size:12px; color:var(--text-muted)">List format · measurable outcome · vertical-specific</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Content gaps -->
        <div class="card" style="margin-top:24px;">
          <h3 class="card-title"><i data-lucide="zap"></i> Content Gaps — Themes your audience engages with but you haven't covered</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-top:14px;">
            <div style="padding:12px; border-left:3px solid #F97316; background:#FFF7ED; border-radius:4px;"><strong style="font-size:13px;">Engineering post-mortems</strong><p style="font-size:12px; color:var(--text-muted); margin-top:4px;">18 top pieces in the last 30d. You've published 0. High affinity with your VP Engineering persona.</p></div>
            <div style="padding:12px; border-left:3px solid #F97316; background:#FFF7ED; border-radius:4px;"><strong style="font-size:13px;">Hiring & team-scaling</strong><p style="font-size:12px; color:var(--text-muted); margin-top:4px;">14 top pieces. 2x avg engagement. Natural fit for your "Craft" value.</p></div>
            <div style="padding:12px; border-left:3px solid #F97316; background:#FFF7ED; border-radius:4px;"><strong style="font-size:13px;">Cost-to-debug narratives</strong><p style="font-size:12px; color:var(--text-muted); margin-top:4px;">11 top pieces. Direct overlap with your product outcome ("Ship faster. Debug less.").</p></div>
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

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last refresh: Today, 09:40 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Derived from ContentEngine's top-142 corpus</span>
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

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last batch: Today, 09:50 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Uses: BrandVoice rules · ContentEngine insights · HookMiner frameworks</span>
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
                <span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span>
                <span class="lm-tag" style="background:#FEE2E2;color:#991B1B">Contrarian hook</span>
                <span class="lm-tag" style="background:#F0FDF4;color:#166534">Hook score 96</span>
              </div>
              <span style="font-size:11px; color:var(--text-muted);">Generated 3 min ago · Draft</span>
            </div>
            <p style="font-size:15px; line-height:1.7; color:var(--text-main); white-space:pre-line;">We killed 40% of our dashboards last quarter.

Nobody complained.

Turns out: most "essential" dashboards get opened twice a month. The third-most-viewed dashboard at a 500-person engineering org we worked with? Last opened 94 days ago.

What we learned:

1/ Dashboards multiply because adding one is free. Removing one requires a meeting.

2/ Most teams don't need "data visibility" — they need a monthly one-pager with 3 numbers.

3/ The dashboards that stuck had an owner, a cadence, and a decision tied to them.

If you're a VP of Engineering drowning in Looker tabs, start with a 30-day audit: kill anything nobody opened.

Ship faster. Debug less.</p>
            <div style="display:flex; gap:10px; margin-top:16px; padding-top:16px; border-top:1px solid var(--border);">
              <button class="btn-sm btn-primary"><i data-lucide="send" style="width:12px"></i> Approve & queue</button>
              <button class="btn-sm btn-ai"><i data-lucide="refresh-cw" style="width:12px"></i> Regenerate</button>
              <button class="btn-sm" style="border:1px solid var(--border);"><i data-lucide="edit-3" style="width:12px"></i> Edit</button>
              <button class="btn-sm" style="border:1px solid var(--border); margin-left:auto; color:#991B1B;"><i data-lucide="trash-2" style="width:12px"></i> Discard</button>
            </div>
          </div>
        </div>

        <!-- Content queue + channel split -->
        <div class="kpi-grid" style="grid-template-columns: 2fr 1fr; margin-top:24px;">
          <div class="card">
            <h3 class="card-title"><i data-lucide="list"></i> Content Queue — awaiting approval</h3>
            <table class="lm-table" style="margin-top:14px;">
              <thead><tr><th>Title</th><th>Channel</th><th>Format</th><th>Hook Score</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td><strong>We killed 40% of our dashboards…</strong></td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td>Post</td><td><span style="color:#10B981;font-weight:600;">96</span></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Draft</span></td></tr>
                <tr><td><strong>Stop writing runbooks nobody reads</strong></td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span></td><td>Article · 800w</td><td><span style="color:#10B981;font-weight:600;">92</span></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Draft</span></td></tr>
                <tr><td><strong>The 3-line Slack message that replaced our standup</strong></td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td>Post</td><td><span style="color:#10B981;font-weight:600;">89</span></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Draft</span></td></tr>
                <tr><td><strong>How we cut our CI from 47 to 6 minutes</strong></td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span></td><td>Post-mortem · 1.2k</td><td><span style="color:#10B981;font-weight:600;">87</span></td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Approved</span></td></tr>
                <tr><td><strong>Onboarding email #2 — "Set up your first alert"</strong></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Email</span></td><td>Email · seq day 3</td><td><span style="color:#10B981;font-weight:600;">84</span></td><td><span class="lm-tag" style="background:#D1FAE5;color:#065F46">Approved</span></td></tr>
                <tr><td><strong>Every VP Eng has the same 3 complaints</strong></td><td><span class="lm-tag" style="background:#EFF6FF;color:#1D4ED8">LinkedIn</span></td><td>Post</td><td><span style="color:#10B981;font-weight:600;">85</span></td><td><span class="lm-tag" style="background:#FEF3C7;color:#B45309">Draft</span></td></tr>
                <tr><td><strong>Debug-cost calculator — lead magnet</strong></td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Blog</span></td><td>Interactive · 600w</td><td><span style="color:#10B981;font-weight:600;">80</span></td><td><span class="lm-tag" style="background:#F3F4F6;color:#374151">Research</span></td></tr>
              </tbody>
            </table>
          </div>
          <div class="card" style="height:360px; display:flex; flex-direction:column;">
            <h3 class="card-title">Channel Distribution</h3>
            <div style="flex:1; position:relative; width:100%; min-height:0;"><canvas id="mpChannelSplitChart"></canvas></div>
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

        <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:12px;">
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="refresh-cw" style="width:11px;vertical-align:middle;margin-right:4px"></i>Last batch: Today, 10:05 AM</span>
          <span style="font-size:11px; color:var(--text-muted);"><i data-lucide="database" style="width:11px;vertical-align:middle;margin-right:4px"></i>Brand guide: Acme Corp · v3.1</span>
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
