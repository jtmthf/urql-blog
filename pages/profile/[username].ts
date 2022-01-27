import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { WithUrqlState } from "next-urql";
import invariant from "tiny-invariant";
import { ArticleFeedDocument } from "../../components/ArticleFeed/article-feed.query.generated";
import { getServerClient } from "../../lib/server-client";
import { Profile } from "../../routes/profile/Profile";

export default Profile;

type Params = {
  username: string;
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<Params>): Promise<
  GetStaticPropsResult<WithUrqlState>
> {
  invariant(params?.username);

  const { client, ssrCache } = getServerClient();

  const { data } = await client
    .query(ArticleFeedDocument, {
      first: 10,
      last: null,
      before: null,
      after: null,
      author: params.username,
    })
    .toPromise();

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 60,
  };
}
