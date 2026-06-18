import { getProductsByPage } from "@/actions/products/get-products-by-page.action";
import { loginUser, logout, registerUser } from "@/actions/auth";

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // Products
  getProductsByPage,
};
