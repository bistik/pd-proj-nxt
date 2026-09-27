"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();
  async function onLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }
  return (
    <Button variant={"destructive"} size={"lg"} onClick={onLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;
