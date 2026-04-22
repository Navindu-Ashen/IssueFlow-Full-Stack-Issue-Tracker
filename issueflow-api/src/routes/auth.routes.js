import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  requestPasswordResetOtp,
  validatePasswordResetOtp,
  resetPasswordWithResetToken,
  uploadProfileImage,
  uploadProfileImageToCloudinary,
} from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /v1/api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Navindu
 *               email:
 *                 type: string
 *                 format: email
 *                 example: navindu@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass@123
 *               profilePictureUrl:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error during registration
 */
router.post("/register", register);

/**
 * @swagger
 * /v1/api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: navindu@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass@123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error during login
 */
router.post("/login", login);

/**
 * @swagger
 * /v1/api/auth/refresh-token:
 *   post:
 *     summary: Refresh access and refresh tokens
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *       400:
 *         description: Missing refresh token
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Server error during token refresh
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /v1/api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       400:
 *         description: Missing refresh token
 *       500:
 *         description: Server error during logout
 */
router.post("/logout", logout);

/**
 * @swagger
 * /v1/api/auth/upload-image:
 *   post:
 *     summary: Upload and compress profile image, then store on Cloudinary
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid upload request or missing image
 *       500:
 *         description: Server error during image upload
 *       502:
 *         description: Failed to upload image to Cloudinary
 */
router.post(
  "/upload-image",
  uploadProfileImage,
  uploadProfileImageToCloudinary,
);

/**
 * @swagger
 * /v1/api/auth/forgot-password/request-otp:
 *   post:
 *     summary: Request OTP for password reset
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: navindu@example.com
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: Email does not exist
 *       500:
 *         description: Server error during OTP request
 */
router.post("/forgot-password/request-otp", requestPasswordResetOtp);

/**
 * @swagger
 * /v1/api/auth/forgot-password/validate-otp:
 *   post:
 *     summary: Validate OTP and issue reset token
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: navindu@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: 6-digit OTP code
 *     responses:
 *       200:
 *         description: OTP validated successfully and reset token returned
 *       400:
 *         description: Invalid input or invalid/expired OTP
 *       404:
 *         description: Email does not exist
 *       500:
 *         description: Server error during OTP validation
 */
router.post("/forgot-password/validate-otp", validatePasswordResetOtp);

/**
 * @swagger
 * /v1/api/auth/forgot-password/reset-password:
 *   post:
 *     summary: Reset password using reset token
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - newPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 format: uuid
 *                 example: 9e9d7e63-1e5d-4ca8-a14a-0f130759f88b
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewStrongPass@123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Missing fields or invalid/expired reset token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error during password reset
 */
router.post("/forgot-password/reset-password", resetPasswordWithResetToken);

export default router;
