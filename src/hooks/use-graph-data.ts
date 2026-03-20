import { useMemo } from "react";
import type { Node } from "@/types/node";
import {
  computeGraphLayout,
  buildLinksFromTags,
  type GraphLink,
} from "@/lib/graph/layout";

export function useGraphData(
  nodes: Node[],
  width: number = 1200,
  height: number = 800
) {
  return useMemo(() => {
    const links = buildLinksFromTags(nodes);
    const graphNodes = computeGraphLayout(nodes, links, width, height);
    return { nodes: graphNodes, links };
  }, [nodes, width, height]);
}
