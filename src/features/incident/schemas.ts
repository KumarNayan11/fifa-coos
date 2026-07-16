import { z } from "zod";
import { IncidentStatus, Severity } from "@prisma/client";

export const createIncidentSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(5000),
  severity: z.nativeEnum(Severity),
  zone_id: z.string().uuid(),
  poi_id: z.string().uuid().optional(),
});

export const updateIncidentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(5000).optional(),
  severity: z.nativeEnum(Severity).optional(),
  zone_id: z.string().uuid().optional(),
  poi_id: z.string().uuid().optional(),
});

export const assignIncidentSchema = z.object({
  incident_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

export const resolveIncidentSchema = z.object({
  incident_id: z.string().uuid(),
  resolution_notes: z.string().min(5).max(5000).optional(), // Can be used to append to description if needed
});
