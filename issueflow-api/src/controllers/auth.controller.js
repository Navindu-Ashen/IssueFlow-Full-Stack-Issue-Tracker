import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const RESET_TOKEN_EXPIRY_MINUTES = Number(
  process.env.RESET_TOKEN_EXPIRY_MINUTES || 15,
);

const OTP_EXPIRY_MS = OTP_EXPIRY_MINUTES * 60 * 1000;
const RESET_TOKEN_EXPIRY_MS = RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000;

const otpStoreByEmail = new Map();
const resetTokenStore = new Map();

const normalizeEmail = (email) => String(email).toLowerCase().trim();

const parseDurationToMs = (duration) => {
  if (typeof duration === "number") return duration;
  if (typeof duration !== "string") return null;

  const trimmed = duration.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);

  const match = trimmed.match(/^(\d+)([smhd])$/i);
  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
};

const toFutureDateFromDuration = (
  duration,
  fallbackMs = 24 * 60 * 60 * 1000,
) => {
  const ms = parseDurationToMs(duration) ?? fallbackMs;
  return new Date(Date.now() + ms);
};

const hashValue = (value) =>
  crypto.createHash("sha256").update(String(value)).digest("hex");

const generateOtp = () =>
  crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

const generateAccessToken = (id) => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

const generateRefreshToken = (id) => {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("JWT_REFRESH_SECRET/JWT_SECRET is not configured");
  }

  return jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

const getSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profilePictureUrl: user.profilePictureUrl || "",
});

const setRefreshTokenState = async (user, refreshToken) => {
  user.refreshTokenHash = hashValue(refreshToken);
  user.refreshTokenExpiresAt = toFutureDateFromDuration(
    REFRESH_TOKEN_EXPIRES_IN,
    7 * 24 * 60 * 60 * 1000,
  );
  await user.save();
};

const issueAndPersistTokens = async (user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await setRefreshTokenState(user, refreshToken);

  return { accessToken, refreshToken };
};

const isExpired = (date) => new Date(date).getTime() <= Date.now();

export const register = async (req, res) => {
  try {
    const { name, email, password, profilePictureUrl = "" } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      profilePictureUrl,
    });

    const { accessToken, refreshToken } = await issueAndPersistTokens(user);

    return res.status(201).json({
      user: getSafeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password +refreshTokenHash",
    );

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = await issueAndPersistTokens(user);

    return res.status(200).json({
      user: getSafeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: incomingRefreshToken } = req.body;

    if (!incomingRefreshToken) {
      return res.status(400).json({ message: "refreshToken is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
    } catch {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.id).select("+refreshTokenHash");
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const incomingRefreshHash = hashValue(incomingRefreshToken);
    if (incomingRefreshHash !== user.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (user.refreshTokenExpiresAt && isExpired(user.refreshTokenExpiresAt)) {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    const tokens = await issueAndPersistTokens(user);

    return res.status(200).json({
      user: getSafeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during token refresh",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken: incomingRefreshToken } = req.body;

    if (!incomingRefreshToken) {
      return res.status(400).json({ message: "refreshToken is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(200).json({ message: "Logged out successfully" });
    }

    const user = await User.findById(decoded.id).select("+refreshTokenHash");
    if (!user) {
      return res.status(200).json({ message: "Logged out successfully" });
    }

    const incomingHash = hashValue(incomingRefreshToken);
    if (user.refreshTokenHash && incomingHash === user.refreshTokenHash) {
      user.refreshTokenHash = null;
      user.refreshTokenExpiresAt = null;
      await user.save();
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during logout",
      error: error.message,
    });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    otpStoreByEmail.set(normalizedEmail, { otp, expiresAt });

    console.log(
      `[FORGOT_PASSWORD_OTP] email=${normalizedEmail} otp=${otp} expiresAt=${expiresAt.toISOString()}`,
    );

    return res.status(200).json({
      message: "OTP generated successfully",
      otpExpiresInMinutes: OTP_EXPIRY_MINUTES,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during OTP request",
      error: error.message,
    });
  }
};

export const validatePasswordResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "email and otp are required" });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({ message: "OTP must be a 6-digit number" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    const otpRecord = otpStoreByEmail.get(normalizedEmail);
    if (!otpRecord || isExpired(otpRecord.expiresAt)) {
      otpStoreByEmail.delete(normalizedEmail);
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (String(otp) !== otpRecord.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpStoreByEmail.delete(normalizedEmail);

    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
    resetTokenStore.set(resetToken, { email: normalizedEmail, expiresAt });

    return res.status(200).json({
      message: "OTP validated successfully",
      resetToken,
      resetTokenExpiresInMinutes: RESET_TOKEN_EXPIRY_MINUTES,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during OTP validation",
      error: error.message,
    });
  }
};

export const resetPasswordWithResetToken = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "resetToken and newPassword are required" });
    }

    const tokenRecord = resetTokenStore.get(resetToken);
    if (!tokenRecord || isExpired(tokenRecord.expiresAt)) {
      resetTokenStore.delete(resetToken);
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const user = await User.findOne({ email: tokenRecord.email });
    if (!user) {
      resetTokenStore.delete(resetToken);
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    user.refreshTokenHash = null;
    user.refreshTokenExpiresAt = null;

    await user.save();

    resetTokenStore.delete(resetToken);

    return res.status(200).json({
      message: "Password reset successful. Please login again",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during password reset",
      error: error.message,
    });
  }
};
