import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    newUser: "/sign-up",
    signIn: "/sign-in",
    signOut: "/sign-in",
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
