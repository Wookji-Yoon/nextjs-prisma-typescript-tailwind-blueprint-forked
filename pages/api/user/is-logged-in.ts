import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/server/client";
import { withAPISession } from "../../../lib/server/withSession";
import withHandler from "../../../lib/server/withHandlers";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { userId } = req.session;
    if (!userId) {
      return res.status(400).json({ ok: false, err: "User not found" });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (!user) {
      return res.status(400).json({ ok: false, err: "User not found" });
    }
    return res.status(200).json({ ok: true, user });
  }
}

export default withAPISession(
  withHandler({
    methods: ["GET"],
    handlerFn: handler,
    isPublic: true,
  })
);
