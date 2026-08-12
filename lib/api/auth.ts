import { api } from "./axios";

export interface LoginParams {
  email?: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
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
  };
  errorList: {
    propertyName: string;
    message: string;
    code: string;
  }[];
  globalErrorCode: string | null;
}

export async function login(params: LoginParams): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", params);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
