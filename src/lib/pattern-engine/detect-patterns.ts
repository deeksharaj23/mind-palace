import type { Node, Pattern } from "@/types/node";

const NEGATIVE_KEYWORDS = [
  "anxious",
  "anxiety",
  "stress",
  "stressed",
  "worried",
  "sad",
  "depressed",
  "overwhelmed",
  "exhausted",
  "frustrated",
  "angry",
  "scared",
  "lonely",
  "hopeless",
  "panic",
  "nervous",
  "fear",
  "struggling",
  "difficult",
  "terrible",
  "awful",
  "horrible",
];

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getTagFrequency(nodes: Node[]): Map<string, Node[]> {
  const now = Date.now();
  const sevenDaysAgo = now - SEVEN_DAYS_MS;
  const recentNodes = nodes.filter(
    (n) => new Date(n.timestamp).getTime() >= sevenDaysAgo
  );

  const tagMap = new Map<string, Node[]>();
  for (const node of recentNodes) {
    for (const tag of node.tags || []) {
      const existing = tagMap.get(tag) ?? [];
      existing.push(node);
      tagMap.set(tag, existing);
    }
  }
  return tagMap;
}

function detectNegativeSentiment(text: string): boolean {
  const lower = text.toLowerCase();
  return NEGATIVE_KEYWORDS.some((kw) => lower.includes(kw));
}

function simpleSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  const intersection = Array.from(wordsA).filter((w) => wordsB.has(w)).length;
  const union = new Set([...Array.from(wordsA), ...Array.from(wordsB)]).size;
  return union > 0 ? intersection / union : 0;
}

export function detectPatterns(nodes: Node[]): Pattern[] {
  const patterns: Pattern[] = [];
  const seenPatternIds = new Set<string>();

  // 1. Recurring tags (frequency over last 7 days)
  const tagMap = getTagFrequency(nodes);
  for (const [tag, tagNodes] of tagMap) {
    if (tagNodes.length >= 2) {
      const id = `recurring-${tag}`;
      if (!seenPatternIds.has(id)) {
        seenPatternIds.add(id);
        const hasNegative = tagNodes.some((n) =>
          detectNegativeSentiment(n.content ?? "")
        );
        patterns.push({
          id,
          type: "recurring_theme",
          tag,
          nodes: tagNodes,
          frequency: tagNodes.length,
          sentiment: hasNegative ? "negative" : "neutral",
        });
      }
    }
  }

  // 2. Negative sentiment clusters
  const negativeNodes = nodes.filter((n) =>
    detectNegativeSentiment(n.content ?? "")
  );
  if (negativeNodes.length >= 2) {
    const id = "emotional-negative";
    if (!seenPatternIds.has(id)) {
      seenPatternIds.add(id);
      patterns.push({
        id,
        type: "emotional_pattern",
        nodes: negativeNodes,
        frequency: negativeNodes.length,
        sentiment: "negative",
      });
    }
  }

  // 3. Repeated similar content (basic string similarity)
  const contentNodes = nodes.filter((n) => n.content && n.content.length > 10);
  for (let i = 0; i < contentNodes.length; i++) {
    const similar: Node[] = [contentNodes[i]];
    for (let j = i + 1; j < contentNodes.length && similar.length < 5; j++) {
      const sim = simpleSimilarity(
        contentNodes[i].content!,
        contentNodes[j].content!
      );
      if (sim >= 0.3) similar.push(contentNodes[j]);
    }
    if (similar.length >= 2) {
      const id = `correlation-${contentNodes[i].id}`;
      if (!seenPatternIds.has(id)) {
        seenPatternIds.add(id);
        patterns.push({
          id,
          type: "correlation",
          nodes: similar,
          frequency: similar.length,
          sentiment: "neutral",
        });
      }
    }
  }

  // 4. Mood streaks (low mood over time)
  const moodNodes = nodes.filter(
    (n) => n.type === "mood" && n.intensity != null
  );
  const lowMoodNodes = moodNodes.filter((n) => (n.intensity ?? 5) <= 3);
  if (lowMoodNodes.length >= 2) {
    const id = "mood-streak-low";
    if (!seenPatternIds.has(id)) {
      seenPatternIds.add(id);
      patterns.push({
        id,
        type: "emotional_pattern",
        nodes: lowMoodNodes,
        frequency: lowMoodNodes.length,
        sentiment: "negative",
      });
    }
  }

  return patterns;
}
