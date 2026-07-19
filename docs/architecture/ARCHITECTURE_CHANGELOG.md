# FIFACoOS - Architecture Change Log

This document permanently records the Architecture Freeze revisions resulting from the Documentation Consistency Audit.

## Approved Architectural Modifications

### 1. Fan Access to Wait Times

- **Document:** `SYSTEM_DESIGN.md`, `SECURITY.md`, `API_DESIGN.md`
- **Section:** System Design (Security Boundaries), Security (Authorization), API Design (Navigation Service)
- **Previous Design:** Fans had no defined way to access POI wait times without querying the operational telemetry database directly, which violated strict role isolation.
- **Updated Design:** The Orchestrator uses a secure service identity to fetch POI telemetry and exposes it via a sanitized `GetPOIWaitTimes` endpoint on the Navigation Service, ensuring Fans only receive safe wait-time data.
- **Reason for Change:** To fulfill the PRD requirement (concession wait times) without compromising the operational security model.
- **Impact on Other Documents:** Synchronized across System Design, Security, and API Design documents.

### 2. Telemetry Granularity

- **Document:** `DATABASE_SCHEMA.md`
- **Section:** Table Definitions (`telemetry_snapshots`)
- **Previous Design:** `telemetry_snapshots` only tracked measurements at the Zone level.
- **Updated Design:** Added a nullable `poi_id` column to `telemetry_snapshots`.
- **Reason for Change:** To support reporting queue wait times at specific Points of Interest (POI), not just general zone crowds.
- **Impact on Other Documents:** None.

### 3. Volunteer Shift Scheduling

- **Document:** `PRD.md`
- **Section:** Core Features, Core Product Interfaces
- **Previous Design:** The Volunteer Assistant included features for querying shift schedules.
- **Updated Design:** Removed references to "shift schedules". The Volunteer Assistant now focuses exclusively on FAQs and policies.
- **Reason for Change:** Shift scheduling would require a new domain service, database tables, and APIs, unnecessarily expanding the MVP scope and adding complexity.
- **Impact on Other Documents:** None.

### 4. Operations Dashboard Aggregation

- **Document:** `API_DESIGN.md`
- **Section:** Service Contracts (Operations Service)
- **Previous Design:** The Operations Service lacked endpoints for aggregating global dashboard state.
- **Updated Design:** Added `GetActiveIncidentsRequest` and `GetDashboardStateRequest` to the Operations Service.
- **Reason for Change:** To explicitly support the data requirements of the Operations Command Center dashboard.
- **Impact on Other Documents:** None.

### 5. Knowledge Retrieval Clarification

- **Document:** `AI_ARCHITECTURE.md`
- **Section:** AI Component Architecture, Future AI Evolution
- **Previous Design:** Referenced RAG and vector databases ambiguously, risking premature MVP complexity.
- **Updated Design:** Explicitly stated that MVP uses deterministic knowledge retrieval performed by the Knowledge Service using structured knowledge sources before passing context to the UIE. Vector database RAG is deferred to post-MVP.
- **Reason for Change:** To keep the MVP implementation simple and technology-independent.
- **Impact on Other Documents:** None.

### 6. Device Fingerprint Privacy

- **Document:** `SECURITY.md`
- **Section:** Identity & Authentication (User Tiers)
- **Previous Design:** Ambiguous on how device fingerprints are securely stored.
- **Updated Design:** Added the requirement that device fingerprints shall be transformed into a non-reversible cryptographic representation before storage.
- **Reason for Change:** To strengthen privacy documentation without mandating a specific cryptographic algorithm.
- **Impact on Other Documents:** None.

### 7. Terminology Standardization

- **Document:** ALL (PRD, ARCHITECTURE, SYSTEM_DESIGN, AI_ARCHITECTURE, DATABASE_SCHEMA, API_DESIGN, SECURITY, TESTING_STRATEGY)
- **Section:** Global
- **Previous Design:** Inconsistent use of terms like "AI Copilot", "Ops Command Interface", "Simulated Telemetry Service", "Domain Modules".
- **Updated Design:** Standardized to "Unified Intelligence Engine (UIE)", "Ops Command Center", "Simulated Telemetry Engine", "Domain Services".
- **Reason for Change:** To eliminate ambiguity for implementation teams.
- **Impact on Other Documents:** All documents modified to use canonical names.

### 8. Document Versioning

- **Document:** ALL
- **Section:** Document Information
- **Previous Design:** Various drafts (e.g., "1.0 (Initial Draft)", "Under Review").
- **Updated Design:** All marked as "Version 1.0", "Status: Approved (Frozen)", "Last Updated: Architecture Synchronization Review", with explicit Dependencies listed.
- **Reason for Change:** To formally freeze the design package.
- **Impact on Other Documents:** All headers synchronized.

### 9. Final Phase 7 Competition Polish & Documentation Synchronization Pass

- **Document:** ALL
- **Section:** Entire Repository Document Set
- **Previous Design:** Checklists and roadmap showed phases in progress, and test counts/demo credentials were partially aligned.
- **Updated Design:** Checked all phase checklists to "Completed", verified standard vitest count at exactly 127 passed tests, standardized setup commands, and updated credentials for Operations/Volunteer/Fan personas.
- **Reason for Change:** To finalize repository state for final PromptWars Submission, ensuring 100% alignment between implementation and code documentation.
- **Impact on Other Documents:** All roadmap entries, README.md, MANUAL_TESTING.md, and implementation logs updated.
