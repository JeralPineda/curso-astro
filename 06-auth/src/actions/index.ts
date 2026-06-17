import { logout } from "@/actions/auth/logout.action";
import { registerUser } from "./auth/register.action";
import { loginUser } from "@/actions/auth/login.action";
import { loginWithGoogle } from "./auth/login-google.action";

export const server = {
  // actions
  registerUser,
  logout,
  loginUser,
  loginWithGoogle,
};
