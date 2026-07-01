// research_company: fetch the client's website and extract plain-text signals.
// Resilient — if the fetch fails (bot-walls, JS-only sites), it returns what it can
// and the pipeline continues on the business-card text alone.

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const pick = (html, re) => {
  const m = html.match(re);
  return m ? strip(m[1]) : "";
};

export async function researchCompany(website) {
  const result = { url: website || "", title: "", description: "", headings: [], text: "", ok: false, error: "" };
  if (!website) return result;
  let url = website.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  result.url = url;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (compatible; HyperionPitchBot/1.0)" },
    });
    clearTimeout(t);
    const html = await res.text();
    result.title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    result.description =
      pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
      pick(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
    result.headings = [...html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi)]
      .map((m) => strip(m[1]))
      .filter(Boolean)
      .slice(0, 15);
    result.text = strip(html).slice(0, 6000);
    result.ok = true;
  } catch (e) {
    result.error = String(e.message || e);
  }
  return result;
}
