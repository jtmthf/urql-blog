import { GetStaticPropsResult } from "next";
import { WithUrqlState } from "next-urql";
import { ArticleFeedDocument } from "../components/ArticleFeed/article-feed.query.generated";
import { getServerClient } from "../lib/server-client";
import Home from "../routes/home/Home";
import { TagsDocument } from "../routes/home/tags.query.generated";

export default Home;

export async function getStaticProps(): Promise<
  GetStaticPropsResult<WithUrqlState>
> {
  const { ssrCache, client } = getServerClient();

  await Promise.all([
    client
      .query(ArticleFeedDocument, {
        first: 10,
        last: null,
        after: null,
        before: null,
      })
      .toPromise(),
    client.query(TagsDocument, { first: 10 }).toPromise(),
  ]);

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 600,
  };
}
