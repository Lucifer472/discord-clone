"use client";
import { useRouter } from "next/navigation";
import { Server } from "@prisma/client";
import Image from "next/image";

import { Hint } from "@/components/hint";

import { cn } from "@/lib/utils";

import { useServerId } from "@/features/servers/hooks/use-server-id";

export const NavigationItem = ({ server }: { server: Server }) => {
  const router = useRouter();
  const serverId = useServerId();

  return (
    <Hint label={server.name} side="right" align="center">
      <button
        onClick={() => {
          router.push("/servers/" + server.id);
        }}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            serverId !== server.id && "group-hover:h-[20px]",
            serverId === server.id ? "h-[36px]" : "h-[8px]"
          )}
        ></div>
        <div
          className={cn(
            "relative group flex mx-3 size-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            serverId === server.id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image
            src={server.image}
            alt={server.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </button>
    </Hint>
  );
};
