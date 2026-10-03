# SwasthyaGrid - Hackathon Demo Flow Walkthrough

This document outlines the step-by-step narrative and user journey for presenting SwasthyaGrid during demonstrations and hackathon evaluations.

---

## The Problem Narrative
In developing regions and urban settlements, disease outbreaks (cholera, dengue, gastroenteritis, viral fevers) often spread for 7–14 days before formal hospital surveillance notices them. Frontline citizens and community workers notice localized symptoms first. Without an intelligent signal aggregation platform, these vital early signals remain trapped in silos.

---

## 10-Step Hackathon Demo Walkthrough

### Step 1: Citizen Submits Health Report
- **Actor:** Citizen / Local Resident
- **Screen:** `/report` (Citizen Report Portal)
- **Action:**
  - Citizen opens the lightweight mobile-friendly report form.
  - Selects symptoms: *High Fever, Vomiting, Stomach Cramps*.
  - Mentions notes: *"Water from the lane 4 municipal pipe has looked brownish since yesterday morning. Three neighbors are also feeling sick."*
  - Automatically captures GPS location (or manually picks Ward 7, Sector 3).
  - Clicks **Submit Report**.
- **Outcome:** Immediate feedback acknowledging submission with a reference token.

### Step 2: Multiple Reports Stream into the System
- **Actor:** Background Simulator / Crowd Signals
- **Action:**
  - 8 additional reports from the same 500-meter radius arrive within a 24-hour timeframe.
  - A local ASHA / community health worker also submits an on-ground field signal reporting an unusual spike in oral rehydration salt (ORS) requests.

### Step 3: Spatial & Temporal Cluster Detection
- **Actor:** SwasthyaGrid Core Engine (Backend)
- **Action:**
  - The clustering algorithm identifies a high concentration of overlapping gastrointestinal symptom reports in Ward 7.
  - Time-series baseline comparison indicates a **340% surge** above standard baseline seasonal signal levels for this sector.

### Step 4: Explainable Risk / Priority Score Calculation
- **Actor:** Risk Engine
- **Action:**
  - The system computes an explainable **Priority Score of 88/100 (Tier: High Alert)**.
  - Scoring factors are transparently weighted:
    - Signal Velocity: +35 (rapid acceleration in <36 hours)
    - Symptom Severity Profile: +25 (dehydration risk factors)
    - Environmental Indicator: +20 (shared water supply mentions)
    - Field Worker Signal Corroboration: +8

### Step 5: Cluster Appears on Interactive Health Map
- **Actor:** Health Department Officer
- **Screen:** `/map` and `/dashboard`
- **Action:**
  - The Health Officer logs in and views the interactive GIS Map.
  - A pulsating Amber/Red cluster bubble appears over Ward 7, Sector 3.
  - The cluster card indicates: **"High Priority Signal: 9 reports within 450m"**.

### Step 6: Officer Opens Alert Details
- **Actor:** Health Officer
- **Screen:** `/alerts/:id`
- **Action:**
  - Officer clicks on the cluster pin.
  - Inspects the timeline of incoming reports, geographic boundary, and predominant symptom distribution charts.

### Step 7: AI Explains Why it is High Priority
- **Actor:** SwasthyaGrid AI Assistant
- **Screen:** Alert Explainability Card
- **Action:**
  - System presents natural language synthesis:
    > *"Notice: 9 reports within a 450m radius of Sector 3 over the last 36 hours show acute gastrointestinal distress. 6 of 9 reports explicitly reference turbid tap water. Surge velocity is 3.4x above ward baseline. Immediate water testing and field survey recommended."*
  - **Disclaimer Displayed:** *"Decision-support signal only. Not a medical diagnosis. Field verification required."*

### Step 8: Officer Assigns Health Worker
- **Actor:** Health Officer
- **Screen:** Task Dispatch Modal
- **Action:**
  - Officer clicks **"Dispatch Field Verification"**.
  - Selects local ASHA worker assigned to Ward 7 (e.g., *Worker Sunita Devi*).
  - Attaches automated verification checklist (check water supply, verify household symptoms, dispense ORS packets).

### Step 9: Health Worker Conducts Field Verification
- **Actor:** Community Health Worker (Worker Sunita Devi)
- **Screen:** `/tasks` (Worker Task Portal)
- **Action:**
  - Health worker receives the task on their mobile interface.
  - Visits the lane, confirms 7 families have mild dehydration, notes broken municipal pipeline joint.
  - Logs verification:
    - Confirmed cases: 11 individuals
    - Water pipe contamination found: Yes
    - Initial supplies distributed: ORS & Chlorine tablets
  - Submits on-ground verification report.

### Step 10: Alert Status Updated & Loop Closed
- **Actor:** Health Department System
- **Screen:** `/dashboard`
- **Action:**
  - Cluster status changes from `DETECTED` → `FIELD_VERIFIED`.
  - Municipal water engineering department is auto-notified to isolate pipeline leak.
  - Health Officer dashboard reflects the prompt containment, preventing a widespread cholera or gastroenteritis outbreak.
