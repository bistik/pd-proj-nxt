import "server-only";

import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  "use cache: private";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session.user;
}

export async function requireNoAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
}
