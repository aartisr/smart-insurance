# SmartInsurance: Production Operationalization & Carrier Integration Roadmap

> **Author**: SmartInsurance Architecture Team  
> **Repository**: `aartisr/smart-insurance`  
> **Status**: Production Deployment & Carrier Onboarding Specification  
> **Target Runtimes**: Vercel (Edge/Serverless), Google Cloud Run (Containerized Node.js), Embedded MGA Rails

---

## Executive Summary

SmartInsurance is a modern, transparent insurance operating system designed to eliminate structural inefficiencies in traditional property and casualty (P&C) insurance. By combining **real-time AI underwriting**, **live telematics deflation**, **comparative rating**, and **sub-3-second commission settlement**, this platform bypasses legacy 60-day broker settlement cycles.

This document details the exact technical, legal, and operational steps required to transition this platform from **Certified Sandbox Mode** to **100% Production Live Operations (Processing Real-Money Binds & Direct Bank Disbursements)**.

---

## 1. Legal & Regulatory Pathways (Choose 1 of 3)

Before binding legal insurance contracts, the platform must operate under an authorized insurance entity. You have three paths depending on your timeline and capital:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          CHOOSE YOUR OPERATIONAL MODEL                          │
└─────────────────────────────────────────────────────────────────────────────────┘
         │                                 │                                │
         ▼                                 ▼                                ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│  PATH A: MGA     │             │  PATH B: DIRECT  │             │  PATH C: TECH &  │
│  PARTNERSHIP     │             │  LICENSED AGENCY │             │  LEAD MONETIZE   │
│  (Boost / Sure)  │             │  (EZLynx / DOI)  │             │  (MediaAlpha)    │
├──────────────────┤             ├──────────────────┤             ├──────────────────┤
│ • Launch: 2-4 wks│             │ • Launch: 2-3 mo │             │ • Launch: 24-48h │
│ • Use partner MGA│             │ • State P&C      │             │ • No license     │
│   license        │             │   Producer Lic.  │             │   required       │
│ • 18% - 22% Comm │             │ • Direct carrier │             │ • $25 - $120 CPA │
│ • Instant bind   │             │   appointments   │             │   per bind/lead  │
└──────────────────┘             └──────────────────┘             └──────────────────┘
```

### Path A: Embedded MGA Partnership (*Recommended for Fastest Launch*)
* **Partners**: **Boost Insurance** (`boostinsurance.com`) or **Sure** (`sureapp.com`).
* **How it works**: Boost/Sure serves as the licensed Program Administrator / Managing General Agent (MGA) backed by A-rated reinsurance (e.g., Markel, Swiss Re). Your application operates as a digital sub-producer.
* **Licensing**: You register your entity as an affiliate sub-producer under their master state licenses.
* **Timeline**: 2–4 weeks.
* **Commission Share**: **15% to 22%** gross written premium (GWP).

### Path B: Direct Licensed Agency & Brokerage
* **How it works**: Your corporate entity obtains a Resident Property & Casualty (P&C) Agency License in your home state, followed by Non-Resident licenses in target expansion states (via NIPR - National Insurance Producer Registry).
* **Carrier Appointments**: Direct appointments with Progressive, Travelers, Nationwide, Safeco, etc., or aggregate via SIAA / Smart Choice / FirstChoice.
* **Rating Hub**: Connect directly to **EZLynx API** or **PL Rating (Vertafore)**.
* **Timeline**: 2–3 months.
* **Commission Share**: **15% to 25%** + Annual Profit Sharing Contingency.

### Path C: Technology & Lead Generation Marketplace (Immediate Launch)
* **How it works**: Operate as a pure technology and risk optimization portal. Direct users who compare quotes to carriers via click-to-bind affiliate APIs (**MediaAlpha API**, **EverQuote API**, **QuinStreet**).
* **Licensing**: No insurance producer license required (operates as advertising/technology platform).
* **Timeline**: Immediate (< 48 hours).
* **Monetization**: **$25 to $120+ flat CPA/CPL** paid per qualified lead or completed policy bind.

---

## 2. Real Carrier API Credentials & Webhook Setup

To activate live quoting, binding, and policy servicing, configure the following API credentials:

### 2.1 Boost Insurance API Integration
1. Apply for developer credentials at [Boost Insurance Portal](https://boostinsurance.com).
2. Obtain your `BOOST_API_KEY`, `BOOST_API_SECRET`, and `BOOST_ENVIRONMENT` (`sandbox` or `production`).
3. Endpoint mapping in `server.ts`:
   * `POST /api/carriers/bind-external` passes real underwriting parameters to `https://api.boostinsurance.com/v1/policies/bind`.
