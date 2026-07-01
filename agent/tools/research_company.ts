import { defineTool } from "eve/tools";
import { z } from "zod";
import { researchCompany } from "../../lib/research.mjs";

// Fetches the client's website and extracts text signals (title, description, headings, body).
export default defineTool({
  description: "Research a company by fetching its website and extracting what it does, its industry and scale signals.",
  inputSchema: z.object({
    website: z.string().describe("The company website URL or domain (e.g. procx.in)."),
  }),
  async execute({ website }) {
    return await researchCompany(website);
  },
});
