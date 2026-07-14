import { defineAgent } from "eve";

// Model resolves through the Vercel AI Gateway.
// gpt-4.1-mini: most reliable multi-step tool-caller (follows the pipeline incl.
// generate_pitch_pdf) + cheap. Swap to "openai/gpt-4.1" for max quality, or
// "deepseek/deepseek-v3.2" for the cheapest. NOTE: still rate-limited on the free
// gateway tier — needs the team's paid account (or a top-up) to run end-to-end.
export default defineAgent({
  model: "openai/gpt-4.1-mini",
  build: {
    // Ship @react-pdf/renderer UNBUNDLED in server/node_modules so its runtime
    // assets (yoga-layout WASM + fontkit AFM font metrics) survive Nitro's
    // tree-shaking. The PDF is rendered in pure JS — no headless browser.
    externalDependencies: ["@react-pdf/renderer"],
  },
});
