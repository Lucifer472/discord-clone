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
  })
  .patch(
    "/:serverId",
    SessionMiddleware,
    zValidator("json", ServerSchema),
    async (c) => {
      const user = c.get("user");
      const { serverId } = c.req.param();
      const { name, image } = c.req.valid("json");

      if (!image || image instanceof File) {
        return c.json({ error: "Invalid Image" }, 400);
      }

      try {
        const server = await db.server.findUnique({
          where: {
            id: serverId,
          },
          include: {
            member: true,
          },
        });

        if (!server) {
          return c.json({ error: "No server found!" }, 404);
        }

        const member = server.member.find((m) => m.userId === user.id);

        if (!member) {
          return c.json({ error: "No Member found!" }, 404);
        }

        if (member.role === "GUEST") {
          return c.json({ error: "you are not authorized" }, 403);
        }

        const updatedServer = await db.server.update({
          where: {
            id: serverId,
          },
          data: {
            name,
            image,
          },
        });

        return c.json({ success: updatedServer }, 200);
      } catch (error) {
        return c.json({ error }, 500);
      }
    }
  )
  .patch(
    "/update-member/:serverId/:memberId/:role",
    SessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const { memberId, role, serverId } = c.req.param();

      try {
        const server = await db.server.findUnique({
          where: {
            id: serverId,
          },
          include: {
            member: true,
          },
        });

        if (!server) {
          return c.json({ error: "Server not found!" }, 404);
        }

        const userMember = server.member.find((m) => m.userId === user.id);

        if (!userMember) {
          return c.json({ error: "No Member Found!" }, 404);
        }

        const isAdmin = userMember.role === "ADMIN";

        if (!isAdmin) {
          return c.json({ error: "Not Authorized" }, 403);
        }

        if (userMember.id === parseInt(memberId)) {
          return c.json({ error: "Self Update is not possible" }, 500);
        }

        await db.member.update({
          where: {
            id: parseInt(memberId),
          },
          data: {
            role:
              role === "ADMIN"
                ? "ADMIN"
                : role === "MODERATOR"
                ? "MODERATOR"
                : "GUEST",
          },
        });

        return c.json({ success: "Members Role Updated!" }, 200);
      } catch (error) {
        return c.json({ error }, 500);
      }
    }
  )
  .patch("/kick-member/:serverId/:memberId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { memberId, serverId } = c.req.param();

    try {
      const server = await db.server.findUnique({
        where: {
          id: serverId,
        },
        include: {
          member: true,
        },
      });

      if (!server) {
        return c.json({ error: "Server not found!" }, 404);
      }

      const userMember = server.member.find((m) => m.userId === user.id);

      if (!userMember) {
        return c.json({ error: "No Member Found!" }, 404);
      }

      const isAdmin = userMember.role === "ADMIN";

      if (!isAdmin) {
        return c.json({ error: "Not Authorized" }, 403);
      }

      if (userMember.id === parseInt(memberId)) {
        return c.json({ error: "Self Update is not possible" }, 500);
      }

      await db.member.delete({
        where: {
          id: parseInt(memberId),
        },
      });

      return c.json({ success: "Member Removed!" }, 200);
    } catch (error) {
      return c.json({ error }, 500);
    }
  })
  .patch("/leave-server/:serverId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { serverId } = c.req.param();

    try {
      const server = await db.server.findUnique({
        where: {
          id: serverId,
        },
        include: {
          member: {
            where: {
              userId: user.id,
            },
          },
        },
      });

      if (!server) {
        return c.json({ error: "No Server found!" }, 404);
      }

      const member = server.member.find((m) => m.userId === user.id);

      if (!member) {
        return c.json({ error: "No Member Found!" }, 404);
      }

      if (member.role === "ADMIN" || server.userId === member.userId) {
        return c.json({ error: "Admin can't leave server!" }, 401);
      }

      await db.member.delete({
        where: {
          id: member.id,
        },
      });

      return c.json({ success: "Member Removed!" }, 200);
    } catch (error) {
      return c.json({ error }, 500);
    }
  })
  .patch("/delete-server/:serverId", SessionMiddleware, async (c) => {
    const user = c.get("user");
    const { serverId } = c.req.param();

    try {
      const server = await db.server.findUnique({
        where: {
          id: serverId,
        },
        include: {
          member: {
            where: {
              userId: user.id,
            },
          },
        },
      });

      if (!server) {
        return c.json({ error: "No Server found!" }, 404);
      }

      const member = server.member.find((m) => m.userId === user.id);

      if (!member) {
        return c.json({ error: "No Member Found!" }, 404);
      }

      if (member.role !== "ADMIN") {
        return c.json(
          { error: "Only Admin have Access to this function!" },
          401
        );
      }

      await db.server.delete({
        where: {
          id: serverId,
        },
      });

      return c.json({ success: "Server Deleted!" }, 200);
    } catch (error) {
      return c.json({ error }, 500);
    }
  });

export default app;
