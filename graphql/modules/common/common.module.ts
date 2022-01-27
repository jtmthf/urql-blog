import { loadFilesSync } from "@graphql-tools/load-files";
import { createModule } from "graphql-modules";
import { resolve } from "path";
import { prisma } from "../../../lib/db";
import { AbilityFactory } from "./ability.factory";
import { Auth } from "./auth.provider";
import { PRISMA } from "./constants";

export const commonModule = createModule({
  id: "common-module",
  dirname: import.meta.url,
  typeDefs: loadFilesSync(
    resolve(process.cwd(), "graphql/modules/common/typedefs/connection.graphql")
  ),
  providers: [
    {
      provide: PRISMA,
      useValue: prisma,
      global: true,
    },
    Auth,
    AbilityFactory,
  ],
});
