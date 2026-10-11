import bcrypt from "bcryptjs";

/**
 * Deliberately no `server-only` here: the seed script runs this module in a
 * plain Node process, outside the React Server Components graph.
 */
const SALT_ROUNDS = 12;

/** Minimum length enforced by both the seed script and the admin forms. */
export const MIN_PASSWORD_LENGTH = 8;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
