import { z } from "zod";
import { Severity } from "@prisma/client";

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
const permissiveUuid = z.string().regex(uuidRegex, "Invalid UUID format");

export const createIncidentSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(5000),
  severity: z.nativeEnum(Severity),
  zone_id: permissiveUuid,
  poi_id: permissiveUuid.optional(),
});

export const updateIncidentSchema = z.object({
  id: permissiveUuid,
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(5000).optional(),
  severity: z.nativeEnum(Severity).optional(),
  zone_id: permissiveUuid.optional(),
  poi_id: permissiveUuid.optional(),
});

export const assignIncidentSchema = z.object({
  incident_id: permissiveUuid,
  user_id: permissiveUuid,
});

export const resolveIncidentSchema = z.object({
  incident_id: permissiveUuid,
  resolution_notes: z.string().min(5).max(5000).optional(), // Can be used to append to description if needed
});
