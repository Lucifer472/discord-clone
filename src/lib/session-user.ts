"use server";

import { auth, signOut } from "@/auth";
import { getUserByEmail } from "@/data/user";

export const SessionUser = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return undefined;
  }

  return user;
};

export const LogOut = async () => {
  await signOut({
    redirect: false,
  });
  return null;
};
