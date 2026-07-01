// Brand-exact 4-page pitch deck rendered with @react-pdf/renderer — pure JS, no
// headless browser. Runs identically on local + Vercel serverless (no chromium,
// no system libraries, no external service). 16:9 pages = 960x540 pt.
import React from "react";
import {
  Document, Page, View, Text, StyleSheet,
  Svg, Rect, Defs, LinearGradient, RadialGradient, Stop,
  renderToBuffer,
} from "@react-pdf/renderer";
import { brand } from "./knowledge.mjs";

const c = brand.colors;
const h = React.createElement;
const W = 960, H = 540;

// ---- helpers -------------------------------------------------------------
const T = (style, children) => h(Text, { style }, children);
const clamp = (arr, n) => (arr || []).slice(0, n);

function Diamond({ size = 11 }) {
  return h(Svg, { width: size, height: size, viewBox: "0 0 12 12" },
    h(Defs, {}, h(LinearGradient, { id: "dg", x1: "0", y1: "0", x2: "1", y2: "1" },
      h(Stop, { offset: "0", stopColor: c.indigo }),
      h(Stop, { offset: "1", stopColor: c.amber }))),
    h(Rect, { x: "1.5", y: "1.5", width: "9", height: "9", rx: "1.6", fill: "url(#dg)", transform: "rotate(45 6 6)" }));
}

function Wordmark({ dark }) {
  return h(View, { style: S.wordmark },
    h(Diamond, {}),
    T({ ...S.wmText, color: dark ? "#FFFFFF" : c.headingInk }, "HYPERION"),
    T(S.wmDot, "."));
}

function Chip({ text, dark }) {
  return h(View, { style: dark ? S.chipDark : S.chip }, T(dark ? S.chipDarkT : S.chipT, text));
}

const CTA_H = 100; // fixed CTA band height so its gradient can be sized exactly

function FullDarkBg({ id }) {
  // Full-bleed hero gradient + amber corner glow. `fixed` takes it out of the
  // layout flow so a 540pt-tall node never triggers a page break.
  return h(View, { fixed: true, style: { position: "absolute", top: 0, left: 0, width: W, height: H } },
    h(Svg, { width: W, height: H },
      h(Defs, {},
        h(LinearGradient, { id: `${id}-g`, x1: "0", y1: "0", x2: "1", y2: "1" },
          h(Stop, { offset: "0", stopColor: c.heroGradientFrom }),
          h(Stop, { offset: "0.58", stopColor: c.heroGradientMid }),
          h(Stop, { offset: "1", stopColor: c.heroGradientTo })),
        h(RadialGradient, { id: `${id}-glow`, cx: "820", cy: "70", r: "470", gradientUnits: "userSpaceOnUse" },
          h(Stop, { offset: "0", stopColor: c.amber, stopOpacity: "0.20" }),
          h(Stop, { offset: "1", stopColor: c.amber, stopOpacity: "0" }))),
      h(Rect, { x: "0", y: "0", width: W, height: H, fill: `url(#${id}-g)` }),
      h(Rect, { x: "0", y: "0", width: W, height: H, fill: `url(#${id}-glow)` })));
}

function BandDarkBg({ id, w, hgt }) {
  // Correctly-sized gradient for the CTA band (not the full page).
  return h(Svg, { style: { position: "absolute", top: 0, left: 0 }, width: w, height: hgt },
    h(Defs, {},
      h(LinearGradient, { id: `${id}-g`, x1: "0", y1: "0", x2: "1", y2: "0" },
        h(Stop, { offset: "0", stopColor: c.heroGradientFrom }),
        h(Stop, { offset: "0.7", stopColor: c.heroGradientMid }),
        h(Stop, { offset: "1", stopColor: c.heroGradientTo })),
      h(RadialGradient, { id: `${id}-glow`, cx: `${w * 0.9}`, cy: "0", r: `${hgt * 2.4}`, gradientUnits: "userSpaceOnUse" },
        h(Stop, { offset: "0", stopColor: c.amber, stopOpacity: "0.22" }),
        h(Stop, { offset: "1", stopColor: c.amber, stopOpacity: "0" }))),
    h(Rect, { x: "0", y: "0", width: w, height: hgt, fill: `url(#${id}-g)` }),
    h(Rect, { x: "0", y: "0", width: w, height: hgt, fill: `url(#${id}-glow)` }));
}

