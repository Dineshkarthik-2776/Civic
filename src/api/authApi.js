// src/api/authApi.js
import api from "./axiosInstance";
import { setAuthTokens } from "./tokenService";

export async function loginApi({ loginId, password }) {
  console.log("[authApi] loginApi called", { loginId });

  try {
    // Use absolute path from API root so axiosInstance baseURL works in both DEV and PROD
    const response = await api.post("/api/auth/login", { loginId, password });

    const { accessToken, refreshToken, loginId: returnedLoginId } = response.data || {};

    console.log("[authApi] login success, storing tokens");
    setAuthTokens({
      accessToken,
      refreshToken,
      loginId: returnedLoginId || loginId,
    });

    return response.data;
  } catch (err) {
    // Normalize error message
    const serverMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Login failed";

    console.error("[authApi] login error:", err?.response || err);
    // Throw an Error instance so consumers can use err.message
    throw new Error(serverMessage);
  }
}
