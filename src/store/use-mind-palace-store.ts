import { create } from "zustand";
import type { Node, Pattern, Insight } from "@/types/node";
import { detectPatterns, generateInsight } from "@/lib/pattern-engine";
import { MOCK_NODES } from "@/data/mock-nodes";

const MAX_NODES_RENDERED = 100;
const STORAGE_KEY = "mind-palace-nodes";

function loadFromStorage(): Node[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(nodes: Node[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
  } catch {}
}

interface MindPalaceState {
  nodes: Node[];
  patterns: Pattern[];
  insights: Insight[];
  currentInsightIndex: number;
  selectedNodeIds: Set<string>;
  highlightedNodeIds: Set<string>;
  useMockData: boolean;

  setNodes: (nodes: Node[]) => void;
  addNode: (node: Omit<Node, "id" | "timestamp">) => void;
  loadNodes: () => void;
  loadPatternsAndInsights: () => void;
  setCurrentInsightIndex: (index: number) => void;
  nextInsight: () => void;
  prevInsight: () => void;
  selectNode: (id: string | null) => void;
  setHighlightedNodes: (ids: string[]) => void;
  getDisplayNodes: () => Node[];
  getCurrentInsight: () => Insight | null;
}

export const useMindPalaceStore = create<MindPalaceState>((set, get) => ({
  nodes: [],
  patterns: [],
  insights: [],
  currentInsightIndex: 0,
  selectedNodeIds: new Set(),
  highlightedNodeIds: new Set(),
  useMockData: true,

  setNodes: (nodes) => set({ nodes }),

  addNode: (node) => {
    const newNode: Node = {
      ...node,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    const stored = loadFromStorage();
    const updated = [newNode, ...stored];
    saveToStorage(updated);
    set({ nodes: updated });
    get().loadPatternsAndInsights();
  },

  loadNodes: () => {
    const stored = loadFromStorage();
    const source = stored.length > 0 ? stored : MOCK_NODES;
    set({ nodes: source });
    get().loadPatternsAndInsights();
  },

  loadPatternsAndInsights: () => {
    const { nodes } = get();
    const source = nodes.length > 0 ? nodes : MOCK_NODES;
    if (source.length === 0) return;

    const patterns = detectPatterns(source);
    const insights = patterns.map(generateInsight);

    set({
      nodes: source,
      patterns,
      useMockData: nodes.length === 0,
      insights,
      currentInsightIndex: 0,
      highlightedNodeIds:
        insights[0]?.nodes.reduce(
          (acc, n) => {
            acc.add(n.id);
            return acc;
          },
          new Set<string>()
        ) ?? new Set(),
    });
  },

  setCurrentInsightIndex: (index) => {
    const { insights } = get();
    const clamped = Math.max(0, Math.min(index, insights.length - 1));
    const insight = insights[clamped];
    const highlightedNodeIds = insight?.nodes.reduce(
      (acc, n) => {
        acc.add(n.id);
        return acc;
      },
      new Set<string>()
    ) ?? new Set();

    set({ currentInsightIndex: clamped, highlightedNodeIds });
  },

  nextInsight: () => {
    const { insights, currentInsightIndex } = get();
    if (currentInsightIndex < insights.length - 1) {
      get().setCurrentInsightIndex(currentInsightIndex + 1);
    }
  },

  prevInsight: () => {
    const { currentInsightIndex } = get();
    if (currentInsightIndex > 0) {
      get().setCurrentInsightIndex(currentInsightIndex - 1);
    }
  },

  selectNode: (id) =>
    set({
      selectedNodeIds: id ? new Set([id]) : new Set(),
    }),

  setHighlightedNodes: (ids) =>
    set({
      highlightedNodeIds: new Set(ids),
    }),

  getDisplayNodes: () => {
    const { nodes } = get();
    return nodes.slice(0, MAX_NODES_RENDERED);
  },

  getCurrentInsight: () => {
    const { insights, currentInsightIndex } = get();
    return insights[currentInsightIndex] ?? null;
  },
}));
