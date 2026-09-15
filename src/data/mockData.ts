import { UserPolicy, IoTDeviceStream, ClaimRecord, ParametricTrigger, P2PPool, GivebackLedgerEntry, SubscriptionTier } from '../types';

export const INITIAL_POLICY: UserPolicy = {
  id: 'POL-AEQ-2026-98102',
  policyHolder: 'Alex Mercer',
  assetType: 'Home',
  address: '742 Evergreen Terrace, Springfield, OR',
  dwellingLimit: 450000,
  personalPropertyLimit: 175000,
  liabilityLimit: 500000,
  deductible: 1000,
  baseMonthlyPremium: 78.0,
  activeMonthlyPremium: 43.6,
  fixedOperationalFeePercent: 20,
  givebackSurplusAccrued: 246.50,
  iotDiscountMonthly: 24.40,
  openBankingDiscountMonthly: 10.00,
  status: 'ACTIVE',
  cryptographicHash: '0x3c7e9a82f1b40971a5c6e804f981dc225a8e0f9b',
  createdAt: '2026-01-15',
  selectedCharity: 'Direct Relief & Clean Water Initiative',
  activeRiders: [
    { id: 'r1', name: 'High-Value Electronics & Camera Gear', costMonthly: 4.5, coverageAmount: 12000 },
    { id: 'r2', name: 'Parametric Flash Flood & Surface Surge', costMonthly: 3.5, coverageAmount: 50000 },
  ],
};

export const INITIAL_IOT_DEVICES: IoTDeviceStream[] = [
  {
    id: 'iot-1',
    name: 'Moen Flo Smart Water Shutoff',
    type: 'water_sensor',
    deviceBrand: 'Moen Flo IoT',
    status: 'ACTIVE_PREVENTION',
    currentMetric: '0.00 gpm (Zero Micro-Leaks Detected)',
    riskDeflationPercent: 18.5,
    monthlySavings: 14.40,
    lastTelemetryPing: '4 seconds ago',
    telemetryLogs: [
      { timestamp: '12:44:10', event: 'Micro-leak ultrasonic integrity scan: PASS (100% dry)', safetyScore: 99 },
      { timestamp: '08:12:05', event: 'Main supply pressure check: 52 PSI (Optimal range)', safetyScore: 98 },
      { timestamp: 'Yesterday', event: 'Automated 3am valve exercise cycle completed', safetyScore: 100 },
    ],
  },
  {
    id: 'iot-2',
    name: 'Connected Vehicle Telematics (Tesla API)',
    type: 'vehicle_telematics',
    deviceBrand: 'Tesla Fleet v2026',
    status: 'ONLINE',
    currentMetric: 'Safety Score 97.4 / 0 Hard Braking / 0 Late Night Dr',
    riskDeflationPercent: 12.0,
    monthlySavings: 8.50,
    lastTelemetryPing: '12 seconds ago',
    telemetryLogs: [
      { timestamp: '11:20:00', event: 'Commute trip completed: 14.2 miles. 0 forward collision warnings.', safetyScore: 97 },
      { timestamp: '07:45:12', event: 'Garaged overnight in secured geolocation fence.', safetyScore: 100 },
    ],
  },
  {
    id: 'iot-3',
    name: 'Smart Smoke & Thermal AI Array',
    type: 'smoke_heat_sensor',
    deviceBrand: 'Nest Protect Pro',
    status: 'ONLINE',
    currentMetric: 'Air Quality: Clean | 71.2°F | CO: 0 ppm',
    riskDeflationPercent: 6.0,
    monthlySavings: 4.50,
    lastTelemetryPing: '1 minute ago',
    telemetryLogs: [
      { timestamp: '09:00:00', event: 'Dual-spectrum smoke sensor self-test: NOMINAL', safetyScore: 100 },
    ],
  },
];

