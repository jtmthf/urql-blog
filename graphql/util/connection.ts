import { PageInfo } from "../generated/graphql";
import { toGlobalId } from "./globalId";
import { PaginateOptions, take } from "./pagination";

export interface Node {
  id: string;
}

export interface Edge<T> {
  cursor: string;
  node: T;
}

export class Connection<T extends Node> {
  readonly #typename: string;
  readonly #nodes: T[];
  readonly #pagination: PaginateOptions;

  constructor(typename: string, nodes: T[], pagination: PaginateOptions) {
    this.#typename = typename;
    this.#nodes = nodes;
    this.#pagination = pagination;
  }

  get nodes(): T[] {
    return this.#nodes.length <= this.expectedLength()
      ? this.#nodes
      : this.isForward()
      ? this.#nodes.slice(0, -1)
      : this.#nodes.slice(1);
  }

  get edges(): Edge<T>[] {
    return this.nodes.map((node) => ({
      cursor: toGlobalId(this.#typename, node.id),
      node,
    }));
  }

  get pageInfo(): PageInfo {
    return {
      hasNextPage: this.isForward()
        ? this.#nodes.length > this.expectedLength()
        : this.#pagination.before != null,
      hasPreviousPage: !this.isForward()
        ? this.#nodes.length > this.expectedLength()
        : this.#pagination.after != null,
      startCursor: toGlobalId(this.#typename, this.nodes[0]?.id),
      endCursor: toGlobalId(this.#typename, this.nodes.at(-1)?.id),
    };
  }

  private expectedLength() {
    return Math.abs(take(this.#pagination)) - 1;
  }

  private isForward(): boolean {
    return this.#pagination.after != null;
  }
}
