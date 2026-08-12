export const authStorage = {
  getAccessToken() {
    return typeof window !== "undefined"
      ? window.localStorage.getItem("accessToken")
      : null;
  },
  setAccessToken(token: string) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("accessToken", token);
    }
  },
  getRefreshToken() {
    return typeof window !== "undefined"
      ? window.localStorage.getItem("refreshToken")
      : null;
  },
  setRefreshToken(token: string) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("refreshToken", token);
    }
  },
  clearTokens() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
    }
  },
};
