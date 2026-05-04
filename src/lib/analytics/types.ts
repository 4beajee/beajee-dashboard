export type RangeKey = "7d" | "30d" | "90d" | "365d" | "all";

export interface AnalyticsMeta {
  generatedAt: string;
  range: {
    key: string;
    label: string;
    from: string | null;
    to: string;
  };
}

export interface RangeParams {
  range?: RangeKey;
  from?: string;
  to?: string;
}

export interface SeriesPoint {
  date: string;
  value: number;
}

export interface CountRow {
  count: number;
  [key: string]: string | number | null;
}

export interface OverviewAnalytics extends AnalyticsMeta {
  summary: {
    owners: { total: number; onboarded: number; demo: number; real: number };
    agents: {
      total: number;
      active: number;
      demo: number;
      real: number;
      wakeWebhooks: {
        enabled: number;
        healthy: number;
        unhealthy: number;
        unknown: number;
        successRate: number | null;
      };
    };
    contexts: {
      published: number;
      freshness: Record<"ACTIVE" | "AGING" | "STALE" | "INACTIVE", number>;
    };
    matches: {
      negotiating: number;
      proposed: number;
      matched: number;
      dormant: number;
      declined: number;
      matchPrecision: { avgSimilarityConfirmed: number | null; coverage: number | null };
    };
    beacons: { total: number; active: number; triggered: number };
    networkVitality: { activeBeacons: number; uniqueExpertiseTags: number; value: number | null };
    countries: { captured: number; missing: number };
  };
  ttfv: {
    firstProposed: WaitStats;
    firstMatched: WaitStats;
  };
  funnel: Record<string, number>;
  series: {
    ownersCreated: SeriesPoint[];
    proposals: SeriesPoint[];
    matched: SeriesPoint[];
    adviceRequested: SeriesPoint[];
  };
}

export interface WaitStats {
  count: number;
  avgHours: number | null;
  medianHours: number | null;
  p90Hours: number | null;
  waitingNow: number;
  waitingOver48h: number;
}

export interface TrustAnalytics extends AnalyticsMeta {
  trustGap: Record<string, number | string | null>;
  ghosting: {
    activeNegotiations: number;
    ghostedOver24h: number;
    ghostedRate: number | null;
    oldest: Array<{
      matchId: string;
      ageHours: number | null;
      agentA: { agentId: string; isDemo: boolean };
      agentB: { agentId: string; isDemo: boolean };
    }>;
  };
  humanConversion: Record<string, number | null>;
  matchPrecision: {
    confirmedMatchesWithSimilarity: number;
    avgSimilarity: number | null;
    medianSimilarity: number | null;
    bySource: Record<string, number>;
  };
  negotiationEfficiency: { agentsTracked: number; avgNegotiationSuccessRate: number | null };
}

export interface NetworkAnalytics extends AnalyticsMeta {
  supplyDemand: {
    topSupply: Array<{ tag: string; count: number }>;
    topDemand: Array<{ tag: string; count: number }>;
    biggestShortages: Array<{ tag: string; supply: number; demand: number; gap: number }>;
    biggestOversupply: Array<{ tag: string; supply: number; demand: number; gap: number }>;
    methodology: string;
  };
  freshness: {
    avgDaysSinceSignificantUpdate: number | null;
    medianDaysSinceSignificantUpdate: number | null;
    p90DaysSinceSignificantUpdate: number | null;
    states: Record<"ACTIVE" | "AGING" | "STALE" | "INACTIVE", number>;
  };
  embeddingDrift: Record<string, number | string | null>;
  contextVolume: {
    totalPublishedContexts: number;
    demoContexts: number;
    realContexts: number;
    topLookingForPhrases: Array<{ phrase: string; count: number }>;
  };
}

export interface BeaconAnalytics extends AnalyticsMeta {
  liquidity: {
    createdInRange: number;
    activeNow: number;
    triggeredInRange: number;
    triggerRate: number | null;
    timeToTriggerHours: { avg: number | null; median: number | null; p90: number | null };
    waitingLongerThan14d: number;
  };
  falsePositives: Record<string, number | string | null>;
  topQueries: Array<{ query: string; count: number }>;
}

export interface AdviceAnalytics extends AnalyticsMeta {
  sessions: {
    total: number;
    byStatus: Record<string, number>;
    avgHoursToApproval: number | null;
    avgHoursToCompletion: number | null;
  };
  conversion: {
    chatsWithAdvice: number;
    chatsWithContactExchange: number;
    adviceConversionRate: number | null;
    note: string;
    examples: Array<{ chatId: string; signals: string[] }>;
  };
  dissonance: {
    completedSessions: number;
    severe: number;
    mild: number;
    severeRate: number | null;
    verdicts: Array<{ verdict: string; count: number }>;
    note: string;
  };
}

export interface AgentAnalytics extends AnalyticsMeta {
  integrity: {
    agentsTracked: number;
    agentsWithReports: number;
    agentsWithPublicDislikes: number;
    note: string;
  };
  topSpammy: AgentQualityRow[];
  topNegativeFeedback: AgentQualityRow[];
}

