import { isNonNullable } from "../../../lib/isNonNullable";
import { pickBy } from "../../../lib/pickBy";
import { Connection } from "../../util/connection";
import { toGlobalId } from "../../util/globalId";
import { TagModule } from "./generated/module-types";
import { TagRepository } from "./tag.repository";

export const resolvers: TagModule.Resolvers = {
  Query: {
    async tags(_root, args, context) {
      const repository = context.injector.get(TagRepository);

      const tags = await repository.listTags(pickBy(args, isNonNullable));

      return new Connection("Tag", tags, pickBy(args, isNonNullable));
    },
  },
  Tag: {
    id({ id }) {
      return toGlobalId("Tag", id);
    },
  },
  Article: {
    async tags({ slug }, args, context) {
      const repository = context.injector.get(TagRepository);

      const tags = await repository.articleTags(
        slug,
        pickBy(args, isNonNullable)
      );

      return new Connection("Tag", tags, pickBy(args, isNonNullable));
    },
  },
};
