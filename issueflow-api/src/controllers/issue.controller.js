import mongoose from "mongoose";
import Issue from "../models/Issue.js";
import ActivityLog from "../models/ActivityLog.js";

const USER_POPULATE_FIELDS = "name email profilePictureUrl";

export const createIssue = async (req, res) => {
  try {
    const { title, description, priority, severity, assignee } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const issue = await Issue.create({
      title,
      description,
      priority,
      severity,
      assignee: assignee || null,
      createdBy: req.user._id,
    });

    await ActivityLog.create({
      issueId: issue._id,
      userId: req.user._id,
      action: "CREATED",
      details: `Issue "${title}" created`,
    });

    return res.status(201).json(issue);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error creating issue", error: error.message });
  }
};

export const getIssues = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const { search, status, priority } = req.query;

    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const skip = (page - 1) * limit;

    const [issues, totalCount] = await Promise.all([
      Issue.find(filter)
        .populate("createdBy", USER_POPULATE_FIELDS)
        .populate("assignee", USER_POPULATE_FIELDS)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Issue.countDocuments(filter),
    ]);

    return res.status(200).json({
      issues,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error fetching issues", error: error.message });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }

    const issue = await Issue.findById(id)
      .populate("createdBy", USER_POPULATE_FIELDS)
      .populate("assignee", USER_POPULATE_FIELDS);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    return res.status(200).json(issue);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error fetching issue", error: error.message });
  }
};

export const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }

    const { title, description, assignee } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      id,
      { title, description, assignee },
      { new: true, runValidators: true },
    )
      .populate("createdBy", USER_POPULATE_FIELDS)
      .populate("assignee", USER_POPULATE_FIELDS);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await ActivityLog.create({
      issueId: issue._id,
      userId: req.user._id,
      action: "UPDATED",
      details: `Issue "${issue.title}" updated`,
    });

    return res.status(200).json(issue);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error updating issue", error: error.message });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }

    const { status } = req.body;

    if (!status || !["Resolved", "Closed"].includes(status)) {
      return res
        .status(400)
        .json({ message: "status must be 'Resolved' or 'Closed'" });
    }

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const oldStatus = issue.status;
    issue.status = status;
    await issue.save();

    await ActivityLog.create({
      issueId: issue._id,
      userId: req.user._id,
      action: "STATUS_CHANGED",
      details: `Status changed from "${oldStatus}" to "${status}"`,
    });

    return res.status(200).json(issue);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error updating status", error: error.message });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }

    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await ActivityLog.deleteMany({ issueId: id });

    return res
      .status(200)
      .json({ message: "Issue deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error deleting issue", error: error.message });
  }
};
