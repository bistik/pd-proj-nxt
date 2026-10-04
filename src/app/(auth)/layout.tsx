import { requireNoAuth } from "@/lib/auth-guard";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
      <NoAuthGate>{children}</NoAuthGate>
    </Suspense>
  );
}

async function NoAuthGate({ children }: { children: React.ReactNode }) {
  await requireNoAuth();
  return <div>{children}</div>;
}
