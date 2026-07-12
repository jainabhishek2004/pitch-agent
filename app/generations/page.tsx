"use client";
import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";

export default function Generations() {
  const gens = useQuery(api.generations.list);
  const [q, setQ] = useState("");

  const query = q.trim().toLowerCase();
  const filtered = (gens || []).filter((g: any) => {
    if (!query) return true;
    return `${g.businessCard} ${g.website} ${g.pitch} ${g.followupEmail}`.toLowerCase().includes(query);
  });

  return (
    <>
      <div className="top">
        <div className="brand"><span className="diamond" /><span>HYPERION<span className="wm-dot">.</span></span></div>
        <h1>Generations</h1>
        <p>Every pitch the team has generated — business card, website, pitch, follow-up email and PDF.</p>
      </div>

      <div className="wrap">
        <div className="actions" style={{ marginBottom: 18, justifyContent: "space-between" }}>
          <Link href="/" className="btn btn-ghost">← Back to pitch</Link>
          <button className="btn btn-ghost" onClick={() => authClient.signOut()}>Sign out</button>
        </div>

        <div className="field">
          <input placeholder="Search by company, website, pitch or email…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {!gens && <div className="loading"><span className="spin" />Loading generations…</div>}
        {gens && filtered.length === 0 && <div className="hint">{q ? "No generations match your search." : "No generations yet — generate a pitch to see it here."}</div>}

        {filtered.map((g: any) => (
          <div className="card gen-card" key={g._id}>
            <div className="gen-grid">
              <div>
                <b>Company website</b>
                <div className="gen-val">{g.website || "—"}</div>
              </div>
              <div>
                <b>Business card</b>
                <div className="gen-val" style={{ whiteSpace: "pre-wrap" }}>{g.businessCard || "—"}</div>
              </div>
            </div>

            <div className="gen-block">
              <b>Pitch</b>
              <div className="agent-out">{g.pitch ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{g.pitch}</ReactMarkdown> : "—"}</div>
            </div>

            <div className="gen-block">
              <b>Follow-up email</b>
              <div className="agent-out">{g.followupEmail ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{g.followupEmail}</ReactMarkdown> : "—"}</div>
            </div>

            <div className="actions" style={{ marginTop: 6 }}>
              {g.pdfUrl ? <a className="btn" href={g.pdfUrl} target="_blank" rel="noreferrer">Open pitch PDF</a> : <span className="hint">No PDF</span>}
              <span className="gen-date">{new Date(g._creationTime).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
