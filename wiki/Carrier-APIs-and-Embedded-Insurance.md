# Carrier APIs & Embedded Insurance Integration

Aequitas integrates directly with leading Managing General Agents (MGAs) and rating hubs to provide programmatic policy issuance across all 50 states.

Backlink: [Return to Live Aequitas Application](https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/)  
API Endpoint: [GET /api/carriers/connectors](https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/api/carriers/connectors)

---

## 1. Certified Carrier API Connectors

| Carrier Connector | Integration Type | Lines of Insurance | Commission Rate | Bind Latency |
| :--- | :--- | :--- | :--- | :--- |
| **Boost Insurance API** | Embedded MGA API | Commercial Auto, Pet, Cyber, Home | **18.0%** | &lt; 15.0s |
| **Sure Embedded Platform** | White-Label MGA | Renters, Hazard, Equipment | **22.0%** | &lt; 30.0s |
| **EZLynx Multi-Carrier** | Comparative Rating | 40+ National Carriers (Auto/Home) | **15.0%** | &lt; 1.2s |
| **Cape Analytics** | Satellite Vision | Aerial parcel assessment | Data Feed | &lt; 2.5s |
| **Smartcar API** | Connected Car | Telematics, Odometer, Driving scores | Risk Deflator | &lt; 1.8s |

---

## 2. Inbound Webhook Processing
The server endpoint `POST /api/carriers/webhook` accepts authenticated webhooks from carrier partners:
- `policy.bound`: Triggers immediate policy record creation and computes atomic revenue split.
- `commission.credited`: Adds available balance to the agency vault for immediate withdrawal.
- `endorsement.applied`: Recalculates risk factors and updates active monthly premiums.

---

## 3. Comparative Rating Engine
Users and brokers can benchmark rates side-by-side against legacy insurance carriers (Geico, State Farm, Allstate) to demonstrate the transparent 38% cost savings.

👉 [Compare 40+ Carrier Quotes Live](https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/)
