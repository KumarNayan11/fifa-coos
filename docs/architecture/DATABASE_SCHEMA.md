# FIFACoOS - Database Schema Design

## 1. Document Information
- **Version:** 1.0
- **Status:** Approved (Frozen)
- **Author:** Principal Data Architecture Team
- **Last Updated:** Architecture Synchronization Review
- **Depends On:** SYSTEM_DESIGN.md
- **Supersedes:** None

## 2. Purpose
This document translates the conceptual Domain Model into a concrete logical relational database blueprint. It serves as the authoritative guide for generating subsequent SQL migrations, ORM models, and API contracts. Note: Detailed technology choices (e.g., specific RDBMS, indexing types) are deferred to the Technology Decisions document.

## 3. Relationship to Previous Documents
- **DOMAIN_MODEL.md:** Defined the abstract business entities. This document maps those entities to physical database tables, defining columns, types, and constraints.
- **SYSTEM_DESIGN.md:** Dictated stateless application tiers, implying the database must handle all state, including robust Row Level Security (RLS) to enforce boundaries.
- **PRD:** Outlines the access models (Anonymous Fans vs. Authenticated Staff) which directly informs the RLS strategy in this document.

## 4. Database Design Philosophy
- **Relational Model:** Chosen for strict ACID compliance, robust foreign key constraints, and JSON support, ensuring data integrity for critical operations while allowing flexibility for AI payloads.
- **Authentication & Security:** The schema anticipates integration with an external identity provider (mapped to the `users` table) and relies on Row Level Security (RLS) concepts for multi-tenant data isolation at the database layer.
- **Identifiers (UUIDs):** `uuid` (UUIDv4) is used for all primary keys. This prevents enumeration attacks (critical for anonymous fan sessions) and simplifies distributed data generation.
- **Timestamps & Auditability:** Every table includes `created_at` and `updated_at`. Operational tables use `created_by`. Soft deletes (`deleted_at`) are preferred for historical accuracy.
- **Normalization Strategy:** Designed for 3rd Normal Form (3NF) to avoid anomalies. However, deliberate denormalization using document/JSON columns is applied to high-velocity telemetry data and flexible AI reasoning metadata to avoid excessive joins.
- **Append-Only History:** Entities like `telemetry_snapshots` and incident updates are append-only to maintain a perfect audit trail of stadium conditions.

## 5. Enumerations
Custom ENUM types ensure data consistency at the database level.

- **`user_role`**: `fan`, `volunteer`, `security`, `ops_manager`, `admin`. Ensures strict RBAC mapping.
- **`incident_status`**: `reported`, `verified`, `assigned`, `resolved`, `closed`. Maps the incident lifecycle.
- **`severity`**: `low`, `medium`, `high`, `critical`. Determines SLA and routing.
- **`navigation_request_status`**: `created`, `calculated`, `presented`, `completed`, `archived`. Tracks wayfinding funnel.
- **`recommendation_status`**: `generated`, `validated`, `presented`, `accepted`, `dismissed`, `expired`. AI lifecycle tracking.
- **`language_code`**: `en`, `es`, `fr`, `hi`. Supported MVP locales.
- **`accessibility_requirement`**: `none`, `wheelchair`, `low_vision`, `deaf`. Influences routing algorithms.

## 6. Entity to Table Mapping

| Domain Entity | Physical Table | Ownership | Update Freq | Access Pattern |
|---|---|---|---|---|
| User | `users` | Identity | Low | High Read (Auth) |
| Session | `sessions` | Identity | High (creation) | High Read (Context) |
| Zone / Sector | `zones` | Navigation | Static | High Read |
| POI | `pois` | Navigation | Static | High Read |
| Incident | `incidents` | Operations | Medium | Read/Write (Ops) |
| Assignment | `incident_assignments` | Operations | Medium | Write (Ops) |
| Telemetry Snapshot | `telemetry_snapshots` | Operations | Very High | Append-only / Read latest |
| Conversation | `conversations` | Intelligence | High | Append-only (Chat) |
| Navigation Request | `navigation_requests`| Navigation | High | Insert / Update |
| Recommendation | `recommendations` | Intelligence | Medium | Insert / Update |
| Knowledge Article| `knowledge_articles` | Policy | Very Low | High Read |

## 7. Table Definitions

### `users`
- **Purpose:** Represents authenticated staff and persistent profiles. Integrates with an external identity provider.
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `role` (`user_role`, required, default: `fan`)
  - `full_name` (text, nullable)
  - `preferred_language` (`language_code`, required, default: `en`)
  - `accessibility_profile` (`accessibility_requirement`[], nullable) - Array of needs.
  - `created_at` (timestamptz, required, default: now())
  - `updated_at` (timestamptz, required, default: now())

### `sessions`
- **Purpose:** Tracks temporary anonymous fan sessions or active staff logins.
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `user_id` (uuid, nullable, FK to `users.id`) - Null for anonymous fans.
  - `device_fingerprint` (text, nullable) - For anonymous session continuity.
  - `active_language` (`language_code`, required, default: `en`)
  - `last_known_location` (json, nullable) - {lat, lng, zone_id}
  - `expires_at` (timestamptz, required)
  - `created_at` (timestamptz, required, default: now())

