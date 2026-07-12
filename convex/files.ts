import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Short-lived URL the pitch tool POSTs the PDF bytes to.
// Public because the (currently public) pitch flow uploads without a user session.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

// Stable, public URL that serves a stored file (embedded in the app + download link).
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => await ctx.storage.getUrl(storageId),
});
