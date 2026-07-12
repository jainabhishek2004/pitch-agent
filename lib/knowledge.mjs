// Loads the Hyperion knowledge base.
// Primary source: Convex (editable from the admin page). If Convex is unreachable
// or not configured, it falls back to the bundled JSON so the agent never breaks.
// brand-kit + company-positioning stay as static JSON (rarely change, used by the PDF).
import brand from "../agent/knowledge/brand-kit.json" with { type: "json" };
import positioning from "../agent/knowledge/company-positioning.json" with { type: "json" };
import productsJson from "../agent/knowledge/products.json" with { type: "json" };
import painsJson from "../agent/knowledge/pain-points.json" with { type: "json" };
import agentsJson from "../agent/knowledge/ai-agents.json" with { type: "json" };
import rulesJson from "../agent/knowledge/recommendation-rules.json" with { type: "json" };
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { classify as classifyRaw } from "./classify.mjs";

export { brand, positioning };

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || "";

// The JSON files, reshaped to the SAME shape Convex returns (so both paths agree).
function jsonKB() {
  return {
    products: productsJson.products.map((p) => ({ ...p, slug: p.id })),
    painPoints: painsJson.painPoints.map((p) => ({ ...p, slug: p.id })),
    agents: agentsJson.agents,
    businessTypes: Object.keys(rulesJson.rules).map((key) => ({
      key,
      label: rulesJson.labels[key] || key,
      keywords: rulesJson.types[key] || [],
      primary: rulesJson.rules[key].primary,
      secondary: rulesJson.rules[key].secondary,
      expansion: rulesJson.rules[key].expansion,
      aiLayer: rulesJson.rules[key].aiLayer,
    })),
  };
}

async function fetchKB() {
  if (!CONVEX_URL) return { data: jsonKB(), source: "json (no CONVEX_URL)" };
  try {
    const client = new ConvexHttpClient(CONVEX_URL);
    const data = await client.query(api.kb.getAll, {});
    if (!data?.products?.length) return { data: jsonKB(), source: "json (Convex empty)" };
    return { data, source: "convex" };
  } catch (e) {
    return { data: jsonKB(), source: `json (Convex error: ${e.message})` };
  }
}

// Build the read helpers over a loaded dataset (works for both Convex + JSON shapes).
function buildKB(data) {
  const products = data.products.map((p) => ({ ...p, id: p.slug ?? p.id }));
  const painPoints = data.painPoints.map((p) => ({ ...p, id: p.slug ?? p.id }));
  const agents = data.agents;
  const businessTypes = data.businessTypes;
  const inList = (arr, type) => (arr || []).includes(type) || (arr || []).includes("all");

  return {
    products,
    painPoints,
    agents,
    businessTypes,
    productById: (id) => products.find((p) => p.slug === id || p.id === id),
    productsForType: (type) => products.filter((p) => inList(p.bestFor, type)),
    painsForType: (type) => painPoints.filter((p) => inList(p.commonIn, type)),
    agentsForType: (type) => agents.filter((a) => inList(a.bestFor, type)),
    searchKnowledgeBase: (query = "") => {
      const q = query.toLowerCase();
      const hit = (s) => String(s).toLowerCase().includes(q);
      return {
        products: products.filter((p) => !q || hit(p.name) || hit(p.solves) || hit(p.category) || (p.keyFeatures || []).some(hit)),
        agents: agents.filter((a) => !q || hit(a.name) || hit(a.automates)),
        painPoints: painPoints.filter((p) => !q || hit(p.text) || hit(p.category)),
      };
    },
    classify: (text) => classifyRaw(text, businessTypes),
  };
}

// 5-minute cache so we don't hit Convex on every agent step.
let cache = null;
let cachedAt = 0;
const TTL = 5 * 60 * 1000;

export async function loadKB() {
  if (cache && Date.now() - cachedAt < TTL) return cache;
  const { data, source } = await fetchKB();
  cache = buildKB(data);
  cache._source = source; // handy for debugging which source was used
  cachedAt = Date.now();
  return cache;
}
