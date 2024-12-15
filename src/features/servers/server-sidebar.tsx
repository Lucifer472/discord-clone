import { redirect } from "next/navigation";

import { getServerWithChannelById } from "@/data/server";
import { SessionUser } from "@/lib/session";

import { ServerHeader } from "./server-header";

export const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const user = await SessionUser();

  const data = await getServerWithChannelById(serverId, user!.id);

  if (!data) {
    return redirect("/");
  }

  const { audioChannel, members, server, textChannel, videoChannel } = data;

  const role = server.member.find(
    (members) => members.userId === user!.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role!} />
    </div>
  );
};
