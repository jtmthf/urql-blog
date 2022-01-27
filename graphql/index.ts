import "reflect-metadata";

import { createApplication } from "graphql-modules";
import { userModule } from "./modules/user/user.module";
import { profileModule } from "./modules/profile/profile.module";
import { commonModule } from "./modules/common/common.module";
import { articleModule } from "./modules/article/article.module";
import { tagModule } from "./modules/tag/tag.module";
import { commentModule } from "./modules/comment/comment.module";

export const app = createApplication({
  modules: [
    commonModule,
    userModule,
    profileModule,
    articleModule,
    tagModule,
    commentModule,
  ],
});
