import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },

    profilePictureUrl: { type: String, default: "" },

    refreshTokenHash: { type: String, default: null, select: false },
    refreshTokenExpiresAt: { type: Date, default: null },

    passwordResetOtpHash: { type: String, default: null, select: false },
    passwordResetOtpExpiresAt: { type: Date, default: null },
    passwordResetOtpRequestCount: { type: Number, default: 0 },
    passwordResetOtpWindowStartedAt: { type: Date, default: null },
    passwordResetOtpAttemptCount: { type: Number, default: 0 },
    passwordResetOtpBlockedUntil: { type: Date, default: null },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
