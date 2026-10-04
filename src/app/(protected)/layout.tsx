import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-guard";
import { Toaster } from "@/components/ui/sonner";
import { Timer } from "@/components/timer";
import { getLatestTimeEntry } from "@/actions/time-entries-actions";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* quick fix, instead of export type SidebarUser = Omit<DrizzleUser, "image"> & {
  image?: string | null
}*/}
      <Suspense fallback={null}>
        <AuthenticatedSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-6">
          <Suspense fallback={null}>
            <RunningTimer />
          </Suspense>
          {children}
        </main>
        <Toaster position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  );
}

async function AuthenticatedSidebar() {
  const session = await requireAuth();
  const { user } = session;
  return <AppSidebar user={{ ...user, image: user.image ?? null }} />;
}

async function RunningTimer() {
  const runningTimeEntry = await getLatestTimeEntry();
  if (!runningTimeEntry.success || !runningTimeEntry.data) {
    return null;
  }
  return <Timer timeEntry={runningTimeEntry.data} />;
}
