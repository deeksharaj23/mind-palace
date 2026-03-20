import type { Node, Pattern, Insight } from "@/types/node";
import { selectRepresentativeNodes } from "./select-representative-nodes";

const CONCERN_PHRASES = [
  "You've been showing signs of anxiety recently. Is everything okay?",
  "There's been a lot of stress in your entries lately. How are you holding up?",
  "Your recent entries suggest you might be struggling. Want to talk about it?",
  "You've mentioned feeling overwhelmed a few times. How are you doing?",
];

const SUPPORT_PHRASES = [
  "This has been coming up quite often. It might help to talk to someone.",
  "You've been circling around similar thoughts. Sometimes writing more or talking it through helps.",
  "This pattern keeps appearing. It might be worth exploring why.",
  "These themes keep resurfacing. Consider what they might be telling you.",
];

const ACTIVE_PHRASES = [
  "You've been circling around similar thoughts about {tag}.",
  "Work has been on your mind a lot lately.",
  "You've been reflecting on {tag} frequently.",
  "A few entries lately share a common thread.",
];

const NEUTRAL_PHRASES = [
  "A pattern emerged across your recent entries.",
  "Several of your entries connect around a theme.",
  "Your entries from the past week share some common ground.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function interpolateTag(template: string, tag?: string): string {
  return template.replace(/\{tag\}/g, tag ?? "this");
}

export function generateInsight(pattern: Pattern): Insight {
  const nodes = selectRepresentativeNodes(pattern);
  const isRepeatedNegative =
    pattern.sentiment === "negative" && pattern.frequency >= 3;
  const isPersistent = pattern.frequency >= 4;

  let message: string;
  let tone: Insight["tone"];

  if (isRepeatedNegative) {
    tone = "concern";
    message = pickRandom(CONCERN_PHRASES);
  } else if (isPersistent) {
    tone = "support";
    message = pickRandom(SUPPORT_PHRASES);
  } else if (pattern.type === "recurring_theme" && pattern.tag) {
    tone = "active";
    message = interpolateTag(pickRandom(ACTIVE_PHRASES), pattern.tag);
  } else {
    tone = "neutral";
    message = pickRandom(NEUTRAL_PHRASES);
  }

  return {
    id: `insight-${pattern.id}`,
    message,
    tone,
    nodes,
    pattern,
  };
}