export const INITIAL_CLAIMS: ClaimRecord[] = [
  {
    id: 'CLM-88912',
    category: 'Water Sensor Preventative Freeze Replacement',
    date: '2026-02-14',
    description: 'Sub-zero thermal burst on external patio hose spigot. Moen Flo auto-isolated water in 800ms before interior damage.',
    claimedAmount: 380,
    payoutAmount: 380,
    status: 'SETTLED_INSTANT_RTP',
    processingTimeSeconds: 2.1,
    fraudAnomalyScore: 2.1,
    computerVisionAnalysis: 'Computer vision verified severed brass fitting and water staining. Zero image manipulation detected.',
    damageSeverity: 'MINOR',
    rtpTransferId: 'FEDNOW-TX-998124501',
    cryptographicProofHash: '0x99a4e872c01827b5e4ff81938aa88c42b01',
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'CLM-77103',
    category: 'Parametric NOAA Severe Hail Auto-Settlement',
    date: '2026-01-28',
    description: 'Doppler radar verified 2.2-inch hail core over postal code 97401. Payout triggered automatically with zero paperwork.',
    claimedAmount: 750,
    payoutAmount: 750,
    status: 'PARAMETRIC_AUTO_PAID',
    processingTimeSeconds: 0.8,
    fraudAnomalyScore: 0.5,
    computerVisionAnalysis: 'Parametric oracle signature confirmed by NOAA Nexrad dual-polarization station.',
    damageSeverity: 'MODERATE',
    rtpTransferId: 'RTP-ORACLE-77218391',
    cryptographicProofHash: '0x2b4f179c44510ad699e30a109827cb63aa8',
  },
];

export const PARAMETRIC_TRIGGERS: ParametricTrigger[] = [
  {
    id: 'param-1',
    title: 'USGS Seismic Accelerometer Trigger',
    hazardType: 'SEISMIC',
    oracleSource: 'USGS National Earthquake Information Center Feed',
    triggerThreshold: 'Ground Motion PGA > 0.35g (Intensity VII+)',
    currentLiveReading: 'PGA 0.02g (Cascadia Subduction Zone Stable)',
    isTriggered: false,
    autoPayoutAmount: 5000,
    latencySeconds: 1.2,
    recipientCount: 4120,
  },
  {
    id: 'param-2',
    title: 'NOAA Doppler Severe Hail Radar Stream',
    hazardType: 'SEVERE_HAIL',
    oracleSource: 'NEXRAD Dual-Pol Level-III Hail Index (MESH)',
    triggerThreshold: 'Hail Diameter > 1.75 in (Golf Ball Size)',
    currentLiveReading: '0.00 in (Clean Atmospheric Scan)',
    isTriggered: false,
    autoPayoutAmount: 1200,
    latencySeconds: 0.9,
    recipientCount: 850,
  },
  {
    id: 'param-3',
    title: 'FlightAware Global Airline Cancellation Oracle',
    hazardType: 'FLIGHT_DELAY',
    oracleSource: 'FAA / Eurocontrol Flight Tracking Telemetry',
    triggerThreshold: 'Delay > 180 mins or Outright Cancellation',
    currentLiveReading: 'Flight UA-489: On-Time (Gate departure in 45m)',
    isTriggered: false,
    autoPayoutAmount: 400,
    latencySeconds: 0.4,
    recipientCount: 1,
  },
  {
    id: 'param-4',
    title: 'Municipal Power Grid Blackout Parametric',
    hazardType: 'POWER_GRID',
    oracleSource: 'ISO-NE / CAISO Smart Meter Frequency Telemetry',
    triggerThreshold: 'Continuous Outage > 6 hours in Geofence',
    currentLiveReading: '60.00 Hz (Grid Resilience Index: 100%)',
    isTriggered: false,
    autoPayoutAmount: 350,
    latencySeconds: 1.5,
    recipientCount: 1240,
  },
];

