import { loadFilesSync } from "@graphql-tools/load-files";
import { createModule } from "graphql-modules";
import { resolve } from "path";
import { TagRepository } from "./tag.repository";
import { resolvers } from "./tag.resolver";

export const tagModule = createModule({
  id: "tag-module",
  dirname: import.meta.url,
  typeDefs: loadFilesSync(
    resolve(process.cwd(), "graphql/modules/tag/typedefs/tag.graphql")
  ),
  resolvers,
  providers: [TagRepository],
});
