import { Session as AuthSession } from "next-auth";
import {
  Article,
  User,
  Account,
  Session,
  VerificationToken,
  Tag,
  Comment,
} from "@prisma/client";
import { AbilityClass, AbilityBuilder } from "@casl/ability";
import { PrismaAbility, Subjects } from "@casl/prisma";
import { Injectable } from "graphql-modules";

type AppAbility = PrismaAbility<
  [
    string,
    Subjects<{
      Account: Account;
      Article: Article;
      Comment: Comment;
      Session: Session;
      Tag: Tag;
      User: User;
      VerificationToken: VerificationToken;
    }>
  ]
>;

const AppAbility = PrismaAbility as AbilityClass<AppAbility>;

@Injectable({ global: true })
export class AbilityFactory {
  createForUser(user: AuthSession["user"]) {
    const { can, build } = new AbilityBuilder(AppAbility);

    can("follow", "User", { id: { not: user.id } });
    can("unfollow", "User", { id: { not: user.id } });

    can("create", "Article");
    can("update", "Article", { authorId: user.id });
    can("delete", "Article", { authorId: user.id });
    can("favorite", "Article");
    can("unfavorite", "Article");

    can("create", "Comment");
    can("delete", "Comment", { userId: user.id });

    return build();
  }
}
