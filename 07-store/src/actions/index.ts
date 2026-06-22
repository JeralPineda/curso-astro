import { getProductsByPage } from "@/actions/products/get-products-by-page.action";
import { loginUser, logout, registerUser } from "@/actions/auth";
import { createUpdateProduct } from "@/actions/products/create-update-product.action";

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // Products
  getProductsByPage,
  createUpdateProduct,
};
