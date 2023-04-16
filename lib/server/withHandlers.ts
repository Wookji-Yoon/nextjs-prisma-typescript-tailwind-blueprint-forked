import { NextApiRequest, NextApiResponse } from "next";

export interface MyReponseType {
  ok: boolean;
  [key: string]: any;
}

type Method = "GET" | "POST" | "DELETE";

export interface ConfigType {
  methods: Method[];
  handlerFn: (req: NextApiRequest, res: NextApiResponse) => void;
  isPublic?: boolean;
}

export default function withHandler({ methods, handlerFn, isPublic = false }: ConfigType) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    if (!methods.includes(req.method as Method)) {
      return res.status(405).end({ err: "Method Not Allowed" });
    }
    if (!isPublic && !req.session.userId) {
      return res.status(401).json({ err: "You must Logged In First" });
    }

    try {
      await handlerFn(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err });
    }
  };
}
