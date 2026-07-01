import { defineTool } from "eve/tools";
import { z } from "zod";
import { searchKnowledgeBase } from "../../lib/knowledge.mjs";

// The source of truth. Returns matching Hyperion products, features, AI agents and pain points.
// Use this to ground every claim — never invent products or features.
export default defineTool({
  description: "Search the Hyperion knowledge base (products, features, AI agents, pain points). The only source of truth for what Hyperion offers.",
  inputSchema: z.object({
    query: z.string().describe("Keywords — e.g. 'warehouse', 'expiry', 'ERP', 'last mile', or '' to list everything."),
  }),
  async execute({ query }) {
    return searchKnowledgeBase(query);
  },
});
