"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { COLLECTIONS, COLLECTION_ORDER, CollectionKey } from "./collections";
import { AdminNav } from "./AdminNav";

export default function AdminOverview() {
  const kb = useQuery(api.kb.getAll);
  // one remover per collection (hooks must be called unconditionally, in order)
  const removers: Record<CollectionKey, any> = {
    products: useMutation(api.kb.removeProduct),
    painPoints: useMutation(api.kb.removePain),
    agents: useMutation(api.kb.removeAgent),
    businessTypes: useMutation(api.kb.removeType),
  };

  const [tab, setTab] = useState<CollectionKey>("products");
  const coll = COLLECTIONS[tab];
  const rows: any[] = kb ? (kb as any)[tab] : [];

  async function del(row: any) {
    if (!confirm(`Delete "${coll.title(row)}"?`)) return;
    await removers[tab]({ id: row._id });
  }

  return (
    <>
      <div className="top">
        <div className="brand"><span className="diamond" /><span>HYPERION<span className="wm-dot">.</span></span></div>
        <h1>Knowledge Base</h1>
        <p>Everything the pitch agent uses. Add or edit any item — changes go live to the agent automatically.</p>
      </div>

      <div className="wrap">
        <AdminNav backHref="/" backLabel="← Back to pitch" />

        <div className="tabs" style={{ marginBottom: 18 }}>
          {COLLECTION_ORDER.map((k) => (
            <button key={k} className={"tab" + (k === tab ? " active" : "")} onClick={() => setTab(k)}>
              {COLLECTIONS[k].label}
              {kb ? ` (${(kb as any)[k].length})` : ""}
            </button>
          ))}
        </div>

        {!kb && <div className="loading"><span className="spin" />Loading knowledge base…</div>}

        {kb && (
          <div className="card">
            <div className="actions" style={{ justifyContent: "space-between", marginBottom: 12 }}>
              <h2>{coll.label}</h2>
              <Link href={`/admin/${tab}/new`} className="btn">+ Add {coll.singular.toLowerCase()}</Link>
            </div>
            {rows.map((row) => (
              <div className="kb-row" key={row._id}>
                <div className="kb-row-title">{coll.title(row)}</div>
                <div className="kb-actions">
                  <Link href={`/admin/${tab}/${row._id}`} className="btn-sm">Edit</Link>
                  <button className="btn-sm btn-danger" onClick={() => del(row)}>Delete</button>
                </div>
              </div>
            ))}
            {rows.length === 0 && <div className="hint">No entries yet.</div>}
          </div>
        )}
      </div>
    </>
  );
}
