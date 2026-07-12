// Save a generated PDF and return a public URL.
// Prod / deployed: upload to Convex file storage. Local dev (no Convex URL): write to public/generated.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || "";
const isServerless = () => !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);

export async function savePdf(buffer, id) {
  // Preferred: Convex file storage.
  if (CONVEX_URL) {
    const client = new ConvexHttpClient(CONVEX_URL);
    const uploadUrl = await client.mutation(api.files.generateUploadUrl, {});
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": "application/pdf" },
      body: buffer,
    });
    if (!res.ok) throw new Error(`Convex upload failed: ${res.status} ${await res.text()}`);
    const { storageId } = await res.json();
    const url = await client.query(api.files.getUrl, { storageId });
    if (!url) throw new Error("Convex storage returned no URL for the uploaded PDF.");
    return url;
  }

  // On a serverless host the filesystem is read-only, so we can't write a PDF anywhere useful.
  if (isServerless()) {
    throw new Error("PDF rendered but no storage configured — set NEXT_PUBLIC_CONVEX_URL so it can upload to Convex.");
  }

  // Local dev only: write into /public so Next serves it at /generated/<id>.pdf.
  const dir = resolve(projectRoot, "public/generated");
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, `${id}.pdf`), buffer);
  return `/generated/${id}.pdf`;
}
