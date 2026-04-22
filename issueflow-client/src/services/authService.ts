import { apiClient } from "@/lib/api";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  setCookie,
  getCookie,
  removeCookie,
} from "@/lib/cookies";
import type { AuthResponse } from "@/types";

export async function register(data: {
  name: string;
  email: string;
  password: string;
  profilePictureUrl: string;
}): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>("/v1/api/auth/register", {
    method: "POST",
    body: data,
  });
  setCookie(ACCESS_TOKEN_KEY, res.accessToken);
  setCookie(REFRESH_TOKEN_KEY, res.refreshToken);
  return res;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>("/v1/api/auth/login", {
    method: "POST",
    body: data,
  });
  setCookie(ACCESS_TOKEN_KEY, res.accessToken);
  setCookie(REFRESH_TOKEN_KEY, res.refreshToken);
  return res;
}

export async function refreshTokens(): Promise<AuthResponse> {
  const refreshToken = getCookie(REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await apiClient<AuthResponse>("/v1/api/auth/refresh-token", {
    method: "POST",
    body: { refreshToken },
  });
  setCookie(ACCESS_TOKEN_KEY, res.accessToken);
  setCookie(REFRESH_TOKEN_KEY, res.refreshToken);
  return res;
}

export async function logout(): Promise<void> {
  const refreshToken = getCookie(REFRESH_TOKEN_KEY);
  try {
    if (refreshToken) {
      await apiClient("/v1/api/auth/logout", {
        method: "POST",
        body: { refreshToken },
      });
    }
  } finally {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  }
}

export async function requestOtp(
  email: string,
): Promise<{ message: string; otpExpiresInMinutes: number }> {
  return apiClient("/v1/api/auth/forgot-password/request-otp", {
    method: "POST",
    body: { email },
  });
}

export async function validateOtp(
  email: string,
  otp: string,
): Promise<{
  message: string;
  resetToken: string;
  resetTokenExpiresInMinutes: number;
}> {
  return apiClient("/v1/api/auth/forgot-password/validate-otp", {
    method: "POST",
    body: { email, otp },
  });
}

export async function resetPassword(
  resetToken: string,
  newPassword: string,
): Promise<{ message: string }> {
  return apiClient("/v1/api/auth/forgot-password/reset-password", {
    method: "POST",
    body: { resetToken, newPassword },
  });
}

export async function uploadImage(file: File): Promise<{
  message: string;
  imageUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}> {
  const formData = new FormData();
  formData.append("image", file);

  return apiClient("/v1/api/auth/upload-image", {
    method: "POST",
    body: formData,
  });
}
