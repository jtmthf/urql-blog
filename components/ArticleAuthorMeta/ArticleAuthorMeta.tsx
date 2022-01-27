import cx from "classnames";
import Link from "next/link";
import { useDateTimeFormat } from "../../hooks/useDateTimeFormat";
import { Avatar } from "../Avatar/Avatar";
import { ArticleAuthorMetaFragment } from "./article-author-meta.fragment.generated";
import styles from "./article-author-meta.module.css";

type Props = ArticleAuthorMetaFragment & {
  variant?: "primary" | "secondary";
  className?: string;
};

export function ArticleAuthorMeta({
  variant = "primary",
  createdAt,
  author,
  className,
}: Props) {
  const createdAtFormatted = useDateTimeFormat(createdAt, {
    dateStyle: "long",
  });

  return (
    <div className={cx(styles.container, className)}>
      <Avatar username={author.username} image={author.image} size="large" />
      <div className={styles.meta}>
        <Link href={`/profile/${author.username}`}>
          <a className={cx(styles.username, styles[variant])}>
            {author.username}
          </a>
        </Link>
        <span className={styles.createdAt}>{createdAtFormatted}</span>
      </div>
    </div>
  );
}
