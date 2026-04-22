import Issue from "../models/Issue.js";

const getLast7DaysRangeUtc = () => {
  const end = new Date();
  const start = new Date(end);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - 6);
  return { start, end };
};

const buildLast7DayKeys = (startDateUtc) => {
  const keys = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(startDateUtc);
    d.setUTCDate(startDateUtc.getUTCDate() + i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
};

export const getAnalytics = async (req, res) => {
  try {
    const { start, end } = getLast7DaysRangeUtc();

    const [createdTrend, statusGroups] = await Promise.all([
      Issue.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "UTC",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Issue.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const dayKeys = buildLast7DayKeys(start);
    const trendMap = new Map(createdTrend.map((row) => [row._id, row.count]));
    const dailyIssueCounts = dayKeys.map((date) => ({
      date,
      count: trendMap.get(date) || 0,
    }));

    const totalIssuesCreatedLast7Days = dailyIssueCounts.reduce(
      (sum, day) => sum + day.count,
      0,
    );

    const statusCountMap = statusGroups.reduce((acc, row) => {
      acc[row._id] = row.count;
      return acc;
    }, {});

    const openIssueCount = statusCountMap.Open || 0;
    const inProgressIssueCount = statusCountMap["In Progress"] || 0;
    const resolvedIssueCount = statusCountMap.Resolved || 0;
    const closedIssueCount = statusCountMap.Closed || 0;
    const totalAvailableIssueCount =
      openIssueCount +
      inProgressIssueCount +
      resolvedIssueCount +
      closedIssueCount;

    return res.status(200).json({
      issuesCreatedLast7Days: {
        total: totalIssuesCreatedLast7Days,
        daily: dailyIssueCounts,
      },
      issueStatusCounts: {
        open: openIssueCount,
        inProgress: inProgressIssueCount,
        resolved: resolvedIssueCount,
        totalAvailable: totalAvailableIssueCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error fetching analytics",
      error: error.message,
    });
  }
};
