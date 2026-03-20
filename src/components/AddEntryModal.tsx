"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Node, NodeType } from "@/types/node";

const NODE_TYPES: { value: NodeType; label: string }[] = [
  { value: "thought", label: "Thought" },
  { value: "journal", label: "Journal" },
  { value: "dream", label: "Dream" },
  { value: "mood", label: "Mood" },
  { value: "health", label: "Health" },
];

const EMOTIONS = [
  "calm",
  "anxious",
  "happy",
  "sad",
  "stressed",
  "grateful",
  "worried",
  "peaceful",
  "overwhelmed",
  "hopeful",
  "exhausted",
  "reflective",
  "other",
];

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (node: Omit<Node, "id" | "timestamp">) => void;
}

export function AddEntryModal({
  isOpen,
  onClose,
  onAdd,
}: AddEntryModalProps) {
  const [type, setType] = useState<NodeType>("journal");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [emotion, setEmotion] = useState("");
  const [intensity, setIntensity] = useState<number | null>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(/[,\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    onAdd({
      type,
      content: content.trim() || null,
      tags,
      emotion: emotion || null,
      intensity: intensity ?? null,
    });

    setContent("");
    setTagsInput("");
    setEmotion("");
    setIntensity(5);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-2xl p-6 shadow-2xl border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30, 30, 60, 0.98) 0%, rgba(20, 20, 40, 0.99) 100%)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-white/90">
                  New Entry
                </h2>
                <button
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors p-1"
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as NodeType)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:outline-none focus:border-violet-500/50"
                  >
                    {NODE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    What&apos;s on your mind?
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thought, dream, or reflection..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="work, stress, sleep..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      Emotion
                    </label>
                    <select
                      value={emotion}
                      onChange={(e) => setEmotion(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:outline-none focus:border-violet-500/50"
                    >
                      <option value="">Select...</option>
                      {EMOTIONS.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      Intensity (1–10)
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={intensity ?? 5}
                      onChange={(e) =>
                        setIntensity(parseInt(e.target.value, 10))
                      }
                      className="w-full mt-1"
                    />
                    <span className="text-sm text-white/50">
                      {intensity ?? 5}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-violet-500/30 hover:bg-violet-500/40 text-violet-200 border border-violet-500/30 transition-colors"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
