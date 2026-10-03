# Database Seed Scripts

This directory houses mock synthetic data and seeding scripts for demonstrations, local development, and evaluation.

## Dataset Overview (Phase 2 Foundation)

All seeded records are **100% synthetic** and contain no real personal health or identifiable data.

- **Users (5):**
  - `admin@swasthyagrid.demo` (Role: `ADMIN`)
  - `officer.anita@swasthyagrid.demo` (Role: `OFFICER`, Ward 7 - South)
  - `officer.rajesh@swasthyagrid.demo` (Role: `OFFICER`, Ward 12 - North)
  - `worker.sunita@swasthyagrid.demo` (Role: `HEALTH_WORKER`, ASHA Worker)
  - `citizen.ramesh@swasthyagrid.demo` (Role: `CITIZEN`, Ward 7 resident)
  *(Default Demo Password for all accounts: `<Role>Password123!`, e.g. `OfficerPassword123!` or `WorkerPassword123!`)*

- **Facilities (3):**
  - Ward 7 Urban Primary Health Centre (PHC)
  - South District Community Hospital (HOSPITAL)
  - North Sector Diagnostic & Epidemiological Lab (LAB)

- **Signal Reports (10):**
  - 6 reports contributing to Cluster 1 (acute gastrointestinal / municipal water line contamination)
  - 3 reports contributing to Cluster 2 (vector-borne febrile illness post-waterlogging)
  - 1 isolated seasonal respiratory signal (monitoring)

- **Clusters (2):**
  - Ward 7 South: Acute GI signal along Municipal Tap Line B (Risk Score: 88, Priority: `CRITICAL`)
  - Ward 12 North: Febrile illness cluster near stagnant water (Risk Score: 64, Priority: `HIGH`)

- **Field Tasks (3):**
  - Dispatch for ORS distribution and water testing
  - Pipeline verification survey (verified with findings)
  - Larvicidal mosquito spraying dispatch

- **Operational Action Logs (4):**
  - Audit trail of status changes, worker dispatches, and boil-water advisory broadcasts

## Running the Seed Script

Ensure your MongoDB instance is running, or set `MONGODB_URI` in `.env`:

```bash
# From project root
npm run seed

# Or directly with Node from backend
node database/seed/seed.js
```

The script will safely clear existing collections and insert the fresh synthetic demo entities with all relationships linked.
