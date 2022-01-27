import { NextApiRequest } from "next";
import { initUrqlClient } from "next-urql";
import { dedupExchange, cacheExchange, ssrExchange } from "urql";
import { getEnveloped } from "../pages/api/graphql";
import { envelopExchange } from "./envelop-exchange";

export function getServerClient(req?: NextApiRequest) {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      url: "http://localhost:3000/api/graphql",
      exchanges: [
        dedupExchange,
        cacheExchange,
        ssrCache,
        envelopExchange(getEnveloped, { req }),
      ],
    },
    false
  )!;

  return {
    ssrCache,
    client,
  };
}
