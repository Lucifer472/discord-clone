import NextAuth from "next-auth";
import authConfig from "@/auth.config";

export const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const loginRoutes = ["/sign-in", "/sign-up"];

  if (nextUrl.pathname.startsWith("/api")) {
    return;
  }

  if (isLoggedIn) {
    if (loginRoutes.includes(nextUrl.pathname)) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (!loginRoutes.includes(nextUrl.pathname)) {
    return Response.redirect(new URL("/sign-in", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
