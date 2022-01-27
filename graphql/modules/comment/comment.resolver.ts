import { isNonNullable } from "../../../lib/isNonNullable";
import { pickBy } from "../../../lib/pickBy";
import { Connection } from "../../util/connection";
import { fromGlobalId, toGlobalId } from "../../util/globalId";
import { CommentRepository } from "./comment.repository";
import { CommentModule } from "./generated/module-types";

export const resolvers: CommentModule.Resolvers = {
  Mutation: {
    async addComment(_root, { input: { slug, body } }, context) {
      const repository = context.injector.get(CommentRepository);

      const comment = await repository.addComment(slug, body);

      return {
        comment,
      };
    },
    async deleteComment(_root, { input: { slug, id } }, context) {
      const repository = context.injector.get(CommentRepository);

      await repository.deleteComment(slug, id);

      return {
        successful: true,
      };
    },
  },
  Comment: {
    id({ id }) {
      return toGlobalId("Comment", id);
    },
    author({ id }, _args, context) {
      const repository = context.injector.get(CommentRepository);

      return repository.commentAuthor(id);
    },
  },
  Article: {
    async comments(article, args, context) {
      const repository = context.injector.get(CommentRepository);
      const pagination = pickBy(args, isNonNullable);

      const comments = await repository.commentsForArticle(
        fromGlobalId(article.id).id,
        pagination
      );

      return new Connection("Comment", comments, pagination);
    },
  },
};
