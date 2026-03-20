export type NodeType =
  | "thought"
  | "journal"
  | "dream"
  | "mood"
  | "health";

export interface Node {
  id: string;
  type: NodeType;
  content: string | null;
  tags: string[];
  timestamp: string;
  emotion: string | null;
  intensity: number | null;
  embedding?: number[]; // Stubbed for future vector search
}

export interface Pattern {
  id: string;
  type: "recurring_theme" | "emotional_pattern" | "correlation";
  tag?: string;
  nodes: Node[];
  frequency: number;
  sentiment: "positive" | "neutral" | "negative";
}

export interface Insight {
  id: string;
  message: string;
  tone: "neutral" | "active" | "concern" | "support";
  nodes: Node[];
  pattern: Pattern;
}
