import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidV4 } from "uuid";

import { ServerSchema } from "../schema";

import { db } from "@/lib/db";
import { SessionMiddleware } from "@/lib/session";
import { getServerWithChannelById } from "@/data/server";

const app = new Hono()
  .post(
    "/create",
    SessionMiddleware,
    zValidator("json", ServerSchema),
    async (c) => {
      const user = c.get("user");
      const { name, image } = c.req.valid("json");

      if (!image || image instanceof File) {
        return c.json({ error: "Invalid Image" }, 400);
      }

      try {
        const inviteCode = uuidV4();

        const server = await db.server.create({
          data: {
            image,
            name,
            userId: user.id,
            inviteCode,
            channels: {
              create: [
                {
                  name: "general",
                  userId: user.id,
                },
              ],
            },
            member: {
              create: [
                {
                  userId: user.id,
                  role: "ADMIN",
                },
              ],
            },
          },
        });

        return c.json({ data: server }, 200);
      } catch (error) {
        return c.json({ error }, 500);
      }
    }
  )
  .get("/:serverId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { serverId } = c.req.param();

    const server = await getServerWithChannelById(serverId, user.id);

    if (!server) {
      return c.json({ error: "no server found!" }, 404);
    }

    return c.json({ data: server }, 200);
  })
  .patch("/generate-new-code/:serverId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { serverId } = c.req.param();

    const server = await getServerWithChannelById(serverId, user.id);

    if (!server) {
      return c.json({ error: "no server found!" }, 404);
    }

    const member = server.server.member.find((m) => m.userId === user.id);

    if (!member || member.role !== "ADMIN") {
      return c.json({ error: "You are not authorized!" }, 400);
    }

    try {
      const data = await db.server.update({
        where: {
          id: server.server.id,
        },

        data: {
          inviteCode: uuidV4(),
        },
      });

      return c.json({ data }, 200);
    } catch (error) {
      return c.json({ error }, 500);
    }
  });

export default app;
