import { ArbitraryObject, GetEnvelopedFn } from "@envelop/types";
import {
  Exchange,
  ExecutionResult,
  getOperationName,
  makeErrorResult,
  makeResult,
  mergeResultPatch,
  Operation,
  OperationResult,
} from "@urql/core";
import {
  filter,
  make,
  merge,
  mergeMap,
  pipe,
  share,
  Source,
  takeUntil,
} from "wonka";

const asyncIterator =
  typeof Symbol !== "undefined" ? Symbol.asyncIterator : null;

function makeExecuteSource<
  T extends GetEnvelopedFn<any>,
  C extends ArbitraryObject
>(
  operation: Operation,
  getEnveloped: T,
  initialContext?: C
): Source<OperationResult> {
  const { contextFactory, execute, subscribe, schema } =
    getEnveloped(initialContext);

  return make<OperationResult>((observer) => {
    let ended = false;

    Promise.resolve()
      .then(async () => {
        return {
          schema,
          document: operation.query,
          contextValue: await contextFactory(),
          variableValues: operation.variables,
          operationName: getOperationName(operation.query),
        };
      })
      .then((args) => {
        if (ended) return;
        if (operation.kind === "subscription") {
          return subscribe(args) as any;
        }
        return execute(args) as any;
      })
      .then((result: ExecutionResult | AsyncIterable<ExecutionResult>) => {
        if (ended || !result) {
          return;
          // @ts-ignore
        } else if (!asyncIterator || !result[Symbol.asyncIterator]) {
          observer.next(makeResult(operation, result as ExecutionResult));
          return;
        }

        const iterator: AsyncIterator<ExecutionResult> =
          // @ts-ignore
          result[asyncIterator!]();
        let prevResult: OperationResult | null = null;

        function next({
          done,
          value,
        }: {
          done?: boolean;
          value: ExecutionResult;
        }) {
          if (value) {
            observer.next(
              (prevResult = prevResult
                ? mergeResultPatch(prevResult, value)
                : makeResult(operation, value))
            );
          }

          if (!done && !ended) {
            iterator.next().then(next);
            return;
          }
          if (ended) {
            iterator.return && iterator.return();
          }
        }

        return iterator.next().then(next);
      })
      .then(() => {
        observer.complete();
      })
      .catch((error) => {
        observer.next(makeErrorResult(operation, error));
        observer.complete();
      });

    return () => {
      ended = true;
    };
  });
}

export function envelopExchange<
  T extends GetEnvelopedFn<any>,
  C extends ArbitraryObject
>(getEnveloped: T, initialContext?: C): Exchange {
  return ({ forward }) => {
    return (ops$) => {
      const sharedOps$ = share(ops$);

      const executedOps$ = pipe(
        sharedOps$,
        filter((operation) => {
          return (
            operation.kind === "query" ||
            operation.kind === "mutation" ||
            operation.kind === "subscription"
          );
        }),
        mergeMap((operation) => {
          const { key } = operation;
          const teardown$ = pipe(
            sharedOps$,
            filter((op) => op.kind === "teardown" && op.key === key)
          );

          return pipe(
            makeExecuteSource(operation, getEnveloped, initialContext),
            takeUntil(teardown$)
          );
        })
      );

      const forwardedOps$ = pipe(
        sharedOps$,
        filter((operation) => operation.kind === "teardown"),
        forward
      );

      return merge([executedOps$, forwardedOps$]);
    };
  };
}
