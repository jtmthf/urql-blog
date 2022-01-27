import Link from "next/link";
import { TagFragment } from "./tag.fragment.generated";

type Props = TagFragment;

export function Tag({ name }: Props) {
  return (
    <Link href={{ pathname: "/", query: { tag: name } }}>
      <a className="bg-gray-500 hover:bg-gray-600 rounded-full text-white px-2 py-1 text-sm">
        {name}
      </a>
    </Link>
  );
}
