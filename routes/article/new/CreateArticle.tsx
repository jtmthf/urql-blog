import { useRouter } from "next/router";
import { FormEvent, ReactElement, useEffect } from "react";
import { useMutation } from "urql";
import Layout from "../../../components/Layout";
import { CreateArticleDocument } from "./create-article.mutation.generated";

export function CreateArticle() {
  const router = useRouter();
  const [result, createArticle] = useMutation(CreateArticleDocument);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { title, description, body, tags } = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as Record<string, string>;

    createArticle({
      title,
      description,
      body,
      tags: tags.split(" "),
    });
  }

  useEffect(() => {
    if (result.data) {
      router.push(`/article/${result.data.createArticle.slug}`);
    }
  }, [result]);

  return (
    <form
      className="flex flex-col gap-4 max-w-4xl mx-auto py-8"
      onSubmit={handleSubmit}
    >
      <input
        name="title"
        type="text"
        placeholder="Article Title"
        className="text-xl rounded"
      />
      <input
        name="description"
        type="text"
        placeholder="What's this article about?"
        className="rounded"
      />
      <textarea
        name="body"
        placeholder="Write your article (in markdown)"
        className="min-h-[200px] rounded"
      />
      <input
        name="tags"
        type="text"
        placeholder="Enter tags (space separated)"
        className="rounded"
      />
      <button
        type="submit"
        className="bg-green-400 text-white max-w-fit px-4 py-3 rounded self-end"
      >
        Publish Article
      </button>
    </form>
  );
}

CreateArticle.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
