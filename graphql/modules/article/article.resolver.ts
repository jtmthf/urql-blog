import { isNonNullable } from "../../../lib/isNonNullable";
import { pickBy } from "../../../lib/pickBy";
import { Connection } from "../../util/connection";
import { toGlobalId } from "../../util/globalId";
import { ArticleRepository } from "./article.repository";
import { ArticleModule } from "./generated/module-types";

export const resolvers: ArticleModule.Resolvers = {
  Query: {
    async getArticle(_root, { slug }, context) {
      const repository = context.injector.get(ArticleRepository);

      return (await repository.getArticleBySlug(slug)) ?? null;
    },
    async articles(
      _root,
      { tag, author, favorited, before, after, last, first },
      context
    ) {
      const repository = context.injector.get(ArticleRepository);

      const articles = await repository.listArticles(
        pickBy(
          {
            tag,
            author,
            favorited,
            before,
            after,
            last,
            first,
          },
          isNonNullable
        )
      );

      return new Connection(
        "Article",
        articles,
        pickBy(
          {
            before,
            after,
            last,
            first,
          },
          isNonNullable
        )
      );
    },
    async feed(_root, { before, after, last, first }, context) {
      const repository = context.injector.get(ArticleRepository);

      const articles = await repository.feed(
        pickBy(
          {
            before,
            after,
            last,
            first,
          },
          isNonNullable
        )
      );

      return new Connection(
        "Article",
        articles,
        pickBy(
          {
            before,
            after,
            last,
            first,
          },
          isNonNullable
        )
      );
    },
  },
  Mutation: {
    async createArticle(
      _root,
      { input: { title, description, body, tags } },
      context
    ) {
      const repository = context.injector.get(ArticleRepository);

      return repository.createArticle({ title, description, body, tags });
    },
    async updateArticle(
      _root,
      { input: { slug, title, description, body } },
      context
    ) {
      const repository = context.injector.get(ArticleRepository);

      return repository.updateArticle(
        slug,
        pickBy({ title, description, body }, isNonNullable)
      );
    },
    async favoriteArticle(_root, { input: { slug } }, context) {
      const repository = context.injector.get(ArticleRepository);

      return repository.favoriteArticle(slug);
    },
    async unfavoriteArticle(_root, { input: { slug } }, context) {
      const repository = context.injector.get(ArticleRepository);

      return repository.unfavoriteArticle(slug);
    },
  },
  Article: {
    id({ id }) {
      return toGlobalId("Article", id);
    },
    async favorited({ id }, _args, context) {
      const repository = context.injector.get(ArticleRepository);

      return (await repository.isFavorited(id)) ?? null;
    },
    async favoritedCount({ id }, _args, context) {
      const repository = context.injector.get(ArticleRepository);

      return repository.countFavorited(id);
    },
    async author({ id }, _args, context) {
      const repository = context.injector.get(ArticleRepository);

      return repository.articleAuthor(id);
    },
  },
};
