// Brand-exact 4-page pitch deck rendered with @react-pdf/renderer — pure JS, no
// headless browser. 16:9 pages = 960x540 pt. Elegant editorial styling in Poppins.
import React from "react";
import {
  Document, Page, View, Text, StyleSheet, Font,
  Svg, Rect, Defs, LinearGradient, RadialGradient, Stop,
  renderToBuffer,
} from "@react-pdf/renderer";
import { brand } from "./knowledge.mjs";

// --- fonts (static TTFs from jsDelivr's google/fonts mirror; cached at render) ---
const P = "https://cdn.jsdelivr.net/npm/@expo-google-fonts/poppins";
Font.register({
  family: "Poppins",
  fonts: [
    { src: `${P}/Poppins_400Regular.ttf`, fontWeight: 400 },
    { src: `${P}/Poppins_500Medium.ttf`, fontWeight: 500 },
    { src: `${P}/Poppins_600SemiBold.ttf`, fontWeight: 600 },
    { src: `${P}/Poppins_700Bold.ttf`, fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((w) => [w]); // no mid-word hyphenation

const c = brand.colors;
const h = React.createElement;
const W = 960, H = 540;
const CTA_H = 94;
const clamp = (arr, n) => (arr || []).slice(0, n);
const T = (style, children) => h(Text, { style }, children);

// ---- shared pieces --------------------------------------------------------
function Diamond({ size = 12 }) {
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
function FullDarkBg({ id }) {
  return h(View, { fixed: true, style: { position: "absolute", top: 0, left: 0, width: W, height: H } },
    h(Svg, { width: W, height: H },
      h(Defs, {},
        h(LinearGradient, { id: `${id}-g`, x1: "0", y1: "0", x2: "1", y2: "1" },
          h(Stop, { offset: "0", stopColor: c.heroGradientFrom }),
          h(Stop, { offset: "0.58", stopColor: c.heroGradientMid }),
          h(Stop, { offset: "1", stopColor: c.heroGradientTo })),
        h(RadialGradient, { id: `${id}-glow`, cx: "830", cy: "70", r: "480", gradientUnits: "userSpaceOnUse" },
          h(Stop, { offset: "0", stopColor: c.amber, stopOpacity: "0.20" }),
          h(Stop, { offset: "1", stopColor: c.amber, stopOpacity: "0" }))),
      h(Rect, { x: "0", y: "0", width: W, height: H, fill: `url(#${id}-g)` }),
      h(Rect, { x: "0", y: "0", width: W, height: H, fill: `url(#${id}-glow)` })));
}
function BandDarkBg({ id, w, hgt }) {
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
function TopBar({ pill, pillStyle, meta }) {
  return h(View, { style: S.topbar },
    h(View, { style: pillStyle }, T(S.pillT, pill)),
    T({ ...S.metaR, color: c.mutedCaps }, meta));
}
function FootLight({ n }) {
  return h(View, { style: S.botbarLight },
    h(Wordmark, {}),
    h(View, { style: { flexDirection: "row", alignItems: "center", gap: 12 } },
      T(S.dim, brand.primaryDomain),
      T(S.pageNum, `${n} / 04`)));
}
function Headline({ parts, style, amberStyle }) {
  return h(Text, { style }, T({}, parts[0] + " "), T(amberStyle, parts[1] || ""));
}

// ---- pages ---------------------------------------------------------------
function Page1(pitch) {
  const cl = pitch.client;
  const proof = clamp(brand.proof, 4);
  return h(Page, { size: [W, H], style: S.pageDark },
    h(FullDarkBg, { id: "p1" }),
    h(View, { style: S.topbar },
      h(Wordmark, { dark: true }),
      T({ ...S.metaR, color: "rgba(255,255,255,0.7)" }, `CLIENT PITCH · ${brand.year}`)),
    h(View, { style: { marginTop: 22 } },
      T(S.heroLabel, pitch.hook.label),
      h(Headline, { parts: pitch.hook.headline, style: S.heroH1, amberStyle: S.amber }),
      T(S.heroSub, pitch.hook.subhead)),
    // proof stat strip
    h(View, { style: S.statRow },
      proof.map((p, i) => {
        const sp = String(p).split(" ");
        const big = sp[0];
        const rest = sp.slice(1).join(" ");
        return h(View, { key: i, style: [S.stat, i < proof.length - 1 && S.statBorder] },
          T(S.statBig, big), T(S.statLbl, rest));
      })),
    h(View, { style: S.snap },
      T(S.snapLabel, "WHAT WE UNDERSTAND"),
      h(View, { style: S.snapGrid },
        h(View, { style: { width: 210 } }, T(S.snapK, "INDUSTRY"), T(S.snapV, cl.industry)),
        h(View, { style: { flex: 1 } }, T(S.snapK, "BUSINESS MODEL"), T(S.snapV, cl.businessModel))),
      h(View, { style: S.chipRow }, clamp(cl.classification, 6).map((t, i) => h(Chip, { key: i, text: t, dark: true })))),
    h(Spacer, {}),
    h(View, { style: S.botbar },
      T(S.footD, pitch.meta.preparedFor),
      T(S.footD, `${brand.primaryDomain} · ${brand.primaryEmail}`)));
}

function Page2(pitch) {
  const cl = pitch.client;
  return h(Page, { size: [W, H], style: S.pageLight },
    h(TopBar, { pill: "CHALLENGES", pillStyle: S.pillProblem, meta: `${cl.name.toUpperCase()} · CHALLENGES` }),
    T(S.h2, `Where ${cl.name}'s operations get hard.`),
    T(S.lead, `Based on what ${cl.name} does, these are the operational gaps Hyperion sees most often in this kind of business.`),
    h(View, { style: S.probGrid },
      clamp(pitch.painPoints, 6).map((p, i) => h(View, { key: i, style: S.probCard },
        h(View, { style: S.probTop },
          h(View, { style: S.probNumWrap }, T(S.probNum, String(i + 1).padStart(2, "0"))),
          h(View, { style: p.confidence === "confirmed" ? S.confConfirmed : S.confLikely },
            T(p.confidence === "confirmed" ? S.confTC : S.confT, (p.confidence || "").toUpperCase()))),
        T(S.probTitle, p.text),
        T(S.probCat, p.category)))),
    h(FootLight, { n: "02" }));
}

function Page3(pitch) {
  const st = pitch.productStack;
  const row = (label, items) => h(View, { style: S.stackRow },
    T(S.stackRk, label),
    h(View, { style: S.chipWrap }, (items && items.length ? items : ["—"]).map((t, i) => h(Chip, { key: i, text: t }))));
  return h(Page, { size: [W, H], style: S.pageLight },
    h(TopBar, { pill: "RECOMMENDED SOLUTION", pillStyle: S.pill, meta: `${pitch.client.name.toUpperCase()} · SOLUTION` }),
    T(S.h2, "The Right Hyperion stack"),
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
      h(View, { style: S.solAccent }),
      h(View, { style: { flex: 1 } },
        T(S.boxLabel, `HOW HYPERION HELPS ${pitch.client.name.toUpperCase()} SPECIFICALLY`),
        T(S.helps, pitch.howItHelpsSpecifically))),
    h(FootLight, { n: "03" }));
}

function Page4(pitch) {
  return h(Page, { size: [W, H], style: S.pageLight },
    h(TopBar, { pill: "PROOF OF FIT & PLAN", pillStyle: S.pillSolution, meta: `${pitch.client.name.toUpperCase()} · PLAN` }),
    h(View, { style: S.two },
      h(View, { style: { width: 512 } },
        T(S.colH, "FEATURE MAPPING"),
        h(View, {}, clamp(pitch.features, 4).map((f, i) => h(View, { key: i, style: S.mapRow },
          h(View, { style: S.mapPain },
            h(View, { style: S.rdot }),
            T(S.mapPainT, f.painSolved)),
          h(Text, { style: S.mapFeat },
            T({}, `${f.feature} `),
            T(S.mapProd, `· ${f.product}`),
            f.businessImpact ? T(S.mapImpact, `   → ${f.businessImpact}`) : null)))),
        T({ ...S.colH, marginTop: 10 }, "AI AGENTS THAT AUTOMATE THE WORK"),
        h(View, {}, clamp(pitch.aiAgents, 4).map((a, i) => h(View, { key: i, style: S.agent },
          h(Text, {}, T(S.agentN, a.name + "  "), T(S.agentD, a.automates)))))),
      h(View, { style: { width: 340 } },
        T(S.colH, "IMPLEMENTATION ROADMAP"),
        h(View, { style: { gap: 11 } }, clamp(pitch.roadmap, 4).map((p, i) => h(View, { key: i, style: S.phase },
          h(View, { style: S.phaseNumWrap }, T(S.phaseN, p.n)),
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
  pageDark: { position: "relative", paddingTop: 32, paddingBottom: 26, paddingHorizontal: 44, color: "#FFFFFF", fontFamily: "Poppins", fontWeight: 400 },
  pageLight: { position: "relative", paddingTop: 26, paddingBottom: 16, paddingHorizontal: 44, backgroundColor: "#FFFFFF", color: c.bodyGray, fontFamily: "Poppins", fontWeight: 400 },
  topbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", zIndex: 2 },
  metaR: { fontSize: 8, fontWeight: 600, letterSpacing: 1.6 },
  wordmark: { flexDirection: "row", alignItems: "center", gap: 8 },
  wmText: { fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5 },
  wmDot: { fontSize: 12.5, fontWeight: 700, color: c.amber },
  amber: { color: c.amber },
  // hero
  heroLabel: { color: c.amber, fontWeight: 600, letterSpacing: 2.5, fontSize: 9.5, marginBottom: 14 },
  heroH1: { fontWeight: 700, fontSize: 30, lineHeight: 1.15, color: "#FFFFFF", marginBottom: 13, zIndex: 2, maxWidth: 740, letterSpacing: -0.3 },
  heroSub: { fontSize: 12, lineHeight: 1.55, color: "#C7C9E6", maxWidth: 640, zIndex: 2, fontWeight: 400 },
  statRow: { flexDirection: "row", marginTop: 22, zIndex: 2 },
  stat: { paddingRight: 22, marginRight: 22 },
  statBorder: { borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.14)" },
  statBig: { fontSize: 18, fontWeight: 700, color: "#FFFFFF", letterSpacing: -0.4 },
  statLbl: { fontSize: 8.5, color: "#9AA0D4", marginTop: 3, letterSpacing: 0.3, maxWidth: 130, lineHeight: 1.3 },
  snap: { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.14)", paddingTop: 14, zIndex: 2 },
  snapLabel: { fontWeight: 600, letterSpacing: 2, fontSize: 8.5, color: c.amber, marginBottom: 10 },
  snapGrid: { flexDirection: "row", gap: 26, marginBottom: 12 },
  snapK: { fontSize: 8, letterSpacing: 1, color: "#9AA0D4", marginBottom: 4 },
  snapV: { fontSize: 11.5, color: "#E7E8FB", lineHeight: 1.4, fontWeight: 500 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  botbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14, zIndex: 2 },
  footD: { color: "rgba(255,255,255,0.62)", fontSize: 8.5, letterSpacing: 0.8 },
  botbarLight: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, borderTopWidth: 1, borderTopColor: c.cardBorder, paddingTop: 10 },
  dim: { color: c.mutedCaps, fontSize: 8.5, letterSpacing: 0.8 },
  pageNum: { color: c.mutedCaps, fontSize: 8.5, letterSpacing: 1.5, fontWeight: 600 },
  // chips
  chip: { backgroundColor: c.pillBg, borderWidth: 1, borderColor: "#DCD9F6", borderRadius: 7, paddingVertical: 4, paddingHorizontal: 10 },
  chipT: { fontSize: 9, fontWeight: 600, color: c.indigo },
  chipDark: { backgroundColor: "rgba(255,255,255,0.09)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 7, paddingVertical: 4, paddingHorizontal: 10 },
  chipDarkT: { fontSize: 9, color: "#E7E8FB", fontWeight: 500 },
  // pills
  pill: { backgroundColor: c.pillBg, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
  pillProblem: { backgroundColor: c.problemBg, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
  pillSolution: { backgroundColor: c.solutionBg, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
  pillT: { fontSize: 8.5, fontWeight: 600, letterSpacing: 1.6, color: c.indigo },
  // headings
  h2: { fontWeight: 600, fontSize: 22, lineHeight: 1.14, color: c.headingInk, marginTop: 16, marginBottom: 7, letterSpacing: -0.3 },
  lead: { fontSize: 10.5, lineHeight: 1.5, color: c.bodyGray, maxWidth: 820 },
  // page 2 — problems
  probGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 16, flexGrow: 1, alignContent: "flex-start" },
  probCard: { width: 278, minHeight: 112, borderWidth: 1, borderColor: c.cardBorder, borderLeftWidth: 3, borderLeftColor: c.problemDot, borderRadius: 11, padding: 15, marginBottom: 12 },
  probTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 9 },
  probNumWrap: { width: 26, height: 26, borderRadius: 13, backgroundColor: c.problemBg, alignItems: "center", justifyContent: "center" },
  probNum: { fontWeight: 700, fontSize: 11, color: c.problemText },
  confLikely: { backgroundColor: "#FFF4E0", borderRadius: 5, paddingVertical: 3, paddingHorizontal: 8 },
  confConfirmed: { backgroundColor: c.solutionBg, borderRadius: 5, paddingVertical: 3, paddingHorizontal: 8 },
  confT: { fontSize: 7, fontWeight: 600, letterSpacing: 0.6, color: "#9A6300" },
  confTC: { fontSize: 7, fontWeight: 600, letterSpacing: 0.6, color: c.solutionText },
  probTitle: { fontWeight: 600, fontSize: 11.5, lineHeight: 1.3, color: c.headingInk, marginBottom: 6 },
  probCat: { fontSize: 8.5, color: c.mutedCaps, marginTop: "auto", letterSpacing: 0.3 },
  // page 3 — stack
  stack: { flexDirection: "row", gap: 18, marginTop: 16 },
  stackPrimary: { width: 300, borderWidth: 1, borderColor: c.cardBorder, borderTopWidth: 3, borderTopColor: c.indigo, borderRadius: 13, padding: 17 },
  stackTag: { fontWeight: 600, letterSpacing: 1.8, fontSize: 8, color: c.indigo, marginBottom: 8 },
  stackName: { fontWeight: 600, fontSize: 16, color: c.headingInk, marginBottom: 8, letterSpacing: -0.2 },
  stackWhy: { fontSize: 10, lineHeight: 1.5, color: c.bodyGray },
  stackRest: { flex: 1, justifyContent: "center", gap: 12 },
  stackRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  stackRk: { width: 100, fontSize: 8.5, fontWeight: 600, letterSpacing: 0.6, color: c.mutedCaps, paddingTop: 5 },
  chipWrap: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  solutionBox: { flexDirection: "row", backgroundColor: c.solutionBg, borderWidth: 1, borderColor: "#CDEEDE", borderRadius: 15, padding: 17, marginTop: 16, gap: 14 },
  solAccent: { width: 3, backgroundColor: c.solutionDot, borderRadius: 2 },
  boxLabel: { fontWeight: 600, letterSpacing: 1.2, fontSize: 8.5, color: c.solutionText, marginBottom: 8 },
  helps: { fontSize: 11, lineHeight: 1.55, color: c.headingInk },
  // page 4
  two: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  colH: { fontWeight: 600, letterSpacing: 1.2, fontSize: 8.5, color: c.headingInk, marginBottom: 9 },
  mapRow: { paddingVertical: 4.5, borderBottomWidth: 1, borderBottomColor: c.cardBorder },
  mapPain: { flexDirection: "row", alignItems: "center", gap: 8 },
  rdot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.solutionDot },
  mapPainT: { fontSize: 10, fontWeight: 600, color: c.headingInk },
  mapFeat: { fontSize: 9.5, color: c.bodyGray, paddingLeft: 14, marginTop: 2 },
  mapProd: { color: c.indigo, fontWeight: 600 },
  mapImpact: { fontSize: 9, color: c.solutionText, paddingLeft: 14, marginTop: 2, fontWeight: 500 },
  agent: { paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: c.cardBorder },
  agentN: { fontWeight: 600, fontSize: 9.5, color: c.headingInk },
  agentD: { fontSize: 9, color: c.bodyGray, lineHeight: 1.35 },
  phase: { flexDirection: "row", gap: 11 },
  phaseNumWrap: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: c.indigo, alignItems: "center", justifyContent: "center" },
  phaseN: { fontWeight: 700, fontSize: 10, color: c.indigo },
  phaseT: { fontWeight: 600, fontSize: 11, color: c.headingInk, marginBottom: 2 },
  phaseB: { fontSize: 9.5, lineHeight: 1.4, color: c.bodyGray },
  // cta
  ctaBand: { position: "relative", overflow: "hidden", borderRadius: 15, height: CTA_H, paddingVertical: 18, paddingHorizontal: 24, marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", color: "#FFFFFF" },
  ctaLabel: { color: c.amber, fontWeight: 600, letterSpacing: 1.8, fontSize: 8.5, marginBottom: 7, zIndex: 2 },
  ctaH: { fontWeight: 600, fontSize: 16, lineHeight: 1.15, color: "#FFFFFF", marginBottom: 5, zIndex: 2, letterSpacing: -0.2 },
  ctaSub: { fontSize: 9.5, lineHeight: 1.45, color: "#C7C9E6", zIndex: 2 },
  ctaAction: { backgroundColor: c.amber, borderRadius: 9, paddingVertical: 12, paddingHorizontal: 22, zIndex: 2 },
  ctaActionT: { color: "#1A1206", fontWeight: 600, letterSpacing: 1, fontSize: 10 },
  ctaContact: { fontSize: 9, letterSpacing: 0.5, color: "#AAB0E0", marginTop: 9, zIndex: 2 },
});

export function PitchDocument(pitch) {
  return h(Document, { title: `${pitch.client?.name || "Client"} — Hyperion Pitch`, author: brand.company },
    Page1(pitch), Page2(pitch), Page3(pitch), Page4(pitch));
}

export async function renderPitchPdf(pitch) {
  return await renderToBuffer(PitchDocument(pitch));
}
