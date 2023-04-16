import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/server/client";
import { withAPISession } from "../../../lib/server/withSession";
import withHandler from "../../../lib/server/withHandlers";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(400).json({
      ok: false,
      error: {
        kind: "email",
        message: "등록되지 않은 이메일입니다",
      },
    });
  }
  if (user.password !== password) {
    return res.status(400).json({
      ok: false,
      error: {
        kind: "password",
        message: "비밀번호가 일치하지 않습니다",
      },
    });
  }

  req.session.userId = user.id;
  await req.session.save();

  return res.status(200).json({ ok: true });
}

export default withAPISession(
  withHandler({
    methods: ["POST"],
    handlerFn: handler,
    isPublic: true,
  })
);
