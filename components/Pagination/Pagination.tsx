import cx from "classnames";
import Link from "next/link";
import { ParsedUrlQueryInput } from "querystring";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { PaginationFragment } from "./pagination.fragment.generated";
import styles from "./pagination.module.css";

type Props = PaginationFragment & {
  pathname: string;
  query?: ParsedUrlQueryInput;
};

export function Pagination({ pathname, query, pageInfo }: Props) {
  return (
    <div className={styles.pagination}>
      <Link
        href={{ pathname, query: { before: pageInfo.startCursor, ...query } }}
      >
        <a
          className={cx(
            styles.link,
            !pageInfo.hasPreviousPage && styles.disabled
          )}
        >
          <FaArrowLeft /> Previous
        </a>
      </Link>
      <Link href={{ pathname, query: { after: pageInfo.endCursor, ...query } }}>
        <a
          className={cx(styles.link, !pageInfo.hasNextPage && styles.disabled)}
        >
          Next <FaArrowRight />
        </a>
      </Link>
    </div>
  );
}
