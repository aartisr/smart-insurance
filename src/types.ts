export type NavigationTab = 
  | 'overview'
  | 'underwriting'
  | 'telematics'
  | 'claims'
  | 'parametric'
  | 'transparency'
  | 'policy_translator'
  | 'p2p_pools'
  | 'giveback'
  | 'agent_service'
  | 'monetization';

export interface UserPolicy {
  id: string;
  policyHolder: string;
  assetType: 'Home' | 'Auto' | 'Health/Life' | 'Commercial Micro';
  address: string;
  dwellingLimit: number;
  personalPropertyLimit: number;
  liabilityLimit: number;
  deductible: number;
  baseMonthlyPremium: number;
  activeMonthlyPremium: number;
  fixedOperationalFeePercent: number; // 20%
  givebackSurplusAccrued: number;
  iotDiscountMonthly: number;
  openBankingDiscountMonthly: number;
  status: 'ACTIVE' | 'BOUND' | 'UNDERWRITING_PENDING';
  cryptographicHash: string;
  createdAt: string;
  selectedCharity: string;
  activeRiders: { id: string; name: string; costMonthly: number; coverageAmount: number }[];
}

export interface IoTDeviceStream {
  id: string;
  name: string;
  type: 'water_sensor' | 'vehicle_telematics' | 'wearable_biometrics' | 'smoke_heat_sensor';
  deviceBrand: string;
  status: 'ONLINE' | 'ACTIVE_PREVENTION' | 'SYNCING';
  currentMetric: string;
  riskDeflationPercent: number;
  monthlySavings: number;
  lastTelemetryPing: string;
  telemetryLogs: { timestamp: string; event: string; safetyScore: number }[];
}

export interface ClaimRecord {
  id: string;
  category: string;
  date: string;
  description: string;
  claimedAmount: number;
  payoutAmount: number;
  status: 'SETTLED_INSTANT_RTP' | 'PROCESSING' | 'PARAMETRIC_AUTO_PAID' | 'FRAUD_FLAGGED';
  processingTimeSeconds: number;
  fraudAnomalyScore: number; // 0-100
  computerVisionAnalysis?: string;
  damageSeverity: 'MINOR' | 'MODERATE' | 'SEVERE';
  rtpTransferId: string;
  cryptographicProofHash: string;
  imageUrl?: string;
}

export interface ParametricTrigger {
  id: string;
  title: string;
  hazardType: 'SEISMIC' | 'SEVERE_HAIL' | 'FLIGHT_DELAY' | 'POWER_GRID' | 'FLOOD_DATUM';
  oracleSource: string;
  triggerThreshold: string;
  currentLiveReading: string;
  isTriggered: boolean;
  autoPayoutAmount: number;
  latencySeconds: number;
  recipientCount: number;
}

export interface P2PPool {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  totalPooledReserve: number;
  currentClaimsDrawn: number;
  projectedAnnualDividendPerMember: number;
  moralHazardScore: number; // 1-100
  isJoined: boolean;
  avatarIcon: string;
  description: string;
}

export interface GivebackLedgerEntry {
  id: string;
  quarter: string;
  totalPremiumsCollected: number;
  fixedOperatingFee20: number;
  claimsPaidOut: number;
  remainingSurplus80: number;
  givebackCharityDistributed: number;
  customerCashRebates: number;
  status: 'AUDITED_ON_CHAIN' | 'PENDING_CYCLE';
}

export interface SubscriptionTier {
  id: string;
  name: string;
  priceMonthly: number;
  billingType: 'FLAT_SUBSCRIPTION' | 'USAGE_MICRO';
  carrierOperatingMargin: string; // 0%
  description: string;
  features: string[];
  recommended?: boolean;
}

export type InsuranceLineType = 'Auto' | 'Home' | 'Renters' | 'Health/Life' | 'Pet' | 'Commercial Micro';

export interface CarrierQuote {
  id: string;
  name: string;
  rating: number;
  financialGrade: string;
  pureActuarialLoss: number;
  marketingAndCommissionToll: number;
  corporateMargin: number;
  netMonthlyRate: number;
  withinBudget: boolean;
  budgetDiffMonthly: number;
  coverageSummary: string;
  claimSpeed: string;
  hiddenTrap: string;
  isCheapest: boolean;
  isBestValue: boolean;
  isZeroMarginProtocol: boolean;
  discountTags: string[];
}

export interface BudgetHackTactic {
  tactic: string;
  monthlySavings: number;
  howToApply: string;
}

export interface AffordabilityComparisonResult {
  marketAverageMonthly: number;
  cheapestMonthly: number;
  userBudget: number;
  budgetAffordabilityAnalysis: string;
  carriers: CarrierQuote[];
  topBudgetHacks: BudgetHackTactic[];
}

export interface UserAffordabilityProfile {
  insuranceType: InsuranceLineType;
  userBudgetMonthly: number;
  maxDeductible: number;
  zipCode: string;
  coverageTier: 'economy_cheapest' | 'balanced' | 'comprehensive';
  autoDetails?: {
    vehicleYear: number;
    vehicleMake: string;
    vehicleModel: string;
    annualMileage: number;
    cleanDrivingRecord: boolean;
    hasTelematicsApp: boolean;
  };
  homeDetails?: {
    propertyType: string;
    squareFeet: number;
    yearBuilt: number;
    hasSmartSensors: boolean;
    hasSecurityAlarm: boolean;
  };
}
