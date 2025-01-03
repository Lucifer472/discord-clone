import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

import { LoginSchema } from "@/features/auth/schema";
import { getUserByEmail } from "@/data/user";

export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          throw new Error("Invalid Fields");
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          throw new Error("Oath Provider Required!");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          throw new Error("Invalid Password or Email");
        }

        return { ...user, password: null };
      },
    }),
  ],
} satisfies NextAuthConfig;
