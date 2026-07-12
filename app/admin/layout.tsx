import { AdminGate } from "./AdminGate";

// Convex provider is at the root layout; here we just require sign-in.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
