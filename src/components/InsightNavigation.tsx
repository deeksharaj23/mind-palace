"use client";

import { motion } from "framer-motion";

interface InsightNavigationProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onGoTo?: (index: number) => void;
}

export function InsightNavigation({
  currentIndex,
  total,
  onNext,
  onPrev,
  onGoTo,
}: InsightNavigationProps) {
  if (total <= 1) return null;

  return (
    <div className="fixed bottom-8 left-0 right-0 flex items-center justify-center gap-6 z-30">
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Previous
      </button>

      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => onGoTo?.(i)}
            className="w-2 h-2 rounded-full transition-colors"
            style={{
              background:
                i === currentIndex
                  ? "rgba(167, 139, 250, 0.9)"
                  : "rgba(255,255,255,0.2)",
            }}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={currentIndex >= total - 1}
        className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Next
      </button>
    </div>
  );
}
