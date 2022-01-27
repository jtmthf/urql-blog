import { CONTEXT, Inject, Injectable, Scope } from "graphql-modules";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import invariant from "tiny-invariant";
import type { Context } from "../../context";

@Injectable({
  scope: Scope.Operation,
  global: true,
})
export class Auth {
  #session?: Session;

  constructor(@Inject(CONTEXT) private context: Context) {}

  async getCurrentSession(): Promise<Session | undefined> {
    if (this.#session) {
      return this.#session;
    }
    if (!this.context.req) {
      return undefined;
    }

    const session = (await getSession({ req: this.context.req })) ?? undefined;

    this.#session = session;

    return session;
  }

  async getRequiredCurrentSession(): Promise<Session> {
    const session = await this.getCurrentSession();

    invariant(session, "session required");

    return session;
  }
}
