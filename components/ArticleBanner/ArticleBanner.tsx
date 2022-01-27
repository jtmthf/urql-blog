import { ArticleAuthorMeta } from "../ArticleAuthorMeta/ArticleAuthorMeta";
import { ArticleBannerFragment } from "./article-banner.fragment.generated";

type Props = ArticleBannerFragment;

export function ArticleBanner({
  title,
  createdAt,
  favoritedCount,
  author,
}: Props) {
  return (
    <div className="bg-green-400 mb-8">
      <div className="max-w-prose lg:text-xl mx-auto py-4">
        <h1 className="text-white text-5xl font-semibold mb-8">{title}</h1>
        <div className="flex items-center">
          <ArticleAuthorMeta
            createdAt={createdAt}
            author={author}
            variant="secondary"
          />
          <button>Follow {author.username}</button>
          <button>Favorite Article ({favoritedCount})</button>
        </div>
      </div>
    </div>
  );
}
