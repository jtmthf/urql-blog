import { cacheExchange } from "@urql/exchange-graphcache";
import { gql } from "graphql-modules";

export const graphcache = cacheExchange({
  optimistic: {
    favoriteArticle(variables, cache, info) {
      const article = cache.readFragment(
        gql`
          fragment _ on Article {
            id
            favoritedCount
          }
        `,
        { slug: variables.slug }
      ) as any;

      return {
        __typename: "Article",
        slug: variables.slug,
        favoritedCount: article.favoritedCount + 1,
      };
    },
  },
});
