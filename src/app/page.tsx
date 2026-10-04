import LogoutButton from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-guard";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

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
  const session = await requireAuth();
  const { user } = session;
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button variant={"outline"} size={"lg"} className="cursor-pointer">
        Hello world
      </Button>
      <h2>{user.name}</h2>
      {user.image ? (
        <Image
          src={user.image}
          alt="user image"
          className="object-contain"
          width={50}
          height={50}
        />
      ) : (
        <div className="size-50 rounded-full bg-muted" />
      )}
      <LogoutButton />
    </div>
  );
}
