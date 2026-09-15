# Real-Time Commissions & Sub-3-Second Settlement

Traditional insurance brokers wait 30 to 60 days to receive commission disbursements. Aequitas operates a real-time ledger that settles commissions in seconds via the Federal Reserve's **FedNow** rail, **The Clearing House RTP**, and **Stripe Connect Instant Payouts**.

Backlink: [Experience the Live Commission Studio](https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/)

---

## 1. The Atomic 80/18/2 Revenue Split
The moment premium is captured via Open Banking ACH or debit card:
```
Gross Premium ($100.00)
 ├── 80.0% ($80.00) ──► Carrier Underwriting Risk Pool
 ├── 18.0% ($18.00) ──► Broker Available Commission Vault (Sub-3s Cashout)
 └──  2.0%  ($2.00) ──► Community Surplus Dividend Pool
```

---

## 2. Payout Rails & Performance

| Payout Rail | Settlement Speed | Transaction Cost | Availability |
| :--- | :--- | :--- | :--- |
| **FedNow / RTP** | **&lt; 1.5 seconds** | **$0.00** | 24/7/365 |
| **Stripe Connect Instant** | **&lt; 3.0 seconds** | 0.5% | 24/7/365 |
| **Visa Direct / Mastercard Send** | **&lt; 10.0 seconds** | 1.0% | 24/7/365 |

---

## 3. Programmatic Instant Cash-Out
Brokers or API partners trigger instant cashout via:
```bash
POST /api/commissions/instant-payout
Content-Type: application/json

{
  "amount": 250.00,
  "rail": "FEDNOW_RTP",
  "destination": "Chase Commercial Checking (•••• 8412)"
}
```

Receipts include verifiable cryptographic transaction hashes (`tx_fednow_...`) confirming immediate funds availability in the destination bank account.

👉 [Launch Commission Cashout Modal](https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/)
