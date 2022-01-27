import { useRouter } from "next/router";
import { ReactElement } from "react";
import invariant from "tiny-invariant";
import { useQuery } from "urql";
import { ArticleBanner } from "../../../components/ArticleBanner/ArticleBanner";
import { Comment } from "../../../components/Comment/Comment";
import Layout from "../../../components/Layout";
import { Main } from "../../../components/Main/Main";
import { ArticleDocument } from "./article.query.generated";

export default function Article() {
  const router = useRouter();
  const { slug } = router.query;
  invariant(typeof slug === "string");

  const [{ data }] = useQuery({ query: ArticleDocument, variables: { slug } });
  const article = data?.getArticle;

  invariant(article, "article is required");

  return (
    <>
      <ArticleBanner {...article} />
      <Main>
        <div className="flex flex-col">
          <article className="prose lg:prose-xl mx-auto">
            <h2>{article.description}</h2>
            {article.body.split("\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <div className="flex flex-col items-center max-w-2xl self-center">
            {article.comments.edges.map((edge) => (
              <Comment key={edge.node.id} {...edge.node} />
            ))}
          </div>
        </div>
      </Main>
    </>
  );
}

Article.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
