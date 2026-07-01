// Loads the Hyperion knowledge base (source of truth). Used by the Eve tools and the CLI.
// JSON is imported (bundled in), NOT read from disk — so it survives Eve's build/relocation.
import brand from "../agent/knowledge/brand-kit.json" with { type: "json" };
import productsData from "../agent/knowledge/products.json" with { type: "json" };
import agentsData from "../agent/knowledge/ai-agents.json" with { type: "json" };
import painData from "../agent/knowledge/pain-points.json" with { type: "json" };
import positioning from "../agent/knowledge/company-positioning.json" with { type: "json" };
import recommendationRules from "../agent/knowledge/recommendation-rules.json" with { type: "json" };

export { brand, positioning, recommendationRules };
export const products = productsData.products;
export const agents = agentsData.agents;
export const painPoints = painData.painPoints;

export const productById = (id) => products.find((p) => p.id === id);
export const productsForType = (type) =>
  products.filter((p) => p.bestFor.includes(type) || p.bestFor.includes("all"));
export const painsForType = (type) =>
  painPoints.filter((p) => p.commonIn.includes(type) || p.commonIn.includes("all"));
export const agentsForType = (type) =>
  agents.filter((a) => a.bestFor.includes(type) || a.bestFor.includes("all"));

// A flat keyword search across the KB — what the Eve tool exposes to the model.
export function searchKnowledgeBase(query = "") {
  const q = query.toLowerCase();
  const hit = (s) => String(s).toLowerCase().includes(q);
  return {
    products: products.filter((p) => !q || hit(p.name) || hit(p.solves) || hit(p.category) || p.keyFeatures.some(hit)),
    agents: agents.filter((a) => !q || hit(a.name) || hit(a.automates)),
    painPoints: painPoints.filter((p) => !q || hit(p.text) || hit(p.category)),
  };
}
