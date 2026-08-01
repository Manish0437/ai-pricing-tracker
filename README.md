# 🤖 AI Model Pricing Tracker

> Compare AI model pricing across 9 major providers — updated automatically every 24 hours.

**Live Demo:** [ai-pricing-tracker-production.up.railway.app](https://ai-pricing-tracker-production.up.railway.app)

![lightdashboard](./screenshots/screenshot1.png)
![darkdashboard](./screenshots/screenshot2.png)
![inputform](./screenshots/screenshot3.png)
![analysisreport](./screenshots/screenshot4.png)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [How It Works](#-how-it-works)
- [Screenshots](#-screenshots)

---

## 🌟 Overview

AI Model Pricing Tracker is a production-grade full-stack web application that **automatically scrapes, normalizes, and compares AI model pricing** across 9 major providers including OpenAI, Anthropic, Google Gemini, Groq, Perplexity, and DeepSeek.

Pricing data is refreshed every 24 hours via an automated pipeline — no manual updates needed. A built-in recommendation engine helps you find the best model for your specific use case, budget, and context window requirements.

---

## ✨ Features

- **🔄 Daily automated scraping** — Playwright scrapes 9 AI provider pricing pages every 24 hours
- **🧠 AI-powered normalization** — Google Gemini extracts structured pricing JSON from raw webpage text
- **✅ Zod validation** — Every data point is schema-validated before being saved
- **📊 Live dashboard** — Search and filter all models across all providers in one place
- **🎯 Recommendation engine** — Find the best model by task type, budget, and context window
- **🔒 Secure API** — Secret-key protected scrape endpoint
- **🚀 Production deployed** — Two Railway services (web + scheduler) running 24/7
- **📱 Responsive UI** — Works on desktop and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Scraping | Playwright (Chromium) |
| AI Normalization | Google Gemini 2.5 Flash Lite |
| Validation | Zod |
| Database | MongoDB Atlas + Mongoose |
| Scheduling | node-cron |
| Deployment | Railway (2 services) |
| Styling | Inline CSS with CSS variables |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Railway Service 2                   │
│                  (Scheduler 24h)                     │
│                                                      │
│  node-cron → scrapeAllProviders()                   │
│           → normalizeAllProviders()  ──────────┐    │
│           → saveAllPricingToDB()               │    │
└────────────────────────────────────────────────│────┘
                                                 │
                                          MongoDB Atlas
                                                 │
┌────────────────────────────────────────────────│────┐
│                  Railway Service 1             │    │
│                  (Next.js Web App)             │    │
│                                                │    │
│  GET  /api/prices     ← reads from DB ─────────┘    │
│  POST /api/scrape     ← triggers pipeline manually  │
│  GET  /api/recommend  ← scores + ranks models       │
│  GET  /              ← dashboard UI                 │
└─────────────────────────────────────────────────────┘
```

**Pipeline flow:**

```
Playwright scrapes page
       ↓
Raw text (8000 chars max)
       ↓
Gemini API normalizes → structured JSON
       ↓
Zod validates schema
       ↓
MongoDB Atlas stores (replace-on-run)
       ↓
Next.js API serves to dashboard
```

---

## 📁 Project Structure

```
ai-pricing-tracker/
│
├── app/
│   ├── api/
│   │   ├── scrape/route.ts          # POST — triggers full pipeline
│   │   ├── prices/route.ts          # GET  — fetch all pricing data
│   │   └── recommend/route.ts       # GET  — recommendation engine
│   ├── layout.tsx                   # Root layout + SEO metadata
│   └── page.tsx                     # Dashboard UI
│
├── lib/
│   ├── scraper.ts                   # Playwright scraping logic
│   ├── normalizer.ts                # Gemini API normalization
│   ├── validator.ts                 # Zod schemas + sanity checks
│   ├── db.ts                        # MongoDB Atlas connection
│   ├── storage.ts                   # Save/replace pricing data
│   ├── providers.ts                 # List of 9 AI provider URLs
│   ├── scheduler.ts                 # node-cron daily scheduler
│   └── run-full-pipeline.ts         # Manual pipeline runner
│
├── models/
│   └── pricing.ts                   # Mongoose model
│
├── logs/                            # Daily run logs (local only)
├── .env.local                       # Environment variables
├── railway.toml                     # Railway deployment config
├── tsconfig.ts-node.json            # ts-node config for local testing
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.9.0
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free tier — 1000 requests/day)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-pricing-tracker.git
cd ai-pricing-tracker
```

### 2. Install dependencies

```bash
npm install
npx playwright install chromium
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your values (see [Environment Variables](#-environment-variables) below).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Run the pipeline manually (optional)

```bash
npx ts-node --project tsconfig.ts-node.json lib/run-full-pipeline.ts
```

This scrapes all 9 providers, normalizes with Gemini, and saves to MongoDB.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# Google Gemini API (free tier — get at aistudio.google.com/apikey)
GEMINI_API_KEY=AIzaSy...

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-pricing

# Secret key to protect the /api/scrape endpoint
SCRAPER_SECRET=your_random_secret_string_here
```

> ⚠️ Never commit `.env.local` to GitHub. It's already in `.gitignore`.

---

## 📡 API Reference

### `POST /api/scrape`

Triggers the full scrape → normalize → save pipeline in the background.

**Headers:**
```
x-scraper-secret: your_secret_here
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Pipeline started in background",
  "startedAt": "2026-07-31T10:30:00.000Z"
}
```

---

### `GET /api/prices`

Returns all current pricing data from MongoDB.

**Response:**
```json
{
  "success": true,
  "count": 9,
  "data": [
    {
      "provider": "OpenAI",
      "models": [
        {
          "model": "gpt-5.4",
          "inputCostPer1M": 2.50,
          "outputCostPer1M": 15.00,
          "contextWindow": 128000,
          "tier": "flagship"
        }
      ],
      "currency": "USD",
      "normalizedAt": "2026-07-31T10:30:00.000Z"
    }
  ]
}
```

---

### `GET /api/recommend`

Returns ranked model recommendations based on your filters.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `task` | string | `chat`, `coding`, `reasoning`, `embeddings`, `realtime`, `image` |
| `budget` | number | Max input cost per 1M tokens (USD) |
| `minContextWindow` | number | Minimum context window in tokens |
| `limit` | number | Max results to return (default: 10) |

**Example:**
```
GET /api/recommend?task=coding&budget=2&limit=5
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "results": [
    {
      "provider": "DeepSeek",
      "model": "deepseek-coder",
      "inputCostPer1M": 0.14,
      "outputCostPer1M": 0.28,
      "score": 135,
      "reasons": ["Very low cost", "Good fit for coding tasks"]
    }
  ]
}
```

---

## 🚢 Deployment

This project deploys as **two separate Railway services** from the same GitHub repository.

### Service 1 — Web App

| Setting | Value |
|---|---|
| Start command | `npm start` |
| Build command | `npm install && npx playwright install chromium --with-deps && npm run build` |
| Purpose | Serves dashboard + API routes |

### Service 2 — Scheduler

| Setting | Value |
|---|---|
| Start command | `npx ts-node --project tsconfig.ts-node.json lib/scheduler.ts` |
| Build command | `npm install && npx playwright install chromium --with-deps` |
| Purpose | Runs pipeline daily at 10:30 AM IST |

Both services share the same MongoDB Atlas database and environment variables.

See [`railway.toml`](./railway.toml) for full configuration.

---

## ⚙️ How It Works

### 1. Scraping
Playwright launches a headless Chromium browser with stealth headers and realistic viewport/locale settings. Each of the 9 providers gets a fresh browser context to isolate cookies and state. After navigation, the scraper waits 3 seconds for JS-rendered content to load, scrolls to trigger lazy loading, then extracts visible text — capped at 8000 characters to optimize LLM token usage.

### 2. Normalization
Raw text is sent to Google Gemini 2.5 Flash Lite with a structured prompt instructing it to extract pricing as JSON. Multi-modality models (e.g. GPT-Realtime with separate audio/text/image pricing) are split into individual entries. The normalizer includes retry logic with exponential backoff for 429/503 errors, and falls back to `gemini-2.5-flash` if the lite model's quota is exhausted.

### 3. Validation
Every normalized response is parsed against a Zod schema before being stored. Fields like `contextWindow`, `tier`, and `notes` are nullable/optional to handle inconsistent LLM output. A sanity checker flags unusual prices (output cost lower than input, suspiciously high values, zero-cost non-free models).

### 4. Storage
MongoDB Atlas stores one document per provider. Each pipeline run **replaces** existing documents rather than appending, keeping the database clean and always reflecting current prices. The Mongoose model is append-only during a single run — the scheduler calls `deleteMany()` before saving to ensure fresh data.

### 5. Recommendation Engine
The recommendation API fetches all providers from MongoDB, flattens all models into a single list, and scores each one based on cost efficiency, task keyword matching, and context window size. Hard filters (budget cap, minimum context window) disqualify models before scoring. Results are sorted by score descending, with input cost as a tiebreaker.

---

## 📸 Screenshots

### 🌞 Dashboard — Light Mode
> Homepage with live pricing overview and sample audit results

![Dashboard Light Mode](./screenshots/screenshot1.png)

---

### 🌙 Dashboard — Dark Mode
> Same dashboard with dark mode — full light/dark theme support

![Dashboard Dark Mode](./screenshots/screenshot2.png)

---

### 📝 Input Form — AI Stack Audit
> Enter your team size, use case, and current AI tools with monthly spend

![Input Form](./screenshots/screenshot3.png)

---

### 📊 Audit Results — Subscription Recommendations
> Get instant cost-saving recommendations with estimated monthly savings per tool

![Audit Results](./screenshots/screenshot4.png)

---

## 📊 Supported Providers

| Provider | Pricing Page |
|---|---|
| OpenAI | platform.openai.com/docs/pricing |
| Anthropic | anthropic.com/pricing |
| Google Gemini | ai.google.dev/pricing |
| Groq | groq.com/pricing |
| Perplexity (Sonar) | docs.perplexity.ai |
| Perplexity (Sonar Pro) | docs.perplexity.ai |
| Perplexity (Sonar Reasoning Pro) | docs.perplexity.ai |
| Perplexity (Sonar Deep Research) | docs.perplexity.ai |
| DeepSeek | api-docs.deepseek.com |

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 🙋 Author

**Manish Babu Mallolu**
- LinkedIn: [linkedin.com/in/mallolumanishbabu](https://linkedin.com/in/mallolumanishbabu)
- Email: mallolumanishbabu@gmail.com
- Live Project: [ai-pricing-tracker-production.up.railway.app](https://ai-pricing-tracker-production.up.railway.app)

---

<p align="center">Built with ❤️ using Next.js, Playwright, and Google Gemini</p>
