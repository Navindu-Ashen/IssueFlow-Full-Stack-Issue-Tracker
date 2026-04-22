import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

/**
 * @swagger
 * /v1/api/analytics:
 *   get:
 *     summary: Get issue analytics summary
 *     description: Returns issue creation trend for the last 7 days and issue status counts.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 last7Days:
 *                   type: object
 *                   properties:
 *                     totalCreated:
 *                       type: number
 *                       example: 18
 *                     dailyCounts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: 2026-04-22
 *                           count:
 *                             type: number
 *                             example: 3
 *                 statusCounts:
 *                   type: object
 *                   properties:
 *                     open:
 *                       type: number
 *                       example: 12
 *                     inProgress:
 *                       type: number
 *                       example: 7
 *                     resolved:
 *                       type: number
 *                       example: 9
 *                     total:
 *                       type: number
 *                       example: 34
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", protect, getAnalytics);

export default router;
