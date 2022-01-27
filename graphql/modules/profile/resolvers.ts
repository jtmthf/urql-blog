import { prisma } from "../../../lib/db";
import { toGlobalId } from "../../util/globalId";
import { Auth } from "../common/auth.provider";
import { ProfileModule } from "./generated/module-types";

export const resolvers: ProfileModule.Resolvers = {
  Query: {
    async getProfile(_root, { username }) {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      return user;
    },
  },
  Mutation: {
    async followUser(_root, { input: { username } }, context) {
      const session = await context.injector
        .get(Auth)
        .getRequiredCurrentSession();

      const user = await prisma.user.update({
        where: { username },
        data: {
          followers: {
            connect: {
              username: session.user.username,
            },
          },
        },
      });

      return {
        ...user,
        following: true,
      };
    },
    async unfollowUser(_root, { input: { username } }, context) {
      const session = await context.injector
        .get(Auth)
        .getRequiredCurrentSession();

      const user = await prisma.user.update({
        where: { username },
        data: {
          followers: {
            disconnect: {
              username: session.user.username,
            },
          },
        },
      });

      return {
        ...user,
        following: false,
      };
    },
  },
  Profile: {
    async __isTypeOf(user, context) {
      const session = await context.injector.get(Auth).getCurrentSession();

      return session?.user.id !== user.id;
    },
    id(user) {
      return toGlobalId("User", user.id);
    },
    async following(profile, _args, context) {
      const session = await context.injector.get(Auth).getCurrentSession();

      if (!session) {
        return null;
      }

      const followers = await prisma.user.count({
        where: {
          username: profile.username,
          followers: {
            some: {
              username: session.user.username,
            },
          },
        },
      });

      return followers > 0;
    },
  },
};
