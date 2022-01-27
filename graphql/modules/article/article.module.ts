import { loadFilesSync } from "@graphql-tools/load-files";
import { createModule } from "graphql-modules";
import { resolve } from "path";
import { ArticleRepository } from "./article.repository";
import { resolvers } from "./article.resolver";

export const articleModule = createModule({
  id: "article-module",
  dirname: import.meta.url,
  typeDefs: loadFilesSync(
    resolve(process.cwd(), "graphql/modules/article/typedefs/article.graphql")
  ),
  resolvers,
  providers: [ArticleRepository],
});
