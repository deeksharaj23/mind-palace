"use client";

import { motion } from "framer-motion";
import type { Node } from "@/types/node";

interface NodeHoverPreviewProps {
  node: Node | null;
  x: number;
  y: number;
}

export function NodeHoverPreview({ node, x, y }: NodeHoverPreviewProps) {
  if (!node) return null;

  const preview = node.content
    ? node.content.slice(0, 60) + (node.content.length > 60 ? "…" : "")
    : node.type;

  return (
    <motion.div
      className="fixed pointer-events-none z-50 max-w-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        left: Math.min(x + 16, typeof window !== "undefined" ? window.innerWidth - 220 : x + 16),
        top: y - 8,
      }}
    >
      <div
        className="px-3 py-2 rounded-lg text-sm text-white/90"
        style={{
          background: "rgba(20, 20, 40, 0.95)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {preview}
      </div>
    </motion.div>
  );
}
