// The shape of the editable knowledge base, stored in Convex.
// Convex auto-adds `_id` and `_creationTime` to every row, so our old JSON "id"
// field is stored as `slug` to avoid clashing.
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    slug: v.string(), // e.g. "wms" (was "id" in products.json)
    name: v.string(),
    category: v.string(),
    source: v.string(), // "brochure" | "prd"
    bestFor: v.array(v.string()),
    solves: v.string(),
    how: v.string(),
    keyFeatures: v.array(v.string()),
  }).index("by_slug", ["slug"]),

  painPoints: defineTable({
    slug: v.string(), // e.g. "stock-mismatch"
    text: v.string(),
    category: v.string(),
    impact: v.string(),
    commonIn: v.array(v.string()),
    products: v.array(v.string()), // product slugs
    features: v.array(v.string()),
    agents: v.array(v.string()), // agent names
  }).index("by_slug", ["slug"]),

  agents: defineTable({
    name: v.string(),
    automates: v.string(),
    trigger: v.string(),
    output: v.string(),
    bestFor: v.array(v.string()),
  }),

  // recommendation-rules.json flattened: one row per business type.
  businessTypes: defineTable({
    key: v.string(), // "d2c"
    label: v.string(), // "D2C Brand"
    keywords: v.array(v.string()), // classification keywords
    primary: v.string(), // primary product slug
    secondary: v.array(v.string()),
    expansion: v.array(v.string()),
    aiLayer: v.array(v.string()), // agent names
  }).index("by_key", ["key"]),

  // A record of every pitch the team generates (the "Generations" library).
  generations: defineTable({
    businessCard: v.string(),
    website: v.string(),
    pitch: v.string(), // the on-screen summary
    followupEmail: v.string(),
    pdfUrl: v.string(),
  }),
});
