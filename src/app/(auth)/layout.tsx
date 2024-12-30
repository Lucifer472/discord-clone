import { redirect } from "next/navigation";

import { SessionUser } from "@/lib/session-user";
import { LayoutType } from "@/type";

const AuthLayout = async ({ children }: LayoutType) => {
  const user = await SessionUser();

  if (user) {
    return redirect("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-[450px] w-full">{children}</div>
    </main>
  );
};

export default AuthLayout;
