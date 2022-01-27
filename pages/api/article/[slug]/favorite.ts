import { NextApiRequest, NextApiResponse } from "next";
import invariant from "tiny-invariant";
import { FavoriteArticleDocument } from "../../../../components/FavoriteButton/favorite.mutation.generated";
import { getServerClient } from "../../../../lib/server-client";

export default async function favoriteArticle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  invariant(typeof slug === "string");

  const { client } = getServerClient(req);

  await client.mutation(FavoriteArticleDocument, { slug }).toPromise();

  res.redirect(req.headers.referer ?? "/");
}
