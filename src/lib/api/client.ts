export const apiClient = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://hakeem1.runasp.net",
  get(url: string) {
    return Promise.resolve({ url, status: 200 });
  },
};
