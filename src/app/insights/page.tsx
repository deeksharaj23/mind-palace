"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Constellation } from "@/components/Constellation/Constellation";
import { InsightMessage } from "@/components/InsightMessage";
import { InsightNavigation } from "@/components/InsightNavigation";
import { NodeExpansionCard } from "@/components/NodeExpansionCard";
import { useMindPalaceStore } from "@/store/use-mind-palace-store";

export default function InsightsPage() {
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
  } = useMindPalaceStore();

  const [messageVisible, setMessageVisible] = useState(false);

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
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 text-white/50 hover:text-white/80 text-sm transition-colors"
      >
        ← Back
      </Link>
      <Constellation />

      <AnimatePresence mode="wait">
        <InsightMessage
          key={currentInsightIndex}
          insight={currentInsight}
          isVisible={messageVisible}
        />
      </AnimatePresence>

      <InsightNavigation
        currentIndex={currentInsightIndex}
        total={insights.length}
        onNext={nextInsight}
        onPrev={prevInsight}
        onGoTo={setCurrentInsightIndex}
      />

      <NodeExpansionCard
        node={selectedNode}
        onClose={() => selectNode(null)}
      />
    </div>
  );
}
