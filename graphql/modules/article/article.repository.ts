import { accessibleBy } from "@casl/prisma";
import { Article, Prisma, PrismaClient, User } from "@prisma/client";
import { Inject, Injectable, Scope } from "graphql-modules";
import slugify from "slugify";
import { paginate, PaginateOptions } from "../../util/pagination";
import { PRISMA } from "../common/constants";
import { AbilityFactory } from "../common/ability.factory";
import { CreateArticle, ListArticles, UpdateArticle } from "./interfaces";
import { Auth } from "../common/auth.provider";
import invariant from "tiny-invariant";

@Injectable({
  scope: Scope.Operation,
})
export class ArticleRepository {
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

  async listArticles({
    tag,
    author,
    favorited,
    before,
    after,
    first,
    last,
  }: ListArticles): Promise<Array<Article>> {
    const where: Prisma.ArticleWhereInput = {};

    if (tag != null) {
      where.tags = {
        some: {
          name: tag,
        },
      };
    }
    if (author != null) {
      where.author = {
        username: author,
      };
    }
    if (favorited != null) {
      where.favoritedBy = {
        some: {
          username: favorited,
        },
      };
    }

    return this.#prisma.article.findMany({
      ...paginate({ first, last, before, after }),
      where,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    });
  }

  async feed({
    before,
    after,
    first,
    last,
  }: PaginateOptions): Promise<Array<Article>> {
    const {
      user: { id },
    } = await this.#auth.getRequiredCurrentSession();

    return this.#prisma.article.findMany({
      ...paginate({ first, last, before, after }),
      where: {
        author: {
          followers: {
            some: {
              id,
            },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    });
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const article = await this.#prisma.article.findUnique({ where: { slug } });

    return article ?? undefined;
  }

  async isFavorited(articleId: string): Promise<boolean | undefined> {
    const session = await this.#auth.getCurrentSession();

    if (!session) {
      return undefined;
    }

    const [self] = await this.#prisma.article
      .findUnique({ where: { id: articleId } })
      .favoritedBy({ where: { id: session.user.id } });

    return !!self;
  }

  async countFavorited(articleId: string): Promise<number> {
    const {
      _count: { favoritedBy: favoritedByCount },
    } = await this.#prisma.article.findUnique({
      where: { id: articleId },
      select: {
        _count: {
          select: {
            favoritedBy: true,
          },
        },
      },
      rejectOnNotFound: true,
    });

    return favoritedByCount;
  }

  async articleAuthor(articleId: string): Promise<User> {
    const author = await this.#prisma.article
      .findUnique({ where: { id: articleId }, rejectOnNotFound: true })
      .author();

    invariant(author, "article author expected");

    return author;
  }

  async createArticle({
    title,
    description,
    body,
    tags,
  }: CreateArticle): Promise<Article> {
    const {
      user: { id },
    } = await this.#auth.getRequiredCurrentSession();

    const article = await this.#prisma.article.create({
      data: {
        title,
        slug: slugify(title),
        description,
        body,
        author: {
          connect: {
            id,
          },
        },
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    return article;
  }

  async updateArticle(
    slug: string,
    { title, description, body }: UpdateArticle
  ): Promise<Article> {
    const { user } = await this.#auth.getRequiredCurrentSession();
    const ability = this.#abilityFactory.createForUser(user);

    let article = await this.#prisma.article.findFirst({
      where: {
        AND: [accessibleBy(ability, "update").Article, { slug }],
      },
      rejectOnNotFound: true,
    });

    article = await this.#prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        title,
        slug: title != null ? slugify(title) : undefined,
        description,
        body,
      },
    });

    return article;
  }

  async deleteArticle(slug: string): Promise<void> {
    const { user } = await this.#auth.getRequiredCurrentSession();
    const ability = this.#abilityFactory.createForUser(user);

    const article = await this.#prisma.article.findFirst({
      where: {
        AND: [accessibleBy(ability, "delete").Article, { slug }],
      },
      rejectOnNotFound: true,
    });

    await this.#prisma.article.delete({
      where: {
        id: article.id,
      },
    });
  }

  async favoriteArticle(slug: string): Promise<Article> {
    const { user } = await this.#auth.getRequiredCurrentSession();
    const ability = this.#abilityFactory.createForUser(user);

    let article = await this.#prisma.article.findFirst({
      where: {
        AND: [accessibleBy(ability, "favorite").Article, { slug }],
      },
      rejectOnNotFound: true,
    });

    article = await this.#prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        favoritedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return article;
  }

  async unfavoriteArticle(slug: string): Promise<Article> {
    const { user } = await this.#auth.getRequiredCurrentSession();
    const ability = this.#abilityFactory.createForUser(user);

    let article = await this.#prisma.article.findFirst({
      where: {
        AND: [accessibleBy(ability, "unfavorite").Article, { slug }],
      },
      rejectOnNotFound: true,
    });

    article = await this.#prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        favoritedBy: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });

    return article;
  }
}
