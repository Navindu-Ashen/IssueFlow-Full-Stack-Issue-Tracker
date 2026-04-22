import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["CREATED", "UPDATED", "STATUS_CHANGED"],
      required: true,
    },
    details: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("ActivityLog", ActivityLogSchema);
