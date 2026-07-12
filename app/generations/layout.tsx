import { AdminGate } from "../admin/AdminGate";

// Team-only: require sign-in to view past generations.
export default function GenerationsLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
