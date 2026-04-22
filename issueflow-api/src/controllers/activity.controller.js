import mongoose from "mongoose";
import ActivityLog from "../models/ActivityLog.js";

const USER_POPULATE_FIELDS = "name email profilePictureUrl";
const ISSUE_POPULATE_FIELDS = "title status priority severity";

const ALLOWED_ACTIONS = ["CREATED", "UPDATED", "STATUS_CHANGED"];

const parseDateQueryParam = (value, isEndOfDay = false) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const isDateOnlyFormat = /^\d{4}-\d{2}-\d{2}$/.test(String(value));
  if (isDateOnlyFormat) {
    if (isEndOfDay) {
      parsedDate.setUTCHours(23, 59, 59, 999);
    } else {
      parsedDate.setUTCHours(0, 0, 0, 0);
    }
  }

  return parsedDate;
};

export const getActivities = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit, 10) || 10),
    );

    const { issueId, userId, action, from, to } = req.query;

    const filter = {};

    if (issueId) {
      if (!mongoose.Types.ObjectId.isValid(issueId)) {
        return res.status(400).json({ message: "Invalid issueId" });
      }
      filter.issueId = issueId;
    }

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      filter.userId = userId;
    }

    if (action) {
      if (!ALLOWED_ACTIONS.includes(action)) {
        return res.status(400).json({
          message: `Invalid action. Allowed values: ${ALLOWED_ACTIONS.join(", ")}`,
        });
      }
      filter.action = action;
    }

    if (from || to) {
      const createdAt = {};

      if (from) {
        const fromDate = parseDateQueryParam(from, false);
        if (!fromDate) {
          return res.status(400).json({ message: "Invalid from date" });
        }
        createdAt.$gte = fromDate;
      }

      if (to) {
        const toDate = parseDateQueryParam(to, true);
        if (!toDate) {
          return res.status(400).json({ message: "Invalid to date" });
        }
        createdAt.$lte = toDate;
      }

      if (createdAt.$gte && createdAt.$lte && createdAt.$gte > createdAt.$lte) {
        return res
          .status(400)
          .json({ message: "'from' date cannot be after 'to' date" });
      }

      filter.createdAt = createdAt;
    }

    const skip = (page - 1) * limit;

    const [activities, totalCount] = await Promise.all([
      ActivityLog.find(filter)
        .populate("userId", USER_POPULATE_FIELDS)
        .populate("issueId", ISSUE_POPULATE_FIELDS)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(filter),
    ]);

    return res.status(200).json({
      activities,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error fetching activities",
      error: error.message,
    });
  }
};
