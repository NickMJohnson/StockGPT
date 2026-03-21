# StockGPT

> AI-powered financial analysis from real SEC filings — search any public company, get instant statements, ratios, charts, and an AI analyst you can chat with.

**Live Demo:** [stock-gpt-five.vercel.app](https://stock-gpt-five.vercel.app)

---

![StockGPT Demo](https://your-gif-placeholder.gif)

---

## What it does

Enter any stock ticker and select a filing (10-K annual or 10-Q quarterly). StockGPT pulls the real SEC filing, extracts structured financial data, and gives you:

- **Income Statement, Balance Sheet, Cash Flow** — pulled from SEC EDGAR, displayed as clean tables with multi-year columns
- **12+ Financial Ratios** — margins, liquidity, leverage, returns, and growth rates computed automatically
- **Trend Charts** — interactive area charts for revenue, free cash flow, and net margin over time
- **AI Summary** — Claude writes a concise analyst-style summary of the filing's key highlights and risks
- **Chat** — ask the AI anything about the filing: *"Why did margins compress?"*, *"Is this company overleveraged?"*, *"How does cash flow compare to net income?"*

All data is live from the SEC — not scraped, not mocked.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, shadcn/ui, Tailwind CSS, Recharts |
| Backend | Python, FastAPI, Pydantic |
| Data | SEC EDGAR companyfacts API (XBRL) |
| AI | Anthropic Claude API (`claude-opus-4-6`) |

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Clone the repo
```bash
git clone https://github.com/NickMJohnson/StockGPT.git
cd StockGPT
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and fill in:
```
ANTHROPIC_API_KEY=your_key_here
SEC_USER_AGENT=YourAppName your_email@example.com
```

> The SEC requires a descriptive User-Agent for all API requests. Any name and real email works.

### 3. Install and run the backend
```bash
cd backend
pip install -r requirements.txt

# Run from the project root
cd ..
uvicorn backend.src.main:app --reload --port 8000
```

### 4. Install and run the frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Usage

1. Enter a ticker symbol (e.g. `AAPL`, `TSLA`, `MSFT`)
2. Select a filing from the list — 10-K for annual, 10-Q for quarterly
3. Click **Analyze Filing**
4. Browse the statements, ratios, and charts
5. Ask the chatbot questions about the filing in the panel on the right

> The first load for a ticker takes ~5–10 seconds while data is fetched from SEC EDGAR. Subsequent loads are instant (cached for 1 hour).

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/filings?ticker=AAPL` | List recent 10-K and 10-Q filings |
| `GET` | `/api/financials?ticker=AAPL&form=10-K` | Full financial data for a filing |
| `POST` | `/api/chat` | `{ question, ticker, form }` → `{ answer }` |
| `GET` | `/health` | Health check |

---

## Repo Structure

```
StockGPT/
│
├── backend/
│   ├── requirements.txt
│   └── src/
│       ├── main.py                  # FastAPI app + CORS
│       ├── api/
│       │   ├── routes.py            # All API endpoints
│       │   └── schemas.py           # Pydantic response models
│       ├── sec/
│       │   ├── client.py            # Rate-limited SEC HTTP client
│       │   ├── cik.py               # Ticker → CIK lookup
│       │   └── filings.py           # List filings from submissions API
│       ├── parsers/
│       │   ├── mappings.py          # GAAP tag → concept mappings + statement layouts
│       │   └── statements.py        # Extract facts from companyfacts API (annual + quarterly)
│       ├── ratios/
│       │   └── calculations.py      # 12+ financial ratio calculations
│       ├── services/
│       │   ├── extract_financials.py  # Main pipeline (SEC fetch → normalized facts)
│       │   └── build_response.py      # Facts → frontend-ready JSON
│       ├── ai/
│       │   └── summarize.py         # Claude AI summary generation
│       ├── chat/
│       │   └── qa.py                # Claude chat Q&A over financial data
│       └── config/
│           └── settings.py          # Environment variable config
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   └── Index.tsx            # Main app page
│       ├── components/              # UI components (shadcn/ui based)
│       ├── lib/
│       │   ├── api.ts               # Backend API client
│       │   └── formatters.ts        # Number/currency formatting
│       └── types/
│           └── financials.ts        # TypeScript interfaces
│
├── .env.example                     # Environment variable template
└── README.md
```

---

## License

MIT
