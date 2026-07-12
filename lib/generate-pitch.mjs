// Orchestrator: business-card text + website -> structured pitch object covering
// PRD modules 2 (profile), 3 (classification), 4 (pains), 5 (product fit),
// 6 (feature mapping), 7 (custom pitch), 9 (AI agents), 10 (roadmap).
// Deterministic by default; if an LLM is wired (Eve/Claude) it can replace `buildPitch`.
import { researchCompany } from "./research.mjs";
import { loadKB, brand } from "./knowledge.mjs";

const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

function guessContact(cardText) {
  const first = (cardText || "").split(/\n|,/)[0]?.trim() || "";
  // a plausible person name: 2-3 capitalised words, no company/role keywords, no @ or digits
  if (/^[A-Z][a-z]+( [A-Z][a-z.]+){1,2}$/.test(first) && !/@|\d|pvt|ltd|inc|llp/i.test(first)) return first.split(" ")[0];
  return "there";
}

function buildEmail({ clientName, cardText, cls, stackNames, topPains, erpDetected }) {
  const contact = guessContact(cardText);
  return {
    subject: `${clientName} × Hyperion — your operations on one system`,
    body:
`Hi ${contact},

Great connecting. From a quick look at ${clientName}, you're running ${cls.label.toLowerCase()} operations — which usually means ${topPains[0] ? topPains[0].toLowerCase() : "gaps between systems"}${topPains[1] ? " and " + topPains[1].toLowerCase() : ""}.

Hyperion can help by connecting ${stackNames} into one operating layer${erpDetected ? ", on top of your existing ERP" : ""} — so the work that runs on spreadsheets and WhatsApp today runs on one system, with live visibility. We typically pilot on a single site or category in weeks, not quarters.

Worth a 30-minute walkthrough? I've put together a short pitch tailored to ${clientName} (attached).

Best,
[Your name]
Hyperion · hello@gudz.in · gudz.in`,
  };
}

function guessClientName(cardText, research, website) {
  const lines = (cardText || "").split(/\n|,/).map((l) => l.trim()).filter(Boolean);
  // a line that looks like a company (has Ltd/Pvt/Inc/LLP or Title Case, not an email/phone)
  const co = lines.find((l) => /(pvt|ltd|llp|inc|gmbh|limited|technologies|industries|logistics|foods|retail|brands)/i.test(l));
  if (co) return co.replace(/\.$/, "");
  if (research.title) return research.title.split(/[|\-–—:]/)[0].trim();
  if (website) return titleCase(website.replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[./]/)[0]);
  return lines[0] || "the client";
}

export async function generatePitch({ cardText = "", website = "" }) {
  const research = await researchCompany(website);
  const kb = await loadKB();
  const clientName = guessClientName(cardText, research, website);
  const combined = [cardText, research.title, research.description, research.headings.join(" "), research.text].join(" ");
  const cls = kb.classify(combined);

  // Deterministic offline builder — used by the CLI (scripts/generate.mjs) for
  // local PDF testing without the agent. The live product uses the Eve agent.
  const pitch = buildPitch({ clientName, website, cardText, research, cls, kb });
  pitch.meta = { preparedFor: `Prepared for ${clientName}`, brand: brand.company };
  return { pitch, research, classification: cls };
}

