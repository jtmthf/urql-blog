import cx from "classnames";
import Image from "next/image";
import Link from "next/link";
import smiley from "../../public/smiley-cyrus.jpeg";

type Props = {
  username: string;
  image?: string | null;
  size?: "small" | "medium" | "large";
};

export function Avatar({ username, image, size = "medium" }: Props) {
  const dimensions = (() => {
    switch (size) {
      case "small":
        return 20;
      case "medium":
        return 24;
      case "large":
        return 32;
    }
  })();

  return (
    <Link href={`/profile/${username}`}>
      <a>
        <div
          className={cx(
            size === "small" && "h-5",
            size === "medium" && "h-6",
            size === "large" && "h-8"
          )}
        >
          <Image
            src={image ?? smiley}
            width={dimensions}
            height={dimensions}
            className="rounded-full"
            alt={`Avatar for ${username}`}
          />
        </div>
      </a>
    </Link>
  );
}
