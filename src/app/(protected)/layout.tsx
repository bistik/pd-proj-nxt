import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth-guard";
import { Toaster } from "@/components/ui/sonner";
import { Timer } from "@/components/timer";
import { getLatestTimeEntry } from "@/actions/time-entries-actions";
import { Suspense } from "react";
import { NavUser } from "@/components/nav-user";
import { NavUserSkeleton } from "@/components/nav-user-skeleton";
import { ModeToggle } from "@/components/mode-toggle";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar
        navUser={
          <Suspense fallback={<NavUserSkeleton />}>
            <AuthenticatedNavUser />
          </Suspense>
        }
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="ml-auto">
            <ModeToggle />
          </div>
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

async function AuthenticatedNavUser() {
  const user = await getCurrentUser();
  return <NavUser user={{ ...user, image: user.image ?? null }} />;
}

async function RunningTimer() {
  const runningTimeEntry = await getLatestTimeEntry();
  if (!runningTimeEntry.success || !runningTimeEntry.data) {
    return null;
  }
  return <Timer timeEntry={runningTimeEntry.data} />;
}
