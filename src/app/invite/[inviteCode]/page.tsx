import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SessionUser } from "@/lib/session-user";

const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  const { inviteCode } = params;

  const user = await SessionUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      member: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect("/servers/" + existingServer.id);
  }

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      member: {
        create: [
          {
            userId: user.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect("/servers/" + server.id);
  }

  return <div>Invalid invite Code!</div>;
};

export default InvitePage;
