import { redirect } from "next/navigation";

import { getFirstServerByUserId } from "@/data/server";
import { SessionUser } from "@/lib/session";

import { InitialModal } from "@/features/servers/initial-modal";
import { UsernameModal } from "@/features/auth/username-model";

const SetupPage = async () => {
  const user = await SessionUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (user.username) {
    const server = await getFirstServerByUserId(user.id);

    if (!server) {
      return <InitialModal />;
    }

    return redirect("/servers/" + server.id);
  }

  return <UsernameModal />;
};

export default SetupPage;
