import { defineAgent } from "eve";

// Model resolves through the Vercel AI Gateway.
// deepseek-v3.2: very cheap, supports reasoning + tool use. If it ever skips
// generate_pitch_pdf, fall back to "openai/gpt-4.1-mini" (most reliable tool-caller)
// or "openai/gpt-4.1" (max quality). Alt cheap: "google/gemini-2.5-flash".
export default defineAgent({
  model: "deepseek/deepseek-v3.2",
  build: {
    // Ship @react-pdf/renderer UNBUNDLED in server/node_modules so its runtime
    // assets (yoga-layout WASM + fontkit AFM font metrics) survive Nitro's
    // tree-shaking. The PDF is rendered in pure JS — no headless browser.
    externalDependencies: ["@react-pdf/renderer"],
  },
});
