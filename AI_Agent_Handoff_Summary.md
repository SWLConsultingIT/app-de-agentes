# Handoff Document & Status Update for Claude Code

This document serves as a handoff summary for continuing development on the **AI Sales Growth Engine Demo (app-de-agentes)**.

## 📁 Repository Overview
- **Working Directory:** `C:\Users\DELL\Desktop\Automatizaciones\app-de-agentes`
- **Main Files Modified:**
  - `index.html`: Contains the new HTML structure for the Company Scanner, including Firmographics, What They Do, Key Differentiators, Recent Strategic Moves, ICP Match, and Key Decision Makers sections.
  - `app.js`: Contains all the application logic, the local cache database (`companyCacheDB`), frontend state management, and chatbot commands.

---

## 🚀 Recent Implementations (What was just done)

### 1. Hybrid Company Bio Scanner (Cache + Scraping)
We transformed the "Company Bio" feature into a dynamic scanner.
- **Local Cache (`companyCacheDB`):** The demo now includes 5 pre-loaded, highly detailed companies (SICIT Group, Valagro, Biolchim, ICL Group, COMPO EXPERT). These simulate real-time extraction and generate the UI instantly to avoid live scraping issues during the demo.
- **Web Scraper Fallback:** If a domain is searched that is *not* in the cache, `scanCompanyBio()` triggers a live HTTP request using a proxy fallback chain (CORS proxies like allorigins/corsproxy) to parse the target website's `<meta>` tags and `<p>` blocks.
- **Dynamic UI Generation:** We created `renderCompanyResults(data)` which populates `index.html` sections dynamically based on whatever data the cache or scraping pulls. Elements hide/show dynamically via `display` properties.

### 2. LeadMiner Integration via Chatbot
- **"Mostrame mis leads" command:** 
  In the `processCommand()` function, querying "empresas" or "leads" now intercepts the message and performs an automated data load:
  1. It iterates over the 5 companies in `companyCacheDB` and lists their executives in the chat window.
  2. It generates direct "View LinkedIn" buttons for leads mapping to `search/results/people`.
  3. **Data Injection:** It clears the mock `leadsData` array and populates it dynamically with the ~23 executives existing across the `companyCacheDB`. 
  4. It switches the app view to `leadminer`, completely populating the dashboard tables that feed the rest of the application (OutreachFlow, ICP Scorer, etc.).
- **Engage Buttons:** We added deep links from the chat to pre-fill the input with drafting prompts (`"Draft an email to..."`).

---

## 🛠️ Where to go from here (Next Steps for Claude Code)

1. **Persistent Database Integration (Supabase):** 
   Currently, everything runs entirely in client-side memory. If the page is refreshed, the live scraped data is lost. You should wire up `app.js` to send new scrapes to a backend/database (like the demo in the Next.js directory `SWL-GrowthEngine-Demo`).
   
2. **AI Enrichment Backend:**
   The fallback web scraper just extracts meta tags and crude paragraphs. To get the same detailed sections ("Key Differentiators", "Strategic Moves") for *new* companies, hook the `scanCompanyBio()` function up to an OpenAI API call on the backend, structured to return JSON.

3. **Message Sending Simulation:**
   Currently the chatbot drafts emails/LinkedIn messages, but the UI "Send" buttons don't have visual indicators or backend logic tied to them. Implement the UI state changes for Sent Messages in the Outreach tabs.

## 🔑 Key Variables to note in `app.js`:
- `companyCacheDB`: The JSON object holding the 5 cached companies.
- `leadsData`: The single source of truth array for the tables.
- `processCommand(text)`: The brain of the chatbot.
- `renderCompanyResults(data)`: The UI injection logic for the scanner.
