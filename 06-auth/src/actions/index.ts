import { logout } from "@/actions/auth/logout.action";
import { registerUser } from "./auth/register.action";

export const server = {
  // actions
  registerUser,
  logout,
};
