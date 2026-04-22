import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
} from "../controllers/issue.controller.js";

const router = Router();

/**
 * @swagger
 * /v1/api/issues:
 *   post:
 *     summary: Create a new issue
 *     tags:
 *       - Issues
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Login page crashes on submit
 *               description:
 *                 type: string
 *                 example: The login form throws a 500 error when the email field is empty.
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: High
 *               severity:
 *                 type: string
 *                 enum: [Minor, Major, Critical]
 *                 example: Major
 *               assignee:
 *                 type: string
 *                 description: User ObjectId
 *                 example: 663f1b2e4f1a2b3c4d5e6f7a
 *     responses:
 *       201:
 *         description: Issue created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/", protect, createIssue);

/**
 * @swagger
 * /v1/api/issues:
 *   get:
 *     summary: Fetch a paginated list of issues
 *     tags:
 *       - Issues
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page (max 100)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search issues by title
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Open, In Progress, Resolved, Closed]
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Filter by priority
 *     responses:
 *       200:
 *         description: Paginated list of issues
 *       500:
 *         description: Server error
 */
router.get("/", protect, getIssues);

/**
 * @swagger
 * /v1/api/issues/{id}:
 *   get:
 *     summary: Get detailed information for a specific issue
 *     tags:
 *       - Issues
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ObjectId
 *     responses:
 *       200:
 *         description: Issue details
 *       400:
 *         description: Invalid issue ID
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, getIssueById);

/**
 * @swagger
 * /v1/api/issues/{id}:
 *   put:
 *     summary: Update title, description, or assignment of an issue
 *     tags:
 *       - Issues
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated issue title
 *               description:
 *                 type: string
 *                 example: Updated description of the issue.
 *               assignee:
 *                 type: string
 *                 description: User ObjectId
 *                 example: 663f1b2e4f1a2b3c4d5e6f7a
 *     responses:
 *       200:
 *         description: Issue updated successfully
 *       400:
 *         description: Invalid issue ID
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, updateIssue);

/**
 * @swagger
 * /v1/api/issues/{id}/status:
 *   patch:
 *     summary: Mark an issue as Resolved or Closed
 *     tags:
 *       - Issues
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Resolved, Closed]
 *                 example: Resolved
 *     responses:
 *       200:
 *         description: Issue status updated
 *       400:
 *         description: Invalid ID or status value
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/status", protect, updateIssueStatus);

/**
 * @swagger
 * /v1/api/issues/{id}:
 *   delete:
 *     summary: Delete an issue
 *     tags:
 *       - Issues
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ObjectId
 *     responses:
 *       200:
 *         description: Issue deleted successfully
 *       400:
 *         description: Invalid issue ID
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteIssue);

export default router;
