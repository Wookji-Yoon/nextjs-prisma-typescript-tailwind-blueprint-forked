import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/server/client";
import { withAPISession } from "../../../lib/server/withSession";
import withHandler from "../../../lib/server/withHandlers";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId } = req.session;
    const { content } = req.body;

    const newTweet = await db.tweet.create({
      data: {
        content,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(200).json({ ok: true, tweet: newTweet });
  }

  if (req.method === "GET") {
    const tweets = await db.tweet.findMany({
      take: 15,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({ ok: true, tweets });
  }
}

export default withAPISession(
  withHandler({
    methods: ["GET", "POST"],
    handlerFn: handler,
    isPublic: true,
  })
);
