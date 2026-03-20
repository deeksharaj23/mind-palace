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
    neutral: "text-white/80",
    active: "text-blue-200",
    concern: "text-amber-200",
    support: "text-violet-200",
  };

  return (
    <motion.div
      className="fixed bottom-24 left-0 right-0 flex justify-center px-6 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="max-w-xl px-6 py-4 rounded-xl text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(30, 30, 60, 0.85) 0%, rgba(20, 20, 40, 0.9) 100%)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p className={`text-lg font-medium ${toneColors[insight.tone]}`}>
          {insight.message}
        </p>
      </div>
    </motion.div>
  );
}
