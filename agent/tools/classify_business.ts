import { defineTool } from "eve/tools";
import { z } from "zod";
import { classify } from "../../lib/classify.mjs";
import { productById, painsForType } from "../../lib/knowledge.mjs";

// Grounds the model: runs the SHARED recommendation rules (PRD §3/§14) over the company text
// and returns the rule-based classification + recommended stack + likely pains.
// The model should treat this as a strong starting point, then refine with judgement.
export default defineTool({
  description: "Classify the business and get the rule-based recommended Hyperion stack + likely pains (the shared catalog's recommendation). Use this to ground the pitch, then refine.",
  inputSchema: z.object({
    text: z.string().describe("All known text about the company: business-card text + website research combined."),
  }),
  async execute({ text }) {
    const cls = classify(text);
    const name = (id: string) => productById(id)?.name || id;
    return {
      classification: cls.classification,
      primaryType: cls.label,
      erpDetected: cls.erpDetected,
      recommendedStack: {
        primary: name(cls.rule.primary),
        secondary: cls.rule.secondary.map(name),
        expansion: cls.rule.expansion.map(name),
        aiLayer: cls.rule.aiLayer,
      },
      likelyPains: painsForType(cls.primary).slice(0, 6).map((p) => ({ text: p.text, category: p.category, impact: p.impact })),
    };
  },
});
