"use client";

import { motion } from "framer-motion";

interface EmptyInsightStateProps {
  onAddEntry: () => void;
}

export function EmptyInsightState({ onAddEntry }: EmptyInsightStateProps) {
  return (
    <motion.div
      className="fixed bottom-28 left-0 right-0 flex justify-center px-6 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="max-w-md w-full px-6 py-5 rounded-xl text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(30, 30, 60, 0.9) 0%, rgba(20, 20, 40, 0.95) 100%)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p className="text-white/70 mb-2">
          Add more entries to discover patterns in your thoughts.
        </p>
        <p className="text-sm text-white/50 mb-4">
          Journal your thoughts, moods, and dreams. The constellation will reveal insights as patterns emerge.
        </p>
        <button
          onClick={onAddEntry}
          className="px-4 py-2 rounded-lg bg-violet-500/30 hover:bg-violet-500/40 text-violet-200 border border-violet-500/30 text-sm font-medium transition-colors"
        >
          + Add your first entry
        </button>
      </div>
    </motion.div>
  );
}
