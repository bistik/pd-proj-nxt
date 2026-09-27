import { createAuthClient } from "better-auth/react";
// should use localhost:3000 on local and prod domain on prod
export const authClient = createAuthClient();
