import { prisma } from "../../../lib/db";
import { isNonNullable } from "../../../lib/isNonNullable";
import { pickBy } from "../../../lib/pickBy";
import { toGlobalId } from "../../util/globalId";
import { Auth } from "../common/auth.provider";
import { UserModule } from "./generated/module-types";

export const resolvers: UserModule.Resolvers = {
  Query: {
    async me(_root, _args, context) {
      const session = await context.injector
        .get(Auth)
        .getRequiredCurrentSession();

      const {
        user: { id, email, username, image, bio },
      } = session;

      return {
        id,
        email,
        username,
        image,
        bio,
      };
    },
  },
  Mutation: {
    async updateUser(_root, { input }, context) {
      const session = await context.injector
        .get(Auth)
        .getRequiredCurrentSession();

      const user = await prisma.user.update({
        where: { email: session.user.email },
        data: pickBy(input, isNonNullable),
      });

      return user;
    },
  },
  Self: {
    async __isTypeOf(user, context) {
      const session = await context.injector.get(Auth).getCurrentSession();

      return session?.user.id === user.id;
    },
    id(user) {
      return toGlobalId("User", user.id);
    },
    async email(_root, _args, context) {
      const session = await context.injector
        .get(Auth)
        .getRequiredCurrentSession();

      return session.user.email;
    },
  },
};
