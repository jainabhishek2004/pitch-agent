// One-time: load the existing knowledge JSON into Convex.
// Run (with `npx convex dev` already running in another terminal):
//   node scripts/seed-convex.mjs
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (p) => JSON.parse(readFileSync(resolve(root, p), "utf8"));

// Target from env (e.g. prod) if set, else read the dev URL from .env.local.
let url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
  const env = readFileSync(resolve(root, ".env.local"), "utf8");
  url = env.match(/^NEXT_PUBLIC_CONVEX_URL=(.+)$/m)?.[1]?.trim();
}
if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL missing (set env var or .env.local).");

// --- reshape the JSON to match the Convex tables (id -> slug, flatten rules) ---
const products = readJson("agent/knowledge/products.json").products.map((p) => ({
  slug: p.id, name: p.name, category: p.category, source: p.source,
  bestFor: p.bestFor, solves: p.solves, how: p.how, keyFeatures: p.keyFeatures,
}));

const painPoints = readJson("agent/knowledge/pain-points.json").painPoints.map((p) => ({
  slug: p.id, text: p.text, category: p.category, impact: p.impact,
  commonIn: p.commonIn, products: p.products, features: p.features, agents: p.agents,
}));

const agents = readJson("agent/knowledge/ai-agents.json").agents.map((a) => ({
  name: a.name, automates: a.automates, trigger: a.trigger, output: a.output, bestFor: a.bestFor,
}));

const rules = readJson("agent/knowledge/recommendation-rules.json");
const businessTypes = Object.keys(rules.rules).map((key) => ({
  key,
  label: rules.labels[key] || key,
  keywords: rules.types[key] || [],
  primary: rules.rules[key].primary,
  secondary: rules.rules[key].secondary,
  expansion: rules.rules[key].expansion,
  aiLayer: rules.rules[key].aiLayer,
}));

const client = new ConvexHttpClient(url);
const res = await client.mutation(api.kb.seedAll, { products, painPoints, agents, businessTypes });
console.log("✅ Seeded Convex:", res);
