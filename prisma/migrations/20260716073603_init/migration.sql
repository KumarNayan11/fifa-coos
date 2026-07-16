-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('fan', 'volunteer', 'security', 'ops_manager', 'admin');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('reported', 'verified', 'assigned', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "NavigationRequestStatus" AS ENUM ('created', 'calculated', 'presented', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('generated', 'validated', 'presented', 'accepted', 'dismissed', 'expired');

-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('en', 'es', 'fr', 'hi');

-- CreateEnum
CREATE TYPE "AccessibilityRequirement" AS ENUM ('none', 'wheelchair', 'low_vision', 'deaf');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'fan',
    "full_name" TEXT,
    "preferred_language" "LanguageCode" NOT NULL DEFAULT 'en',
    "accessibility_profile" "AccessibilityRequirement"[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "device_fingerprint" TEXT,
    "active_language" "LanguageCode" NOT NULL DEFAULT 'en',
    "last_known_location" JSONB,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zones" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "polygon_coordinates" JSONB NOT NULL,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pois" (
    "id" UUID NOT NULL,
    "zone_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_accessible" BOOLEAN NOT NULL DEFAULT false,
    "coordinates" JSONB NOT NULL,

    CONSTRAINT "pois_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'reported',
    "severity" "Severity" NOT NULL,
    "zone_id" UUID NOT NULL,
    "poi_id" UUID,
    "reported_by_session" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMPTZ,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_assignments" (
    "id" UUID NOT NULL,
    "incident_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "released_at" TIMESTAMPTZ,

    CONSTRAINT "incident_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetry_snapshots" (
    "id" UUID NOT NULL,
    "zone_id" UUID NOT NULL,
    "poi_id" UUID,
    "metric_type" TEXT NOT NULL,
    "metric_value" DECIMAL(65,30) NOT NULL,
    "raw_payload" JSONB,
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telemetry_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "messages" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_requests" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "origin_poi_id" UUID,
    "destination_poi_id" UUID,
    "requires_accessibility" BOOLEAN NOT NULL DEFAULT false,
    "status" "NavigationRequestStatus" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "navigation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" UUID NOT NULL,
    "incident_id" UUID,
    "zone_id" UUID,
    "suggested_action" TEXT NOT NULL,
    "reasoning_metadata" JSONB NOT NULL,
    "confidence_score" INTEGER NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'generated',
    "reviewed_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_articles" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content_markdown" TEXT NOT NULL,
    "applicable_roles" "UserRole"[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "incidents_status_idx" ON "incidents"("status");

-- CreateIndex
CREATE INDEX "incidents_severity_idx" ON "incidents"("severity");

-- CreateIndex
CREATE INDEX "telemetry_snapshots_recorded_at_idx" ON "telemetry_snapshots"("recorded_at");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pois" ADD CONSTRAINT "pois_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_poi_id_fkey" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_reported_by_session_fkey" FOREIGN KEY ("reported_by_session") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_assignments" ADD CONSTRAINT "incident_assignments_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_assignments" ADD CONSTRAINT "incident_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemetry_snapshots" ADD CONSTRAINT "telemetry_snapshots_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemetry_snapshots" ADD CONSTRAINT "telemetry_snapshots_poi_id_fkey" FOREIGN KEY ("poi_id") REFERENCES "pois"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_requests" ADD CONSTRAINT "navigation_requests_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_requests" ADD CONSTRAINT "navigation_requests_origin_poi_id_fkey" FOREIGN KEY ("origin_poi_id") REFERENCES "pois"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_requests" ADD CONSTRAINT "navigation_requests_destination_poi_id_fkey" FOREIGN KEY ("destination_poi_id") REFERENCES "pois"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
