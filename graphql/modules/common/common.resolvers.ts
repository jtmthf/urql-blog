import { fromGlobalId } from "../../util/globalId";
import { PRISMA } from "./constants";
import { CommonModule } from "./generated/module-types";

export const resolvers: CommonModule.Resolvers = {
  Query: {
    async node(_root, args, context) {
      const prisma = context.injector.get(PRISMA);
      const { typename, id } = fromGlobalId(args.id);

      switch (typename) {
        case "Article": {
          const article = await prisma.article.findUnique({ where: { id } });

          if (!article) {
            return null;
          }

          return {
            __typename: typename,
            ...article,
          };
        }
        case "Comment": {
          const comment = await prisma.comment.findUnique({ where: { id } });

          if (!comment) {
            return null;
          }

          return {
            __typename: typename,
            ...comment,
          };
        }
        default: {
          throw new Error();
        }
      }
    },
  },
};
