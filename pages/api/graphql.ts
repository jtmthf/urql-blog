/* eslint-disable react-hooks/rules-of-hooks */

import { useHive } from "@graphql-hive/client";
import { envelop, useErrorHandler } from "@envelop/core";
import { useGraphQLModules } from "@envelop/graphql-modules";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  Request,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { NextApiRequest, NextApiResponse } from "next";
import { app } from "../../graphql";

export const getEnveloped = envelop({
  plugins: [
    useGraphQLModules(app),
    useErrorHandler((error) => {
      console.error(error);
    }),
    useHive({
      enabled: true,
      debug: process.env.NODE_ENV === "development",
      token: process.env.HIVE_TOKEN!,
      usage: true,
      reporting: {
        author: process.env.COMMIT_AUTHOR!,
        commit: process.env.COMMIT_HASH!,
      },
    }),
  ],
});

export default async function graphql(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { parse, validate, contextFactory, execute, schema } = getEnveloped({
    req,
  });
  const request: Request = {
    body: req.body,
    headers: req.headers,
    method: req.method!,
    query: req.query,
  };

  if (shouldRenderGraphiQL(request)) {
    res.setHeader("Content-Type", "text/html");
    res.send(renderGraphiQL({ endpoint: "/api/graphql" }));
    return;
  }

  const { operationName, query, variables } = getGraphQLParameters(request);

  const result = await processRequest({
    operationName,
    query,
    variables,
    request,
    schema,
    parse,
    validate,
    execute,
    contextFactory,
  });

  sendResult(result, res);
}
