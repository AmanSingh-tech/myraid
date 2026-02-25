# API Reference

Complete API documentation for the Task Management Application.

## Base URL

**Development**: `http://localhost:3000`
**Production**: `https://your-app.vercel.app`

## Authentication

All protected endpoints require authentication via HTTP-only cookie containing JWT token.

### Cookie Format
```
Cookie: token=<jwt_token>
```

Cookie is automatically set/cleared by authentication endpoints.

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min: 6, max: 100)"
}
```

**Success Response**: `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2026-02-25T12:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `409 Conflict` - Email already exists

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }' \
  -c cookies.txt
```

---

### Login

Authenticate existing user.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response**: `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2026-02-25T12:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid credentials

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }' \
  -c cookies.txt
```

---

### Logout

Clear authentication session.

**Endpoint**: `POST /api/auth/logout`

**Success Response**: `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

### Get Current User

Retrieve authenticated user information.

**Endpoint**: `GET /api/auth/me`

**Authentication**: Required

**Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2026-02-25T12:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized` - No token or invalid token
- `404 Not Found` - User not found

**Example**:
```bash
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

---

## Task Endpoints

### Create Task

Create a new task for authenticated user.

**Endpoint**: `POST /api/tasks`

**Authentication**: Required

**Request Body**:
```json
{
  "title": "string (required, max: 200)",
  "description": "string (required, max: 5000)",
  "status": "TODO | IN_PROGRESS | DONE (optional, default: TODO)"
}
```

**Success Response**: `201 Created`
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": "uuid",
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs",
      "status": "TODO",
      "createdAt": "2026-02-25T12:00:00.000Z",
      "userId": "uuid"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated

**Example**:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Review pull requests",
    "description": "Review and approve pending PRs",
    "status": "TODO"
  }'
```

---

### Get All Tasks

Retrieve tasks for authenticated user with pagination, filtering, and search.

**Endpoint**: `GET /api/tasks`

**Authentication**: Required

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |
| status | enum | No | - | Filter by status (TODO, IN_PROGRESS, DONE) |
| search | string | No | - | Search in task title |

**Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Task title",
        "description": "Task description",
        "status": "TODO",
        "createdAt": "2026-02-25T12:00:00.000Z",
        "userId": "uuid"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Not authenticated

**Examples**:

Get first page (10 items):
```bash
curl http://localhost:3000/api/tasks \
  -b cookies.txt
```

Get page 2 with 20 items:
```bash
curl "http://localhost:3000/api/tasks?page=2&limit=20" \
  -b cookies.txt
```

Filter by status:
```bash
curl "http://localhost:3000/api/tasks?status=TODO" \
  -b cookies.txt
```

Search tasks:
```bash
curl "http://localhost:3000/api/tasks?search=meeting" \
  -b cookies.txt
```

Combined filters:
```bash
curl "http://localhost:3000/api/tasks?page=1&limit=10&status=IN_PROGRESS&search=project" \
  -b cookies.txt
```

---

### Get Single Task

Retrieve a specific task by ID.

**Endpoint**: `GET /api/tasks/:id`

**Authentication**: Required

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Task ID |

**Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "uuid",
      "title": "Task title",
      "description": "Task description",
      "status": "TODO",
      "createdAt": "2026-02-25T12:00:00.000Z",
      "userId": "uuid"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Task belongs to different user
- `404 Not Found` - Task doesn't exist

**Example**:
```bash
curl http://localhost:3000/api/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -b cookies.txt
```

---

### Update Task

Update an existing task.

**Endpoint**: `PATCH /api/tasks/:id`

**Authentication**: Required

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Task ID |

**Request Body** (all fields optional):
```json
{
  "title": "string (optional, max: 200)",
  "description": "string (optional, max: 5000)",
  "status": "TODO | IN_PROGRESS | DONE (optional)"
}
```

**Success Response**: `200 OK`
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": "uuid",
      "title": "Updated title",
      "description": "Updated description",
      "status": "IN_PROGRESS",
      "createdAt": "2026-02-25T12:00:00.000Z",
      "userId": "uuid"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Task belongs to different user
- `404 Not Found` - Task doesn't exist

**Examples**:

Update title only:
```bash
curl -X PATCH http://localhost:3000/api/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title": "New title"}'
```

Update status:
```bash
curl -X PATCH http://localhost:3000/api/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"status": "DONE"}'
```

Update multiple fields:
```bash
curl -X PATCH http://localhost:3000/api/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Updated task",
    "description": "New description",
    "status": "IN_PROGRESS"
  }'
