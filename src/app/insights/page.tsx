"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Constellation } from "@/components/Constellation/Constellation";
import { InsightMessage } from "@/components/InsightMessage";
import { InsightNavigation } from "@/components/InsightNavigation";
import { NodeExpansionCard } from "@/components/NodeExpansionCard";
import { AddEntryModal } from "@/components/AddEntryModal";
import { EmptyInsightState } from "@/components/EmptyInsightState";
import { useMindPalaceStore } from "@/store/use-mind-palace-store";

function InsightsContent() {
  const {
    getCurrentInsight,
    currentInsightIndex,
    insights,
    nextInsight,
    prevInsight,
    setCurrentInsightIndex,
    selectedNodeIds,
    selectNode,
    nodes,
    addNode,
  } = useMindPalaceStore();

  const searchParams = useSearchParams();
  const [messageVisible, setMessageVisible] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("add") === "1") setAddModalOpen(true);
  }, [searchParams]);

  const currentInsight = getCurrentInsight();
  const selectedNode = selectedNodeIds.size > 0
    ? nodes.find((n) => selectedNodeIds.has(n.id)) ?? null
    : null;

  useEffect(() => {
    setMessageVisible(false);
    const t = setTimeout(() => setMessageVisible(true), 1200);
    return () => clearTimeout(t);
  }, [currentInsightIndex]);

  return (
    <div className="min-h-screen bg-palace-dark">
      <div className="fixed top-6 left-6 right-6 flex justify-between items-center z-50">
        <Link
          href="/"
          className="text-white/50 hover:text-white/80 text-sm transition-colors"
        >
          ← Back
        </Link>
        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-violet-500/30 hover:bg-violet-500/40 text-violet-200 border border-violet-500/30 text-sm font-medium transition-colors"
        >
          + New Entry
        </button>
      </div>
      <Constellation />

      <AnimatePresence mode="wait">
        {insights.length > 0 ? (
          <InsightMessage
            key={currentInsightIndex}
            insight={currentInsight}
            isVisible={messageVisible}
          />
        ) : (
          <EmptyInsightState onAddEntry={() => setAddModalOpen(true)} />
        )}
      </AnimatePresence>

      <InsightNavigation
        currentIndex={currentInsightIndex}
        total={Math.max(insights.length, 1)}
        onNext={nextInsight}
        onPrev={prevInsight}
        onGoTo={setCurrentInsightIndex}
      />

      <NodeExpansionCard
        node={selectedNode}
        onClose={() => selectNode(null)}
      />

      <AddEntryModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={addNode}
      />
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-palace-dark flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    }>
      <InsightsContent />
    </Suspense>
  );
}
