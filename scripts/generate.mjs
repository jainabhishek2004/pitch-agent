// CLI: generate a pitch PDF without the web app. Useful for testing the shared pipeline.
// Usage: node scripts/generate.mjs "<business card text>" "<website>"
import { generatePitch } from "../lib/generate-pitch.mjs";
import { renderPitchPdf } from "../lib/pitch-pdf.mjs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cardText = process.argv[2] || "";
const website = process.argv[3] || "";

const { pitch } = await generatePitch({ cardText, website });
const dir = resolve(root, "public/generated");
mkdirSync(dir, { recursive: true });
const out = resolve(dir, `${pitch.client.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40)}.pdf`);
const full = { ...pitch, meta: { preparedFor: `Prepared for ${pitch.client.name}` } };
writeFileSync(out, await renderPitchPdf(full));

console.log("Client      :", pitch.client.name);
console.log("Class       :", pitch.client.classification.join(", "));
console.log("Primary     :", pitch.productStack.primary?.name);
console.log("Email subj  :", pitch.followupEmail.subject);
console.log("PDF         :", out);
