import { defineTool } from "eve/tools";
import { z } from "zod";
import { renderPitchPdf } from "../../lib/pitch-pdf.mjs";
import { savePdf } from "../../lib/storage.mjs";
import { brand } from "../../lib/knowledge.mjs";

// The input schema IS the pitch contract — it enforces the PRD rules:
// forces primary/secondary/expansion + AI layer, makes "howItHelpsSpecifically" mandatory,
// and labels each pain confirmed vs likely.
const Pitch = z.object({
  client: z.object({
    name: z.string(),
    website: z.string().optional().default(""),
    industry: z.string(),
    businessModel: z.string(),
    classification: z.array(z.string()).min(1),
  }),
  hook: z.object({
    label: z.string().default("AI-NATIVE OPERATIONS PLATFORM"),
    headline: z.array(z.string()).length(2).describe("Two parts; the second is highlighted."),
    subhead: z.string(),
  }),
  painPoints: z.array(z.object({
    text: z.string(),
    confidence: z.enum(["confirmed", "likely"]),
    category: z.string(),
  })).min(3).max(6),
  productStack: z.object({
    primary: z.object({ name: z.string(), why: z.string() }),
    secondary: z.array(z.string()),
    expansion: z.array(z.string()),
    aiLayer: z.array(z.string()),
    reasoning: z.string(),
  }),
  features: z.array(z.object({
    feature: z.string(), product: z.string(), painSolved: z.string(), businessImpact: z.string(),
  })).min(2).max(5),
  howItHelpsSpecifically: z.string().describe("MANDATORY. Because [client] operates as [model], Hyperion helps by [solution] so that they can [outcome]."),
  aiAgents: z.array(z.object({ name: z.string(), automates: z.string() })).min(1),
  roadmap: z.array(z.object({ n: z.string(), title: z.string(), body: z.string() })).min(3).max(4),
  cta: z.object({
    label: z.string().default("GET STARTED"),
    headline: z.array(z.string()).length(2),
    subhead: z.string(),
    action: z.string().default("BOOK A WALKTHROUGH"),
  }),
});

export default defineTool({
  description: "Render the finished structured pitch into a brand-exact 4-page PDF. Call this last.",
  inputSchema: Pitch,
  async execute(pitch) {
    const full = { ...pitch, meta: { preparedFor: `Prepared for ${pitch.client.name}`, brand: brand.company } };
    const id = `${pitch.client.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "client"}-${Date.now()}`;
    const buffer = await renderPitchPdf(full);
    const url = await savePdf(buffer, id);
    return { ok: true, url, pages: 4, message: `Generated a 4-page pitch PDF for ${pitch.client.name}: ${url}` };
  },
});
