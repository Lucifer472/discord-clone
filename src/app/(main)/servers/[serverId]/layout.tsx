import { redirect } from "next/navigation";
import { LayoutType } from "@/type";

import { getServerById } from "@/data/server";
import { SessionUser } from "@/lib/session";

import { ServerSidebar } from "@/features/servers/server-sidebar";

const ServerLayout = async ({
  children,
  params,
}: LayoutType & { params: { serverId: string } }) => {
  const user = await SessionUser();
  const { serverId } = params;

  if (!user) {
    return redirect("/sign-in");
  }

  const server = await getServerById(serverId, user.id);

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen">
      <div className="hidden md:flex min-h-screen w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <div className="min-h-screen md:pl-60"> {children}</div>
    </div>
  );
};

export default ServerLayout;
