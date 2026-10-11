import { Schema, model, models, type Model } from "mongoose";

export const USER_ROLES = ["admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface UserDocument {
  email: string;
  name: string;
  /** bcrypt hash — never select this into anything that leaves the server. */
  passwordHash: string;
  /**
   * Stamped into every session token. Changing the password moves this
   * forward, which makes tokens issued before the change fail verification —
   * so "đổi mật khẩu" really does sign other devices out.
   */
  passwordChangedAt: Date;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: { type: String, required: true, trim: true },
    // `select: false` keeps the hash out of every query that does not ask for
    // it explicitly, so it cannot leak through a careless `.find()`.
    passwordHash: { type: String, required: true, select: false },
    passwordChangedAt: { type: Date, required: true, default: () => new Date() },
    role: { type: String, required: true, enum: USER_ROLES, default: "admin" },
  },
  { timestamps: true, collection: "users" },
);

export const UserModel: Model<UserDocument> =
  (models.User as Model<UserDocument>) ??
  model<UserDocument>("User", userSchema);