export interface AgentQualityRow {
  internalId: string;
  agentId: string;
  ownerName: string;
  isDemo: boolean;
  reputationScore: number | null;
  freshnessState: string | null;
  totalInitiatedNegotiations: number;
  completedMatches: number;
  totalProposedMatches: number;
  totalAcceptedByOwner: number;
  negotiationAcceptanceRate: number | null;
  ownerAcceptanceRate: number | null;
  spammyIndex: number | null;
  reportsAgainst: number;
  publicDislikes: number;
  negativeFeedback: number;
}

export interface CountryAnalytics extends AnalyticsMeta {
  summary: { registeredUsers: number; withCountry: number; withoutCountry: number };
  countries: Array<{
    countryCode: string;
    total: number;
    onboarded: number;
    pending: number;
    demo: number;
    real: number;
    onboardingRate: number | null;
  }>;
}

export interface UsersAnalytics extends AnalyticsMeta {
  summary: { totalUsers: number; onboarded: number; pendingOnboarding: number };
  users: UserRow[];
}

export interface UserRow {
  ownerId: string;
  email: string;
  name: string;
  createdAt: string;
  onboarded: boolean;
  countryCode: string | null;
  networkingGoal: string | null;
  agentPlatform: string | null;
  isDemo: boolean;
  agent: {
    agentId: string;
    isActive: boolean;
    lastActiveAt: string | null;
    reputationScore: number | null;
    freshnessState: string | null;
    currentWork: string | null;
  } | null;
  matches: { total: number; matched: number; proposed: number; dormant: number; declined: number };
  chats: number;
  reportsSubmitted: number;
}

export interface UserDetail {
  owner: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    onboarded: boolean;
    countryCode: string | null;
    networkingGoal: string | null;
    agentPlatform: string | null;
    privacyConsent: boolean;
    researchConsent: boolean;
    excludedTopics: string[];
    isDemo: boolean;
  };
  agent: {
    id: string;
    agentId: string;
    displayName: string;
    isActive: boolean;
    lastActiveAt: string | null;
    wakeWebhookEnabled: boolean;
    wakeWebhookLastPingAt: string | null;
    wakeWebhookLastPingOk: boolean | null;
    wakeWebhookLastPingError: string | null;
    reputationScore: number | null;
    context: {
      currentWork: string;
      expertise: string[];
      lookingFor: string;
      networkingGoal: string;
      freshnessState: string;
      updatedAt: string;
      lastSignificantUpdateAt: string;
    } | null;
  } | null;
  matches: UserMatch[];
}

export interface UserMatch {
  matchId: string;
  status: string;
  createdAt: string;
  proposedAt: string | null;
  matchedAt: string | null;
  overlapSummary: string;
  framingForMe: string;
  matchSimilarity: number | null;
  discoverySource: string;
  otherPerson: {
    ownerId: string;
    name: string;
    email: string;
    currentWork: string | null;
  };
  reactions: unknown[];
  comments: Array<{ id: string; ownerId: string; content: string; createdAt: string }>;
  chat: {
    chatId: string;
    status: string;
    createdAt: string;
    adviceSessions: Array<{
      id: string;
      status: string;
      promptTitle: string;
      promptText: string;
      summary: string | null;
      recommendation: string | null;
      createdAt: string;
      completedAt: string | null;
    }>;
    messages: Array<{
      id: string;
      fromOwner: string | null;
      kind: string;
      adviceSessionId: string | null;
      content: string;
      createdAt: string;
    }>;
  } | null;
}

export interface CostAnalytics extends AnalyticsMeta {
  tracked: {
    totalUsd: number | null;
    totalTokens: number;
    tokensPerSuccessfulMatch: number | null;
    usdPerSuccessfulMatch: number | null;
    production: CostBreakdown;
    demo: { totalUsd: number | null; totalTokens: number };
    byEvent: CostRow[];
    byTool: CostRow[];
    note: string;
  };
  untrackedActivity: Record<string, number | string>;
  webhooks: {
    enabledAgents: number;
    healthy: number;
    unhealthy: number;
    unknown: number;
    successRate: number | null;
    pingHistory: { total: number; success: number; failure: number; successRate: number | null };
  };
}

export interface CostBreakdown {
  totalUsd: number | null;
  totalTokens: number;
  byCategory: CostRow[];
  byOperation: CostRow[];
}

export interface CostRow {
  category?: string;
  operation?: string;
  event?: string;
  tool?: string;
  count: number;
  usd: number | null;
  tokensInput: number;
  tokensOutput: number;
}

export interface AnomalyAnalytics extends AnalyticsMeta {
  anomalies: Array<{
    key: string;
    severity: "info" | "warn" | "critical";
    title: string;
    summary: string;
    metric: number | null;
  }>;
}

export interface ReportAnalytics extends AnalyticsMeta {
  summary: {
    totalReports: number;
    uniqueChatsReported: number;
    uniqueReporters: number;
    note: string;
  };
  topReasons: Array<{ reason: string; count: number }>;
  recentReports: Array<{
    reportId: string;
    createdAt: string;
    reason: string;
    reporter: { id: string; name: string; email: string; isDemo: boolean };
    chat: { id: string; status: string };
    match: { id: string; status: string; overlapSummary: string };
    participants: Array<{
      side: string;
      agentId: string;
      isDemo: boolean;
      ownerId: string;
      ownerName: string;
      ownerEmail: string;
    }>;
  }>;
}
