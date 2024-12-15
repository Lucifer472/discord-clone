import { db } from "@/lib/db";

export const getFirstServerByUserId = async (userId: string) => {
  try {
    return await db.server.findFirst({
      where: {
        userId,
      },
    });
  } catch {
    return null;
  }
};

export const getServerById = async (id: string, userId: string) => {
  try {
    return await db.server.findFirst({
      where: {
        id,
        member: {
          some: {
            userId: userId,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

export const getServerWithChannelById = async (id: string, userId: string) => {
  try {
    const server = await db.server.findFirst({
      where: {
        id,
        member: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
        member: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    if (!server) return null;

    const textChannel = server.channels.filter(
      (channel) => channel.type === "TEXT"
    );

    const audioChannel = server.channels.filter(
      (channel) => channel.type === "AUDIO"
    );

    const videoChannel = server.channels.filter(
      (channel) => channel.type === "VIDEO"
    );

    const members = server.member.filter((member) => member.userId !== userId);

    return {
      server,
      videoChannel,
      audioChannel,
      textChannel,
      members,
    };
  } catch {
    return null;
  }
};

export const findManyServerByUserId = async (userId: string) => {
  try {
    return await db.server.findMany({
      where: {
        member: {
          some: {
            userId,
          },
        },
      },
    });
  } catch {
    return null;
  }
};
