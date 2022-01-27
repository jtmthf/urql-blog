import NextAuth, { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & {
      email: string;
      username: string;
      bio?: string;
    };
  }

  interface User {
    username: string;
    bio: string;
  }
}
