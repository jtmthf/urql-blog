import { devtoolsExchange } from "@urql/devtools";
import { withUrqlClient } from "next-urql";
import { cacheExchange, dedupExchange, fetchExchange } from "urql";

export const withUrql = withUrqlClient(
  (ssrExchange) => ({
    url: "/api/graphql",
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cacheExchange,
      ssrExchange,
      fetchExchange,
    ],
    fetchOptions: {
      headers: {
        "graphql-client-name": "urlq",
      },
    },
  }),
  { ssr: false }
);
