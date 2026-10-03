# SwasthyaGrid — Database Architecture & Schema Specification

**Database Engine:** MongoDB (v6.0+) with Mongoose ODM  
**Geospatial Standard:** GeoJSON `Point` with `2dsphere` spherical indexing  
**Platform Scope:** Intelligent community health-signal monitoring, spatial-temporal clustering, and frontline response dispatch.  
*(Note: SwasthyaGrid is an early-warning signal detection and operational platform; it does not perform clinical diagnosis).*

---

## Entity Relationship Overview

```
 [User] (OFFICER / ADMIN)
   │
   ├── dispatches ───► [Task] ◄── assignedTo ─── [User] (HEALTH_WORKER)
   │                      │
   │                      ├── belongsTo
   │                      ▼
 [Report] ── memberOf ──► [Cluster] ◄── audits ─── [Action] (Operational Trail)
   │ (Geospatial)           │ (Geospatial)
   ▼                        ▼
[2dsphere Spatial Index]  [2dsphere Spatial Index]
   ▲
   │
 [Facility] (PHC / Hospital / Clinic Directory)
```

---

## 1. `users` Collection

Stores authentication credentials, profile roles, and geographical assignments.

| Field | Type | Required | Constraints / Validation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto | Primary key | Unique user identifier |
| `name` | String | Yes | 2 to 100 characters, trimmed | Full name of the user |
| `email` | String | Yes | Unique, lowercase, valid email regex | Login and contact email |
| `passwordHash` | String | Yes | Hashed with bcrypt (salt rounds = 10) | Never stored in plain text; omitted in JSON output |
| `role` | String | Yes | Enum: `CITIZEN`, `OFFICER`, `HEALTH_WORKER`, `ADMIN` | Role-based access control (default: `CITIZEN`) |
| `area` | String | No | Trimmed (default: `'General'`) | Operating administrative ward or sector |
| `phone` | String | No | Trimmed | Contact telephone number |
| `assignedWard` | String | No | Trimmed | Field assignment for health workers / officers |
| `facilityId` | ObjectId | No | Ref: `Facility` | Healthcare facility affiliation (if applicable) |
| `isActive` | Boolean | Yes | Default: `true` | Account activation flag |
| `createdAt` | Date | Auto | Mongoose timestamp | Creation timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp | Last modification timestamp |

**Indexes:**
- `email`: Unique index for fast lookups and preventing duplicate registrations.

---

## 2. `reports` Collection

Stores incoming citizen and frontline health worker symptom signals.

| Field | Type | Required | Constraints / Validation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto | Primary key | Unique report identifier |
| `reporterId` | ObjectId | No | Ref: `User`, default `null` | Nullable to allow anonymous citizen reporting |
| `location` | Object | Yes | GeoJSON Point `[longitude, latitude]` | Geographical coordinates and human-readable address |
| `location.type` | String | Yes | Enum: `['Point']`, default: `'Point'` | GeoJSON specification compliant type |
| `location.coordinates`| [Number] | Yes | Array of 2 numbers `[lng, lat]` | Indexed with `2dsphere` |
| `location.address` | String | No | Trimmed | Street address or locality description |
| `location.ward` | String | No | Trimmed, indexed | Municipal ward identifier (e.g. `'Ward 7'`) |
| `location.pincode` | String | No | Trimmed | Postal code |
| `symptoms` | [String] | Yes | Min 1 element required | Array of reported symptoms (e.g. `['fever', 'acute diarrhea']`) |
| `topics` | [String] | No | Default: `[]` | Signal classifications (e.g. `['water_quality', 'gastrointestinal']`) |
| `duration` | String | No | Trimmed, default: `'1-2 days'` | Approximate duration of reported symptoms |
| `severity` | String | Yes | Enum: `MILD`, `MODERATE`, `SEVERE` | Subjective symptom severity level (default: `'MODERATE'`) |
| `affectedPeople` | Number | Yes | Min: `1`, default: `1` | Number of individuals experiencing similar symptoms |
| `description` | String | No | Max 2000 characters, trimmed | Free-text contextual description from reporter |
| `aiAnalysis` | Object | No | Nested signal schema | Signal extraction metadata (signalsDetected, riskLevel, confidence, summary) |
| `status` | String | Yes | Enum: `NEW`, `ANALYZED`, `UNDER_REVIEW`, `VERIFIED`, `RESOLVED` | Workflow lifecycle state (default: `'NEW'`) |
| `clusterId` | ObjectId | No | Ref: `Cluster`, default: `null` | Associated outbreak cluster ID once grouped |
| `environmentalFactors`| Object | No | waterSource, drainageIssues, recentFlooding | Environmental context relevant to water/vector-borne risks |
| `createdAt` | Date | Auto | Mongoose timestamp | Submission timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp | Last modification timestamp |

**Indexes:**
- `location.coordinates`: `2dsphere` for geospatial proximity and clustering radius queries.
- `status` + `createdAt`: Compound index for rapid dashboard filtering of active alerts.
- `location.ward` + `status`: Compound index for ward-level incident tracking.

---

## 3. `clusters` Collection

Represents spatial-temporal clusters generated by the Risk & Clustering Engine.

