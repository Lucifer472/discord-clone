import "server-only";

import { createMiddleware } from "hono/factory";
import { User } from "@prisma/client";

import { auth, signOut } from "@/auth";
import { getUserByEmail } from "@/data/user";

export const SessionUser = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    await signOut();
    return null;
  }

  return user;
};

type AdditionalContext = {
  Variables: {
    user: User;
  };
};
export const SessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return c.json({ error: "Unauthorized!" }, 403);
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return c.json({ error: "Unauthorized!" }, 403);
    }

    c.set("user", user);

    await next();
  }
);
