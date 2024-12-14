"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Login } from "./action";

export const SignInCard = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      startTransition(() => {
        Login({ email, password }).then((res) => {
          if (res.success) {
            router.push("/");
          }

          if (res.error) {
            toast.error(res.error);
          }
        });
      });
    }
  };

  return (
    <Card className="w-full h-full p-8 bg-white">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-black">Login to Continue</CardTitle>
        <CardDescription className="text-muted-foreground">
          Use you&apos;re email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handleLogin}>
          <Input
            disabled={isPending}
            type="email"
            placeholder="Email"
            name="email"
            required
            className="text-black bg-white border-gray-300"
          />
          <Input
            disabled={isPending}
            type="password"
            placeholder="Password"
            name="password"
            required
            className="text-black bg-white border-gray-300"
          />
          <Button
            type="submit"
            className="w-full bg-black hover:bg-black/80 text-white"
            size={"lg"}
            disabled={isPending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={isPending}
            onClick={() => {}}
            variant={"outline"}
            size={"lg"}
            className="w-full relative bg-transparent text-black hover:bg-gray-100 hover:text-black"
          >
            <div className="absolute top-2.5 left-2.5 size-5">
              <Image
                src={"/icons/google.svg"}
                fill
                alt="Google"
                style={{ objectFit: "contain" }}
              />
            </div>
            Continue with Google
          </Button>
          <Button
            disabled={isPending}
            onClick={() => {}}
            variant={"outline"}
            size={"lg"}
            className="w-full relative bg-transparent text-black hover:bg-gray-100 hover:text-black"
          >
            <div className="absolute top-2.5 left-2.5 size-5">
              <Image
                src={"/icons/github.svg"}
                fill
                alt="Google"
                style={{ objectFit: "contain" }}
              />
            </div>
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an Account?{" "}
          <Link
            href={"/sign-up"}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
