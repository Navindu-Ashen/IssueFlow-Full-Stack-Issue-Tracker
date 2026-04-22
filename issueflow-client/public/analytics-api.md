# Analytics API Documentation

This document describes the analytics endpoint available in IssueFlow.

## Base Route

- **Analytics base route:** `/v1/api/analytics`
- **Content-Type:** `application/json`
- **Auth requirement for this endpoint:** Protected (`Bearer JWT required`)

### Authorization Header

    Authorization: Bearer <accessToken>

---

## Common Response Structures

### Last 7 Days Issue Creation Analytics

    {
      "issuesCreatedLast7Days": {
        "total": 12,
        "daily": [
          { "date": "2026-04-16", "count": 1 },
          { "date": "2026-04-17", "count": 0 },
          { "date": "2026-04-18", "count": 2 },
          { "date": "2026-04-19", "count": 3 },
          { "date": "2026-04-20", "count": 1 },
          { "date": "2026-04-21", "count": 4 },
          { "date": "2026-04-22", "count": 1 }
        ]
      }
    }

### Issue Status Counts Analytics

    {
      "issueStatusCounts": {
        "open": 10,
        "inProgress": 6,
        "resolved": 8,
        "totalAvailable": 27
      }
    }

### Error Response (general pattern)

    {
      "message": "string",
      "error": "string (optional, usually on 500 responses)"
    }

---

## 1) Get Issue Analytics Summary

- **Method:** `GET`
- **Route:** `/v1/api/analytics`

### Description

Returns:
1. Total issues created in the last 7 days, including separate count for each day.
2. Total `open`, `in progress`, `resolved`, and overall `total available` issue counts.

### Request Body

- No request body.

### Success Response (`200 OK`)

    {
      "issuesCreatedLast7Days": {
        "total": 12,
        "daily": [
          { "date": "2026-04-16", "count": 1 },
          { "date": "2026-04-17", "count": 0 },
          { "date": "2026-04-18", "count": 2 },
          { "date": "2026-04-19", "count": 3 },
          { "date": "2026-04-20", "count": 1 },
          { "date": "2026-04-21", "count": 4 },
          { "date": "2026-04-22", "count": 1 }
        ]
      },
      "issueStatusCounts": {
        "open": 10,
        "inProgress": 6,
        "resolved": 8,
        "totalAvailable": 27
      }
    }

### Field Notes

- `issuesCreatedLast7Days.total`  
  Sum of issues created over the last 7 days.
- `issuesCreatedLast7Days.daily`  
  Always includes 7 records (one for each day), even when count is `0`.
- `issueStatusCounts.open`  
  Count of issues with status `"Open"`.
- `issueStatusCounts.inProgress`  
  Count of issues with status `"In Progress"`.
- `issueStatusCounts.resolved`  
  Count of issues with status `"Resolved"`.
- `issueStatusCounts.totalAvailable`  
  Total count of all available issues (`Open + In Progress + Resolved + Closed`).

### Error Responses

- `401` — Unauthorized (missing/invalid access token)
- `500` — `Server error fetching analytics`

---

## Quick Endpoint Summary

| Method | Route | Description |
|---|---|---|
| GET | `/v1/api/analytics` | Get last 7 days issue creation analytics and issue status totals |