### `zones`
- **Purpose:** Represents stadium sectors (e.g., "North Concourse").
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `name` (text, required)
  - `description` (text, nullable)
  - `capacity` (integer, required)
  - `polygon_coordinates` (json, required) - GeoJSON representation for UI mapping.

### `pois`
- **Purpose:** Points of Interest (Gates, Concessions, Restrooms).
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `zone_id` (uuid, required, FK to `zones.id`)
  - `name` (text, required)
  - `type` (text, required) - e.g., 'restroom', 'food'
  - `is_accessible` (boolean, required, default: false)
  - `coordinates` (json, required) - {lat, lng}

### `incidents`
- **Purpose:** Tracks operational anomalies.
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `title` (text, required)
  - `description` (text, required)
  - `status` (`incident_status`, required, default: `reported`)
  - `severity` (`severity`, required)
  - `zone_id` (uuid, required, FK to `zones.id`)
  - `poi_id` (uuid, nullable, FK to `pois.id`)
  - `reported_by_session` (uuid, nullable, FK to `sessions.id`)
  - `created_at` (timestamptz, required, default: now())
  - `updated_at` (timestamptz, required, default: now())
  - `closed_at` (timestamptz, nullable)

### `incident_assignments`
- **Purpose:** Maps staff (`users`) to `incidents`.
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `incident_id` (uuid, required, FK to `incidents.id`)
  - `user_id` (uuid, required, FK to `users.id`)
  - `assigned_at` (timestamptz, required, default: now())
  - `released_at` (timestamptz, nullable)

### `telemetry_snapshots`
- **Purpose:** Immutable append-only log of stadium sensor data.
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `zone_id` (uuid, required, FK to `zones.id`)
  - `poi_id` (uuid, nullable, FK to `pois.id`)
  - `metric_type` (text, required) - e.g., 'crowd_density', 'queue_time'
  - `metric_value` (numeric, required)
  - `raw_payload` (json, nullable) - Original sensor payload for debugging.
  - `recorded_at` (timestamptz, required, default: now())

### `conversations`
- **Purpose:** Stores chat histories between users and the Unified Intelligence Engine (UIE).
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `session_id` (uuid, required, FK to `sessions.id`)
  - `messages` (json, required) - Array of {role: 'user'|'assistant', content: text, timestamp}
  - `created_at` (timestamptz, required, default: now())
  - `updated_at` (timestamptz, required, default: now())

### `navigation_requests`
- **Purpose:** Tracks fan routing requests for analytics and AI context.
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `session_id` (uuid, required, FK to `sessions.id`)
  - `origin_poi_id` (uuid, nullable, FK to `pois.id`)
  - `destination_poi_id` (uuid, required, FK to `pois.id`)
  - `requires_accessibility` (boolean, required, default: false)
  - `status` (`navigation_request_status`, required)
  - `created_at` (timestamptz, required, default: now())

### `recommendations`
- **Purpose:** Stores AI-generated operational suggestions.
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `incident_id` (uuid, nullable, FK to `incidents.id`)
  - `zone_id` (uuid, nullable, FK to `zones.id`)
  - `suggested_action` (text, required)
  - `reasoning_metadata` (json, required) - Explanation of AI decision.
  - `confidence_score` (integer, required) - 0 to 100.
  - `status` (`recommendation_status`, required, default: `generated`)
  - `reviewed_by` (uuid, nullable, FK to `users.id`)
  - `created_at` (timestamptz, required, default: now())
  - `updated_at` (timestamptz, required, default: now())

### `knowledge_articles`
- **Purpose:** SOPs, FAQs, and Policies for RAG ingestion.
- **Primary Key:** `id` (uuid)
- **Columns:**
  - `id` (uuid, PK)
  - `title` (text, required)
  - `content_markdown` (text, required)
  - `applicable_roles` (`user_role`[], required) - Who is allowed to see this.
  - `created_at` (timestamptz, required, default: now())
  - `updated_at` (timestamptz, required, default: now())

## 8. Relationships
- **One-to-Many:**
  - `zones` (1) to `pois` (Many). Cascade delete not allowed (restrict).
  - `zones` (1) to `incidents` (Many).
  - `sessions` (1) to `conversations` (Many). Cascade delete on session expiration.
  - `incidents` (1) to `recommendations` (Many).
- **Many-to-Many:**
  - `users` to `incidents` via `incident_assignments`.
- **Orphan Handling:** If a POI is deleted, navigation requests pointing to it should nullify `destination_poi_id` rather than cascade delete, preserving analytical history.

## 9. Indexing Strategy
- **Primary Keys:** Automatically indexed.
- **Foreign Keys:** Standard indexes (e.g., B-Tree) on all FK columns (`zone_id`, `session_id`, `incident_id`) to prevent table scans during joins.
- **Time-Series Data:** Specialized time-series indexing (e.g., Block Range Index) on `telemetry_snapshots.recorded_at` for massive space savings and fast time-range queries on append-only data.
- **Filtering Columns:** Standard indexes on `incidents.status` and `incidents.severity` as Ops dashboards frequently filter by these.
- **Document Search:** Inverted index (e.g., GIN) on `conversations.messages` if full-text search within chats is required (deferred for MVP unless performance demands it).

