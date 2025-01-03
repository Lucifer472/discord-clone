import { SessionUser } from "@/lib/session-user";

import { findManyServerByUserId } from "@/data/server";

import { NavigationAction } from "@/components/navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "@/components/navigation-item";
import { ModeToggle } from "@/components/toggle-theme";

import { UserButton } from "@/features/auth/user-button";

export const NavigationSidebar = async () => {
  const user = await SessionUser();

  if (!user) return;

  const servers = await findManyServerByUserId(user.id);

  return (
    <div className="space-y-4 flex flex-col items-center min-h-screen text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers?.map((s) => (
          <div key={s.id} className="mb-4">
            <NavigationItem server={s} />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
};
