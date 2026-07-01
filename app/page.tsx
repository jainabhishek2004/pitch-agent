"use client";
import { useState, useEffect } from "react";
import { useEveAgent } from "eve/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// The generate_pitch_pdf tool returns a URL; the agent ends its reply with `PDF: <url>`.
const PDF_RE = /(https?:\/\/\S+?\.pdf|\/generated\/[^\s)]+\.pdf)/i;

export default function Home() {
  const [cardText, setCardText] = useState("");
  const [website, setWebsite] = useState("");
  const agent = useEveAgent();
  const busy = agent.status === "submitted" || agent.status === "streaming";
  const started = agent.data.messages.length > 0;

  // Concatenate the assistant's streamed text (research notes, the pitch summary…).
  const assistantText = agent.data.messages
    .filter((m: any) => m.role === "assistant")
    .flatMap((m: any) => m.parts.filter((p: any) => p.type === "text").map((p: any) => p.text))
    .join("\n")
    .trim();
  const pdfUrl = assistantText.match(PDF_RE)?.[1] ?? null;
  const summary = assistantText.replace(/PDF:\s*\S+/i, "").trim();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!cardText.trim() && !website.trim()) return;
    agent.reset();
    agent.send({
      message:
        `Generate a Hyperion client pitch.\n\n` +
        `Business card:\n${cardText || "(none)"}\n\n` +
        `Website: ${website || "(none)"}`,
    });
  }
  useEffect(() => {
  console.log({
    status: agent.status,
    messages: agent.data.messages,
    error: (agent as any).error,
    agent,
  });
}, [agent.status, agent.data.messages]);

  return (
    <>
      <div className="top">
        <div className="brand"><span className="diamond" /><span>HYPERION<span className="wm-dot">.</span></span></div>
        <h1>Pitch Studio</h1>
        <p>Drop in a business card and the client&apos;s website. The Eve agent researches them, finds their operational pains, picks the right Hyperion stack + AI agents, and builds a branded pitch PDF.</p>
      </div>

      <div className="wrap">
        <div className="card">
          <h2>New client pitch</h2>
          <div className="sub">Business-card text and/or website. No meeting notes needed.</div>
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="card">Business card text</label>
              <textarea id="card" rows={4} value={cardText} onChange={(e) => setCardText(e.target.value)} placeholder="Paste what's on the card — name, title, company, email, phone…" />
              <div className="hint">e.g. &ldquo;Navin Singh, Founder &amp; CEO, ProcX Value Engineering Pvt. Ltd., navin@procx.in&rdquo;</div>
            </div>
            <div className="field">
              <label htmlFor="site">Company website</label>
              <input id="site" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="procx.in" />
            </div>
            <div className="actions">
              <button className="btn" type="submit" disabled={busy}>Generate pitch</button>
              {busy && <div className="loading"><span className="spin" />The agent is working…</div>}
              {started && !busy && <button type="button" className="btn btn-ghost" onClick={() => agent.reset()}>Generate another</button>}
            </div>
          </form>
          {agent.status === "error" && <div className="err">Something went wrong talking to the agent. Check that the Eve dev server is running and a model key (AI Gateway / Anthropic) is set.</div>}
        </div>

        {started && (
          <div className="results">
            <div className="panel">
              <h3>Agent</h3>
              {summary ? <div className="agent-out"><ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown></div> : <div className="loading"><span className="spin" />Thinking…</div>}
            </div>

            {pdfUrl && (
              <div className="pdfwrap">
                <div className="actions" style={{ marginBottom: 12 }}>
                  <a className="btn" href={pdfUrl} download>Download pitch PDF</a>
                </div>
                <iframe src={pdfUrl} title="Pitch PDF" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
