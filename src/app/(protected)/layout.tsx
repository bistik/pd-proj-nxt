import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-guard";
import { Toaster } from "@/components/ui/sonner";
import { Timer } from "@/components/timer";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const { user } = session;
  return (
    <SidebarProvider>
      {/* quick fix, instead of export type SidebarUser = Omit<DrizzleUser, "image"> & {
  image?: string | null
}*/}
      <AppSidebar user={{ ...user, image: user.image ?? null }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-6">
          <Timer />
          {children}
        </main>
        <Toaster position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  );
}
