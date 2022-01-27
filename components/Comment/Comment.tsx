import Link from "next/link";
import { useDateTimeFormat } from "../../hooks/useDateTimeFormat";
import { Avatar } from "../Avatar/Avatar";
import { CommentViewFragment } from "./comment.fragment.generated";

type Props = CommentViewFragment;

export function Comment({ body, author, createdAt }: Props) {
  const createdAtFormatted = useDateTimeFormat(createdAt, {
    dateStyle: "long",
  });

  return (
    <div className="rounded border border-gray-200 mb-4 w-full">
      <div className="prose mx-auto p-4">{body}</div>
      <div className="flex items-center gap-2 bg-gray-100 border-t border-gray-200 py-3 px-5">
        <Avatar username={author.username} image={author.image} size="small" />
        <Link href={`/profile/${author.username}`}>
          <a className="text-sm text-green-400 hover:underline">
            {author.username}
          </a>
        </Link>
        <span className="text-sm text-gray-500">{createdAtFormatted}</span>
      </div>
    </div>
  );
}
