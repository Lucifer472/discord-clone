import { redirect } from "next/navigation";
import { LayoutType } from "@/type";

import { SessionUser } from "@/lib/session";

import { UsernameModal } from "@/features/auth/username-model";
import { NavigationSidebar } from "@/components/navigation";

const MainLayout = async ({ children }: LayoutType) => {
  const user = await SessionUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      <UsernameModal />
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-72 min-h-screen">{children}</main>
    </div>
  );
};

export default MainLayout;
