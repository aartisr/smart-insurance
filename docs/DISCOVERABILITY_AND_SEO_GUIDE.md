# Aequitas Discoverability, SEO, AEO, AIO & Analytics Architecture

This document details the comprehensive discoverability framework implemented across the Aequitas platform, ensuring first-class visibility across traditional search engines, modern Answer Engines (Perplexity, ChatGPT Search, Claude), and AI crawlers.

🔗 **Live Application URL**: [https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/](https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/)

---

## 1. Multi-Engine Indexing Strategy

### Traditional Search Engines (SEO)
- **Engines**: Google, Microsoft Bing, Yahoo, DuckDuckGo, Baidu, Yandex.
- **Directives**:
  - `robots.txt` with universal allowances for all verified crawler agents.
  - Standard XML Sitemap at `/sitemap.xml` with `<lastmod>`, `<changefreq>`, and `<priority>`.
  - Canonical links (`<link rel="canonical" ...>`) and pre-connected Google Font assets.
  - OpenGraph 2.0 (`og:title`, `og:description`, `og:image`, `og:type`, `og:site_name`).
  - Twitter / X summary card metadata (`twitter:card`, `twitter:site`, `twitter:creator`).

### Answer Engine Optimization (AEO)
- **Target Platforms**: Perplexity AI, ChatGPT Search, Claude, Google AI Overviews, Bing Copilot.
- **Implementations**:
  - Embedded **Schema.org JSON-LD** graph including:
    - `@type: WebApplication`
    - `@type: Organization`
    - `@type: FAQPage` with accepted answers designed for natural-language extraction.
  - Semantic HTML5 sectioning (`<header>`, `<main>`, `<article>`, `<nav>`, `<footer>`) with explicit headings (`h1`, `h2`, `h3`).

### AI Overview & Agent Experience Optimization (AIO & AXO)
- **Target Bots**: `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `Bytespider`, `cohere-ai`.
- **Machine Context Files**:
  - `/llms.txt`: Standardized summary file for LLMs outlining capabilities, pricing, and canonical endpoints.
  - `/llms-full.txt`: Deep architectural context for LLMs performing research tasks.
  - `/.well-known/openapi.json`: Complete OpenAPI 3.0 API documentation for autonomous agent tool use.
  - `/.well-known/ai-plugin.json`: Standard plugin descriptor for conversational AI tools.

---

## 2. Analytics & Behavioral Heatmaps

### Microsoft Clarity
- Provides visual user session recording, rage-click detection, dead-click analysis, and scrolling heatmaps.
- Initialized via `src/lib/analytics.ts` and configured via `VITE_CLARITY_PROJECT_ID`.
- Passes custom events (`clarity('event', eventName)`) when users bind policies or cash out commissions.

### PostHog Product Analytics
- Captures full-funnel conversion events, retention cohorts, and session replays.
- Initialized with automatic pageview and pageleave tracking.
- Tracks specific transactional events:
  - `carrier_bind_success` (monitors bind volume by carrier)
  - `instant_cashout_success` (tracks payout speed and amount)
  - `navigate_module` (analyzes tab engagement)

---

## 3. GitHub Pages & GitHub Wiki Cross-Linking
- `/docs/index.html`: Fully styled, responsive GitHub Pages static documentation hub with persistent top navigation, module summaries, and high-authority contextual backlinks to the live application.
- `/wiki/`: Complete set of 7 cross-referenced wiki markdown pages ready to sync to the GitHub Wiki repository.
