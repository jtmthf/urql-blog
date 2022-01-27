import { NextApiRequest, NextApiResponse } from "next";
import invariant from "tiny-invariant";
import { UnfavoriteArticleDocument } from "../../../../components/FavoriteButton/unfavorite.mutation.generated";
import { getServerClient } from "../../../../lib/server-client";

export default async function unfavoriteArticle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  invariant(typeof slug === "string");

  const { client } = getServerClient(req);

  await client.mutation(UnfavoriteArticleDocument, { slug }).toPromise();

  res.redirect(req.headers.referer ?? "/");
}
