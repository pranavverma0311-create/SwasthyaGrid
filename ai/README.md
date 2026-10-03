# SwasthyaGrid - AI Module

This directory contains the AI and signal processing services for SwasthyaGrid.

## Overview
SwasthyaGrid employs AI as an **early-signal extraction and decision-support tool**, strictly operating under human-in-the-loop oversight.

> **CRITICAL DISCLAIMER:**
> SwasthyaGrid is **NOT** a medical diagnostic system. The AI engine extracts signals and anomalies from aggregated community reports and provides explainable priority scoring. It does **not** diagnose medical conditions or claim disease certainty. All alerts require human verification by authorized health workers.

## Directory Structure
- `prompts/`: Versioned prompt templates for LLM signal extraction, report summarization, and query reasoning.
- `services/`: AI service clients (e.g., Gemini / LLM integrations, NLP symptom tokenization, anomaly detection helpers).

## Planned Implementation (Phases 8 & 10)
- **Phase 8:** AI Signal Extraction — Normalizes unstructured citizen feedback and extracts symptom mentions, geographic tags, and temporal markers.
- **Phase 10:** AI Health Assistant — Conversational interface for health officers and workers to query cluster trends and draft situational summaries.
