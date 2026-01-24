
export enum AppView {
  COMMAND_CENTER = 'command_center',
  CONTROL_PLANE = 'control-plane',
  SCAN = 'scan',
  ANALYTICS = 'analytics',
  TREASURY = 'treasury',
  OPERATIONS = 'operations',
  VOICE = 'voice',
  NPR_GRID = 'npr-grid',
  SPATIAL_INTEL = 'spatial-intel',
  COMPUTE_NODE = 'compute-node',
  SOURCE_INTEL = 'source-intel',
  TEST_HARNESS = 'test-harness',
  ENV_SETUP = 'env-setup',
  NPR_LAUNCH = 'npr-launch',
  GLOBAL_SEARCH = 'global-search',
  PATENT_ARCHITECT = 'patent-architect',
  STRUCTURED_ALPHA = 'structured-alpha',
  SECURITY_SCAN = 'security-scan',
  ADAPTER_HUB = 'adapter-hub',
  EPICENTER = 'epicenter',
  GLP_DOCTRINE = 'glp-doctrine',
  QUANTUM_AI_LENS = 'quantum-ai-lens',
  MISSION_CONTROL = 'mission-control',
  AI_STUDIO = 'ai-studio'
}

export interface GitRepo {
  id: string;
  provider: 'github' | 'gitlab' | 'azure-devops' | 'other';
  url: string;
  defaultBranch: string;
  tags: string[];
}

export interface GitRegistry {
  tenantId: string;
  repos: GitRepo[];
  metadata: Record<string, any>;
}

export interface AtlassianApp {
  key: string;
  name: string;
  vendor: string;
  products: string[];
  tags: string[];
  installs?: number;
  trust_signals: string[];
}

export interface SyncCyclePlan {
  tenantId: string;
  cycleName: string;
  repos: string[];
  cadence: 'hourly' | 'daily' | 'weekly';
  safeMode: boolean;
}

export interface DevEnvStatus {
  urlRoot: string;
  contextPath: string;
  reachable: boolean;
  statusCode?: number;
  lastChecked: number;
}

export interface DevEnvCheckOutput {
  reachable: boolean;
  statusCode?: number;
  fullUrl: string;
  notes: string[];
}

export interface RolloutStatus {
  deployment: string;
  namespace: string;
  status: 'RESTARTING' | 'WAITING' | 'ONLINE' | 'FAILED';
  replicaCount: string;
  uptime: string;
  logs: string[];
}

export interface TunnelConfig {
  localPort: number;
  remotePort: number;
  service: string;
  active: boolean;
}

export interface MoralCheck {
  intent: string;
  humanImpact: "positive" | "neutral" | "negative";
  reversible: boolean;
  exploitative: boolean;
  authorized: boolean;
  reasoning?: string;
}

export interface GLPMetrics {
  alignment: number;
  harmRisk: "LOW" | "MEDIUM" | "HIGH";
  humanBenefit: "CRITICAL" | "HIGH" | "NEUTRAL";
  compassionIndex: number;
  lastAudit: number;
}

export interface AlphaColorResult {
  color: string;
  intensity: number;
  maskId: string;
  entropy: number;
}

export type CapabilityType =
  | 'vision'
  | 'web_intel'
  | 'cyber'
  | 'quantum_opt'
  | 'llm'
  | 'seo_intel'
  | 'enterprise_seo_intel'
  | 'spaceflight_intel'
  | 'rural_dev_intel'
  | 'church_life_intel'
  | 'state_legislature_intel'
  | 'policy_intel'
  | 'hardware_support_intel'
  | 'sacred_compute'
  | 'bio_sensory'
  | 'alignment_guard'
  | 'dev_ops'
  | 'git_orchestrator';

export interface CapabilityProvider {
  id: string;
  type: CapabilityType;
  version: string;
  health(): Promise<'ok' | 'degraded' | 'down'>;
}

export type QueryIntent = {
  raw: string;
  wildcardTerms: string[];
  redacted: boolean;
  mustIncludeTags: string[];
};

export type VisionInsight = {
  source: string;
  entities: { id: string; label: string; confidence: number }[];
  summary?: string;
  acParametrization?: AlphaColorResult[];
};

export type WebInsight = {
  source: string;
  url: string;
  title?: string;
  summary?: string;
  tags?: string[];
};

export interface TestResult {
  id: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'RUNNING' | 'PENDING';
  duration: number;
  logs: string[];
}