```

---

### Delete Task

Delete a task permanently.

**Endpoint**: `DELETE /api/tasks/:id`

**Authentication**: Required

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Task ID |

**Success Response**: `200 OK`
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses**:
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Task belongs to different user
- `404 Not Found` - Task doesn't exist

**Example**:
```bash
curl -X DELETE http://localhost:3000/api/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -b cookies.txt
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errorCode": "MACHINE_READABLE_CODE"
}
```

### Error Codes

#### Authentication Errors (400-401)
| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| INVALID_CREDENTIALS | 401 | Wrong email/password |
| TOKEN_MISSING | 401 | No authentication token |
| TOKEN_INVALID | 401 | Invalid or expired token |

#### Authorization Errors (403)
| Code | Status | Description |
|------|--------|-------------|
| FORBIDDEN | 403 | Insufficient permissions |

#### Not Found Errors (404)
| Code | Status | Description |
|------|--------|-------------|
| USER_NOT_FOUND | 404 | User doesn't exist |
| TASK_NOT_FOUND | 404 | Task doesn't exist |

#### Conflict Errors (409)
| Code | Status | Description |
|------|--------|-------------|
| USER_EXISTS | 409 | Email already registered |

#### Server Errors (500)
| Code | Status | Description |
|------|--------|-------------|
| INTERNAL_ERROR | 500 | Server error |

### Example Error Responses

**Validation Error**:
```json
{
  "success": false,
  "message": "Invalid email address",
  "errorCode": "VALIDATION_ERROR"
}
```

**Authentication Error**:
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "errorCode": "TOKEN_INVALID"
}
```

**Not Found Error**:
```json
{
  "success": false,
  "message": "Task not found",
  "errorCode": "TASK_NOT_FOUND"
}
```

---

## Rate Limiting

**Not currently implemented**. Recommended limits for production:

- Authentication endpoints: 5 requests per 15 minutes per IP
- Task endpoints: 100 requests per 15 minutes per user
- General: 1000 requests per hour per IP

---

## Data Encryption

### Encrypted Fields

Task `description` field is encrypted using AES-256-CBC before storage.

**Client Impact**: None - encryption/decryption happens server-side automatically.

### Encryption Format

Stored format: `<iv_hex>:<encrypted_data_hex>`

Example: `a1b2c3d4e5f6....:9f8e7d6c5b4a....`

---

## Pagination

All list endpoints support pagination with consistent format.

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Response Format
```json
{
  "data": {
    "tasks": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

### Calculating Total Pages
```
totalPages = ceil(total / limit)
```

---

## Status Codes Summary

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input validation |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server-side error |

---

## Testing with Postman

### Import Collection

Create a new collection with these settings:

**Variables**:
- `baseUrl`: `http://localhost:3000`
- `token`: (auto-set from login response)

**Pre-request Script** (for authenticated requests):
```javascript
// Token is automatically set in cookies
```

**Tests** (for all requests):
```javascript
pm.test("Status code is successful", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
});
```

---

## Changelog

### Version 1.0.0 (2026-02-25)
- Initial API release
- Authentication endpoints
- Task CRUD operations
- Pagination support
- Status filtering
- Search functionality

---

**API Version**: 1.0.0
**Last Updated**: February 25, 2026
