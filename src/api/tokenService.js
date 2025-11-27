// src/api/tokenService.js

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const LOGINID_KEY = "loginId";

// Save tokens safely
export function setAuthTokens({ accessToken, refreshToken, loginId }) {
  if (accessToken && accessToken !== "undefined") {
    localStorage.setItem(ACCESS_KEY, accessToken);
  }
  if (refreshToken && refreshToken !== "undefined") {
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }
  if (loginId && loginId !== "undefined") {
    localStorage.setItem(LOGINID_KEY, loginId);
  }
}

export function getAccessToken() {
  const token = localStorage.getItem(ACCESS_KEY);
  return token && token !== "undefined" ? token : null;
}

export function getRefreshToken() {
  const token = localStorage.getItem(REFRESH_KEY);
  return token && token !== "undefined" ? token : null;
}

export function getLoginId() {
  const loginId = localStorage.getItem(LOGINID_KEY);
  return loginId && loginId !== "undefined" ? loginId : null;
}

// Remove all tokens (logout)
export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(LOGINID_KEY);
}