export const P2P_POOLS: P2PPool[] = [
  {
    id: 'pool-1',
    name: 'Cascadia Smart Eco-Homeowners Syndicate',
    category: 'Smart Home & Flo Water Monitored',
    membersCount: 148,
    totalPooledReserve: 44200,
    currentClaimsDrawn: 4200,
    projectedAnnualDividendPerMember: 270.27,
    moralHazardScore: 98,
    isJoined: true,
    avatarIcon: 'Home',
    description: 'Homeowners equipped with verified ultrasonic water shutoffs and smart smoke arrays. 90% historical giveback rate.',
  },
  {
    id: 'pool-2',
    name: 'Tesla Autopilot & Low-Mileage Commuters',
    category: 'Connected Telematics EV',
    membersCount: 312,
    totalPooledReserve: 89400,
    currentClaimsDrawn: 12100,
    projectedAnnualDividendPerMember: 247.75,
    moralHazardScore: 96,
    isJoined: false,
    avatarIcon: 'Car',
    description: 'Drivers maintaining a 95+ safety score with forward radar assistance. Zero high-speed collision claims in 36 months.',
  },
  {
    id: 'pool-3',
    name: 'Pacific Northwest Urban Cyclists & E-Bikers',
    category: 'Micro-Mobility & Personal Property',
    membersCount: 86,
    totalPooledReserve: 18900,
    currentClaimsDrawn: 1800,
    projectedAnnualDividendPerMember: 198.80,
    moralHazardScore: 94,
    isJoined: false,
    avatarIcon: 'Bike',
    description: 'Active commuters sharing low-tier bike theft & damage deductible pooling with GPS-tracked smart locks.',
  },
];

export const GIVEBACK_LEDGER: GivebackLedgerEntry[] = [
  {
    id: 'gb-q4-2025',
    quarter: '2025 Q4 Audit (Complete)',
    totalPremiumsCollected: 4850000,
    fixedOperatingFee20: 970000,
    claimsPaidOut: 1840000,
    remainingSurplus80: 2040000,
    givebackCharityDistributed: 1020000,
    customerCashRebates: 1020000,
    status: 'AUDITED_ON_CHAIN',
  },
  {
    id: 'gb-q3-2025',
    quarter: '2025 Q3 Audit (Complete)',
    totalPremiumsCollected: 4200000,
    fixedOperatingFee20: 840000,
    claimsPaidOut: 1450000,
    remainingSurplus80: 1910000,
    givebackCharityDistributed: 955000,
    customerCashRebates: 955000,
    status: 'AUDITED_ON_CHAIN',
  },
  {
    id: 'gb-q1-2026',
    quarter: '2026 Q1 Cycle (In Progress)',
    totalPremiumsCollected: 5600000,
    fixedOperatingFee20: 1120000,
    claimsPaidOut: 1980000,
    remainingSurplus80: 2500000,
    givebackCharityDistributed: 1250000,
    customerCashRebates: 1250000,
    status: 'PENDING_CYCLE',
  },
];

