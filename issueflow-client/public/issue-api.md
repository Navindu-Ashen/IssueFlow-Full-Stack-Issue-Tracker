# Issue API Documentation

This document describes the issue management endpoints available in IssueFlow.

## Base Route

- **Issue base route:** `/v1/api/issues`
- **Content-Type:** `application/json`
- **Auth requirement for these endpoints:** Protected (Bearer token required)

---

## Common Response Structures

### Populated User Object

    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "profilePictureUrl": "string"
    }

### Issue Object (general)

    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "status": "Open | In Progress | Resolved | Closed",
      "priority": "Low | Medium | High",
      "severity": "Minor | Major | Critical",
      "createdBy": "string | populated user object",
      "assignee": "string | populated user object | null",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }

### Error Response (general pattern)

    {
      "message": "string",
      "error": "string (optional, usually on 500 responses)"
    }

---

## 1) Create Issue

- **Method:** `POST`
- **Route:** `/v1/api/issues`

### Request Body

    {
      "title": "Login page crashes on submit",
      "description": "The login form throws a 500 error when the email field is empty.",
      "priority": "High",
      "severity": "Major",
      "assignee": "663f1b2e4f1a2b3c4d5e6f7a"
    }

> `title` is required.  
> If `assignee` is omitted, it will be saved as `null`.

### Success Response (`201 Created`)

    {
      "_id": "6650ab...",
      "title": "Login page crashes on submit",
      "description": "The login form throws a 500 error when the email field is empty.",
      "status": "Open",
      "priority": "High",
      "severity": "Major",
      "createdBy": "664f6a...",
      "assignee": "663f1b2e4f1a2b3c4d5e6f7a",
      "createdAt": "2026-04-22T10:00:00.000Z",
      "updatedAt": "2026-04-22T10:00:00.000Z"
    }

### Error Responses

- `400` — `title is required`
- `500` — `Server error creating issue`

---

## 2) Get Issues (Paginated + Filters)

- **Method:** `GET`
- **Route:** `/v1/api/issues`

### Query Parameters

- `page` (optional, default: `1`, min: `1`)
- `limit` (optional, default: `10`, max: `100`, min: `1`)
- `search` (optional, case-insensitive search on issue title)
- `status` (optional: `Open | In Progress | Resolved | Closed`)
- `priority` (optional: `Low | Medium | High`)

### Success Response (`200 OK`)

    {
      "issues": [
        {
          "_id": "6650ab...",
          "title": "Login page crashes on submit",
          "description": "The login form throws a 500 error when the email field is empty.",
          "status": "Open",
          "priority": "High",
          "severity": "Major",
          "createdBy": {
            "_id": "664f6a...",
            "name": "Navindu",
            "email": "navindu@example.com",
            "profilePictureUrl": "https://example.com/avatar.jpg"
          },
          "assignee": {
            "_id": "663f1b...",
            "name": "Alex",
            "email": "alex@example.com",
            "profilePictureUrl": "https://example.com/alex.jpg"
          },
          "createdAt": "2026-04-22T10:00:00.000Z",
          "updatedAt": "2026-04-22T10:05:00.000Z"
        }
      ],
      "page": 1,
      "totalPages": 3,
      "totalCount": 25
    }

### Error Responses

- `500` — `Server error fetching issues`

---

## 3) Get Issue by ID

- **Method:** `GET`
- **Route:** `/v1/api/issues/{id}`

### Path Parameters

- `id` — Issue ObjectId

### Success Response (`200 OK`)

    {
      "_id": "6650ab...",
      "title": "Login page crashes on submit",
      "description": "The login form throws a 500 error when the email field is empty.",
      "status": "Open",
      "priority": "High",
      "severity": "Major",
      "createdBy": {
        "_id": "664f6a...",
        "name": "Navindu",
        "email": "navindu@example.com",
        "profilePictureUrl": "https://example.com/avatar.jpg"
      },
      "assignee": {
        "_id": "663f1b...",
        "name": "Alex",
        "email": "alex@example.com",
        "profilePictureUrl": "https://example.com/alex.jpg"
      },
      "createdAt": "2026-04-22T10:00:00.000Z",
      "updatedAt": "2026-04-22T10:05:00.000Z"
    }

### Error Responses

- `400` — `Invalid issue ID`
- `404` — `Issue not found`
- `500` — `Server error fetching issue`

---

## 4) Update Issue

- **Method:** `PUT`
- **Route:** `/v1/api/issues/{id}`

### Path Parameters

- `id` — Issue ObjectId

### Request Body

    {
      "title": "Updated issue title",
      "description": "Updated description of the issue.",
      "assignee": "663f1b2e4f1a2b3c4d5e6f7a"
    }

> All fields are optional; only provided fields are updated by the controller.

### Success Response (`200 OK`)

    {
      "_id": "6650ab...",
      "title": "Updated issue title",
      "description": "Updated description of the issue.",
      "status": "Open",
      "priority": "High",
      "severity": "Major",
      "createdBy": {
        "_id": "664f6a...",
        "name": "Navindu",
        "email": "navindu@example.com",
        "profilePictureUrl": "https://example.com/avatar.jpg"
      },
      "assignee": {
        "_id": "663f1b...",
        "name": "Alex",
        "email": "alex@example.com",
        "profilePictureUrl": "https://example.com/alex.jpg"
      },
      "createdAt": "2026-04-22T10:00:00.000Z",
      "updatedAt": "2026-04-22T10:20:00.000Z"
    }

### Error Responses

- `400` — `Invalid issue ID`
- `404` — `Issue not found`
- `500` — `Server error updating issue`

---

## 5) Update Issue Status

- **Method:** `PATCH`
- **Route:** `/v1/api/issues/{id}/status`

### Path Parameters

- `id` — Issue ObjectId

### Request Body

    {
      "status": "Resolved"
    }

> Allowed `status` values for this endpoint: `Resolved`, `Closed`.

### Success Response (`200 OK`)

    {
      "_id": "6650ab...",
      "title": "Updated issue title",
      "description": "Updated description of the issue.",
      "status": "Resolved",
      "priority": "High",
      "severity": "Major",
      "createdBy": "664f6a...",
      "assignee": "663f1b2e4f1a2b3c4d5e6f7a",
      "createdAt": "2026-04-22T10:00:00.000Z",
      "updatedAt": "2026-04-22T10:30:00.000Z"
    }

### Error Responses

- `400` — `Invalid issue ID`
- `400` — `status must be 'Resolved' or 'Closed'`
- `404` — `Issue not found`
- `500` — `Server error updating status`

---

## 6) Delete Issue

- **Method:** `DELETE`
- **Route:** `/v1/api/issues/{id}`

### Path Parameters

- `id` — Issue ObjectId

### Success Response (`200 OK`)

    {
      "message": "Issue deleted successfully"
    }

### Error Responses

- `400` — `Invalid issue ID`
- `404` — `Issue not found`
- `500` — `Server error deleting issue`

---

## Quick Endpoint Summary

| Method | Route | Description |
|---|---|---|
| POST | `/v1/api/issues` | Create a new issue |
| GET | `/v1/api/issues` | Get paginated issues with optional filters |
| GET | `/v1/api/issues/{id}` | Get single issue details |
| PUT | `/v1/api/issues/{id}` | Update title, description, or assignee |
| PATCH | `/v1/api/issues/{id}/status` | Update status to `Resolved` or `Closed` |
| DELETE | `/v1/api/issues/{id}` | Delete an issue |