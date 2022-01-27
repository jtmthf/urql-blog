import { PrismaClient, Tag } from ".prisma/client";
import { Inject, Injectable } from "graphql-modules";
import { paginate, PaginateOptions } from "../../util/pagination";
import { PRISMA } from "../common/constants";

@Injectable()
export class TagRepository {
  readonly #prisma: PrismaClient;

  constructor(@Inject(PRISMA) prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async listTags({
    first,
    last,
    before,
    after,
  }: PaginateOptions): Promise<Tag[]> {
    const tags = await this.#prisma.tag.findMany({
      ...paginate({ first, last, before, after }),
      orderBy: [
        {
          articles: {
            _count: "desc",
          },
        },
        { id: "asc" },
      ],
    });

    return tags;
  }

  async articleTags(
    articleSlug: string,
    { first, last, before, after }: PaginateOptions
  ): Promise<Tag[]> {
    const tags = await this.#prisma.tag.findMany({
      ...paginate({ first, last, before, after }),
      where: {
        articles: {
          some: {
            slug: articleSlug,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return tags;
  }
}