const Spacer = () => h(View, { style: { flexGrow: 1 } });

function TopBar({ dark, pill, pillStyle, meta }) {
  return h(View, { style: S.topbar },
    dark ? h(View, { style: S.topLeft }, h(Wordmark, { dark: true })) : h(View, { style: pillStyle }, T(S.pillT, pill)),
    T({ ...S.metaR, color: dark ? "rgba(255,255,255,0.72)" : c.mutedCaps }, meta));
}

function Headline({ parts, style, amberStyle }) {
  // Two-part headline; the second part is amber.
  return h(Text, { style },
    T({}, parts[0] + " "),
    T(amberStyle, parts[1] || ""));
}

// ---- pages ---------------------------------------------------------------
function Page1(pitch) {
  const cl = pitch.client;
  return h(Page, { size: [W, H], style: S.pageDark },
    h(FullDarkBg, { id: "p1" }),
    h(View, { style: S.topbar },
      h(Wordmark, { dark: true }),
      T({ ...S.metaR, color: "rgba(255,255,255,0.72)" }, `CLIENT PITCH · ${brand.year}`)),
    h(View, { style: { marginTop: 16 } },
      T(S.heroLabel, pitch.hook.label),
      h(Headline, { parts: pitch.hook.headline, style: S.heroH1, amberStyle: S.amber }),
      T(S.heroSub, pitch.hook.subhead)),
    h(Spacer, {}),
    h(View, { style: S.snap },
      T(S.snapLabel, "WHAT WE UNDERSTAND"),
      h(View, { style: S.snapGrid },
        h(View, { style: { width: 200 } },
          T(S.snapK, "INDUSTRY"), T(S.snapV, cl.industry)),
        h(View, { style: { flex: 1 } },
          T(S.snapK, "BUSINESS MODEL"), T(S.snapV, cl.businessModel))),
      h(View, { style: S.chipRow }, clamp(cl.classification, 6).map((t, i) => h(Chip, { key: i, text: t, dark: true }))),
      T(S.proof, (brand.proof || []).join("   ·   "))),
    h(View, { style: S.botbar },
      T({ color: "rgba(255,255,255,0.72)", fontSize: 8.5, letterSpacing: 1 }, pitch.meta.preparedFor),
      T({ color: "rgba(255,255,255,0.72)", fontSize: 8.5, letterSpacing: 1 }, `${brand.primaryDomain} · ${brand.primaryEmail}`)));
}

function Page2(pitch) {
  const cl = pitch.client;
  return h(Page, { size: [W, H], style: S.pageLight },
    h(TopBar, { pill: "CHALLENGES", pillStyle: S.pillProblem, meta: `${cl.name.toUpperCase()} · 02` }),
    T(S.h2, `Where ${cl.name}'s operations get hard.`),
    T(S.lead, `Based on what ${cl.name} does, these are the operational gaps Hyperion sees most often in this kind of business.`),
    h(View, { style: S.probGrid },
      clamp(pitch.painPoints, 6).map((p, i) => h(View, { key: i, style: S.probCard },
        h(View, { style: S.probTop },
          T(S.probNum, String(i + 1).padStart(2, "0")),
          h(View, { style: p.confidence === "confirmed" ? S.confConfirmed : S.confLikely },
            T(S.confT, (p.confidence || "").toUpperCase()))),
        T(S.probTitle, p.text),
        T(S.probCat, p.category)))),
    h(View, { style: S.botbarLight }, h(Wordmark, {}), T(S.dim, brand.primaryDomain)));
}

