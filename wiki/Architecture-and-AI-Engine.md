# Architecture & AI Engine Specification

The Aequitas platform replaces manual human adjusters and paper underwriting questionnaires with high-speed autonomous agents powered by **Google Gemini** models.

Backlink: [Return to Live Aequitas Insurance Engine](https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/)

---

## 1. 3-Question Enriched Intake
Traditional home and auto insurance applications require 60 to 80 intrusive questions. Aequitas requests only 3 primary inputs:
1. **Property Address** (e.g., `1044 Marina Blvd, San Francisco, CA`)
2. **Vehicle VIN or Connected Account** (Tesla, Ford, Toyota via Smartcar)
3. **Target Coverage Tier** (Essential, Balanced, Sovereign)

### Data Enrichment Pipeline
Upon submission, the engine invokes serverless enrichment tasks:
- **Cape Analytics**: Fetches high-resolution aerial imagery to calculate roof square footage, tree canopy overhang, and pool safety fences.
- **USGS Geocoding & Hazard Zones**: Queries FEMA flood zones and California Wildfire Threat Maps.
- **Smartcar Vehicle Telematics**: Retrieves verified odometer readings and safety braking event frequency.

---

## 2. Multimodal AI Claims Triage
When an insured party files a First Notice of Loss (FNOL):
- The user uploads damage photos directly in the [Claims Module](https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/).
- The server runs Gemini vision triage to:
  - Verify EXIF metadata, timestamp, and location coordinates to prevent spoofing.
  - Segment damage boundaries (e.g., bumper dent vs. cracked windshield).
  - Compute a repair estimate distribution using localized labor rates.
- Claims below $1,500 with a fraud confidence index `< 5%` are automatically settled within 3 seconds.

---

## 3. Plain-Language Policy Translation
Legal fine-print is notoriously difficult to parse. Aequitas translates legal insurance declarations into 6th-grade reading level summaries with interactive toggles, showing exactly what is covered and what is excluded.

👉 [Try the Policy Translator Live](https://ais-dev-6wif5vkcbekrimpjj2ayl6-433861030990.us-east5.run.app/)
