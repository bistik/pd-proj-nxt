import { requireNoAuth } from "@/lib/auth-guard";
import React from "react";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  await requireNoAuth();
  return <div>{children}</div>;
}

export default AuthLayout;
