import { ConvexClientProvider } from "../ConvexClientProvider";
import { AdminGate } from "./AdminGate";

// Every /admin route: Convex client + require sign-in.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <AdminGate>{children}</AdminGate>
    </ConvexClientProvider>
  );
}
