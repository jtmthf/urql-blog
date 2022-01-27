import { useQuery } from "urql";
import { ArticleFeedDocument } from "./article-feed.query.generated";
import { ArticlePreview } from "../ArticlePreview/ArticlePreview";
import { Pagination } from "../Pagination/Pagination";
import { useRouter } from "next/router";
import { pickBy } from "../../lib/pickBy";
import { isNonNullable } from "../../lib/isNonNullable";

type Props = {
  tag?: string;
  author?: string;
  favoritedBy?: string;
};

export function ArticleFeed({ tag, author, favoritedBy }: Props) {
  const { query } = useRouter();

  const [{ data }] = useQuery({
    query: ArticleFeedDocument,
    variables: {
      first: query.before == null ? 10 : null,
      last: query.before != null ? 10 : null,
      after: typeof query.after === "string" ? query.after : null,
      before: typeof query.before === "string" ? query.before : null,
      tag,
      author,
      favorited: favoritedBy,
    },
  });

  return (
    <>
      {data?.articles.edges.map(({ node: article }) => (
        <ArticlePreview key={article.id} {...article} />
      ))}
      {data && (
        <Pagination
          pathname="/"
          pageInfo={data?.articles.pageInfo}
          query={pickBy({ tag }, isNonNullable)}
        />
      )}
    </>
  );
}
