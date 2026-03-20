import type { Node, Pattern } from "@/types/node";

const MAX_REPRESENTATIVE_NODES = 5;

function simpleSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return union > 0 ? intersection / union : 0;
}

export function selectRepresentativeNodes(pattern: Pattern): Node[] {
  const nodes = [...pattern.nodes];
  if (nodes.length <= MAX_REPRESENTATIVE_NODES) return nodes;

  const selected: Node[] = [];
  const usedIds = new Set<string>();

  // 1. Pick most recent node
  const byTimestamp = [...nodes].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  if (byTimestamp[0] && !usedIds.has(byTimestamp[0].id)) {
    selected.push(byTimestamp[0]);
    usedIds.add(byTimestamp[0].id);
  }

  // 2. Pick highest intensity node
  const withIntensity = nodes.filter((n) => n.intensity != null);
  if (withIntensity.length > 0) {
    const highest = withIntensity.reduce((a, b) =>
      (a.intensity ?? 0) >= (b.intensity ?? 0) ? a : b
    );
    if (!usedIds.has(highest.id)) {
      selected.push(highest);
      usedIds.add(highest.id);
    }
  }

  // 3. Pick most similar nodes (fallback: same tag)
  const remaining = nodes.filter((n) => !usedIds.has(n.id));
  if (remaining.length > 0 && selected.length > 0) {
    const reference = selected[0];
    const withSimilarity = remaining.map((n) => ({
      node: n,
      sim: simpleSimilarity(reference.content ?? "", n.content ?? ""),
    }));
    withSimilarity.sort((a, b) => b.sim - a.sim);

    // If no good similarity, use same tag
    const tag = pattern.tag;
    const byTag: Node[] =
      tag && withSimilarity.every((x) => x.sim < 0.2)
        ? remaining.filter((n) => n.tags?.includes(tag))
        : withSimilarity.map((x) => x.node);

    for (const n of byTag) {
      if (selected.length >= MAX_REPRESENTATIVE_NODES) break;
      if (!usedIds.has(n.id)) {
        selected.push(n);
        usedIds.add(n.id);
      }
    }
  }

  // Fill remaining slots with any unused
  for (const n of remaining) {
    if (selected.length >= MAX_REPRESENTATIVE_NODES) break;
    if (!usedIds.has(n.id)) {
      selected.push(n);
      usedIds.add(n.id);
    }
  }

  return selected.slice(0, MAX_REPRESENTATIVE_NODES);
}
