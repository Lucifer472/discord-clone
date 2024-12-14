import { LayoutType } from "@/type";

const AuthLayout = ({ children }: LayoutType) => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-[450px] w-full">{children}</div>
    </main>
  );
};

export default AuthLayout;
