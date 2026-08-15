import { api } from "./axios";

export interface LoginParams {
  email?: string;
  password?: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: {
    userId: string;
    email: string;
    userType: string;
  };
}

export async function login(params: LoginParams): Promise<LoginResult> {
  const { data } = await api.post<LoginResult>("/auth/login", params);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
