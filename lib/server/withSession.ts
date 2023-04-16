import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    userId?: number;
  }
}

export function withAPISession(handler: any) {
  return withIronSessionApiRoute(handler, {
    password: "EsQYZYzA45oH2bB44CFnfpgbpjBZxhbj",
    cookieName: "challenge",
  });
}
