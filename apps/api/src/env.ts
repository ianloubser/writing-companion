import type { AuthEnv } from '@repo/db';

/**
 * Worker bindings: D1 + AI + auth vars.
 * TRUSTED_ORIGINS arrives as a comma-separated string from wrangler vars and
 * is split into an array before being passed to createAuth.
 */
export interface Env extends Omit<AuthEnv, 'TRUSTED_ORIGINS'> {
  AI: Ai;
  TRUSTED_ORIGINS?: string;
}
