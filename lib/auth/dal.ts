import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/user";
import { getSessionClaims, toPasswordStamp } from "@/lib/auth/session";
import type { AdminUser } from "@/types/user";

/**
 * Data access layer for the signed-in admin.
 *
 * Every protected page and every Server Action calls `requireAdmin()` itself.
 * Guarding only in the layout would not be enough: Server Actions are their
 * own entry points and do not re-run layouts.
 *
 * `cache()` dedupes the lookup within a single request.
 */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const claims = await getSessionClaims();
  if (!claims || !Types.ObjectId.isValid(claims.userId)) return null;

  await connectToDatabase();

  const user = await UserModel.findById(claims.userId).lean();
  if (!user) return null;

  // Token minted before the current password — the account changed it since,
  // so this session belongs to a device that must sign in again.
  if (toPasswordStamp(user.passwordChangedAt) !== claims.passwordStamp) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
});

/** Redirects to the login page when there is no valid admin session. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