export const SAMPLE_POLICIES_FOR_TRANSLATOR = [
  {
    title: 'Standard Legacy Carrier HO-3 Homeowners Policy (42 Pages)',
    type: 'Homeowners & Hazard HO-3',
    snippet: `SECTION I – PERILS INSURED AGAINST: We insure against direct physical loss to property described in Coverages A and B. We do not insure, however, for loss:
1. Under Coverages A and B:
a. Caused by:
(1) Freezing of a plumbing, heating, air conditioning or automatic fire protective sprinkler system or of a household appliance, or by discharge, leakage or overflow from within the system or appliance caused by freezing. This provision does not apply if you have used reasonable care to maintain heat in the building;
(2) Freezing, thawing, pressure or weight of water or ice, whether driven by wind or not, to a fence, pavement, patio, swimming pool, foundation, retaining wall, bulkhead, pier, wharf or dock;
(3) Theft in or to a dwelling under construction;
(4) Vandalism and malicious mischief if the dwelling has been vacant for more than 60 consecutive days;
(5) Constant or repeated seepage or leakage of water or steam over a period of weeks, months or years from within a plumbing, heating, air conditioning or automatic fire protective sprinkler system or from within a household appliance;
(6) Wear and tear, marring, deterioration;
(7) Inherent vice, latent defect, mechanical breakdown;
(8) Smog, rust or other corrosion, mold, wet or dry rot;
(9) Smoke from agricultural smudging or industrial operations;
(10) Discharge, dispersal, seepage, migration, release or escape of pollutants unless the discharge is itself caused by a Peril Insured Against under Coverage C.
SECTION I – EXCLUSIONS: We do not insure for loss caused directly or indirectly by any of the following. Such loss is excluded regardless of any other cause or event contributing concurrently or in any sequence to the loss:
a. Ordinance or Law; b. Earth Movement including earthquake, landslide, mine subsidence; c. Water Damage meaning flood, surface water, waves, tidal water, overflow of any body of water; d. Power Failure; e. Neglect; f. War; g. Nuclear Hazard.`,
  },
  {
    title: 'Commercial Auto & Comprehensive Fleet Policy (38 Pages)',
    type: 'Commercial Auto & Fleet',
    snippet: `SECTION II – LIABILITY COVERAGE: We will pay all sums an 'insured' legally must pay as damages because of 'bodily injury' or 'property damage' to which this insurance applies, caused by an 'accident' and resulting from the ownership, maintenance or use of a covered 'auto'.
EXCLUSIONS: This insurance does not apply to any of the following:
1. Expected Or Intended Injury; 2. Contractual Liability; 3. Workers' Compensation; 4. Employee Indemnification And Employer's Liability; 5. Fellow Employee; 6. Care, Custody Or Control; 7. Handling Of Property; 8. Movement Of Property By Mechanical Device; 9. Operations; 10. Completed Operations; 11. Pollution; 12. War; 13. Racing; 14. Electronic Navigation and Autonomous Driver Assist Interruption unless verified by manufacturer cryptographic telemetry log.`,
  },
];

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'tier-base',
    name: 'Aequitas Pure Surplus (Zero Margin)',
    priceMonthly: 4.0,
    billingType: 'FLAT_SUBSCRIPTION',
    carrierOperatingMargin: '0.00% (Strict 20% Cost Rule)',
    description: 'Direct passthrough of actuarial risk. Bypasses sales commissions, legacy broker fees, and carrier profit markups.',
    features: [
      '3-Second Instant RTP Payout Rail',
      '20% Fixed Operating Cap Ledger',
      'Real-Time IoT Telematics Deflation',
      '100% Annual Unclaimed Surplus Rebate',
      'Automated Parametric Weather Oracles',
      'Open Banking 0% Transaction Fee Direct',
    ],
    recommended: true,
  },
  {
    id: 'tier-resilience',
    name: 'Aequitas Pro Resilience + IoT Hardware',
    priceMonthly: 9.0,
    billingType: 'FLAT_SUBSCRIPTION',
    carrierOperatingMargin: '0.00% Operating Pass-through',
    description: 'Includes subsidized smart hardware sensors + ultrasonic leak prevention + multi-pool syndicate sharing.',
    features: [
      'All Pure Surplus Core Features',
      'Complimentary Moen Flo / Smart Valve Hardware Kit',
      'P2P Risk Pool Multi-Syndicate Access',
      'Priority Parametric High-Precision Doppler Oracles',
      'Continuous 24/7 Autonomous Policy Agent Execution',
      'Worldwide Personal Property Floater Rider Included',
    ],
  },
  {
    id: 'tier-enterprise',
    name: 'Affinity Fleet & Community Syndicate',
    priceMonthly: 24.0,
    billingType: 'USAGE_MICRO',
    carrierOperatingMargin: '0.00% Actuarial Pass-through',
    description: 'For EV fleets, HOA communities, and commercial collectives managing shared low-tier reserves.',
    features: [
      'All Pro Resilience Features',
      'Custom P2P Social Syndicate Smart Contracts',
      'Direct API Telematics Ingestion Webhooks',
      'Multi-Party Consensus Claim Settlement',
      'Zero-Knowledge Identity & Proof Verification',
      'Quarterly Dividend Distribution to Treasury Wallet',
    ],
  },
];
