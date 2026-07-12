"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function AdminNav({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  return (
    <div className="actions" style={{ marginBottom: 18, justifyContent: "space-between" }}>
      <Link href={backHref} className="btn btn-ghost">{backLabel}</Link>
      <button className="btn btn-ghost" onClick={() => authClient.signOut()}>Sign out</button>
    </div>
  );
}
