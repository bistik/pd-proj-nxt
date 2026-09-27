import LogoutButton from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-guard";
import Image from "next/image";

export default async function Home() {
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
