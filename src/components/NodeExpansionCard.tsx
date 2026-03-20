"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Node } from "@/types/node";

interface NodeExpansionCardProps {
  node: Node | null;
  onClose: () => void;
}

export function NodeExpansionCard({ node, onClose }: NodeExpansionCardProps) {
  return (
    <AnimatePresence>
      {node && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-2xl p-6 shadow-2xl border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30, 30, 60, 0.9) 0%, rgba(20, 20, 40, 0.95) 100%)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium uppercase tracking-wider text-violet-400">
                  {node.type}
                </span>
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {node.content && (
                <p className="text-white/90 text-lg leading-relaxed mb-4">
                  {node.content}
                </p>
              )}

              {node.emotion && (
                <p className="text-violet-400 text-sm mb-2">
                  Emotion: {node.emotion}
                  {node.intensity != null && ` (${node.intensity}/10)`}
                </p>
              )}

              {node.tags && node.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {node.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-lg text-xs bg-violet-500/20 text-violet-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-white/50 text-sm">
                {new Date(node.timestamp).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
