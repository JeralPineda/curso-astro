import { logout } from "@/actions/auth/logout.action";
import { registerUser } from "./auth/register.action";
import { loginUser } from "@/actions/auth/login.action";

export const server = {
  // actions
  registerUser,
  logout,
  loginUser,
};
