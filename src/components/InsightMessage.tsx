"use client";

import { motion } from "framer-motion";
import type { Insight } from "@/types/node";

interface InsightMessageProps {
  insight: Insight | null;
  isVisible: boolean;
}

export function InsightMessage({ insight, isVisible }: InsightMessageProps) {
  if (!insight) return null;

  const toneColors = {
    neutral: "text-white/90",
    active: "text-blue-200",
    concern: "text-amber-200",
    support: "text-violet-200",
  };

  const entryCount = insight.nodes.length;

  return (
    <motion.div
      className="fixed bottom-28 left-0 right-0 flex justify-center px-6 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="max-w-xl w-full px-6 py-5 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(30, 30, 60, 0.92) 0%, rgba(20, 20, 40, 0.95) 100%)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p className="text-xs text-white/50 mb-2">
          Based on {entryCount} {entryCount === 1 ? "entry" : "entries"} from your journal
        </p>
        <p className={`text-lg font-medium ${toneColors[insight.tone]} mb-3`}>
          {insight.message}
        </p>
        <p className="text-sm text-white/50">
          Tap the glowing nodes above to read the entries behind this insight.
        </p>
      </div>
    </motion.div>
  );
}
