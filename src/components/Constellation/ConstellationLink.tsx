"use client";

import { motion } from "framer-motion";
import type { GraphNode } from "@/lib/graph/layout";
import type { GraphLink } from "@/lib/graph/layout";

interface ConstellationLinkProps {
  link: GraphLink;
  nodes: Map<string, GraphNode>;
  isHighlighted: boolean;
  highlightedNodeIds: Set<string>;
}

export function ConstellationLink({
  link,
  nodes,
  isHighlighted,
  highlightedNodeIds,
}: ConstellationLinkProps) {
  const source = nodes.get(link.source);
  const target = nodes.get(link.target);

  if (!source || !target) return null;

  const opacity = isHighlighted ? 0.6 : 0.15;
  const strokeWidth = isHighlighted ? 1.5 : 0.5;

  return (
    <motion.line
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke="url(#linkGradient)"
      strokeWidth={strokeWidth}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  );
}