| Field | Type | Required | Constraints / Validation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto | Primary key | Unique cluster identifier |
| `area` | String | Yes | Trimmed | Municipal ward or locality name |
| `reportIds` | [ObjectId] | No | Array of Ref: `Report` | Member signal reports forming the cluster |
| `score` | Number | Yes | Min: `0`, Max: `100` | Explainable composite risk score |
| `priority` | String | Yes | Enum: `LOW`, `WATCH`, `HIGH`, `CRITICAL` | Action urgency tier |
| `signals` | [String] | No | Default: `[]` | Detected signal signatures (e.g. `['acute_diarrhea_spike', 'water_source_clustering']`) |
| `explanation` | Mixed / Object | Yes | `{ summary: string, factors: [...] }` | Natural-language and weighted explanation of the alert score |
| `status` | String | Yes | Enum: `DETECTED`, `TASK_DISPATCHED`, `FIELD_VERIFIED`, `RESOLVED`, `FALSE_ALERT` | Operational status of the cluster |
| `centerLocation` | Object | No | GeoJSON Point `[lng, lat]` | Geometric centroid of member reports |
| `radiusMeters` | Number | No | Default: `500` | Cluster geographical boundary radius |
| `detectedAt` | Date | Yes | Default: `Date.now` | Initial detection timestamp |
| `resolvedAt` | Date | No | Default: `null` | Closure timestamp |
| `createdAt` | Date | Auto | Mongoose timestamp | Creation timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp | Last modification timestamp |

**Indexes:**
- `priority` + `score`: Compound index for prioritizing critical alerts on officer consoles.
- `area` + `status`: Compound index for administrative status views.
- `centerLocation.coordinates`: `2dsphere` for mapping and geospatial proximity matching.

---

## 4. `tasks` Collection

Represents field verification assignments dispatched to frontline Community Health Workers (e.g. ASHA workers).

| Field | Type | Required | Constraints / Validation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto | Primary key | Unique task identifier |
| `clusterId` | ObjectId | Yes | Ref: `Cluster` | Associated spatial-temporal outbreak cluster |
| `workerId` | ObjectId | Yes | Ref: `User` | Assigned health worker user ID |
| `assignedBy` | ObjectId | No | Ref: `User` | Dispatching health officer ID |
| `status` | String | Yes | Enum: `ASSIGNED`, `IN_PROGRESS`, `VERIFIED`, `FALSE_ALERT`, `MONITORING`, `ACTION_REQUIRED` | Task operational state |
| `priority` | String | Yes | Enum: `LOW`, `MEDIUM`, `HIGH`, `URGENT` | Operational priority level |
| `notes` | String | No | Trimmed | Guidance and inspection instructions |
| `assignedAt` | Date | Yes | Default: `Date.now` | Dispatch timestamp |
| `completedAt` | Date | No | Default: `null` | Resolution / verification completion timestamp |
| `verificationReport` | Object | No | Confirmed cases, observations, supplies provided | Ground-truth findings submitted from field |
| `createdAt` | Date | Auto | Mongoose timestamp | Creation timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp | Last modification timestamp |

**Indexes:**
- `clusterId` + `status`: Compound index for cluster task progress tracking.
- `workerId` + `status`: Compound index for worker mobile dashboard workload queries.

---

## 5. `actions` Collection

Maintains an immutable audit log of administrative and clinical interventions.

| Field | Type | Required | Constraints / Validation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto | Primary key | Unique action identifier |
| `clusterId` | ObjectId | No | Ref: `Cluster`, default: `null` | Target cluster (if linked to a specific incident) |
| `actionType` | String | Yes | Trimmed | Type of action taken (e.g. `DISPATCH_HEALTH_WORKER`, `COMMUNITY_ADVISORY_ISSUED`) |
| `owner` | ObjectId | Yes | Ref: `User` | Officer or administrator executing the action |
| `notes` | String | No | Trimmed | Contextual notes and justification |
| `timestamp` | Date | Yes | Default: `Date.now` | Timestamp when the action occurred |
| `metadata` | Mixed | No | Default: `{}` | Arbitrary action parameters (e.g. affected population count, advisory text) |
| `createdAt` | Date | Auto | Mongoose timestamp | Creation timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp | Last modification timestamp |

**Indexes:**
- `clusterId` + `timestamp`: Chronological audit log per cluster.
- `owner` + `timestamp`: Officer activity history.

---

## 6. `facilities` Collection

Directory of local healthcare facilities, primary health centers (PHCs), diagnostic labs, and dispensaries.

| Field | Type | Required | Constraints / Validation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto | Primary key | Unique facility identifier |
| `name` | String | Yes | Min 2 characters, trimmed | Facility name (e.g. `'Urban Primary Health Centre - Ward 4'`) |
| `type` | String | Yes | Enum: `HOSPITAL`, `PHC`, `CLINIC`, `LAB`, `OTHER` | Facility classification |
| `location` | Object | Yes | GeoJSON Point `[lng, lat]` | Physical location and address |
| `contact` | Object | No | `{ phone, email, inCharge }` | Administrative contact information |
| `availability` | Object | No | `{ status, isOpen24x7, bedsTotal, bedsAvailable, orsStockAvailable, testingKitsAvailable }` | Real-time capacity and resource indicators |
| `createdAt` | Date | Auto | Mongoose timestamp | Creation timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp | Last modification timestamp |

**Indexes:**
- `location.coordinates`: `2dsphere` for nearest-facility routing and proximity analysis.
- `type` + `location.ward`: Ward-level facility discovery.

---

## Summary of Data Guarantees & Constraints

1. **Security & Privacy:** Passwords are consistently hashed using `bcrypt` and omitted from model JSON exports. Anonymous reports are accommodated by making `reporterId` optional.
2. **Spatial Integrity:** All coordinates conform to GeoJSON `[longitude, latitude]` format and utilize MongoDB `2dsphere` indexes for spherical distance calculations.
3. **Audit Trail:** Every critical cluster status transition or dispatch action logs a permanent entry in `actions`.
4. **Scope Demarcation:** Schema fields emphasize early health signals, water/environmental factors, and operational dispatch without claiming diagnostic authority.
