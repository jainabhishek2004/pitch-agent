"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { COLLECTIONS, CollectionKey } from "./collections";
import { AdminNav } from "./AdminNav";

export function ItemForm({ collectionKey, id }: { collectionKey: CollectionKey; id?: string }) {
  const coll = COLLECTIONS[collectionKey];
  const router = useRouter();
  const kb = useQuery(api.kb.getAll);
  const addM = useMutation(coll.api.add);
  const updateM = useMutation(coll.api.update);

  const [form, setForm] = useState<Record<string, string> | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Initialise the form once data is available (blank for "new", filled for "edit").
  useEffect(() => {
    if (form !== null) return;
    if (id && !kb) return; // editing: wait for data
    const src = id && kb ? (kb as any)[collectionKey].find((r: any) => r._id === id) : null;
    if (id && !src) return; // not found yet
    const f: Record<string, string> = {};
    coll.fields.forEach((fl) => {
      const v = src ? src[fl.key] : "";
      f[fl.key] = Array.isArray(v) ? v.join(", ") : v ?? "";
    });
    setForm(f);
  }, [kb, id, form, collectionKey, coll]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setErr("");
    setBusy(true);
    try {
      const doc: any = {};
      coll.fields.forEach((fl) => {
        const raw = form[fl.key] ?? "";
        doc[fl.key] = fl.type === "array" ? raw.split(",").map((s) => s.trim()).filter(Boolean) : raw;
      });
      if (id) await (updateM as any)({ id, ...doc });
      else await (addM as any)(doc);
      router.push("/admin");
    } catch (e: any) {
      setErr(e?.message || "Failed to save.");
      setBusy(false);
    }
  }

  const heading = id ? `Edit ${coll.singular.toLowerCase()}` : `New ${coll.singular.toLowerCase()}`;

  return (
    <>
      <div className="top">
        <div className="brand"><span className="diamond" /><span>HYPERION<span className="wm-dot">.</span></span></div>
        <h1>{heading}</h1>
        <p>{coll.label} · list fields are comma-separated.</p>
      </div>
      <div className="wrap">
        <AdminNav backHref="/admin" backLabel="← Back to knowledge base" />
        {!form ? (
          <div className="loading"><span className="spin" />Loading…</div>
        ) : (
          <div className="card">
            <form onSubmit={save}>
              {coll.fields.map((fl) => (
                <div className="field" key={fl.key}>
                  <label>{fl.label}</label>
                  {fl.type === "textarea" ? (
                    <textarea rows={2} placeholder={fl.placeholder} value={form[fl.key]} onChange={(e) => setForm({ ...form, [fl.key]: e.target.value })} />
                  ) : (
                    <input placeholder={fl.placeholder} value={form[fl.key]} onChange={(e) => setForm({ ...form, [fl.key]: e.target.value })} />
                  )}
                </div>
              ))}
              {err && <div className="err">{err}</div>}
              <div className="actions" style={{ marginTop: 8 }}>
                <button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
                <Link href="/admin" className="btn btn-ghost">Cancel</Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
