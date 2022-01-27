import { loadFilesSync } from "@graphql-tools/load-files";
import { createModule } from "graphql-modules";
import { resolve } from "path";
import { CommentRepository } from "./comment.repository";
import { resolvers } from "./comment.resolver";

export const commentModule = createModule({
  id: "comment-module",
  dirname: import.meta.url,
  typeDefs: loadFilesSync(
    resolve(process.cwd(), "graphql/modules/comment/typedefs/comment.graphql")
  ),
  resolvers,
  providers: [CommentRepository],
});
