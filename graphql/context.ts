import { NextApiRequest } from "next";

declare global {
  namespace GraphQLModules {
    interface GlobalContext {
      req: NextApiRequest;
    }
  }
}

export type Context = GraphQLModules.GlobalContext;
