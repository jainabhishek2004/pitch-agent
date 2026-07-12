import { defineAgent } from "eve";

// Model resolves through the Vercel AI Gateway.
// TEMP (testing on free credit): gpt-4o-mini has a higher free-tier rate limit so
// a full pitch completes. Switch back to "openai/gpt-4.1" once BYOK / paid credits
// are set for best quality.
export default defineAgent({
  model: "openai/gpt-4o-mini",
  build: {
    // Ship @react-pdf/renderer UNBUNDLED in server/node_modules so its runtime
    // assets (yoga-layout WASM + fontkit AFM font metrics) survive Nitro's
    // tree-shaking. The PDF is rendered in pure JS — no headless browser.
    externalDependencies: ["@react-pdf/renderer"],
  },
});
