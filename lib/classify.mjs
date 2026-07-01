// Business classification (PRD §3) + recommendation rules (PRD §14).
// Reads the SHARED CATALOG (agent/knowledge/recommendation-rules.json) so the deterministic
// engine and the Eve `classify_business` tool always agree.
import CATALOG from "../agent/knowledge/recommendation-rules.json" with { type: "json" };

const { types: TYPES, labels: LABEL, rules: RULES } = CATALOG;

export function classify(text = "") {
  const t = text.toLowerCase();
  const scores = Object.entries(TYPES)
    .map(([type, kws]) => [type, kws.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0)])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);

  const detected = scores.map(([type]) => type);
  const erpDetected = detected.includes("erp-heavy");
  let primary = detected.find((d) => d !== "erp-heavy") || detected[0] || "operations";
  if (!RULES[primary]) primary = "operations";

  const classification = detected.map((d) => LABEL[d]).filter(Boolean);
  if (classification.length === 0) classification.push(LABEL.operations);

  return { primary, detected, erpDetected, classification, label: LABEL[primary], rule: RULES[primary] };
}

export { RULES, LABEL, TYPES };
