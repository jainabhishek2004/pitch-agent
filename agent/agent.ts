import { defineAgent } from "eve";

// Model resolves through the Vercel AI Gateway. It uses your team's OpenAI key
// (added as BYOK in the gateway settings), so tokens are billed to your OpenAI
// account. Swap the string for any model your key supports — e.g. "openai/gpt-4o",
// "openai/gpt-4.1-mini" (cheaper), or back to "anthropic/claude-sonnet-4.6".
export default defineAgent({
  model: "openai/gpt-4.1",
  build: {
    // Ship @react-pdf/renderer UNBUNDLED in server/node_modules so its runtime
    // assets (yoga-layout WASM + fontkit AFM font metrics) survive Nitro's
    // tree-shaking. The PDF is rendered in pure JS — no headless browser.
    externalDependencies: ["@react-pdf/renderer"],
  },
});
