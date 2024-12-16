import { SessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  const { inviteCode } = params;

  const user = await SessionUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!inviteCode) {
    return redirect("/");
  }

  return <div>This is Invite code!</div>;
};

export default InvitePage;
