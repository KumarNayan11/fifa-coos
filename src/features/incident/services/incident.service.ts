import { prisma } from "@/lib/prisma";
import { IncidentStatus, Severity, Incident } from "@prisma/client";
import {
  createIncidentSchema,
  updateIncidentSchema,
  assignIncidentSchema,
  resolveIncidentSchema,
} from "../schemas";

export class IncidentService {
  static async createIncident(data: unknown): Promise<Incident> {
    const validatedData = createIncidentSchema.parse(data);

    return prisma.incident.create({
      data: {
        ...validatedData,
        status: IncidentStatus.reported,
      },
    });
  }

  static async updateIncident(data: unknown): Promise<Incident> {
    const { id, ...validatedData } = updateIncidentSchema.parse(data);

    // Cannot update a closed incident
    const existing = await prisma.incident.findUniqueOrThrow({ where: { id } });
    if (existing.status === IncidentStatus.closed) {
      throw new Error("Cannot update a closed incident.");
    }

    return prisma.incident.update({
      where: { id },
      data: validatedData,
    });
  }

  static async assignIncident(data: unknown): Promise<Incident> {
    const { incident_id, user_id } = assignIncidentSchema.parse(data);

    const incident = await prisma.incident.findUniqueOrThrow({ where: { id: incident_id } });

    if (incident.status === IncidentStatus.closed || incident.status === IncidentStatus.resolved) {
      throw new Error("Cannot assign a resolved or closed incident.");
    }

    // Wrap in transaction to create assignment and update status
    return prisma.$transaction(async (tx) => {
      await tx.incidentAssignment.create({
        data: {
          incident_id,
          user_id,
        },
      });

      return tx.incident.update({
        where: { id: incident_id },
        data: {
          status: IncidentStatus.assigned,
        },
      });
    });
  }

  static async resolveIncident(data: unknown): Promise<Incident> {
    const { incident_id, resolution_notes } = resolveIncidentSchema.parse(data);

    const incident = await prisma.incident.findUniqueOrThrow({
      where: { id: incident_id },
      include: { assignments: true },
    });

    if (incident.status === IncidentStatus.resolved || incident.status === IncidentStatus.closed) {
      throw new Error("Incident is already resolved or closed.");
    }

    if (incident.status !== IncidentStatus.assigned && incident.assignments.length === 0) {
      throw new Error("Cannot resolve an unassigned incident.");
    }

    let updatedDescription = incident.description;
    if (resolution_notes) {
      updatedDescription += `\n\nResolution Notes: ${resolution_notes}`;
    }

    return prisma.incident.update({
      where: { id: incident_id },
      data: {
        status: IncidentStatus.resolved,
        description: updatedDescription,
      },
    });
  }

  static async closeIncident(incidentId: string): Promise<Incident> {
    const incident = await prisma.incident.findUniqueOrThrow({ where: { id: incidentId } });

    if (incident.status !== IncidentStatus.resolved) {
      throw new Error("Only resolved incidents can be closed.");
    }

    return prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: IncidentStatus.closed,
        closed_at: new Date(),
      },
    });
  }

  static async listIncidents() {
    return prisma.incident.findMany({
      orderBy: { created_at: "desc" },
      include: {
        zone: true,
        assignments: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  static async getIncident(id: string) {
    return prisma.incident.findUniqueOrThrow({
      where: { id },
      include: {
        zone: true,
        assignments: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
