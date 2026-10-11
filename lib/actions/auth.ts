"use server";

import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/user";
import { requireAdmin } from "@/lib/auth/dal";
import {
  MIN_PASSWORD_LENGTH,
  hashPassword,
  verifyPassword,
} from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import type { FormState } from "@/types/form-state";

/**
 * bcrypt hash of a value nobody knows, compared against when the email does
 * not exist so a wrong email and a wrong password take the same time. Without
 * it, response latency alone tells an attacker which emails are registered.
 */
const DUMMY_HASH =
  "$2b$12$EAHNXIrSzMiYsNOO6Z0ARuMyhs77b.j1mVQK5DQlucQxppK.n.7d2";

export async function loginAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  // The password is never echoed back — only the email, so a typo in the
  // password does not cost the user their email too.
  const values = { email };

  if (!email || !password) {
    return { error: "Vui lòng nhập email và mật khẩu.", values };
  }

  await connectToDatabase();

  const user = await UserModel.findOne({ email })
    .select("+passwordHash")
    .lean();

  const isValid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !isValid) {
    return { error: "Email hoặc mật khẩu không đúng.", values };
  }

  await createSession(user._id.toString(), user.passwordChangedAt);

  // Outside any try/catch on purpose: `redirect` signals by throwing.
  redirect("/admin");
}

export async function changePasswordAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  // Nothing is echoed back: every field here is a password.
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Vui lòng điền đủ ba ô mật khẩu." };
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Mật khẩu mới phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`,
    };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Xác nhận mật khẩu không khớp." };
  }

  if (newPassword === currentPassword) {
    return { error: "Mật khẩu mới phải khác mật khẩu hiện tại." };
  }

  await connectToDatabase();

  // A document, not `.lean()`: the hash has `select: false` and the row is
  // about to be written back.
  const user = await UserModel.findById(admin.id).select("+passwordHash");
  if (!user) return { error: "Tài khoản không còn tồn tại." };

  if (!(await verifyPassword(currentPassword, user.passwordHash))) {
    return { error: "Mật khẩu hiện tại không đúng." };
  }

  user.passwordHash = await hashPassword(newPassword);
  // Moving the stamp invalidates every token minted before this moment.
  user.passwordChangedAt = new Date();
  await user.save();

  // Re-issue this device's cookie with the new stamp so the admin doing the
  // change stays signed in while everyone else is dropped.
  await createSession(user._id.toString(), user.passwordChangedAt);

  return {
    success:
      "Đã đổi mật khẩu. Các thiết bị khác đang đăng nhập sẽ phải đăng nhập lại.",
  };
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}
