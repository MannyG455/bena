# Clearflow — Financial Intelligence PWA

Personal finance forecasting powered by AI. Runs as a PWA on iOS (and any browser).

---

## Deploy in ~10 minutes

### Step 1 — Prerequisites (one-time)
- Install [Node.js](https://nodejs.org) (v18+)
- Install [Git](https://git-scm.com)
- Free accounts at [GitHub](https://github.com) and [Vercel](https://vercel.com)
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Step 2 — Set up the project locally
```bash
# Install dependencies
cd clearflow
npm install
```

### Step 3 — Add placeholder icons
The app needs two icon files in `public/`:
- `public/icon-192.png`  (192×192px)
- `public/icon-512.png`  (512×512px)

You can use any square image resized to those dimensions.
Free option: https://favicon.io/favicon-generator/ — download and rename.

### Step 4 — Test locally (optional)
```bash
npm start
# Opens at http://localhost:3000
```

### Step 5 — Push to GitHub
```bash
git init
git add .
git commit -m "initial clearflow"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/clearflow.git
git push -u origin main
```

### Step 6 — Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework Preset: **Create React App**
4. Click **Deploy** — done in ~2 minutes
5. Vercel gives you a URL like `https://clearflow-abc123.vercel.app`

### Step 7 — Install on iPhone as PWA
1. Open your Vercel URL in **Safari** on iPhone
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add**

Clearflow now appears on your home screen like a native app.

---

## First Run
1. Open the app → enter your Anthropic API key (stored only on your device)
2. Export statements from your bank (PDF or CSV):
   - Chase: Accounts → Download Activity → PDF
   - BofA: Statements → Download
   - Most banks: look for "Export" or "Download" in statements
3. Upload checking, savings, and/or credit card files
4. Hit **Run Analysis**

---

## Architecture — Scalability Notes

The app is structured for future expansion:

### Adding Plaid (live bank connection)
- In `App.js`, see `DataAdapters` at the top
- Add a Plaid adapter: `{ name: "Plaid", fetchTransactions, fetchBalance, fetchAccounts }`
- Wire it to the UI toggle in the header
- The regression engine accepts the same transaction format regardless of source

### Adding a Brokerage / Investing platform
- Same pattern — implement an adapter for Robinhood, Fidelity, etc.
- Add investment account balance to the cash flow model
- The forecast engine can incorporate investment returns as an income stream

### Swapping the AI model
- `callClaude()` and `parseFileWithClaude()` in `App.js` are the only AI-touching functions
- Change the model string in one place to upgrade

---

## Cost Estimate
Each analysis session (parse + categorize + insight):
- ~3,000–6,000 input tokens + ~1,000 output tokens
- At Claude Sonnet pricing: **~$0.02–0.05 per analysis**
- Monthly (daily use): **~$0.60–1.50**

---

## Privacy
- Your API key is stored in `localStorage` on your device only
- Statement files are sent directly to Anthropic's API for parsing, never to any other server
- No data is stored between sessions beyond your API key
