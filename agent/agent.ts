import { defineAgent } from "eve";

// Model resolves through Vercel AI Gateway (OIDC on Vercel — no API key to manage).
// Switch to "anthropic/claude-opus-4.8" for maximum pitch quality.
export default defineAgent({
  model: "anthropic/claude-sonnet-4.6",
  build: {
    // Ship @react-pdf/renderer UNBUNDLED in server/node_modules so its runtime
    // assets (yoga-layout WASM + fontkit AFM font metrics) survive Nitro's
    // tree-shaking. The PDF is rendered in pure JS — no headless browser.
    externalDependencies: ["@react-pdf/renderer"],
  },
});
