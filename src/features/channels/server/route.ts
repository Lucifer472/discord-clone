import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { db } from "@/lib/db";
import { SessionMiddleware } from "@/lib/session";

import { ChannelSchema } from "../schema";

const app = new Hono().post(
  "/create/:serverId",
  SessionMiddleware,
  zValidator("json", ChannelSchema),
  async (c) => {
    const { serverId } = c.req.param();
    const user = c.get("user");

    const { name, type } = c.req.valid("json");

    try {
      const server = await db.server.findUnique({
        where: {
          id: serverId,
        },
        include: {
          channels: {
            orderBy: {
              name: "asc",
            },
          },
          member: {
            orderBy: {
              updatedAt: "asc",
            },
          },
        },
      });

      if (!server) {
        return c.json({ error: "No Server Found!" }, 404);
      }

      const userMember = server.member.find((m) => m.userId === user.id);

      if (!userMember || userMember.role === "GUEST") {
        return c.json({ error: "Unauthorized!" }, 401);
      }

      const nameExists = server.channels.find((c) => c.name === name);

      if (nameExists) {
        return c.json({ error: "Channel Already Exists!" }, 402);
      }

      const channel = await db.channel.create({
        data: {
          name,
          serverId,
          type,
          userId: user.id,
        },
      });

      return c.json({ success: "Channel Created!", data: channel }, 200);
    } catch (error) {
      return c.json({ error }, 500);
    }
  }
);

export default app;
