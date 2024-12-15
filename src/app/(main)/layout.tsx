import { redirect } from "next/navigation";
import { LayoutType } from "@/type";

import { SessionUser } from "@/lib/session";

import { NavigationSidebar } from "@/components/navigation";
import { ModalProvider } from "@/components/provider/modal-provider";

const MainLayout = async ({ children }: LayoutType) => {
  const user = await SessionUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      <ModalProvider />
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] min-h-screen">{children}</main>
    </div>
  );
};

export default MainLayout;
