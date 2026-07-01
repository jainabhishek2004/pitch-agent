// Brand-exact 4-page pitch deck (16:9). Renders the structured pitch object.
// Covers PRD modules 2/3 (snapshot), 4 (challenges), 5/7 (solution + helps-specifically),
// 6/9/10 (feature mapping + AI agents + roadmap) + CTA.

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const amberMid = (parts) => parts.map((p, i) => (i === 1 ? `<span class="amber">${esc(p)}</span>` : esc(p))).join(" ");

export function buildHtml(pitch, brand) {
  const c = brand.colors;
  const diamond = `<span class="diamond"></span>`;
  const wordmark = `<span class="wordmark">${diamond}<b>${esc(brand.company.toUpperCase())}</b><span class="wm-dot">.</span></span>`;
  const meta = (n) => `<span class="meta-r dim">${esc(pitch.client.name.toUpperCase())} · 0${n}</span>`;
  const chip = (t) => `<span class="chip">${esc(t)}</span>`;

  // P1 — cover + client snapshot
  const p1 = `
  <section class="slide dark">
    <div class="topbar">${wordmark}<span class="meta-r">CLIENT PITCH · ${esc(brand.year)}</span></div>
    <div class="hook">
      <div class="label amber">${esc(pitch.hook.label)}</div>
      <h1 class="hero-h1">${amberMid(pitch.hook.headline)}</h1>
      <p class="hero-sub">${esc(pitch.hook.subhead)}</p>
    </div>
    <div class="snap">
      <div class="snap-label">WHAT WE UNDERSTAND</div>
      <div class="snap-grid">
        <div><div class="snap-k">Industry</div><div class="snap-v">${esc(pitch.client.industry)}</div></div>
        <div><div class="snap-k">Business model</div><div class="snap-v">${esc(pitch.client.businessModel)}</div></div>
      </div>
      <div class="snap-chips">${pitch.client.classification.map(chip).join("")}</div>
      <div class="proof">${(brand.proof || []).join(" · ")}</div>
    </div>
    <div class="botbar"><span>${esc(pitch.meta.preparedFor)}</span><span>${esc(brand.primaryDomain)} · ${esc(brand.primaryEmail)}</span></div>
  </section>`;

  // P2 — challenges (pains, module 4)
  const p2 = `
  <section class="slide light">
    <div class="topbar light"><span class="pill problem-pill">CHALLENGES</span>${meta(2)}</div>
    <h2 class="h2">Where ${esc(pitch.client.name)}'s operations get hard.</h2>
    <p class="lead">Based on what ${esc(pitch.client.name)} does, these are the operational gaps Hyperion sees most often in this kind of business.</p>
    <div class="prob-grid">
      ${pitch.painPoints.map((p, i) => `
        <div class="prob-card">
          <div class="prob-top"><span class="prob-num">${String(i + 1).padStart(2, "0")}</span><span class="conf conf-${esc(p.confidence)}">${esc(p.confidence)}</span></div>
          <div class="prob-title">${esc(p.text)}</div>
          <div class="prob-cat">${esc(p.category)}</div>
        </div>`).join("")}
    </div>
    <div class="botbar light"><span>${wordmark}</span><span class="dim">${esc(brand.primaryDomain)}</span></div>
  </section>`;

  // P3 — recommended solution + how it helps specifically (modules 5, 7)
  const st = pitch.productStack;
  const p3 = `
  <section class="slide light">
    <div class="topbar light"><span class="pill">RECOMMENDED SOLUTION</span>${meta(3)}</div>
    <h2 class="h2">The right Hyperion stack — not the whole catalog.</h2>
    <p class="lead">${esc(st.reasoning)}</p>
    <div class="stack">
      <div class="stack-primary">
        <div class="stack-tag">PRIMARY</div>
        <div class="stack-name">${esc(st.primary ? st.primary.name : "—")}</div>
        <div class="stack-why">${esc(st.primary ? st.primary.why : "")}</div>
      </div>
      <div class="stack-rest">
        <div class="stack-row"><span class="stack-rk">Secondary</span><span class="stack-rv">${st.secondary.map(chip).join("") || "—"}</span></div>
        <div class="stack-row"><span class="stack-rk">Expansion</span><span class="stack-rv">${st.expansion.map(chip).join("") || "—"}</span></div>
        <div class="stack-row"><span class="stack-rk">AI agent layer</span><span class="stack-rv">${st.aiLayer.map(chip).join("") || "—"}</span></div>
      </div>
    </div>
    <div class="solution-box">
      <div class="box-label solution">HOW HYPERION HELPS ${esc(pitch.client.name.toUpperCase())} SPECIFICALLY</div>
      <p class="helps">${esc(pitch.howItHelpsSpecifically)}</p>
    </div>
    <div class="botbar light"><span>${wordmark}</span><span class="dim">${esc(brand.primaryDomain)}</span></div>
  </section>`;

  // P4 — feature mapping + AI agents + roadmap + CTA (modules 6, 9, 10)
  const p4 = `
  <section class="slide light">
    <div class="topbar light"><span class="pill solution-pill">PROOF OF FIT &amp; PLAN</span>${meta(4)}</div>
    <div class="two">
      <div>
        <div class="col-h">Feature mapping</div>
        <div class="map">
          ${pitch.features.slice(0, 4).map((f) => `
            <div class="map-row">
              <div class="map-pain"><span class="rdot"></span>${esc(f.painSolved)}</div>
              <div class="map-feat">${esc(f.feature)} <span class="map-prod">· ${esc(f.product)}</span></div>
            </div>`).join("")}
        </div>
        <div class="col-h mt">AI agents that automate the work</div>
        <div class="agents">
          ${pitch.aiAgents.map((a) => `<div class="agent"><span class="agent-n">${esc(a.name)}</span><span class="agent-d">${esc(a.automates)}</span></div>`).join("")}
        </div>
      </div>
      <div>
        <div class="col-h">Implementation roadmap</div>
        <div class="phases">
          ${pitch.roadmap.map((p) => `<div class="phase"><span class="phase-n">${esc(p.n)}</span><div><div class="phase-t">${esc(p.title)}</div><div class="phase-b">${esc(p.body)}</div></div></div>`).join("")}
        </div>
      </div>
    </div>
    <div class="cta-band">
      <div class="cta-left">
        <div class="label amber sm">${esc(pitch.cta.label)}</div>
        <div class="cta-h">${amberMid(pitch.cta.headline)}</div>
        <p class="cta-sub">${esc(pitch.cta.subhead)}</p>
      </div>
      <div class="cta-right">
        <div class="cta-action">${esc(pitch.cta.action)}</div>
        <div class="cta-contact">${esc(brand.primaryEmail)} · ${esc(brand.primaryDomain)}</div>
      </div>
    </div>
  </section>`;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${brand.fonts.googleFontsHref}" rel="stylesheet">
<style>
  :root{ --ink:${c.ink}; --indigo:${c.indigo}; --amber:${c.amber};
    --heading:${c.headingInk}; --body:${c.bodyGray}; --muted:${c.mutedCaps}; --border:${c.cardBorder}; --pill:${c.pillBg};
    --prob-bg:${c.problemBg}; --prob-tx:${c.problemText}; --prob-dot:${c.problemDot};
    --sol-bg:${c.solutionBg}; --sol-tx:${c.solutionText}; --sol-dot:${c.solutionDot}; }
  @page{ size:13.333in 7.5in; margin:0; }
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{ font-family:${brand.fonts.bodyStack}; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .slide{ width:1280px; height:720px; position:relative; overflow:hidden; padding:42px 56px 36px; page-break-after:always; display:flex; flex-direction:column; background:#fff; color:var(--body);}
  .slide:last-child{ page-break-after:auto; }
  .dark{ color:#fff; background:
      radial-gradient(900px 520px at 88% 6%, rgba(245,165,36,.22), transparent 60%),
      radial-gradient(760px 620px at 10% 102%, rgba(79,70,229,.38), transparent 60%),
      linear-gradient(135deg, ${c.heroGradientFrom} 0%, ${c.heroGradientMid} 58%, ${c.heroGradientTo} 100%);}
  .dark::before{ content:""; position:absolute; inset:0;
    background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);
    background-size:46px 46px; mask-image:radial-gradient(circle at 72% 26%, #000 0%, transparent 72%);}
  .topbar{ display:flex; justify-content:space-between; align-items:center; font-weight:700; letter-spacing:.14em; font-size:12px; position:relative; z-index:2;}
  .topbar.light{ color:var(--heading);}
  .meta-r{ font-weight:600; letter-spacing:.2em; font-size:11px; opacity:.7;}
  .dim{ color:var(--muted); opacity:1;}
  .wordmark{ display:inline-flex; align-items:center; gap:9px; letter-spacing:.1em; font-weight:800;}
  .wordmark .wm-dot{ color:var(--amber);} .topbar.light .wordmark{ color:var(--heading);}
  .diamond{ width:15px; height:15px; transform:rotate(45deg); border-radius:3px; background:linear-gradient(135deg,var(--indigo),var(--amber)); box-shadow:0 0 14px rgba(245,165,36,.4); display:inline-block;}
  .botbar{ margin-top:auto; display:flex; justify-content:space-between; align-items:center; font-size:11px; letter-spacing:.12em; font-weight:600; position:relative; z-index:2;}
  .botbar{ opacity:.72;} .botbar.light{ color:var(--muted); border-top:1px solid var(--border); padding-top:11px; opacity:1;}
  .label{ font-weight:700; letter-spacing:.24em; font-size:12px; margin-bottom:14px;} .label.sm{ font-size:11px; margin-bottom:7px;}
  .amber{ color:var(--amber);}
  .hook{ position:relative; z-index:2; margin-top:14px; max-width:1040px;}
  .hero-h1{ font-family:${brand.fonts.displayStack}; font-weight:700; font-size:46px; line-height:1.06; letter-spacing:-.02em; color:#fff; margin-bottom:14px;}
  .hero-sub{ font-size:16px; line-height:1.5; color:#c7c9e6; max-width:880px;}
  .snap{ position:relative; z-index:2; margin-top:auto; padding-top:16px; border-top:1px solid rgba(255,255,255,.14);}
  .snap-label{ font-weight:700; letter-spacing:.2em; font-size:10.5px; color:var(--amber); margin-bottom:10px;}
  .snap-grid{ display:grid; grid-template-columns:1fr 2fr; gap:24px; margin-bottom:12px;}
  .snap-k{ font-size:10.5px; letter-spacing:.1em; color:#9aa0d4; text-transform:uppercase; margin-bottom:3px;}
  .snap-v{ font-size:13.5px; color:#e7e8fb; line-height:1.4;}
  .snap-chips{ display:flex; flex-wrap:wrap; gap:7px; margin-bottom:12px;}
  .snap-chips .chip{ background:rgba(255,255,255,.1); color:#e7e8fb; border:1px solid rgba(255,255,255,.18);}
  .proof{ font-size:11px; letter-spacing:.04em; color:#9aa0d4;}
  .chip{ font-size:11px; font-weight:600; color:var(--indigo); background:var(--pill); border:1px solid #dcd9f6; border-radius:7px; padding:5px 10px; display:inline-block;}
  .pill{ background:var(--pill); color:var(--indigo); font-weight:700; letter-spacing:.16em; font-size:11px; padding:7px 14px; border-radius:999px;}
  .pill.problem-pill{ background:var(--prob-bg); color:var(--prob-tx);} .pill.solution-pill{ background:var(--sol-bg); color:var(--sol-tx);}
  .h2{ font-family:${brand.fonts.displayStack}; font-weight:700; font-size:31px; line-height:1.08; letter-spacing:-.02em; color:var(--heading); margin:16px 0 8px;}
  .lead{ font-size:14px; line-height:1.5; color:var(--body); max-width:1080px;}
  .prob-grid{ display:grid; grid-template-columns:1fr 1fr 1fr; grid-auto-rows:1fr; gap:14px; margin-top:18px; flex:1;}
  .prob-card{ border:1px solid var(--border); border-left:4px solid var(--prob-dot); border-radius:12px; padding:16px 18px; display:flex; flex-direction:column;}
  .prob-top{ display:flex; justify-content:space-between; align-items:center; margin-bottom:9px;}
  .prob-num{ font-family:${brand.fonts.displayStack}; font-weight:700; font-size:17px; color:var(--prob-dot);}
  .conf{ font-size:9.5px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:3px 8px; border-radius:6px;}
  .conf-likely{ background:#FFF4E0; color:#9A6300;} .conf-confirmed{ background:var(--sol-bg); color:var(--sol-tx);}
  .prob-title{ font-family:${brand.fonts.displayStack}; font-weight:600; font-size:15.5px; line-height:1.25; color:var(--heading); margin-bottom:8px;}
  .prob-cat{ font-size:11px; color:var(--muted); margin-top:auto;}
  .stack{ display:grid; grid-template-columns:1.1fr 1.4fr; gap:18px; margin-top:18px;}
  .stack-primary{ border:1px solid var(--border); border-top:4px solid var(--indigo); border-radius:14px; padding:18px 20px;}
  .stack-tag{ font-weight:700; letter-spacing:.16em; font-size:10px; color:var(--indigo); margin-bottom:8px;}
  .stack-name{ font-family:${brand.fonts.displayStack}; font-weight:700; font-size:21px; color:var(--heading); margin-bottom:8px;}
  .stack-why{ font-size:12.5px; line-height:1.45; color:var(--body);}
  .stack-rest{ display:flex; flex-direction:column; justify-content:center; gap:12px;}
  .stack-row{ display:flex; align-items:flex-start; gap:14px;}
  .stack-rk{ width:108px; flex-shrink:0; font-size:11px; font-weight:700; letter-spacing:.06em; color:var(--muted); text-transform:uppercase; padding-top:5px;}
  .stack-rv{ display:flex; flex-wrap:wrap; gap:6px;}
  .solution-box{ background:var(--sol-bg); border:1px solid #cdeede; border-radius:16px; padding:18px 22px; margin-top:18px;}
  .box-label{ font-weight:700; letter-spacing:.14em; font-size:10.5px; margin-bottom:9px;} .box-label.solution{ color:var(--sol-tx);}
  .helps{ font-size:14px; line-height:1.5; color:var(--heading);}
  .two{ display:grid; grid-template-columns:1.25fr 1fr; gap:26px; margin-top:14px;}
  .col-h{ font-weight:700; letter-spacing:.1em; font-size:11px; color:var(--heading); text-transform:uppercase; margin-bottom:10px;} .col-h.mt{ margin-top:18px;}
  .map-row{ display:flex; flex-direction:column; gap:2px; padding:8px 0; border-bottom:1px solid var(--border);}
  .map-row:last-child{ border-bottom:none;}
  .map-pain{ font-size:12px; font-weight:600; color:var(--heading); display:flex; align-items:center; gap:8px;}
  .rdot{ width:6px; height:6px; border-radius:50%; background:var(--sol-dot); flex-shrink:0;}
  .map-feat{ font-size:11.5px; color:var(--body); padding-left:14px;} .map-prod{ color:var(--indigo); font-weight:600;}
  .agents{ display:flex; flex-direction:column; gap:8px;}
  .agent{ border:1px solid var(--border); border-radius:9px; padding:9px 12px;}
  .agent-n{ font-weight:700; font-size:12px; color:var(--heading); display:block;}
  .agent-d{ font-size:11px; color:var(--body); line-height:1.35;}
  .phases{ display:flex; flex-direction:column; gap:11px;}
  .phase{ display:flex; gap:12px;}
  .phase-n{ font-family:${brand.fonts.displayStack}; font-weight:700; font-size:18px; color:var(--indigo); min-width:30px;}
  .phase-t{ font-family:${brand.fonts.displayStack}; font-weight:600; font-size:14px; color:var(--heading); margin-bottom:2px;}
  .phase-b{ font-size:11.5px; line-height:1.4; color:var(--body);}
  .cta-band{ margin-top:auto; display:flex; justify-content:space-between; align-items:center; gap:24px; border-radius:16px; padding:18px 24px; color:#fff; position:relative; overflow:hidden;
    background:radial-gradient(600px 300px at 90% 0%, rgba(245,165,36,.22), transparent 60%), linear-gradient(120deg, ${c.heroGradientFrom}, ${c.heroGradientMid} 70%, ${c.heroGradientTo});}
  .cta-left{ max-width:760px;}
  .cta-h{ font-family:${brand.fonts.displayStack}; font-weight:700; font-size:22px; line-height:1.1; color:#fff; margin-bottom:5px;}
  .cta-sub{ font-size:12px; line-height:1.4; color:#c7c9e6;}
  .cta-right{ text-align:right; flex-shrink:0;}
  .cta-action{ background:var(--amber); color:#1a1206; font-weight:700; letter-spacing:.12em; font-size:12px; padding:13px 24px; border-radius:10px; white-space:nowrap;}
  .cta-contact{ font-size:10.5px; letter-spacing:.06em; color:#aab0e0; margin-top:10px;}
</style></head><body>${p1}${p2}${p3}${p4}</body></html>`;
}
