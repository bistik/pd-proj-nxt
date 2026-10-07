import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth-guard";
import { Folder, ListTodo, Loader2, NotebookText, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { cn } from "cn";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      }
    >
      <HomePageUser />
    </Suspense>
  );
}

async function HomePageUser() {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-background text-foreground font-sans">
      <div className="flex flex-col items-center gap-2">
        {user.image ? (
          <Image
            src={user.image}
            alt="user image"
            className="rounded-full object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <User className="size-8 text-muted-foreground" />
          </div>
        )}
        <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
      </div>
      <nav className="flex items-center gap-3">
        <Link
          href="/tasks"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          <ListTodo /> Tasks
        </Link>
        <Link
          href="/projects"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          <Folder /> Projects
        </Link>
        <Link
          href="/notes"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          <NotebookText /> Notes
        </Link>
      </nav>
    </div>
  );
}
