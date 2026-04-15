# GrowthAI - App de Agentes | Project Instructions

## Project Overview
Single-page demo app (vanilla JS, no framework, no build step) for SWL Consulting.
Files: `app.js` (3024 lines, all logic + views as template literals), `index.html`, `styles.css`.
No build step — changes are immediately live in the browser.

All views live inside `generateViewHTML()` as template literal strings.
`leadsData[]` is the single source of truth for all modules.
`companyCacheDB{}` holds 5 pre-loaded company profiles (SICIT, Valagro, Biolchim, ICL, COMPO EXPERT).

---

## Available Skills — Use These Proactively

### 🔧 Development & Engineering (superpowers)
Located in: `skills/superpowers/skills/`

| Skill | When to use |
|-------|-------------|
| `brainstorming` | BEFORE any creative work — features, components, new views |
| `writing-plans` | Before any multi-step implementation task |
| `executing-plans` | When executing a written plan in a fresh session |
| `subagent-driven-development` | When implementing plans with independent parallel tasks |
| `dispatching-parallel-agents` | When 2+ independent tasks can run simultaneously |
| `systematic-debugging` | When encountering any bug or unexpected behavior |
| `test-driven-development` | Before writing implementation code |
| `verification-before-completion` | Before claiming work is done |
| `requesting-code-review` | After completing features or before merging |
| `receiving-code-review` | When handling code review feedback |
| `finishing-a-development-branch` | When implementation is complete |
| `using-git-worktrees` | For isolated feature work |
| `writing-skills` | When creating/modifying skills |

### 📢 Marketing & Sales (marketingskills)
Located in: `skills/marketingskills/skills/`

| Skill | When to use |
|-------|-------------|
| `cold-email` | Writing B2B cold emails, sequences, subject lines |
| `copywriting` | Homepage, landing pages, marketing copy |
| `sales-enablement` | Pitch decks, one-pagers, objection handling, demo scripts |
| `customer-research` | ICP research, review mining, customer interviews |
| `revops` | Lead scoring, routing, MQL/SQL lifecycle, CRM automation |
| `competitor-alternatives` | Competitor comparison pages, battle cards |
| `pricing-strategy` | Pricing tiers, packaging, freemium decisions |
| `content-strategy` | Blog strategy, topic clusters, editorial calendar |
| `email-sequence` | Drip campaigns, onboarding sequences |
| `social-content` | LinkedIn, Twitter/X, Instagram content |
| `lead-magnets` | Lead magnet creation (guides, templates, tools) |
| `ad-creative` | Ad copy for Google, Meta, LinkedIn |
| `paid-ads` | Paid media strategy and setup |
| `page-cro` | Landing page conversion optimization |
| `seo-audit` | SEO technical audits |
| `churn-prevention` | Retention and cancellation flow optimization |
| `product-marketing-context` | Set up shared product context across all marketing skills |

### 🔍 Research & Intelligence (awesome-claude-skills)
Located in: `skills/awesome-claude-skills/`

| Skill | When to use |
|-------|-------------|
| `lead-research-assistant` | Finding and qualifying leads, building ICP-matched lists |
| `competitive-ads-extractor` | Extracting competitor advertising intelligence |
| `content-research-writer` | Research + write content pieces |
| `developer-growth-analysis` | Analyze developer community growth metrics |
| `meeting-insights-analyzer` | Analyze meeting transcripts for insights |
| `changelog-generator` | Generate changelogs from git history |
| `twitter-algorithm-optimizer` | Optimize Twitter/X content for reach |
| `webapp-testing` | Test web app UI with Playwright |
| `file-organizer` | Organize and structure files |
| `invoice-organizer` | Organize invoices and financial docs |
| `tailored-resume-generator` | Generate tailored resumes |
| `domain-name-brainstormer` | Brainstorm domain names |
| `skill-creator` | Create new skills with evals |

### 📄 Document Generation (anthropics/skills + awesome-claude-skills)
Located in: `skills/skills/` and `skills/awesome-claude-skills/document-skills/`

| Skill | When to use |
|-------|-------------|
| `pptx` | PowerPoint presentations with visual QA |
| `pdf` | PDF reading, merging, creating, OCR |
| `xlsx` | Excel spreadsheets with financial-grade formulas |
| `docx` | Word documents |
| `frontend-design` | Production-grade web UI design |
| `canvas-design` | Museum-quality static art (PDF/PNG) |
| `theme-factory` | Apply professional themes to artifacts |
| `brand-guidelines` | Anthropic brand colors/typography |

### 🤖 Claude API & MCP (anthropics/skills + Skills Odoo)
Located in: `skills/skills/` and `Skills Odoo/`

| Skill | When to use |
|-------|-------------|
| `claude-api` | Building/debugging Anthropic SDK apps |
| `mcp-builder` | Creating MCP servers (TypeScript/Python) |
| `mcp-configuration` | Setting up and managing MCP servers |
| `mcp-troubleshooting` | Debugging MCP config issues (ghost configs) |
| `mcp-integration` | Integrating MCP into Claude Code plugins |

### 🔄 n8n Workflow Correction Pipeline
Located in: `Skills n8n/`

Full correction flow (in order):
1. `find-error-conversations` → Search CRM for bad conversations
2. `review-conversation` → Analyze erroneous conversation
3. `ingest-case` → Create formal case from failed conversations
4. `analyze-case` → Compare failed vs ideal, find root cause
5. `audit-workflow` → Deep audit of responsible workflow
6. `modify-workflow` → Apply changes with backup
7. `test-sandbox-agent` → Test in sandbox via webhook
8. `validate-fix` → Automated validation
9. `test-workflow` → Isolated test copy
10. `generate-case-report` → Executive report for client
11. `deploy-to-production` → Deploy with client approval

Supporting: `changelog-workflow`, `add-tracelog`, `validate-lead-scoring`, `generate-workflow-docs`, `deploy-workflow`

### 📐 Context Engineering (context-engineering-intro)
Located in: `skills/context-engineering-intro/`

Use the PRP workflow for complex feature implementations:
1. Write feature request in `INITIAL.md`
2. `/generate-prp INITIAL.md` → creates comprehensive blueprint in `PRPs/`
3. `/execute-prp PRPs/feature-name.md` → implements with validation

---

## MCPs Available (connected)
- **ZoomInfo** — Company/contact research, enrichment, intent signals, similar company finder
- **Airtable** — Base/table/record management
- **Notion** — Pages, databases, comments

---

## Key Rules
- No build step — edit `app.js`/`styles.css`/`index.html` directly
- All views are template literals inside `generateViewHTML()` in `app.js`
- `leadsData[]` feeds ALL modules — changes there propagate everywhere
- `lucide.createIcons()` must be called after inserting new HTML with icons
- Client: SICIT Group (agrochemicals/biostimulants, Italy) — primary demo target
- ZoomInfo MCP is available for real lead enrichment when needed
