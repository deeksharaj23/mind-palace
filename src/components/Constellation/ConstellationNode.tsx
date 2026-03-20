"use client";

import { motion } from "framer-motion";
import type { GraphNode } from "@/lib/graph/layout";
import { getNodeSize, getNodeBrightness } from "@/lib/graph/layout";

interface ConstellationNodeProps {
  node: GraphNode;
  isHighlighted: boolean;
  isDimmed: boolean;
  maxAge: number;
  maxFreq: number;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

export function ConstellationNode({
  node,
  isHighlighted,
  isDimmed,
  maxAge,
  maxFreq,
  onHover,
  onClick,
}: ConstellationNodeProps) {
  const size = getNodeSize(node, maxFreq);
  const brightness = getNodeBrightness(node, maxAge);

  const baseOpacity = isDimmed ? 0.15 : isHighlighted ? 1 : 0.5;
  const glowOpacity = isHighlighted ? 0.8 : 0.3;
  const scale = isHighlighted ? 1.1 : 1;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: baseOpacity,
        scale,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onHoverStart={() => onHover(node.id)}
      onHoverEnd={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(node.id);
      }}
      style={{ cursor: "pointer" }}
    >
      {/* Glow */}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={size * 3}
        fill="url(#nodeGlow)"
        opacity={glowOpacity * brightness}
        animate={
          isHighlighted
            ? {
                opacity: [
                  glowOpacity * brightness,
                  glowOpacity * brightness * 1.2,
                  glowOpacity * brightness,
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Core dot */}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={size}
        fill="url(#nodeGradient)"
        opacity={brightness}
      />
    </motion.g>
  );
}