## 10. Row Level Security (RLS)
Conceptually designed to leverage database Row Level Security (RLS) policies:

- **`users`**:
  - Read: Authenticated user can read own profile. Ops/Admin can read all.
  - Write: Admin only.
- **`incidents` & `incident_assignments`**:
  - Read: Ops Manager, Security, Admin. (Strictly hidden from Fans/Volunteers).
  - Write/Update: Ops Manager, Security.
- **`telemetry_snapshots`**:
  - Read: Ops Manager, Security, Admin.
  - `Write`: Service Role only (Simulated Telemetry Engine bypasses RLS).
- **`zones` & `pois`**:
  - Read: Public (Anonymous & Authenticated).
  - Write/Update: Admin only.
- **`sessions` & `conversations`**:
  - Read: Session owner (via device_fingerprint or auth token).
  - Write: Session owner.
- **`knowledge_articles`**:
  - Read: Based on `applicable_roles` array matching the user's JWT role claim.
  - Write: Admin only.

## 11. Auditing
- **Timestamps:** Standard `created_at` and `updated_at` (managed via database triggers or application logic) exist on all mutable tables.
- **Soft Deletes:** Not explicitly modeled with `deleted_at` to save MVP complexity, except where operational history is paramount. Closed incidents are simply marked `status = 'closed'`, never deleted.
- **AI Traceability:** The `recommendations` table inherently audits AI behavior. `reasoning_metadata` captures the exact context provided to the LLM, and `reviewed_by` logs which human accepted the AI's advice.

## 12. AI Data Storage
- **Persisted:** `recommendations` (including confidence and reasoning) are saved permanently for operational audits. `conversations` are saved to maintain context during an active session.
- **Not Persisted (Ephemeral):** The raw, massive string prompts sent to the LLM are NOT stored in the primary database (they belong in application logs) to prevent database bloat.
- **JSON Usage:** `reasoning_metadata` uses JSON columns to accommodate varying explanation structures from different LLM models without schema migrations.

## 13. Data Retention
- **Temporary Sessions:** Anonymous fan `sessions` and associated `conversations` should be purged via a scheduled job 24 hours after `expires_at`.
- **Operational Data:** `incidents`, `recommendations`, and `telemetry_snapshots` are retained indefinitely for post-tournament analysis.
- **Knowledge Base:** Static, retained indefinitely.

## 14. Performance
- **Read-Heavy vs Write-Heavy:** `pois` and `zones` are heavily read and rarely updated, making them perfect candidates for application-level caching to relieve the primary database.
- **Partitioning:** If telemetry volume scales to millions of rows per match, `telemetry_snapshots` should be partitioned by range on `recorded_at` (e.g., daily partitions). Deferred for MVP.
- **Connection Pooling:** A robust connection pooler is required to handle thousands of concurrent read requests from Fan mobile apps.

## 15. Database Risks
- **Storage Growth:** `telemetry_snapshots` will grow extremely fast. Mitigation: Aggregation jobs summarizing per-minute data into hourly averages post-match.
- **JSON Overuse:** Using JSON for `conversations.messages` prevents easy querying of individual messages. Mitigation: Acceptable trade-off since individual message querying isn't a PRD requirement; whole conversation retrieval is.
- **RLS Overhead:** Complex RLS policies on large tables (like `incidents`) can degrade performance. Mitigation: Keep RLS policies simple, relying on token claims rather than subqueries.

## 16. Consistency Review
- **PRD:** Fully supports anonymous fans (via `sessions`) vs authenticated staff (via `users`), fulfilling the MVP access model.
- **Architecture:** Supports the stateless application tier by moving session tracking and RBAC enforcement to the database layer.
- **System Design:** `telemetry_snapshots` table perfectly matches the append-only Simulated Telemetry Engine requirement.
- **AI Architecture:** AI recommendations are stored with `confidence_score` and `reasoning_metadata`, satisfying the "Explainable AI" and validation requirements.
- **Domain Model:** 1:1 conceptual mapping of all identified Aggregates and Entities into physical tables.

## 17. Executive Summary
- **Database Philosophy:** A relational database-first design leveraging robust Authentication, RLS, and JSON support to enforce strict security boundaries at the data layer, treating AI outputs as auditable, non-authoritative records.
- **Core Tables:** `sessions` (Fan context), `users` (Staff IAM), `incidents` (Ops reality), `telemetry_snapshots` (Simulated sensors), and `recommendations` (AI outputs).
- **Major Relationships:** The schema centers around `zones` (physical geography) and `sessions` (user interaction windows), securely bridging them via AI `conversations` and Ops `incidents`.
- **RLS Strategy:** Strict isolation. Fans access read-only routing data; Staff access restricted operational mutations. Enforced natively via database row-level policies.
- **Future Scalability:** Designed for 3NF normalization to start, with identified paths for time-series indexing and table partitioning (`telemetry_snapshots`) when scaling to tournament-level data volumes.
