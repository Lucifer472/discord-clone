import { SessionUser } from "@/lib/session";

import { findManyServerByUserId } from "@/data/server";

import { NavigationAction } from "./navigation-action";

export const NavigationSidebar = async () => {
  const user = await SessionUser();

  if (!user) return;

  const servers = await findManyServerByUserId(user.id);

  return (
    <div className="space-y-4 flex flex-col items-center min-h-screen text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
    </div>
  );
};
