// Shared config for the admin: field definitions + Convex mutation refs per collection.
// Used by the overview page AND the add/edit form pages.
import { api } from "../../convex/_generated/api";

export type Field = { key: string; label: string; type: "text" | "textarea" | "array"; placeholder?: string };
export type CollectionKey = "products" | "painPoints" | "agents" | "businessTypes";

export const COLLECTION_ORDER: CollectionKey[] = ["products", "painPoints", "agents", "businessTypes"];

export const COLLECTIONS: Record<CollectionKey, {
  label: string;
  singular: string;
  title: (r: any) => string;
  fields: Field[];
  api: { add: any; update: any; remove: any };
}> = {
  products: {
    label: "Products", singular: "Product", title: (r) => r.name,
    api: { add: api.kb.addProduct, update: api.kb.updateProduct, remove: api.kb.removeProduct },
    fields: [
      { key: "slug", label: "Slug / id", type: "text", placeholder: "wms" },
      { key: "name", label: "Name", type: "text", placeholder: "Warehouse Management (WMS)" },
      { key: "category", label: "Category", type: "text", placeholder: "Warehouse" },
      { key: "source", label: "Source (brochure / prd)", type: "text", placeholder: "brochure" },
      { key: "solves", label: "Solves", type: "textarea", placeholder: "Paper GRN, no bin strategy, high mispick, untrustworthy book stock" },
      { key: "how", label: "How it works", type: "textarea", placeholder: "Scanner-first GRN with live variance, guided putaway, wave/zone picking…" },
      { key: "bestFor", label: "Best for (comma-separated)", type: "array", placeholder: "3pl, d2c, distributor, warehousing-heavy" },
      { key: "keyFeatures", label: "Key features (comma-separated)", type: "array", placeholder: "Scanner GRN, Guided putaway, Cycle counts, Dock & SLA" },
    ],
  },
  painPoints: {
    label: "Pain points", singular: "Pain point", title: (r) => r.text,
    api: { add: api.kb.addPain, update: api.kb.updatePain, remove: api.kb.removePain },
    fields: [
      { key: "slug", label: "Slug / id", type: "text", placeholder: "stock-mismatch" },
      { key: "text", label: "Text", type: "textarea", placeholder: "Stock numbers don't match across systems" },
      { key: "category", label: "Category", type: "text", placeholder: "Inventory" },
      { key: "impact", label: "Impact", type: "text", placeholder: "A stock number no one trusts at month-end" },
      { key: "commonIn", label: "Common in (comma-separated)", type: "array", placeholder: "d2c, distributor, manufacturing" },
      { key: "products", label: "Products (slugs, comma-separated)", type: "array", placeholder: "ims" },
      { key: "features", label: "Features (comma-separated)", type: "array", placeholder: "Multi-node ledger, Reconciliation" },
      { key: "agents", label: "Agents (comma-separated)", type: "array", placeholder: "Inventory Shortfall Agent" },
    ],
  },
  agents: {
    label: "AI agents", singular: "AI agent", title: (r) => r.name,
    api: { add: api.kb.addAgent, update: api.kb.updateAgent, remove: api.kb.removeAgent },
    fields: [
      { key: "name", label: "Name", type: "text", placeholder: "Replenishment Agent" },
      { key: "automates", label: "Automates", type: "textarea", placeholder: "Drafts purchase/replenishment orders from reorder points and lead times" },
      { key: "trigger", label: "Trigger", type: "text", placeholder: "Reorder point hit" },
      { key: "output", label: "Output", type: "text", placeholder: "Draft PO" },
      { key: "bestFor", label: "Best for (comma-separated)", type: "array", placeholder: "d2c, distributor, food" },
    ],
  },
  businessTypes: {
    label: "Rules", singular: "Business rule", title: (r) => r.label,
    api: { add: api.kb.addType, update: api.kb.updateType, remove: api.kb.removeType },
    fields: [
      { key: "key", label: "Key (e.g. d2c)", type: "text", placeholder: "d2c" },
      { key: "label", label: "Label (e.g. D2C Brand)", type: "text", placeholder: "D2C Brand" },
      { key: "keywords", label: "Classification keywords (comma-separated)", type: "array", placeholder: "d2c, shopify, ecommerce, marketplace, amazon, flipkart" },
      { key: "primary", label: "Primary product (slug)", type: "text", placeholder: "ims" },
      { key: "secondary", label: "Secondary (slugs, comma-separated)", type: "array", placeholder: "wms" },
      { key: "expansion", label: "Expansion (slugs, comma-separated)", type: "array", placeholder: "order-delivery" },
      { key: "aiLayer", label: "AI layer (agent names, comma-separated)", type: "array", placeholder: "Order Exception Agent, Inventory Shortfall Agent, Daily MIS Agent" },
    ],
  },
};
