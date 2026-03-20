import type { Node } from "@/types/node";

export interface GraphNode extends Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const SPREAD = 0.4;

export function computeGraphLayout(
  nodes: Node[],
  links: GraphLink[],
  width: number = 1200,
  height: number = 800
): GraphNode[] {
  const centerX = width / 2;
  const centerY = height / 2;

  return nodes.map((node, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 + Math.random() * 0.5;
    const radius =
      Math.min(width, height) * SPREAD * (0.5 + Math.random() * 0.5);
    return {
      ...node,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
    };
  });
}

export function buildLinksFromTags(nodes: Node[]): GraphLink[] {
  const links: GraphLink[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const shared = (a.tags || []).filter((t) => (b.tags || []).includes(t));
      if (shared.length > 0) {
        const key = [a.id, b.id].sort().join("-");
        if (!seen.has(key)) {
          seen.add(key);
          links.push({ source: a.id, target: b.id });
        }
      }
    }
  }
  return links;
}

export function getNodeSize(node: Node, maxFreq: number): number {
  const intensity = node.intensity ?? 5;
  const base = 4;
  const intensityFactor = intensity / 10;
  return base + intensityFactor * 8;
}

export function getNodeBrightness(node: Node, maxAge: number): number {
  const age = Date.now() - new Date(node.timestamp).getTime();
  return Math.max(0.3, 1 - age / maxAge);
}