function Page3(pitch) {
  const st = pitch.productStack;
  const row = (label, items) => h(View, { style: S.stackRow },
    T(S.stackRk, label),
    h(View, { style: S.chipWrap }, (items && items.length ? items : ["—"]).map((t, i) => h(Chip, { key: i, text: t }))));
  return h(Page, { size: [W, H], style: S.pageLight },
    h(TopBar, { pill: "RECOMMENDED SOLUTION", pillStyle: S.pill, meta: `${pitch.client.name.toUpperCase()} · 03` }),
    T(S.h2, "The right Hyperion stack — not the whole catalog."),
    T(S.lead, st.reasoning),
    h(View, { style: S.stack },
      h(View, { style: S.stackPrimary },
        T(S.stackTag, "PRIMARY"),
        T(S.stackName, st.primary ? st.primary.name : "—"),
        T(S.stackWhy, st.primary ? st.primary.why : "")),
      h(View, { style: S.stackRest },
        row("SECONDARY", st.secondary),
        row("EXPANSION", st.expansion),
        row("AI AGENT LAYER", st.aiLayer))),
    h(View, { style: S.solutionBox },
      T(S.boxLabel, `HOW HYPERION HELPS ${pitch.client.name.toUpperCase()} SPECIFICALLY`),
      T(S.helps, pitch.howItHelpsSpecifically)),
    h(View, { style: S.botbarLight }, h(Wordmark, {}), T(S.dim, brand.primaryDomain)));
}

function Page4(pitch) {
  return h(Page, { size: [W, H], style: S.pageLight },
    h(TopBar, { pill: "PROOF OF FIT & PLAN", pillStyle: S.pillSolution, meta: `${pitch.client.name.toUpperCase()} · 04` }),
    h(View, { style: S.two },
      h(View, { style: { width: 500 } },
        T(S.colH, "FEATURE MAPPING"),
        h(View, {}, clamp(pitch.features, 4).map((f, i) => h(View, { key: i, style: S.mapRow },
          h(View, { style: S.mapPain },
            h(View, { style: S.rdot }),
            T(S.mapPainT, f.painSolved)),
          h(Text, { style: S.mapFeat }, T({}, `${f.feature}  `), T(S.mapProd, `· ${f.product}`))))),
        T({ ...S.colH, marginTop: 12 }, "AI AGENTS THAT AUTOMATE THE WORK"),
        h(View, {}, clamp(pitch.aiAgents, 4).map((a, i) => h(View, { key: i, style: S.agent },
          h(Text, {}, T(S.agentN, a.name + "  "), T(S.agentD, a.automates)))))),
      h(View, { style: { width: 340 } },
        T(S.colH, "IMPLEMENTATION ROADMAP"),
        h(View, { style: { gap: 10 } }, clamp(pitch.roadmap, 4).map((p, i) => h(View, { key: i, style: S.phase },
          T(S.phaseN, p.n),
          h(View, { style: { flex: 1 } },
            T(S.phaseT, p.title),
            T(S.phaseB, p.body))))))),
    h(Spacer, {}),
    h(View, { style: S.ctaBand },
      h(BandDarkBg, { id: "cta", w: 880, hgt: CTA_H }),
      h(View, { style: { maxWidth: 560 } },
        T(S.ctaLabel, pitch.cta.label),
        h(Headline, { parts: pitch.cta.headline, style: S.ctaH, amberStyle: S.amber }),
        T(S.ctaSub, pitch.cta.subhead)),
      h(View, { style: { alignItems: "flex-end" } },
        h(View, { style: S.ctaAction }, T(S.ctaActionT, pitch.cta.action)),
        T(S.ctaContact, `${brand.primaryEmail} · ${brand.primaryDomain}`))));
}

