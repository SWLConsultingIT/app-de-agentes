# GrowthAI — Sales Booster Engine

> AI-powered sales automation demo platform built by **SWL Consulting IT**

---

## What is this?

A **single-page demo application** that showcases a full AI sales automation stack for B2B sales teams. Built as a client demo tool — no backend required, runs entirely in the browser.

The app simulates what a real AI-powered sales platform looks like in production: lead mining, ICP scoring, personalized outreach, multichannel sequencing, smart nurturing, competitive intelligence, and company scanning — all driven by mock AI agents and live data previews.

---

## Modules

### 🔍 Company Bio Scanner
- Scans any company website in real-time via a CORS proxy chain
- Falls back to a pre-loaded cache of 5 detailed company profiles (SICIT Group, Valagro, Biolchim, ICL Group, COMPO EXPERT)
- Extracts: firmographics, tech stack, social presence, key differentiators, strategic moves, ICP match score, and key decision makers

### 🚀 Sales Growth Engine (5 AI Agents)
| Agent | Description |
|-------|-------------|
| **LeadMiner™** | Prospecting engine — finds, enriches and tracks leads by ICP. Populated via the AI chatbot. |
| **ICP Scorer™** | Predictive lead prioritization — ranks leads by ICP score, closing probability and behavioral signals |
| **MessageTailor™** | Hyper-personalized outreach — generates email and LinkedIn messages adapted per lead, tone and channel |
| **OutreachFlow™** | Multichannel sequence engine — Email → LinkedIn → WhatsApp cadence, adapts in real-time |
| **Smart Nurture™** | Dormant lead reactivation — monitors intent signals and triggers re-engagement automatically |

### 📊 SICIT Competitive Intelligence
Sector-specific market intelligence modules built for SICIT Group:
- **Fertilizers & Biostimulants** — Competitor sentiment, biostimulant modalities, grower friction heatmaps, field intelligence feed
- **Plaster Retarders** *(in configuration)*
- **Biofuel Fats** *(in configuration)*

### 🤖 AI Chatbot Assistant
- Conversational interface for lead actions
- Commands: draft emails, write LinkedIn messages, search leads, open profiles, import company data
- Populates the entire LeadMiner database from the company cache on demand

### 📈 Analytics & Dashboard
- KPI overview: leads generated, active opportunities, predictive win rate, at-risk accounts
- Chart.js pipeline conversion charts
- AI recommendation feed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| **Charts** | Chart.js |
| **Icons** | Lucide (CDN) |
| **Fonts** | Outfit + Plus Jakarta Sans (Google Fonts) |
| **Data** | Client-side in-memory (no backend) |
| **Web Scraping** | CORS proxy chain (allorigins, corsproxy, codetabs) |

No framework. No build step. No dependencies to install.  
Open `index.html` and it runs.

---

## Project Structure

```
app-de-agentes/
├── index.html          # App shell — sidebar, topbar, chatbot FAB, slide-out panels
├── app.js              # All logic: state, data, views, chatbot, scanner (~3000 lines)
├── styles.css          # Full design system with CSS variables
├── CLAUDE.md           # AI assistant rules and available skills catalog
├── Skills n8n/         # 16 n8n workflow correction pipeline skills
├── Skills Odoo/        # 3 MCP configuration skills
└── skills/             # External skill libraries (superpowers, marketingskills, etc.)
```

---

## Key Data Structures

```javascript
// Single source of truth for all modules
leadsData[]             // Array of lead objects — feeds LeadMiner, ICP Scorer, MessageTailor, OutreachFlow, Smart Nurture

// Pre-loaded company intelligence cache
companyCacheDB{}        // 5 companies with full profiles: firmographics, leads, ICP match, strategic moves

// App state
state.currentView       // Active view ID
leadsRevealed           // Boolean — gates whether LeadMiner shows data or empty state
```

---

## How the Chatbot Works

The AI Assistant (bottom-right FAB) intercepts natural language commands:

| Command | Action |
|---------|--------|
| `"mostrame mis leads"` / `"empresas"` | Loads all 5 companies + 23 executives into LeadMiner |
| `"Draft an email for [Name]"` | Generates email, opens lead panel, fills fields |
| `"Draft a LinkedIn message for [Name]"` | Same for LinkedIn |
| `"Make the email shorter"` | Trims the active message |
| `"Show profile for [Name]"` | Opens lead slide-out panel |
| `"clear"` / `"reset"` | Clears all leads, returns to empty state |

---

## Pre-loaded Companies (Cache)

| Company | Industry | ICP Score |
|---------|----------|-----------|
| SICIT Group S.p.A. | Agrochemicals / Biostimulants | 94 |
| Valagro S.p.A. (Syngenta) | Biostimulants / Specialty Agriculture | 91 |
| Biolchim S.p.A. | Agrochemicals / Biostimulants | 86 |
| ICL Group Ltd. | Specialty Minerals / Fertilizers | 72 |
| COMPO EXPERT GmbH | Specialty Fertilizers | 79 |

---

## Running Locally

```bash
# No installation needed — just open the file
open index.html

# Or serve with any static server
npx serve .
python3 -m http.server 8080
```

---

## Development Notes

- All views are generated as template literal strings inside `generateViewHTML()` in `app.js`
- `lucide.createIcons()` must be called after inserting any new HTML that contains icon elements
- The `leadsData[]` array feeds ALL modules — changes propagate everywhere automatically
- To add a new view: add entry to `viewMeta{}`, add case to `generateViewHTML()`, add nav button in `index.html`

---

## Built by

**SWL Consulting IT** — AI automation and sales intelligence solutions  
[sales@swlconsulting.com](mailto:sales@swlconsulting.com)
