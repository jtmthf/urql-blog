import { FavoriteFragment } from "./favorite.fragment.generated";
import { FaHeart } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useMutation } from "urql";
import { FavoriteArticleDocument } from "./favorite.mutation.generated";
import { UnfavoriteArticleDocument } from "./unfavorite.mutation.generated";

type Props = FavoriteFragment;

export function FavoriteButton({ slug, favorited, favoritedCount }: Props) {
  const { data: session } = useSession();
  const [, favoriteArticle] = useMutation(FavoriteArticleDocument);
  const [, unfavoriteArticle] = useMutation(UnfavoriteArticleDocument);

  return (
    <form
      method="POST"
      action={`/api/article/${slug}/${favorited ? "unfavorite" : "favorite"}`}
    >
      <button
        type="submit"
        onClick={(event) => {
          event.preventDefault();

          if (!session) {
            signIn("github");
          } else if (!favorited) {
            favoriteArticle({ slug });
          } else {
            unfavoriteArticle({ slug });
          }
        }}
        className="inline-flex items-center justify-around w-12 rounded border border-green-400 text-sm text-green-400 hover:text-white hover:bg-teal-400"
      >
        <FaHeart /> {favoritedCount}
      </button>
    </form>
  );
}
