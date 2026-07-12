// Knowledge-base functions.
// - `getAll`  : PUBLIC read (the agent + the admin page both read this)
// - add/update/remove : ADMIN-ONLY writes (must be signed in; email allowlist optional)
// - `seedAll` : one-time dev seed (kept public for the seed script; remove before prod if desired)
import { mutation, query, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

// Require a signed-in user. If ADMIN_EMAILS is set (comma-separated), the user's
// email must be on the list. If it's unset, any signed-in user is allowed (dev).
async function assertAdmin(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("You must be signed in to edit the knowledge base.");
  const allow = (process.env.ADMIN_EMAILS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const email = String(identity.email || "").toLowerCase();
  if (allow.length > 0 && !allow.includes(email)) {
    throw new Error(`Not an authorized admin: ${email || "(no email)"}`);
  }
}

export const getAll = query({
  args: {},
  handler: async (ctx) => ({
    products: await ctx.db.query("products").collect(),
    painPoints: await ctx.db.query("painPoints").collect(),
    agents: await ctx.db.query("agents").collect(),
    businessTypes: await ctx.db.query("businessTypes").collect(),
  }),
});

// ---- field validators (mirror convex/schema.ts) ----
const productFields = {
  slug: v.string(), name: v.string(), category: v.string(), source: v.string(),
  bestFor: v.array(v.string()), solves: v.string(), how: v.string(), keyFeatures: v.array(v.string()),
};
const painFields = {
  slug: v.string(), text: v.string(), category: v.string(), impact: v.string(),
  commonIn: v.array(v.string()), products: v.array(v.string()), features: v.array(v.string()), agents: v.array(v.string()),
};
const agentFields = {
  name: v.string(), automates: v.string(), trigger: v.string(), output: v.string(), bestFor: v.array(v.string()),
};
const typeFields = {
  key: v.string(), label: v.string(), keywords: v.array(v.string()),
  primary: v.string(), secondary: v.array(v.string()), expansion: v.array(v.string()), aiLayer: v.array(v.string()),
};

// ---- products ----
export const addProduct = mutation({ args: productFields, handler: async (ctx, args) => { await assertAdmin(ctx); return ctx.db.insert("products", args); } });
export const updateProduct = mutation({ args: { id: v.id("products"), ...productFields }, handler: async (ctx, { id, ...doc }) => { await assertAdmin(ctx); await ctx.db.replace("products", id, doc); } });
export const removeProduct = mutation({ args: { id: v.id("products") }, handler: async (ctx, { id }) => { await assertAdmin(ctx); await ctx.db.delete("products", id); } });

// ---- pain points ----
export const addPain = mutation({ args: painFields, handler: async (ctx, args) => { await assertAdmin(ctx); return ctx.db.insert("painPoints", args); } });
export const updatePain = mutation({ args: { id: v.id("painPoints"), ...painFields }, handler: async (ctx, { id, ...doc }) => { await assertAdmin(ctx); await ctx.db.replace("painPoints", id, doc); } });
export const removePain = mutation({ args: { id: v.id("painPoints") }, handler: async (ctx, { id }) => { await assertAdmin(ctx); await ctx.db.delete("painPoints", id); } });

// ---- ai agents ----
export const addAgent = mutation({ args: agentFields, handler: async (ctx, args) => { await assertAdmin(ctx); return ctx.db.insert("agents", args); } });
export const updateAgent = mutation({ args: { id: v.id("agents"), ...agentFields }, handler: async (ctx, { id, ...doc }) => { await assertAdmin(ctx); await ctx.db.replace("agents", id, doc); } });
export const removeAgent = mutation({ args: { id: v.id("agents") }, handler: async (ctx, { id }) => { await assertAdmin(ctx); await ctx.db.delete("agents", id); } });

// ---- business types ----
export const addType = mutation({ args: typeFields, handler: async (ctx, args) => { await assertAdmin(ctx); return ctx.db.insert("businessTypes", args); } });
export const updateType = mutation({ args: { id: v.id("businessTypes"), ...typeFields }, handler: async (ctx, { id, ...doc }) => { await assertAdmin(ctx); await ctx.db.replace("businessTypes", id, doc); } });
export const removeType = mutation({ args: { id: v.id("businessTypes") }, handler: async (ctx, { id }) => { await assertAdmin(ctx); await ctx.db.delete("businessTypes", id); } });

// One-time seed from the existing JSON (scripts/seed-convex.mjs). Clears each table first.
export const seedAll = mutation({
  args: {
    products: v.array(v.any()),
    painPoints: v.array(v.any()),
    agents: v.array(v.any()),
    businessTypes: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    for (const row of await ctx.db.query("products").collect()) await ctx.db.delete("products", row._id);
    for (const row of await ctx.db.query("painPoints").collect()) await ctx.db.delete("painPoints", row._id);
    for (const row of await ctx.db.query("agents").collect()) await ctx.db.delete("agents", row._id);
    for (const row of await ctx.db.query("businessTypes").collect()) await ctx.db.delete("businessTypes", row._id);
    for (const p of args.products) await ctx.db.insert("products", p);
    for (const p of args.painPoints) await ctx.db.insert("painPoints", p);
    for (const a of args.agents) await ctx.db.insert("agents", a);
    for (const b of args.businessTypes) await ctx.db.insert("businessTypes", b);
    return { products: args.products.length, painPoints: args.painPoints.length, agents: args.agents.length, businessTypes: args.businessTypes.length };
  },
});
