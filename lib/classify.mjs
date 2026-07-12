// Business classification (PRD §3) + recommendation rules (PRD §14).
// Pure function: it takes the businessTypes rows (from Convex or the JSON fallback)
// and scores the text by keyword hits. No file/DB access here.
export function classify(text = "", businessTypes = []) {
  const TYPES = {}, LABEL = {}, RULES = {};
  for (const b of businessTypes) {
    TYPES[b.key] = b.keywords || [];
    LABEL[b.key] = b.label;
    RULES[b.key] = { primary: b.primary, secondary: b.secondary, expansion: b.expansion, aiLayer: b.aiLayer };
  }

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
  if (classification.length === 0) classification.push(LABEL.operations || "Operations Business");

  return {
    primary,
    detected,
    erpDetected,
    classification,
    label: LABEL[primary] || LABEL.operations || "Operations Business",
    rule: RULES[primary] || RULES.operations,
  };
}
