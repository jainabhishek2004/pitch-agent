import { defineAgent } from "eve";

// Model resolves through Vercel AI Gateway (OIDC on Vercel — no API key to manage).
// Switch to "anthropic/claude-opus-4.8" for maximum pitch quality.
export default defineAgent({
  model: "anthropic/claude-sonnet-4.6",
});
