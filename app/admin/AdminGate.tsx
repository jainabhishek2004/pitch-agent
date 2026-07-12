"use client";
import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";

// Wraps every /admin route: shows the login screen until signed in.
export function AdminGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading) {
    return <div className="wrap" style={{ marginTop: 40 }}><div className="loading"><span className="spin" />Checking sign-in…</div></div>;
  }
  if (!isAuthenticated) return <LoginScreen />;
  return <>{children}</>;
}

function LoginScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res =
        mode === "signin"
          ? await authClient.signIn.email({ email, password })
          : await authClient.signUp.email({ email, password, name: email.split("@")[0] || "Admin" });
      if ((res as any)?.error) setErr((res as any).error.message || "Something went wrong.");
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="top">
        <div className="brand"><span className="diamond" /><span>HYPERION<span className="wm-dot">.</span></span></div>
        <h1>Hyperion — Admin</h1>
        <p>Sign in to continue.</p>
      </div>
      <div className="wrap">
        <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
          <h2>{mode === "signin" ? "Sign in" : "Create admin account"}</h2>
          <div className="sub">Email &amp; password.</div>
          <form onSubmit={submit}>
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {err && <div className="err">{err}</div>}
            <div className="actions" style={{ marginTop: 8 }}>
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); }}>
                {mode === "signin" ? "Create an account" : "Have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
