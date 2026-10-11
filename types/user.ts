import type { UserRole } from "@/lib/db/models/user";

/** Plain, serialisable admin identity — never carries the password hash. */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
