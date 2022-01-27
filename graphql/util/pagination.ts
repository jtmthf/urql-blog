import { fromGlobalId } from "./globalId";

export interface TakeOptions {
  first?: number;
  last?: number;
}

export function take({ first, last }: TakeOptions): number {
  if (first != null && last == null) {
    return first + 1;
  } else if (last != null && first == null) {
    return -(last + 1);
  } else if (last == null && first == null) {
    throw new Error("first or last is required");
  } else {
    throw new Error("first ant last cannot be specified together");
  }
}

export interface CursorOptions {
  before?: string;
  after?: string;
}

export function cursor({
  before,
  after,
}: CursorOptions): { id: string } | undefined {
  if (before != null && after == null) {
    const { id } = fromGlobalId(before);

    return {
      id,
    };
  } else if (after != null && before == null) {
    const { id } = fromGlobalId(after);

    return {
      id,
    };
  } else if (before != null && after != null) {
    throw new Error("before and after cannot be specified together");
  }

  return undefined;
}

export type PaginateOptions = TakeOptions & CursorOptions;

export function paginate({ first, last, before, after }: PaginateOptions) {
  return {
    take: take({ first, last }),
    cursor: cursor({ before, after }),
    skip: before != null || after != null ? 1 : 0,
  };
}
