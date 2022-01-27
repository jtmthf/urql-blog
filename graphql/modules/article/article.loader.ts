import { Article, Prisma } from "@prisma/client";
import DataLoader from "dataloader";
import { InjectionToken } from "graphql-modules";
import { prisma } from "../../../lib/db";

export const ARTICLE_DATA_LOADER = new InjectionToken<ArticleDataLoader>(
  "ARTICLE_DATA_LOADER"
);

export class ArticleDataLoader extends DataLoader<string, Article> {
  #select = new Set<keyof Article>();

  constructor() {
    super(async (keys) => {
      const articles = (await prisma.article.findMany({
        where: { id: { in: keys as string[] } },
        select: Object.fromEntries(
          [...this.#select.values()].map((value) => [value, true])
        ),
      })) as unknown as Article[];

      return articles.sort((a, b) => keys.indexOf(a.id) - keys.indexOf(b.id));
    });

    this.#select.add("id");
  }

  load(id: string, select?: Prisma.ArticleSelect) {
    for (const key in select) {
      if (select[key as keyof Article]) {
        this.#select.add(key as keyof Article);
      }
    }

    return super.load(id);
  }
}
