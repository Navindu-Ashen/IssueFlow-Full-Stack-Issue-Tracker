# Authentication API Documentation

This document describes the authentication endpoints available in IssueFlow.

## Base Route

- **Auth base route:** `/v1/api/auth`
- **Content-Type:** `application/json`
- **Auth requirement for these endpoints:** Public (`security: []`)

---

## Common Response Structures

### User Object

    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "profilePictureUrl": "string"
    }

### Error Response (general pattern)

    {
      "message": "string",
      "error": "string (optional, usually on 500 responses)"
    }

---

## 1) Register User

- **Method:** `POST`
- **Route:** `/v1/api/auth/register`

### Request Body

    {
      "name": "Navindu",
      "email": "navindu@example.com",
      "password": "StrongPass@123",
      "profilePictureUrl": "https://example.com/avatar.jpg"
    }

### Success Response (`201 Created`)

    {
      "user": {
        "_id": "664f6a...",
        "name": "Navindu",
        "email": "navindu@example.com",
        "profilePictureUrl": "https://example.com/avatar.jpg"
      },
      "accessToken": "jwt-token",
      "refreshToken": "jwt-token"
    }

### Error Responses

- `400` — `name, email, and password are required` / `User already exists`
- `500` — `Server error during registration`

---

## 2) Login

- **Method:** `POST`
- **Route:** `/v1/api/auth/login`

### Request Body

    {
      "email": "navindu@example.com",
      "password": "StrongPass@123"
    }

### Success Response (`200 OK`)

    {
      "user": {
        "_id": "664f6a...",
        "name": "Navindu",
        "email": "navindu@example.com",
        "profilePictureUrl": "https://example.com/avatar.jpg"
      },
      "accessToken": "jwt-token",
      "refreshToken": "jwt-token"
    }

### Error Responses

- `400` — `email and password are required`
- `401` — `Invalid email or password`
- `500` — `Server error during login`

---

## 3) Refresh Access & Refresh Tokens

- **Method:** `POST`
- **Route:** `/v1/api/auth/refresh-token`

### Request Body

    {
      "refreshToken": "jwt-refresh-token"
    }

### Success Response (`200 OK`)

    {
      "user": {
        "_id": "664f6a...",
        "name": "Navindu",
        "email": "navindu@example.com",
        "profilePictureUrl": "https://example.com/avatar.jpg"
      },
      "accessToken": "new-jwt-access-token",
      "refreshToken": "new-jwt-refresh-token"
    }

### Error Responses

- `400` — `refreshToken is required`
- `401` — `Invalid or expired refresh token` / `Invalid refresh token` / `Refresh token expired`
- `500` — `Server error during token refresh`

---

## 4) Logout

- **Method:** `POST`
- **Route:** `/v1/api/auth/logout`

### Request Body

    {
      "refreshToken": "jwt-refresh-token"
    }

### Success Response (`200 OK`)

    {
      "message": "Logged out successfully"
    }

### Error Responses

- `400` — `refreshToken is required`
- `500` — `Server error during logout`

> Note: If refresh token is already invalid/expired, endpoint still returns `200 Logged out successfully`.

---

## 5) Request Password Reset OTP

- **Method:** `POST`
- **Route:** `/v1/api/auth/forgot-password/request-otp`

### Request Body

    {
      "email": "navindu@example.com"
    }

### Success Response (`200 OK`)

    {
      "message": "OTP generated successfully",
      "otpExpiresInMinutes": 10
    }

### Error Responses

- `400` — `email is required`
- `404` — `Email does not exist`
- `500` — `Server error during OTP request`

---

## 6) Validate Password Reset OTP

- **Method:** `POST`
- **Route:** `/v1/api/auth/forgot-password/validate-otp`

### Request Body

    {
      "email": "navindu@example.com",
      "otp": "123456"
    }

### Success Response (`200 OK`)

    {
      "message": "OTP validated successfully",
      "resetToken": "9e9d7e63-1e5d-4ca8-a14a-0f130759f88b",
      "resetTokenExpiresInMinutes": 15
    }

### Error Responses

- `400` — `email and otp are required`
- `400` — `OTP must be a 6-digit number`
- `400` — `Invalid or expired OTP` / `Invalid OTP`
- `404` — `Email does not exist`
- `500` — `Server error during OTP validation`

---

## 7) Reset Password with Reset Token

- **Method:** `POST`
- **Route:** `/v1/api/auth/forgot-password/reset-password`

### Request Body

    {
      "resetToken": "9e9d7e63-1e5d-4ca8-a14a-0f130759f88b",
      "newPassword": "NewStrongPass@123"
    }

### Success Response (`200 OK`)

    {
      "message": "Password reset successful. Please login again"
    }

### Error Responses

- `400` — `resetToken and newPassword are required`
- `400` — `Invalid or expired reset token`
- `404` — `User not found`
- `500` — `Server error during password reset`

---

## Quick Endpoint Summary

| Method | Route | Description |
|---|---|---|
| POST | `/v1/api/auth/register` | Register a new user |
| POST | `/v1/api/auth/login` | Login and receive tokens |
| POST | `/v1/api/auth/refresh-token` | Rotate/refresh access + refresh tokens |
| POST | `/v1/api/auth/logout` | Logout user (invalidate stored refresh token hash) |
| POST | `/v1/api/auth/forgot-password/request-otp` | Request OTP for password reset |
| POST | `/v1/api/auth/forgot-password/validate-otp` | Validate OTP and receive reset token |
| POST | `/v1/api/auth/forgot-password/reset-password` | Reset password using reset token |