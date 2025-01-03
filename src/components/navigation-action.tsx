"use client";

import { PlusIcon } from "lucide-react";
import { Hint } from "@/components/hint";
import { useServerModal } from "@/features/servers/hooks/use-server-modal";

export const NavigationAction = () => {
  const { setIsServer } = useServerModal();

  return (
    <Hint label="Add a server" side="right" align="center">
      <button
        className="group flex items-center"
        onClick={() => setIsServer(true)}
      >
        <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
          <PlusIcon
            className="group-hover:text-white transition text-emerald-500"
            size={25}
          />
        </div>
      </button>
    </Hint>
  );
};