4. Configure Inbound Webhook:
   * URL: `https://your-domain.com/api/carriers/webhook`
   * Events: `policy.bound`, `policy.cancelled`, `endorsement.created`, `commission.disbursed`.

### 2.2 EZLynx Multi-Carrier Comparative Rating
1. Register for the [EZLynx Developer Partner Program](https://www.ezlynx.com).
2. Obtain `EZLYNX_API_KEY` and `EZLYNX_CLIENT_ID`.
3. EZLynx normalizes quoting across 40+ carriers (Auto, Home, Umbrella) with a single JSON payload.

### 2.3 Computer Vision & Connected-Car Telematics
* **Cape Analytics API**:
  * Set `CAPE_ANALYTICS_API_KEY` to ingest real satellite and aerial imagery assessing roof condition, tree overhang, and pool liabilities.
* **Smartcar Connected Vehicle API**:
  * Register on [Smartcar Dashboard](https://dashboard.smartcar.com).
  * Set `SMARTCAR_CLIENT_ID`, `SMARTCAR_CLIENT_SECRET`, and `SMARTCAR_REDIRECT_URI`.
  * Allows users to authenticate their Tesla, Ford, Toyota, or BMW directly to stream verified odometer readings for low-mileage discounts.

---

## 3. Real-Time Commission Payout Rails (<3s Instant Settlement)

To get commissions paid immediately into your bank account rather than waiting 30–60 days:

```
┌────────────────────────┐      ┌─────────────────────────┐      ┌────────────────────────┐
│  CUSTOMER PAYS PREMIUM │ ───► │  STRIPE / OPEN BANKING  │ ───► │ ATOMIC REVENUE SPLIT   │
│  ($100.00 / month)     │      │  PAYMENT CAPTURE        │      │ (Calculated in Memory) │
└────────────────────────┘      └─────────────────────────┘      └────────────────────────┘
                                                                              │
                                       ┌──────────────────────────────────────┴──────────────────────────────────────┐
                                       ▼                                                                             ▼
                        ┌──────────────────────────────┐                                              ┌──────────────────────────────┐
                        │   80% RISK POOL TO CARRIER   │                                              │ 18% COMMISSION TO BROKER     │
                        │   ($80.00 to Boost / Reins.) │                                              │ ($18.00 Available to Cashout)│
                        └──────────────────────────────┘                                              └──────────────────────────────┘
                                                                                                                     │
                                                                                                                     ▼
                                                                                                      ┌──────────────────────────────┐
                                                                                                      │ INSTANT CASHOUT VIA FEDNOW   │
                                                                                                      │ Dispatched to Bank in <1.5s  │
                                                                                                      └──────────────────────────────┘
```

### 3.1 Stripe Connect Custom with Instant Payouts
1. Create a [Stripe Account](https://stripe.com) and enable **Stripe Connect**.
2. Complete your identity verification and link your commercial business bank account or debit card.
3. Enable **Instant Payouts** in the Stripe Dashboard (under Settings > Payouts).
4. Environment variables to add:
   * `STRIPE_SECRET_KEY=sk_live_...`
   * `STRIPE_WEBHOOK_SECRET=whsec_...`
   * `STRIPE_CONNECT_ACCOUNT_ID=acct_...`
5. Payout Speed: **< 3.0 seconds** via Visa Direct / Mastercard Send (0.5% fee).

### 3.2 FedNow / RTP Instant Transfer (via Modern Treasury or Moov)
* Integrate **Modern Treasury API** or **Moov API** for direct Federal Reserve FedNow clearing.
* Payout Speed: **< 1.5 seconds**, 24/7/365, **$0 fee**.

---

## 4. Environment Variables Configuration

Copy these into your `.env` file or Vercel Environment Variables:

```env
# ==========================================
# 1. AI UNDERWRITING & TRIAGE
# ==========================================
GEMINI_API_KEY=your_gemini_api_key_here

# ==========================================
# 2. CARRIER & MGA PARTNER CREDENTIALS
# ==========================================
BOOST_API_KEY=your_boost_api_key
BOOST_API_SECRET=your_boost_api_secret
SURE_API_SECRET=your_sure_api_secret
EZLYNX_CLIENT_ID=your_ezlynx_client_id
EZLYNX_CLIENT_SECRET=your_ezlynx_client_secret

# ==========================================
# 3. REAL-TIME PAYMENT & COMMISSION RAILS
# ==========================================
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
MODERN_TREASURY_API_KEY=mt_live_...
COMMISSION_AUTOSWEEP_THRESHOLD=100.00
COMMISSION_DESTINATION_ACCOUNT=chase_commercial_checking_8412

# ==========================================
# 4. SATELLITE & TELEMATICS ENRICHMENT
# ==========================================
SMARTCAR_CLIENT_ID=your_smartcar_id
SMARTCAR_CLIENT_SECRET=your_smartcar_secret
CAPE_ANALYTICS_API_KEY=your_cape_api_key

# ==========================================
# 5. ENVIRONMENT & RUNTIME
# ==========================================
NODE_ENV=production
APP_BASE_URL=https://your-domain.com
```

---

## 5. Step-by-Step Deployment Runbook (Vercel & Custom Domain)

### Step 1: Push Repository to GitHub
```bash
git remote -v
# Confirmed: https://github.com/aartisr/smart-insurance.git
```

### Step 2: Deploy to Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Select repository `aartisr/smart-insurance`.
3. Set Framework Preset: **Vite**.
4. Set Build Command: `vite build`.
5. Set Output Directory: `dist`.
6. Add Environment Variables (listed in Section 4).
7. Click **Deploy**.

### Step 3: Configure Webhook Endpoints
In your Boost / Sure / Stripe developer dashboards, register your live webhook URL:
```
https://your-vercel-domain.vercel.app/api/carriers/webhook
```

### Step 4: Add Custom Domain & SSL
In Vercel Project Settings > Domains, add your domain (e.g., `app.smartinsurance.io`) and update DNS records (CNAME `cname.vercel-dns.com` or A-Record `76.76.21.21`).

---

## 6. Security, Privacy & Insurance Compliance Checklist

| Item | Requirement | Status / Action |
| :--- | :--- | :--- |
| **PCI-DSS Level 1** | Never store raw credit card / CVV numbers on server; use Stripe Elements tokenization. |  Compliant via Stripe Tokenization |
| **Gramm-Leach-Bliley Act (GLBA)** | Financial privacy notice presented prior to non-public personal financial data intake. |  Integrated into Intake Flow |
| **FCRA Compliance** | Disclosure notice when querying MVR (Motor Vehicle Records) or LexisNexis loss history. |  Included in Consumer Consent Modal |
| **Data Encryption** | TLS 1.3 in transit; AES-256 for all stored underwriting photos and payloads. |  Enforced by Vercel & HTTPS |
| **Webhook Idempotency** | Prevent duplicate commission credits by verifying `x-webhook-signature` and caching transaction IDs. |  Implemented in `server.ts` |

---

## 7. Next Actions & Milestones

1. **Week 1**: Register for [Boost Insurance Developer Sandbox](https://boostinsurance.com) or [MediaAlpha Lead API](https://mediaalpha.com).
2. **Week 2**: Set up [Stripe Connect](https://stripe.com/connect) and configure your direct commercial bank account for Instant Payouts.
3. **Week 3**: Add your production keys to Vercel and execute your first real live-bound policy with automated instant revenue disbursement.