// ---- styles --------------------------------------------------------------
const S = StyleSheet.create({
  pageDark: { position: "relative", paddingTop: 30, paddingBottom: 26, paddingHorizontal: 40, color: "#FFFFFF", fontFamily: "Helvetica" },
  pageLight: { position: "relative", paddingTop: 28, paddingBottom: 18, paddingHorizontal: 40, backgroundColor: "#FFFFFF", color: c.bodyGray, fontFamily: "Helvetica" },
  topbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", zIndex: 2 },
  topLeft: { flexDirection: "row", alignItems: "center" },
  metaR: { fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.5 },
  wordmark: { flexDirection: "row", alignItems: "center", gap: 7 },
  wmText: { fontSize: 12.5, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  wmDot: { fontSize: 12.5, fontFamily: "Helvetica-Bold", color: c.amber },
  amber: { color: c.amber },
  // hero
  heroLabel: { color: c.amber, fontFamily: "Helvetica-Bold", letterSpacing: 2, fontSize: 10, marginBottom: 12 },
  heroH1: { fontFamily: "Helvetica-Bold", fontSize: 29, lineHeight: 1.14, color: "#FFFFFF", marginBottom: 12, zIndex: 2, maxWidth: 720 },
  heroSub: { fontSize: 12.5, lineHeight: 1.5, color: "#C7C9E6", maxWidth: 660, zIndex: 2 },
  snap: { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.15)", paddingTop: 14, zIndex: 2 },
  snapLabel: { fontFamily: "Helvetica-Bold", letterSpacing: 1.6, fontSize: 8.5, color: c.amber, marginBottom: 9 },
  snapGrid: { flexDirection: "row", gap: 24, marginBottom: 11 },
  snapK: { fontSize: 8.5, letterSpacing: 1, color: "#9AA0D4", marginBottom: 3 },
  snapV: { fontSize: 11.5, color: "#E7E8FB", lineHeight: 1.35 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 11 },
  proof: { fontSize: 9.5, color: "#9AA0D4", letterSpacing: 0.3 },
  botbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14, zIndex: 2 },
  botbarLight: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, borderTopWidth: 1, borderTopColor: c.cardBorder, paddingTop: 10 },
  dim: { color: c.mutedCaps, fontSize: 8.5, letterSpacing: 1 },
  // chips
  chip: { backgroundColor: c.pillBg, borderWidth: 1, borderColor: "#DCD9F6", borderRadius: 6, paddingVertical: 4, paddingHorizontal: 9 },
  chipT: { fontSize: 9, fontFamily: "Helvetica-Bold", color: c.indigo },
  chipDark: { backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 6, paddingVertical: 4, paddingHorizontal: 9 },
  chipDarkT: { fontSize: 9, color: "#E7E8FB" },
  // pills
  pill: { backgroundColor: c.pillBg, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 13 },
  pillProblem: { backgroundColor: c.problemBg, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 13 },
  pillSolution: { backgroundColor: c.solutionBg, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 13 },
  pillT: { fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, color: c.indigo },
  // headings
  h2: { fontFamily: "Helvetica-Bold", fontSize: 21, lineHeight: 1.12, color: c.headingInk, marginTop: 15, marginBottom: 7 },
  lead: { fontSize: 11, lineHeight: 1.45, color: c.bodyGray, maxWidth: 810 },
  // page 2 — problems
  probGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 16, flexGrow: 1, alignContent: "flex-start" },
  probCard: { width: 278, minHeight: 116, borderWidth: 1, borderColor: c.cardBorder, borderLeftWidth: 3, borderLeftColor: c.problemDot, borderRadius: 10, padding: 14, marginBottom: 12 },
  probTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  probNum: { fontFamily: "Helvetica-Bold", fontSize: 14, color: c.problemDot },
  confLikely: { backgroundColor: "#FFF4E0", borderRadius: 5, paddingVertical: 3, paddingHorizontal: 7 },
  confConfirmed: { backgroundColor: c.solutionBg, borderRadius: 5, paddingVertical: 3, paddingHorizontal: 7 },
  confT: { fontSize: 7, fontFamily: "Helvetica-Bold", letterSpacing: 0.5, color: "#9A6300" },
  probTitle: { fontFamily: "Helvetica-Bold", fontSize: 12, lineHeight: 1.25, color: c.headingInk, marginBottom: 6 },
  probCat: { fontSize: 9, color: c.mutedCaps },
  // page 3 — stack
  stack: { flexDirection: "row", gap: 18, marginTop: 16 },
  stackPrimary: { width: 300, borderWidth: 1, borderColor: c.cardBorder, borderTopWidth: 3, borderTopColor: c.indigo, borderRadius: 12, padding: 16 },
  stackTag: { fontFamily: "Helvetica-Bold", letterSpacing: 1.5, fontSize: 8, color: c.indigo, marginBottom: 7 },
  stackName: { fontFamily: "Helvetica-Bold", fontSize: 16, color: c.headingInk, marginBottom: 7 },
  stackWhy: { fontSize: 10, lineHeight: 1.45, color: c.bodyGray },
  stackRest: { flex: 1, justifyContent: "center", gap: 11 },
  stackRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  stackRk: { width: 96, fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 0.5, color: c.mutedCaps, paddingTop: 5 },
  chipWrap: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  solutionBox: { backgroundColor: c.solutionBg, borderWidth: 1, borderColor: "#CDEEDE", borderRadius: 14, padding: 16, marginTop: 16 },
  boxLabel: { fontFamily: "Helvetica-Bold", letterSpacing: 1, fontSize: 8.5, color: c.solutionText, marginBottom: 8 },
  helps: { fontSize: 11.5, lineHeight: 1.5, color: c.headingInk },
  // page 4
  two: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  colH: { fontFamily: "Helvetica-Bold", letterSpacing: 1, fontSize: 9, color: c.headingInk, marginBottom: 9 },
  mapRow: { paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: c.cardBorder },
  mapPain: { flexDirection: "row", alignItems: "center", gap: 8 },
  rdot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.solutionDot },
  mapPainT: { fontSize: 10, fontFamily: "Helvetica-Bold", color: c.headingInk },
  mapFeat: { fontSize: 9.5, color: c.bodyGray, paddingLeft: 14, marginTop: 2 },
  mapProd: { color: c.indigo, fontFamily: "Helvetica-Bold" },
  agent: { borderWidth: 1, borderColor: c.cardBorder, borderRadius: 8, padding: 7, marginBottom: 5 },
  agentN: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: c.headingInk },
  agentD: { fontSize: 9, color: c.bodyGray, lineHeight: 1.3 },
  phase: { flexDirection: "row", gap: 10 },
  phaseN: { fontFamily: "Helvetica-Bold", fontSize: 15, color: c.indigo, width: 26 },
  phaseT: { fontFamily: "Helvetica-Bold", fontSize: 11, color: c.headingInk, marginBottom: 2 },
  phaseB: { fontSize: 9.5, lineHeight: 1.35, color: c.bodyGray },
  // cta
  ctaBand: { position: "relative", overflow: "hidden", borderRadius: 14, height: CTA_H, paddingVertical: 18, paddingHorizontal: 22, marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF" },
  ctaLabel: { color: c.amber, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, fontSize: 9, marginBottom: 6, zIndex: 2 },
  ctaH: { fontFamily: "Helvetica-Bold", fontSize: 16, lineHeight: 1.12, color: "#FFFFFF", marginBottom: 5, zIndex: 2 },
  ctaSub: { fontSize: 10, lineHeight: 1.4, color: "#C7C9E6", zIndex: 2 },
  ctaAction: { backgroundColor: c.amber, borderRadius: 9, paddingVertical: 12, paddingHorizontal: 20, zIndex: 2 },
  ctaActionT: { color: "#1A1206", fontFamily: "Helvetica-Bold", letterSpacing: 1, fontSize: 10 },
  ctaContact: { fontSize: 9, letterSpacing: 0.5, color: "#AAB0E0", marginTop: 9, zIndex: 2 },
});

export function PitchDocument(pitch) {
  return h(Document, { title: `${pitch.client?.name || "Client"} — Hyperion Pitch`, author: brand.company },
    Page1(pitch), Page2(pitch), Page3(pitch), Page4(pitch));
}

export async function renderPitchPdf(pitch) {
  return await renderToBuffer(PitchDocument(pitch));
}
