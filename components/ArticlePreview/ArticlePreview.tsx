import Link from "next/link";
import { ArticleAuthorMeta } from "../ArticleAuthorMeta/ArticleAuthorMeta";
import { FavoriteButton } from "../FavoriteButton/FavoriteButton";
import { Tag } from "../Tag/Tag";
import { ArticlePreviewFragment } from "./article-preview.fragment.generated";

type Props = ArticlePreviewFragment;

export function ArticlePreview({
  id,
  slug,
  title,
  description,
  favorited,
  favoritedCount,
  createdAt,
  author,
  tags,
}: Props) {
  return (
    <div className="border-t border-t-black border-opacity-10 py-6">
      <div className="mb-4 flex items-center">
        <ArticleAuthorMeta createdAt={createdAt} author={author} />
        <div className="ml-auto">
          <FavoriteButton
            id={id}
            slug={slug}
            favorited={favorited}
            favoritedCount={favoritedCount}
          />
        </div>
      </div>
      <Link href={`/article/${slug}`}>
        <a>
          <h3 className="text-2xl font-semibold mb-1">{title}</h3>
          <p className="font-light text-gray-500 mb-4">{description}</p>
          <div className="flex justify-between">
            <span className="font-light text-gray-500 text-sm">
              Read more...
            </span>
            <div className="flex gap-2">
              {tags.edges.map((tag) => (
                <Tag key={tag.node.id} {...tag.node} />
              ))}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
