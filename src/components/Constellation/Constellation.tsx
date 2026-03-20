"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGraphData } from "@/hooks/use-graph-data";
import { useMindPalaceStore } from "@/store/use-mind-palace-store";
import { ConstellationNode } from "./ConstellationNode";
import { ConstellationLink } from "./ConstellationLink";
import { NodeHoverPreview } from "@/components/NodeHoverPreview";
import type { GraphLink } from "@/lib/graph/layout";

export function Constellation() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [hoveredNode, setHoveredNode] = useState<{ node: (typeof graphNodes)[0]; x: number; y: number } | null>(null);
  const {
    getDisplayNodes,
    loadPatternsAndInsights,
    highlightedNodeIds,
    selectedNodeIds,
    selectNode,
  } = useMindPalaceStore();

  const nodes = getDisplayNodes();
  const { nodes: graphNodes, links } = useGraphData(
    nodes,
    dimensions.width,
    dimensions.height
  );

  useEffect(() => {
    loadPatternsAndInsights();
  }, [loadPatternsAndInsights]);

  useEffect(() => {
    const onResize = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const nodeMap = useMemo(
    () => new Map(graphNodes.map((n) => [n.id, n])),
    [graphNodes]
  );

  const maxAge = useMemo(() => {
    if (nodes.length === 0) return 1;
    const now = Date.now();
    return Math.max(
      ...nodes.map((n) => now - new Date(n.timestamp).getTime()),
      1
    );
  }, [nodes]);

  const maxFreq = useMemo(() => {
    const freq = new Map<string, number>();
    nodes.forEach((n) => {
      (n.tags || []).forEach((t) => freq.set(t, (freq.get(t) ?? 0) + 1));
    });
    return Math.max(...Array.from(freq.values()), 1);
  }, [nodes]);

  const highlightedLinks = useMemo(() => {
    const ids = highlightedNodeIds;
    return links.filter(
      (l) => ids.has(l.source) && ids.has(l.target)
    ) as GraphLink[];
  }, [links, highlightedNodeIds]);

  const dimmed = highlightedNodeIds.size > 0;

  const handleNodeHover = (id: string | null) => {
    if (!id) {
      setHoveredNode(null);
      return;
    }
    const node = graphNodes.find((n) => n.id === id);
    if (node) setHoveredNode({ node, x: node.x, y: node.y });
    else setHoveredNode(null);
  };

  return (
    <div className="fixed inset-0 bg-palace-dark overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 70%)",
        }}
      />

      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 w-full h-full"
        onClick={() => selectNode(null)}
      >
        <defs>
          <linearGradient
            id="nodeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.5} />
          </linearGradient>
        </defs>

        {/* Links - dimmed background links first */}
        {dimmed &&
          links
            .filter((l) => !highlightedNodeIds.has(l.source) || !highlightedNodeIds.has(l.target))
            .map((link, i) => (
              <ConstellationLink
                key={`dim-${link.source}-${link.target}-${i}`}
                link={link}
                nodes={nodeMap}
                isHighlighted={false}
                highlightedNodeIds={highlightedNodeIds}
              />
            ))}

        {/* Highlighted links */}
        {highlightedLinks.map((link) => (
          <ConstellationLink
            key={`hl-${link.source}-${link.target}`}
            link={link}
            nodes={nodeMap}
            isHighlighted
            highlightedNodeIds={highlightedNodeIds}
          />
        ))}

        {/* Non-dimmed links (when no highlight) */}
        {!dimmed &&
          links.map((link, i) => (
            <ConstellationLink
              key={`${link.source}-${link.target}-${i}`}
              link={link}
              nodes={nodeMap}
              isHighlighted={false}
              highlightedNodeIds={highlightedNodeIds}
            />
          ))}

        {/* Nodes */}
        {graphNodes.map((node) => (
          <ConstellationNode
            key={node.id}
            node={node}
            isHighlighted={highlightedNodeIds.has(node.id)}
            isDimmed={dimmed && !highlightedNodeIds.has(node.id)}
            maxAge={maxAge}
            maxFreq={maxFreq}
            onHover={(id) => handleNodeHover(id)}
            onClick={selectNode}
          />
        ))}
      </svg>

      <AnimatePresence>
        {hoveredNode && (
          <NodeHoverPreview
            node={hoveredNode.node}
            x={hoveredNode.x}
            y={hoveredNode.y}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
