import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { WithUrqlState } from "next-urql";
import invariant from "tiny-invariant";
import { getServerClient } from "../../lib/server-client";
import Article from "../../routes/article/slug/Article";
import { ArticleDocument } from "../../routes/article/slug/article.query.generated";
import { TopArticlesDocument } from "../../routes/article/slug/top-articles.query.generated";

type Params = {
  slug: string;
};

export default Article;

export async function getStaticPaths(): Promise<GetStaticPathsResult<Params>> {
  const { client } = getServerClient();

  const { data } = await client
    .query(TopArticlesDocument, { first: 50 })
    .toPromise();

  return {
    paths:
      data?.articles.edges.map((article) => ({
        params: { slug: article.node.slug },
      })) ?? [],
    fallback: "blocking",
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<Params>): Promise<
  GetStaticPropsResult<WithUrqlState>
> {
  invariant(params?.slug);

  const { client, ssrCache } = getServerClient();

  const { data } = await client
    .query(ArticleDocument, { slug: params?.slug })
    .toPromise();

  if (data?.getArticle == null) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 60,
  };
}
