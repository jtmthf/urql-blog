import { Middleware } from "graphql-modules";
import { Auth } from "./modules/common/auth.provider";

export const isAuthenticated: Middleware = async ({ context }, next) => {
  const auth = context.injector.get(Auth);

  if (!(await auth.getCurrentSession())) {
    throw new Error("Not authenticated");
  }

  return next();
};
