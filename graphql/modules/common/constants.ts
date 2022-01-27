import { PrismaClient } from ".prisma/client";
import { InjectionToken } from "graphql-modules";

export const PRISMA = new InjectionToken<PrismaClient>("PRISMA");
