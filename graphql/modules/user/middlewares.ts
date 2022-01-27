import { isAuthenticated } from "../../middleware";
import { UserModule } from "./generated/module-types";

export const middlewares: UserModule.MiddlewareMap = {
  Query: {
    me: [isAuthenticated],
  },
  Mutation: {
    updateUser: [isAuthenticated],
  },
};
