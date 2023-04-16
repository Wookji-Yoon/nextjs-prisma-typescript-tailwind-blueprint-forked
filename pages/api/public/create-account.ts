import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/server/client";
import { withAPISession } from "../../../lib/server/withSession";
import withHandler from "../../../lib/server/withHandlers";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, name } = req.body;
  await db.user.create({
    data: {
      email,
      password,
      name,
    },
  });
  return res.status(200).json({ ok: true });
}

export default withAPISession(
  withHandler({
    methods: ["POST"],
    handlerFn: handler,
    isPublic: true,
  })
);
