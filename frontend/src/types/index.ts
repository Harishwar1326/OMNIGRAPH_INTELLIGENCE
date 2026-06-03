export type EntityType =
  | 'Topic'
  | 'Concept'
  | 'Person'
  | 'Organization'
  | 'Technology'
  | 'Event'
  | 'Project';

export interface KnowledgeItem {
  name: string;
  description?: string;
}

export interface Entity {
  name: string;
  type: EntityType | string;
  description?: string;
}

export interface Relationship {
  source: string;
  relationship: string;
  target: string;
  confidence?: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  status?: 'MODIFIED' | 'REMOVED' | 'ADDED';
  description?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  confidence?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface UploadResult {
  documentId: string;
  filename?: string;
  textLength: number;
  entities: Entity[];
  relationships: Relationship[];
  topics?: KnowledgeItem[];
  concepts?: KnowledgeItem[];
  stats: {
    entityCount: number;
    relationshipCount: number;
    topicCount?: number;
    conceptCount?: number;
  };
}

export interface ChatResponse {
  answer: string;
  confidence: number;
  evidence: { path: string; source: string }[];
  contextUsed: number;
}

export interface DiscoverySuggestion {
  entityA: string;
  entityB: string;
  sharedNode: string;
  reason: string;
  confidence: number;
  type: string;
  message?: string;
}

export interface Stats {
  nodeCount: number;
  relationshipCount: number;
  documentCount: number;
  entityTypes: Record<string, number>;
}

export interface SimulationType {
  id: string;
  name: string;
}

export interface SimulationResult {
  query?: string;
  type: string;
  summary: string;
  impactScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  impactedTeams: string[];
  impactedProjects: string[];
  impactedEntities?: string[];
  risks: { level: string; message: string }[];
  costEstimate: string;
  graphChanges: any[];
  aiRecommendations: string[];
  simulatedGraph: GraphData;
  originalGraph: GraphData;
  plan?: {
    action: string;
    source: string;
    target?: string;
  };
}

