import { Hono } from "hono";
import { handle } from "hono/vercel";

import UserRoute from "@/features/auth/server/route";
import ServerRoute from "@/features/servers/server/route";
import ChannelRoute from "@/features/channels/server/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app
  .route("/channel", ChannelRoute)
  .route("/user", UserRoute)
  .route("/server", ServerRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof route;
