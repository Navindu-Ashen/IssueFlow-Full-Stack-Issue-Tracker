import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getActivities } from "../controllers/activity.controller.js";

const router = Router();

/**
 * @swagger
 * /v1/api/activities:
 *   get:
 *     summary: Fetch a paginated list of activity logs
 *     tags:
 *       - Activities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page (max 100)
 *       - in: query
 *         name: issueId
 *         schema:
 *           type: string
 *         description: Filter by Issue ObjectId
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by User ObjectId
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [CREATED, UPDATED, STATUS_CHANGED]
 *         description: Filter by activity action type
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date/time (inclusive). Supports YYYY-MM-DD or ISO datetime.
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date/time (inclusive). Supports YYYY-MM-DD or ISO datetime.
 *     responses:
 *       200:
 *         description: Paginated list of activities
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getActivities);

export default router;
