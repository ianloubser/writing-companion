import { betterAuth } from 'better-auth';

/** Bindings the auth instance needs from the Worker environment. */
export interface AuthEnv {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  /** Extra origins allowed to make credentialed auth requests. */
  TRUSTED_ORIGINS?: string[];
}

/**
 * Creates a Better Auth instance bound to the Worker's D1 database.
 * The Worker just imports this and mounts `auth.handler(c.req.raw)`.
 * (Creating per-request is the recommended pattern for Workers.)
 */
export function createAuth(env: AuthEnv) {
  return betterAuth({
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: env.TRUSTED_ORIGINS ?? [],
    emailAndPassword: {
      enabled: true,
    },
  });
}