// Deterministic pitch builder (the offline brain). Grounded entirely in the knowledge base.
export function buildPitch({ clientName, website, cardText = "", research, cls, kb }) {
  const primaryProduct = kb.productById(cls.rule.primary);
  const secondary = cls.rule.secondary.map((id) => kb.productById(id)).filter(Boolean);
  let expansion = cls.rule.expansion.map((id) => kb.productById(id)).filter(Boolean);
  if (cls.erpDetected && !expansion.find((p) => p.id === "erp-integration-layer")) {
    expansion = [...expansion, kb.productById("erp-integration-layer")].filter(Boolean);
  }
  const aiLayer = cls.rule.aiLayer
    .map((name) => kb.agents.find((a) => a.name === name))
    .filter(Boolean);

  // Pains: inferred from business model (no meeting notes) -> confidence "likely".
  const seen = new Set();
  const pains = [];
  for (const type of [cls.primary, ...cls.detected]) {
    for (const p of kb.painsForType(type)) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      pains.push({ text: p.text, confidence: "likely", category: p.category, _src: p });
      if (pains.length >= 5) break;
    }
    if (pains.length >= 5) break;
  }

  // Feature mapping (module 6): pain -> feature -> product -> impact.
  const features = pains.slice(0, 5).map((p) => {
    const src = p._src;
    const prod = kb.productById(src.products[0]);
    return { feature: (src.features && src.features[0]) || prod?.keyFeatures[0] || "—", product: prod ? prod.name : "Hyperion", painSolved: src.text, businessImpact: src.impact };
  });

  const stackNames = [primaryProduct, ...secondary].filter(Boolean).map((p) => p.name).join(" and ");

  const howItHelpsSpecifically =
    `Because ${clientName} operates as a ${cls.label.toLowerCase()}, Hyperion connects ${stackNames} ` +
    `into one operating layer${cls.erpDetected ? ", on top of your existing ERP" : ""} — replacing the spreadsheets, ` +
    `email and WhatsApp that run operations today — so that ${clientName} runs on one trusted stock number, ` +
    `true cost visibility and live operational control from day one.`;

  const roadmap = [
    { n: "01", title: "Discovery", body: `Map ${clientName}'s current operations, tools, reports and the pain points above.` },
    { n: "02", title: "Configure", body: `Set up ${primaryProduct ? primaryProduct.name : "the primary module"}${secondary[0] ? " + " + secondary[0].name : ""}, roles, workflows and agent triggers.` },
    { n: "03", title: "Pilot", body: "Run live on one site / category / workflow and instrument the results from day one." },
    { n: "04", title: "Rollout", body: "Scale across locations, channels and teams — standalone or on top of the existing ERP." },
  ];

  return {
    meta: { preparedFor: `Prepared for ${clientName}`, brand: brand.company },
    client: {
      name: clientName,
      website: research.url || website || "",
      industry: research.description ? research.description.slice(0, 140) : cls.label,
      businessModel: research.description || `${cls.label} — operationally complex business that moves goods.`,
      classification: cls.classification,
    },
    hook: {
      label: "AI-NATIVE OPERATIONS PLATFORM",
      headline: ["One operating layer for", `${clientName}.`],
      subhead: `Hyperion runs the daily execution behind ${cls.label.toLowerCase()} operations — ${stackNames} — as a standalone platform or a layer on top of your existing ERP.`,
    },
    painPoints: pains.map(({ text, confidence, category }) => ({ text, confidence, category })),
    productStack: {
      primary: primaryProduct ? { name: primaryProduct.name, why: primaryProduct.solves } : null,
      secondary: secondary.map((p) => p.name),
      expansion: expansion.map((p) => p.name),
      aiLayer: aiLayer.map((a) => a.name),
      reasoning: `${cls.label} operations live or die on ${primaryProduct ? primaryProduct.category.toLowerCase() : "operations"} — so we lead there, add ${secondary.map((s) => s.name).join(" & ") || "supporting modules"}, and automate with the AI agent layer. We pitch only what fits.`,
    },
    features,
    howItHelpsSpecifically,
    aiAgents: aiLayer.map((a) => ({ name: a.name, automates: a.automates })),
    roadmap,
    cta: {
      label: "GET STARTED",
      headline: ["Let's run the operations behind", `${clientName}.`],
      subhead: `From ${primaryProduct ? primaryProduct.name.toLowerCase() : "core operations"} to the full stack — one platform to execute, automate and see everything. Pilot in weeks, not quarters.`,
      action: "BOOK A WALKTHROUGH",
    },
    followupEmail: buildEmail({
      clientName, cardText, cls, stackNames,
      topPains: pains.slice(0, 2).map((p) => p.text),
      erpDetected: cls.erpDetected,
    }),
  };
}
