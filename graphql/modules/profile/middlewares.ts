import { isAuthenticated } from "../../middleware";
import { ProfileModule } from "./generated/module-types";

export const middlewares: ProfileModule.MiddlewareMap = {
  Mutation: {
    followUser: [isAuthenticated],
    unfollowUser: [isAuthenticated],
  },
};
