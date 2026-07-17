"use server";

import { requireOps } from "@/lib/auth";
import { IncidentService } from "./services/incident.service";

export async function createIncident(data: unknown) {
  await requireOps();
  try {
    const incident = await IncidentService.createIncident(data);
    return { success: true, data: incident };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateIncident(data: unknown) {
  await requireOps();
  try {
    const incident = await IncidentService.updateIncident(data);
    return { success: true, data: incident };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function assignIncident(data: unknown) {
  await requireOps();
  try {
    const incident = await IncidentService.assignIncident(data);
    return { success: true, data: incident };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function resolveIncident(data: unknown) {
  await requireOps();
  try {
    const incident = await IncidentService.resolveIncident(data);
    return { success: true, data: incident };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function closeIncident(id: string) {
  await requireOps();
  try {
    const incident = await IncidentService.closeIncident(id);
    return { success: true, data: incident };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function listIncidents() {
  await requireOps();
  try {
    const incidents = await IncidentService.listIncidents();
    return { success: true, data: incidents };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getIncident(id: string) {
  await requireOps();
  try {
    const incident = await IncidentService.getIncident(id);
    return { success: true, data: incident };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getZones() {
  await requireOps();
  try {
    const { prisma } = await import("@/lib/prisma");
    const zones = await prisma.zone.findMany();
    return { success: true, data: zones };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getUsers() {
  await requireOps();
  try {
    const { prisma } = await import("@/lib/prisma");
    const users = await prisma.user.findMany({
      where: { role: { in: ["admin", "security", "volunteer"] } },
    });
    return { success: true, data: users };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
