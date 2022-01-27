import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { Comment, PrismaClient, User } from "@prisma/client";
import { Inject, Injectable, Scope } from "graphql-modules";
import invariant from "tiny-invariant";
import { paginate, PaginateOptions } from "../../util/pagination";
import { AbilityFactory } from "../common/ability.factory";
import { Auth } from "../common/auth.provider";
import { PRISMA } from "../common/constants";

@Injectable({ scope: Scope.Operation })
export class CommentRepository {
  readonly #prisma: PrismaClient;
  readonly #auth: Auth;
  readonly #abilityFactory: AbilityFactory;

  constructor(
    @Inject(PRISMA) prisma: PrismaClient,
    auth: Auth,
    abilityFactory: AbilityFactory
  ) {
    this.#prisma = prisma;
    this.#auth = auth;
    this.#abilityFactory = abilityFactory;
  }

  async commentsForArticle(
    articleId: string,
    { before, after, first, last }: PaginateOptions
  ): Promise<Array<Comment>> {
    return this.#prisma.comment.findMany({
      ...paginate({ first, last, before, after }),
      where: {
        articleId,
      },
    });
  }

  async commentAuthor(commentId: string): Promise<User> {
    const author = await this.#prisma.comment
      .findUnique({ where: { id: commentId }, rejectOnNotFound: true })
      .author();

    invariant(author, "comment author must exist");

    return author;
  }

  async addComment(articleSlug: string, body: string): Promise<Comment> {
    const { user } = await this.#auth.getRequiredCurrentSession();
    const ability = this.#abilityFactory.createForUser(user);

    ForbiddenError.from(ability).throwUnlessCan("create", "Comment");

    const comment = await this.#prisma.comment.create({
      data: {
        body,
        author: {
          connect: {
            id: user.id,
          },
        },
        article: {
          connect: {
            slug: articleSlug,
          },
        },
      },
    });

    return comment;
  }

  async deleteComment(articleSlug: string, commentId: string): Promise<void> {
    const { user } = await this.#auth.getRequiredCurrentSession();
    const ability = this.#abilityFactory.createForUser(user);

    const comment = await this.#prisma.comment.findFirst({
      where: {
        AND: [
          accessibleBy(ability, "delete").Comment,
          { id: commentId },
          {
            article: {
              slug: articleSlug,
            },
          },
        ],
      },
      rejectOnNotFound: true,
    });

    await this.#prisma.comment.delete({ where: { id: comment.id } });
  }
}
