# SwasthyaGrid Architecture

## System Overview
**SwasthyaGrid** is an intelligent community health response and early-signal monitoring platform designed specifically for Health Department operations. It captures decentralized health signal reports from citizens and frontline health workers, clusters signals geographically and temporally, computes an explainable priority risk score, and enables rapid field verification by authorized health workers.

> **CRITICAL MEDICAL DISCLAIMER**  
> SwasthyaGrid is **NOT** a medical diagnostic system. It does not diagnose diseases or predict outcomes with clinical certainty. The platform acts strictly as an administrative and operational decision-support tool. Every alert and cluster **requires human verification** by authorized healthcare personnel before any clinical or public health action is undertaken.

---

## End-to-End Workflow Architecture

```
┌─────────────────────────────────┐
│     Citizen / Worker Report     │
│ (Symptoms, Location, Timestamp) │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│         Data Processing         │
│ (Validation, Normalization)     │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│       AI Signal Extraction      │
│  (NLP, Categorization, Weight)  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│           Risk Engine           │
│ (Density, Velocity, Vulnerability)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│        Priority Cluster         │
│ (Geo-Spatial & Temporal Groups) │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   Health Department Dashboard   │
│ (Officer Overview, Signal Trends)│
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│           Map + Alert           │
│ (Interactive Spatial Heatmaps)  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│    Health Worker Assignment     │
│ (Task Dispatched to Field Team) │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│        Field Verification       │
│ (On-ground Check, Patient Count)│
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│         Updated Status          │
│(Resolved / Monitored / Escalated)
└─────────────────────────────────┘
```

---

## Component Deep Dive

### 1. Ingestion Layer (Citizen / Worker Reports)
- **Multi-channel collection**: Responsive web portal for citizens and field-optimized mobile interface for ASHA/community health workers.
- **Signal capture**: Aggregates non-diagnostic indicators such as self-reported symptoms (e.g., fever, rash, diarrheal indicators), onset dates, approximate geographic coordinates, water source notes, and severity perception.

### 2. Processing & Normalization
- Sanitization and schema validation of payload.
- De-identification of private citizen identities to maintain strict privacy standards.
- Time-bucketing and spatial geohash discretization.

### 3. AI Signal Extraction & Pattern Recognition
- Extracts standardized symptom tokens and environmental anomaly keywords from unstructured descriptions.
- Identifies unusual surges against baseline seasonal averages for specific wards/zones.
- Produces explainable signal rationales (e.g., *"Cluster triggered due to 14 reports of acute gastrointestinal symptoms within 400m of Sector 4 water distribution point within 48 hours"*).

### 4. Risk Engine & Prioritization Score
- Computes an explainable Priority Score (0–100) based on:
  - **Cluster Velocity**: Acceleration of new reports over 24/48 hours.
  - **Symptom Severity Weight**: Criticality indicators (e.g., dehydration, high fever).
  - **Vulnerability Factors**: Proximity to dense populations, schools, or compromised water sources.
  - **Confidence Index**: Number of distinct reports and cross-reporting by frontline workers.

### 5. Health Department Dashboard & Spatial Intelligence
- Visualizes active geographic clusters on interactive Leaflet maps.
- Categorizes alerts by priority: High (Red), Elevated (Amber), and Watch (Blue).
- Provides complete transparency into *why* the score was generated (explainability view).

### 6. Human-in-the-Loop Field Verification & Resolution
- Health officers dispatch verification tasks to local health workers (e.g., ASHA / ANM staff).
- Health workers conduct on-site verification, log findings, and confirm or dismiss cluster anomalies.
- System updates status to `Verified`, `Monitoring`, `Resolved`, or `False Alarm`.

---

## Technical Stack Architecture

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Leaflet / React Leaflet, Recharts, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, CORS, dotenv, Mongoose |
| **Database** | MongoDB (GeoJSON spatial indexing, time-series bucketing) |
| **AI Layer** | LLM Signal Extraction (Gemini API) + Rule-based Deterministic Risk Scoring |
| **Tooling & CI** | Git, GitHub, npm workspaces / modular monorepo |
