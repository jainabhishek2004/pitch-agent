// Save a generated PDF and return a URL.
// Prod (Vercel): upload to Vercel Blob (needs BLOB_READ_WRITE_TOKEN). Dev: write to public/generated.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Vercel sets VERCEL=1 in every deployment; Lambda sets AWS_LAMBDA_FUNCTION_NAME.
const isServerless = () =>
  !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);

export async function savePdf(buffer, id) {
  // Preferred path (and the ONLY workable path on a serverless host): Vercel Blob.
  // The @vercel/blob SDK reads BLOB_READ_WRITE_TOKEN from env automatically.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const { url } = await put(`pitches/${id}.pdf`, buffer, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: true,
    });
    return url;
  }

  // On Vercel/Lambda the filesystem is read-only (only /tmp is writable, and it
  // isn't served publicly), so a disk write can never produce a usable URL.
  // Fail with a clear, actionable message instead of a confusing ENOENT mkdir.
  if (isServerless()) {
    throw new Error(
      "PDF rendered but could not be saved: BLOB_READ_WRITE_TOKEN is not set. " +
        "Connect a Vercel Blob store to this project (Storage → Create/Connect a Blob store), " +
        "make sure the token is present in the Production environment, then redeploy.",
    );
  }

  // Local dev only: write into /public so Next serves it at /generated/<id>.pdf.
  const dir = resolve(projectRoot, "public/generated");
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, `${id}.pdf`), buffer);
  return `/generated/${id}.pdf`;
}
