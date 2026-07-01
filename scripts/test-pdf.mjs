// Local visual test for the react-pdf deck. Renders a realistic sample to a file.
import { writeFileSync } from "node:fs";
import { renderPitchPdf } from "../lib/pitch-pdf.mjs";

const pitch = {
  client: {
    name: "Healthy Master",
    website: "healthymaster.in",
    industry: "Food & Beverage FMCG (healthy snacks)",
    businessModel: "Central-kitchen producer + D2C brand + B2B supplier (vending, HoReCa, school snacks, corporate gifting)",
    classification: ["Food Brand / Central Kitchen", "D2C Brand", "B2B Supplier", "Multi-channel"],
  },
  hook: {
    label: "AI-NATIVE OPERATIONS PLATFORM",
    headline: ["Connect your kitchen, inventory and delivery into", "one operating layer."],
    subhead: "1 lakh+ happy snackers and 10,000+ orders a month across D2C, marketplaces, vending, HoReCa and gifting — run on one AI-native platform instead of spreadsheets and WhatsApp.",
  },
  painPoints: [
    { text: "Production planned on gut feel, not live demand", confidence: "confirmed", category: "Central-kitchen ops" },
    { text: "Batch & expiry hard to track across SKUs and channels", confidence: "confirmed", category: "Inventory / FEFO" },
    { text: "B2B account replenishment runs reactively", confidence: "likely", category: "Order & fulfilment" },
    { text: "Fulfilment lifted off WhatsApp — no pick-to-proof trail", confidence: "likely", category: "Delivery" },
    { text: "No single stock number across D2C + marketplaces", confidence: "confirmed", category: "Inventory" },
    { text: "FSSAI compliance docs assembled manually for buyers", confidence: "likely", category: "Compliance" },
  ],
  productStack: {
    primary: { name: "Central Kitchen Operations", why: "Connects recipe/BOM, daily production planning, batch & expiry tracking, hub allocation and dispatch into one layer — so production stops running blind to demand." },
    secondary: ["IMS — Inventory", "Order & Delivery"],
    expansion: ["WMS — Warehouse", "Compliance docs"],
    aiLayer: ["Production Planning Agent", "Hub Replenishment Agent", "Dispatch Exception Agent", "Daily MIS Agent"],
    reasoning: "Healthy Master sits at the intersection of three business types — central-kitchen producer, D2C brand and B2B supplier. That three-way model is exactly where ops friction compounds fastest, so we lead with kitchen-to-demand and layer inventory and delivery on top.",
  },
  features: [
    { feature: "Live demand-linked production plan", product: "Central Kitchen", painSolved: "Production planned on gut feel, not live demand", businessImpact: "Less wastage, fewer stockouts" },
    { feature: "FEFO batch + 90-day expiry alerts", product: "IMS", painSolved: "Batch & expiry hard to track across channels", businessImpact: "Zero expired stock shipped" },
    { feature: "Auto-replenishment for B2B accounts", product: "Order & Delivery", painSolved: "B2B replenishment runs reactively", businessImpact: "Accounts never stock out" },
    { feature: "Pick-to-proof fulfilment with photo-POD", product: "Order & Delivery", painSolved: "Fulfilment lifted off WhatsApp", businessImpact: "Every order accounted for" },
  ],
  howItHelpsSpecifically: "Because Healthy Master operates as a central kitchen feeding both D2C and B2B channels, Hyperion helps by planning production from live multi-channel demand, tracking every batch to its expiry with automatic FEFO selling, and auto-replenishing B2B accounts before they stock out — so the team runs on one operating layer instead of gut feel, spreadsheets and WhatsApp.",
  aiAgents: [
    { name: "Production Planning Agent", automates: "Builds daily kitchen schedules from live D2C + B2B demand." },
    { name: "Hub Replenishment Agent", automates: "Auto-transfers stock to B2B accounts before they run dry." },
    { name: "Dispatch Exception Agent", automates: "Catches stuck or delayed orders and escalates them." },
    { name: "Daily MIS Agent", automates: "Sends a daily ops + sales summary to founders." },
  ],
  roadmap: [
    { n: "01", title: "Kitchen + inventory live", body: "Recipe/BOM, production planning and FEFO batch tracking in weeks." },
    { n: "02", title: "Multi-channel order layer", body: "Unified intake across D2C, marketplace, vending and gifting." },
    { n: "03", title: "B2B auto-replenishment", body: "Turn on hub replenishment + dispatch exception agents." },
    { n: "04", title: "Compliance + scale", body: "FSSAI docs and scanner WMS as volumes grow." },
  ],
  cta: {
    label: "GET STARTED",
    headline: ["See exactly how it fits", "Healthy Master's setup."],
    subhead: "A 30-minute walkthrough mapped to your kitchen, channels and B2B accounts — standalone or alongside any existing system. No ERP required.",
    action: "BOOK A WALKTHROUGH",
  },
  meta: { preparedFor: "Prepared for Healthy Master", brand: "Hyperion" },
};

const buf = await renderPitchPdf(pitch);
writeFileSync("scripts/sample-pitch.pdf", buf);
console.log("OK wrote scripts/sample-pitch.pdf", buf.length, "bytes");
