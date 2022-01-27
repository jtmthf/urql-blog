import { loadFilesSync } from "@graphql-tools/load-files";
import { createModule } from "graphql-modules";
import { MiddlewareMap } from "graphql-modules/shared/middleware";
import { resolve } from "path";
import { middlewares } from "./middlewares";
import { resolvers } from "./resolvers";

export const profileModule = createModule({
  id: "profile-module",
  dirname: import.meta.url,
  typeDefs: loadFilesSync(
    resolve(process.cwd(), "graphql/modules/profile/typedefs/profile.graphql")
  ),
  resolvers,
  middlewares: middlewares as MiddlewareMap,
});
