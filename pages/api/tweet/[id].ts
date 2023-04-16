import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/server/client";
import { withAPISession } from "../../../lib/server/withSession";
import withHandler from "../../../lib/server/withHandlers";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;
    const tweet = await db.tweet.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            Like: true,
          },
        },
      },
    });

    const isLiked = Boolean(
      await db.like.findFirst({
        where: {
          tweetId: Number(id),
          authorId: req.session.userId,
        },
      })
    );

    return res.status(200).json({ ok: true, tweet, isLiked });
  }

  if (req.method === "POST") {
    const { id } = req.query;

    const isAlreadyLiked = Boolean(
      await db.like.findFirst({
        where: {
          tweetId: Number(id),
          authorId: req.session.userId,
        },
      })
    );
    if (isAlreadyLiked) {
      await db.like.deleteMany({
        where: {
          tweetId: Number(id),
          authorId: req.session.userId,
        },
      });
      return res.status(200).json({ ok: false, message: "Unliked" });
    } else {
      await db.like.create({
        data: {
          author: {
            connect: {
              id: req.session.userId,
            },
          },
          tweet: {
            connect: {
              id: Number(id),
            },
          },
        },
      });
      return res.status(200).json({ ok: true, message: "Liked" });
    }
  }
}

export default withAPISession(
  withHandler({
    methods: ["GET", "POST"],
    handlerFn: handler,
  })
);
