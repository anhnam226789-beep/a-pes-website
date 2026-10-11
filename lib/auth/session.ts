import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "apes_admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const JWT_ALGORITHM = "HS256";

interface SessionPayload {
  userId: string;
  /**
   * `passwordChangedAt` as epoch milliseconds.
   *
   * Verified against the stored value on every request, so changing the
   * password invalidates tokens minted before it. `0` means the account has
   * no stamp yet — the value tokens issued before this field existed carry,
   * which keeps those sessions valid until a password actually changes.
   */
  passwordStamp: number;
}

/** Normalises the stamp so a missing date and an absent claim agree on `0`. */
export function toPasswordStamp(passwordChangedAt?: Date | null): number {
  return passwordChangedAt ? passwordChangedAt.getTime() : 0;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "Missing SESSION_SECRET. Copy `.env.example` to `.env.local` and fill it in.",
    );
  }
  return new TextEncoder().encode(secret);
}

async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + SESSION_DURATION_MS))
    .sign(getSecretKey());
}

async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: [JWT_ALGORITHM],
    });

    if (typeof payload.userId !== "string") return null;

    return {
      userId: payload.userId,
      passwordStamp:
        typeof payload.passwordStamp === "number" ? payload.passwordStamp : 0,
    };
  } catch {
    // Tampered, expired or signed with an older SESSION_SECRET.
    return null;
  }
}

export async function createSession(
  userId: string,
  passwordChangedAt?: Date | null,
): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encryptSession({
    userId,
    passwordStamp: toPasswordStamp(passwordChangedAt),
  });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // `secure` would stop the cookie from being stored over plain-http
    // localhost, which is how `next dev` runs.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Returns the session claims, or `null` when there is no valid session. */
export async function getSessionClaims(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  return decryptSession(token);
}
