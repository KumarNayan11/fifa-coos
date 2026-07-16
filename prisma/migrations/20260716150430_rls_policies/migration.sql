-- FIFACoOS Row-Level Security (RLS) Policies
-- Enables RLS and applies access policies based on the architecture.
-- Reference: SECURITY.md and DATABASE_SCHEMA.md

-- 1. Enable RLS on all application tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pois" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "incidents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "incident_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "telemetry_snapshots" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "navigation_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recommendations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "knowledge_articles" ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- users (Authenticated user data / Administrative data)
-- ==============================================================================
CREATE POLICY "users_read_own" ON "users" FOR SELECT
USING (id = auth.uid());

CREATE POLICY "users_read_ops" ON "users" FOR SELECT
USING (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security', 'admin'));

CREATE POLICY "users_write_admin" ON "users" FOR ALL
USING (current_setting('request.jwt.claims', true)::json->>'role' = 'admin');

-- ==============================================================================
-- zones (Public Reference Data)
-- ==============================================================================
CREATE POLICY "zones_read_all" ON "zones" FOR SELECT
USING (true);

CREATE POLICY "zones_write_admin" ON "zones" FOR ALL
USING (current_setting('request.jwt.claims', true)::json->>'role' = 'admin');

-- ==============================================================================
-- pois (Public Reference Data)
-- ==============================================================================
CREATE POLICY "pois_read_all" ON "pois" FOR SELECT
USING (true);

CREATE POLICY "pois_write_admin" ON "pois" FOR ALL
USING (current_setting('request.jwt.claims', true)::json->>'role' = 'admin');

-- ==============================================================================
-- knowledge_articles (Protected Reference data)
-- ==============================================================================
CREATE POLICY "knowledge_articles_read" ON "knowledge_articles" FOR SELECT
USING (
  (current_setting('request.jwt.claims', true)::json->>'role')::text = ANY(SELECT unnest(applicable_roles)::text)
  OR current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
);

CREATE POLICY "knowledge_articles_write_admin" ON "knowledge_articles" FOR ALL
USING (current_setting('request.jwt.claims', true)::json->>'role' = 'admin');

-- ==============================================================================
-- incidents (Operational data)
-- ==============================================================================
CREATE POLICY "incidents_read_ops" ON "incidents" FOR SELECT
USING (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security', 'admin'));

CREATE POLICY "incidents_insert_ops_vol" ON "incidents" FOR INSERT
WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security', 'volunteer'));

CREATE POLICY "incidents_update_ops" ON "incidents" FOR UPDATE
USING (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security'));

CREATE POLICY "incidents_delete_ops" ON "incidents" FOR DELETE
USING (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security'));

-- ==============================================================================
-- incident_assignments (Operational data)
-- ==============================================================================
CREATE POLICY "incident_assignments_read_ops" ON "incident_assignments" FOR SELECT
USING (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security', 'admin'));

CREATE POLICY "incident_assignments_write_ops" ON "incident_assignments" FOR ALL
USING (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security'));

-- ==============================================================================
-- telemetry_snapshots (Operational data)
-- ==============================================================================
CREATE POLICY "telemetry_snapshots_read_ops" ON "telemetry_snapshots" FOR SELECT
USING (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security', 'admin'));

-- ==============================================================================
-- recommendations (Operational data)
-- ==============================================================================
CREATE POLICY "recommendations_read_ops" ON "recommendations" FOR SELECT
USING (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security', 'admin'));

CREATE POLICY "recommendations_write_ops" ON "recommendations" FOR ALL
USING (current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security'));

-- ==============================================================================
-- sessions (Authenticated user data / Ephemeral fan data)
-- ==============================================================================
CREATE POLICY "sessions_owner" ON "sessions" FOR ALL
USING (
  user_id = auth.uid() OR id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
);

CREATE POLICY "sessions_read_staff" ON "sessions" FOR SELECT
USING (
  current_setting('request.jwt.claims', true)::json->>'role' IN ('ops_manager', 'security', 'admin')
  AND user_id IS NOT NULL
);

-- ==============================================================================
-- conversations (Authenticated user data)
-- ==============================================================================
CREATE POLICY "conversations_owner" ON "conversations" FOR ALL
USING (
  session_id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
  OR session_id IN (SELECT id FROM "sessions" WHERE user_id = auth.uid())
);

-- ==============================================================================
-- navigation_requests (Authenticated user data)
-- ==============================================================================
CREATE POLICY "navigation_requests_owner" ON "navigation_requests" FOR ALL
USING (
  session_id::text = current_setting('request.jwt.claims', true)::json->>'session_id'
  OR session_id IN (SELECT id FROM "sessions" WHERE user_id = auth.uid())
);