export interface SovereignRepo {
  id: string;
  name: string;
  url: string;
  status: 'CLONING' | 'INDEXED' | 'ANALYZING' | 'READY';
  stars: number;
  lastCommit: string;
  language: string;
  siphonedLogic: string[];
}

export interface CodeExecutionPart {
  text?: string;
  executableCode?: {
    language: string;
    code: string;
  };
  codeExecutionResult?: {
    outcome: string;
    output: string;
  };
}

export type BrandStatus = 'ACTIVE' | 'LAUNCHING' | 'PAUSED' | 'SCALING';

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  status: BrandStatus;
  metrics: {
    revenue: number;
    orders: number;
    adSpend: number;
    profit: number;
  };
  config: {
    storeTemplate: string;
    region: string;
    logistics: string;
    [key: string]: any;
  };
}

export interface ActivityEntry {
  id: string;
  brandId: string;
  timestamp: number;
  message: string;
  type: 'WORKFLOW' | 'METRIC' | 'INCIDENT' | 'SETTLEMENT' | 'GLP_AUDIT' | 'GIT_ROCKET';
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  timestamp: number;
  description?: string;
}

export interface AutonomousLog {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'executing' | 'success' | 'warning' | 'quantum';
}

export interface AdCampaign {
  platform: 'X' | 'TikTok' | 'Instagram';
  status: 'active' | 'paused';
  spend: number;
  reach: number;
  conversions: number;
  lastUpdate: number;
}

export interface Shipment {
  id: string;
  destination: string;
  method: string;
  status: 'In-Transit' | 'Clearing-Customs' | 'Processing' | 'Delivered';
  value: number;
  timestamp: number;
}

export interface ApexTrigger {
  id: string;
  type: string;
  targetEntity: string;
  threshold: number;
  currentValue: number;
}

export interface ArbitrageNode {
  id: string;
  supplierNode: string;
  buyerNode: string;
  status: string;
  allocation: string;
  riskScore: string;
  commodity: string;
  roi: string;
  buyPrice: number;
  sellPrice: number;
  delta: number;
}

export interface FinancialForecast {
  period: string;
  inflow: number;
  outflow: number;
  netPosition: number;
  confidence: number;
}

export interface RiskAssessment {
  verdict: string;
  score: number;
  factors: string[];
}

export interface AgingReport {
  current: number;
  thirtyDays: number;
  sixtyDays: number;
  ninetyDaysPlus: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  predictedDate: string;
  probability: number;
}

export interface HardwareNode {
  id: string;
  type: string;
  status: string;
  utilization: number;
  temp: string;
}

export interface DepositRecord {
  id: string;
  timestamp: number;
  amount: number;
  routing: string;
  account: string;
  status: 'VERIFIED' | 'SETTLING' | 'SECURED';
  rail: 'CASH_APP' | 'HERITAGE' | 'APEX_ESCROW';
  verificationHash: string;
}

export interface ReasoningBranch {
  id: string;
  label: string;
  content: string;
  status: 'thinking' | 'resolved' | 'merged';
}

export interface SovereignTenant {
  id: string;
  owner: string;
  roles: string[];
  boundaries: ('compute' | 'trust' | 'commerce')[];
  status: 'Provisioned' | 'Reconciling' | 'Error';
}

export interface SpatialParcel {
  id: number;
  pin: string;
  countyName: string;
  lastSalePrice: number;
  ownerInfo: any;
  geom: string; 
  inferences: {
    featureType: 'septic' | 'well' | 'foundation';
    probability: number;
    metadata: any;
  }[];
  timber: {
    species: string;
    volume: number;
    canopyHeight: number;
  } | null;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';
  summary: string;
  logs?: string[];
  startedAt?: number;
  finishedAt?: number;
}

export interface WorkflowRun {
  id: string;
  brandId: string;
  workflowKey: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED';
  steps: WorkflowStep[];
  startedAt: number;
  finishedAt?: number;
}

export interface SystemMetrics {
  tflops: number;
  latency: number;
  uptime: number;
  memoryBandwidth: number;
  temp: number;
  nodeCount: number;
  cacheHitRate: number;
  circuitStatus: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  requestThroughput: number;
  wafShield: 'ACTIVE' | 'BYPASS' | 'THREAT_DETECTED';
  anycastHealth: number;
  zeroTrustTunnel: 'CONNECTED' | 'RECONNECTING';
}
