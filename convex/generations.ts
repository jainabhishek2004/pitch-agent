import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Called by the pitch page after a pitch completes. Public (the pitch flow has no session).
export const save = mutation({
  args: {
    businessCard: v.string(),
    website: v.string(),
    pitch: v.string(),
    followupEmail: v.string(),
    pdfUrl: v.string(),
  },
  handler: async (ctx, args) => await ctx.db.insert("generations", args),
});

// Most recent first (bounded). The /generations page searches this list client-side.
export const list = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("generations").order("desc").take(200),
});
