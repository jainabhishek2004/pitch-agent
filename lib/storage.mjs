// Save a generated PDF and return a URL.
// Prod (Vercel): upload to Vercel Blob (needs BLOB_READ_WRITE_TOKEN). Dev: write to public/generated.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function savePdf(buffer, id) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const { url } = await put(`pitches/${id}.pdf`, buffer, { access: "public", contentType: "application/pdf" });
    return url;
  }
  // Local fallback: served by Next.js from /public.
  const dir = resolve(projectRoot, "public/generated");
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, `${id}.pdf`), buffer);
  return `/generated/${id}.pdf`;
}
