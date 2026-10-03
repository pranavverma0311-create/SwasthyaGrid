# SwasthyaGrid - API Specification (Planned)

Base URL: `/api`

All responses follow the standardized envelope:
```json
{
  "success": true,
  "data": {},
  "message": "Operation description"
}
```
Error response envelope:
```json
{
  "success": false,
  "error": "Error message description",
  "details": null
}
```

---

## 1. System Health
### `GET /api/health`
Health check endpoint to verify API server status.
- **Access**: Public
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "SwasthyaGrid API is running"
}
```

---

## 2. Authentication & Authorization (Phase 3)
### `POST /api/auth/register`
Register new citizen or health personnel (officer, health worker).
- **Body**: `{ name, email, password, role, phone, ward }`
- **Response `201 Created`**: `{ success: true, token, user }`

### `POST /api/auth/login`
Authenticate existing user and return JWT bearer token.
- **Body**: `{ email, password }`
- **Response `200 OK`**: `{ success: true, token, user }`

### `GET /api/auth/me`
Retrieve profile of currently authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{ success: true, user }`

---

## 3. Community Health Reports (Phase 4)
### `POST /api/reports`
Submit a new community health signal report (citizen or field worker).
- **Access**: Public or Authenticated
- **Body**:
```json
{
  "symptoms": ["fever", "diarrhea", "vomiting"],
  "symptomNotes": "Multiple family members feeling sick since yesterday",
  "location": {
    "type": "Point",
    "coordinates": [77.2090, 28.6139],
    "address": "Ward 12, Block B",
    "ward": "Ward 12"
  },
  "waterSource": "Community Borewell #3",
  "affectedCount": 3,
  "severityRating": "moderate"
}
```
- **Response `201 Created`**: `{ success: true, reportId, message }`

### `GET /api/reports`
Retrieve list of reports with spatial and temporal filters.
- **Access**: Health Officer, Admin
- **Query Params**: `ward`, `startDate`, `endDate`, `status`, `page`, `limit`

### `GET /api/reports/:id`
Retrieve detailed view of a specific report.
- **Access**: Health Officer, Field Worker

---

## 4. Signal Clusters & Risk Engine (Phases 6 & 7)
### `GET /api/clusters`
Retrieve detected signal clusters for map display and alert prioritization.
- **Access**: Health Officer, Field Worker
- **Query Params**: `minScore`, `status`, `ward`
- **Response `200 OK`**: List of clusters with geo-coordinates, priorityScore, symptoms summary, explainability text.

### `GET /api/clusters/:id`
Retrieve in-depth details of a cluster, including associated report IDs, velocity metrics, and AI explainability reasoning.

### `PATCH /api/clusters/:id/status`
Update status of a cluster (e.g., `INVESTIGATING`, `VERIFIED`, `RESOLVED`, `FALSE_ALARM`).
- **Access**: Health Officer

---

## 5. Field Worker Tasks & Verification (Phase 9)
### `POST /api/tasks`
Create and assign a field verification task to a health worker.
- **Access**: Health Officer
- **Body**: `{ clusterId, assignedToUserId, priority, instructions, dueDate }`

### `GET /api/tasks/my-tasks`
Get all tasks assigned to the authenticated health worker.
- **Access**: Health Worker

### `PATCH /api/tasks/:id/verify`
Submit on-ground verification results.
- **Access**: Assigned Health Worker
- **Body**:
```json
{
  "verifiedCount": 5,
  "fieldNotes": "Inspected community well; water appears turbid. Chlorination requested.",
  "status": "VERIFIED",
  "immediateActionTaken": "Advised boiling water; distributed ORS packets"
}
```

---

## 6. AI Signal & Decision Assistant (Phases 8 & 10)
### `POST /api/ai/explain-cluster`
Generate natural language explainability for a high-priority cluster.
- **Body**: `{ clusterId }`
- **Response `200 OK`**: Rationale breakdown, contributing factors, recommended verification checklist.

### `POST /api/ai/query`
Natural language query interface for health officers (e.g., *"Show fever clusters in Ward 4 over last 3 days"*).
- **Body**: `{ prompt, contextFilters }`
- **Response `200 OK`**: Summary response and suggested filter actions.

---

## 7. Healthcare Facilities (Phase 11)
### `GET /api/facilities`
Get list of nearby PHCs (Primary Health Centers), dispensaries, and hospitals with contact details and bed/testing availability.
