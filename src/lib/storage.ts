export const authStorage = {
  getAccessToken() {
    return typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;
  },
  setAccessToken(token: string) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("accessToken", token);
    }
  },
};
