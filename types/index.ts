export type RunStatus = 'PENDING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';
export type StageStatus = 'PENDING' | 'RUNNING' | 'WAITING_HITL' | 'COMPLETED' | 'FAILED';
export type HitlMode = 'FULL_AUTO' | 'REVIEW_EACH' | 'REVIEW_CRITICAL' | 'CHAT_GUIDED' | 'STEP_BY_STEP' | 'MANUAL';
export type ArtifactType = 'LITERATURE' | 'HYPOTHESIS' | 'BENCHMARK' | 'DATA' | 'ANALYSIS' | 'PAPER' | 'REVIEW';
export type UserRole = 'RESEARCHER' | 'ADMIN';

export interface ResearchRun {
  id: string;
  topic: string;
  initiativeTitle: string;
  initiativeSummary: string;
  localEntity: string;
  status: RunStatus;
  mode: HitlMode;
  stages: Stage[];
  artifacts: Artifact[];
  paper?: Paper;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stage {
  id: string;
  number: number;
  phase: string;
  name: string;
  status: StageStatus;
  input?: any;
  output?: any;
  artifacts: Artifact[];
  hitlPause?: HitlPause;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  content: any;
  citations: Citation[];
  verified: boolean;
  createdAt: Date;
}

export interface Citation {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  venue?: string;
  doi?: string;
  url?: string;
  s2Id?: string;
  relevanceScore?: number;
  verified: boolean;
  verificationLog?: any;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  sections: PaperSections;
  citations: Citation[];
  latex?: string;
  pdfUrl?: string;
  peerReviews?: PeerReview[];
  qualityScore?: number;
}

export interface PaperSections {
  introduction: string;
  methods: string;
  results: string;
  discussion: string;
  conclusion: string;
  futureWork: string;
}

export interface PeerReview {
  reviewer: string;
  score: number;
  comments: string;
  recommendations: string;
}

export interface HitlPause {
  reason: string;
  requiredAction: string;
  userResponse?: string;
}

export interface LiteratureItem {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  abstract: string;
  url: string;
  doi?: string;
  relevance: number;
}

export interface BenchmarkConfig {
  title: string;
  description: string;
  kpis: KPI[];
  datasets: string[];
  metrics: string[];
}

export interface KPI {
  name: string;
  description: string;
  target: number;
  unit: string;
}

export interface PipelineState {
  currentStage: number;
  totalStages: number;
  status: RunStatus;
  messages: PipelineMessage[];
}

export interface PipelineMessage {
  stage: number;
  phase: string;
  message: string;
  timestamp: Date;
}
