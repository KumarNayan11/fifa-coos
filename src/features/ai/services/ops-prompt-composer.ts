import { RecentIncidentDTO } from "@/features/dashboard/types";
import { TelemetryDashboardDto } from "@/features/telemetry/types";

export function composeOpsPrompt(
  incidents: RecentIncidentDTO[],
  telemetry: TelemetryDashboardDto | null,
): string {
  const sections: string[] = [];

  // Module 1: System Identity
  sections.push(`## System Identity
You are FIFACoOS Operations Copilot, an AI-powered decision support assistant for the stadium operations center.
Your job is to analyze real-time telemetry and incident reports to provide advisory recommendations to operations staff.`);

  // Module 2: Advisory Policy
  sections.push(`## Advisory Policy
IMPORTANT: Recommendations are advisory only. You are a decision-support tool.
- NEVER state that an action has already been taken.
- NEVER state that an action will be executed automatically.
- Frame all recommendations as suggestions for the human operator (e.g., "Consider deploying additional staff to Zone A").`);

  // Module 3: Active Incidents
  if (incidents.length > 0) {
    const incidentText = incidents
      .map((inc) => `- [${inc.severity}] ${inc.title} (Status: ${inc.status})`)
      .join("\n");
    sections.push(`## Active Incidents\n${incidentText}`);
  } else {
    sections.push(`## Active Incidents\nNo active incidents reported.`);
  }

  // Module 4: Telemetry Context
  if (telemetry) {
    sections.push(`## Telemetry Summary
- Global Crowd Density: ${telemetry.globalCrowdDensity}%
- Average Gate Throughput: ${telemetry.gateThroughput} persons/min`);

    const zoneText = telemetry.zones
      .map(
        (z) =>
          `- ${z.zoneName} (ID: ${z.zoneId}): Crowd Density ${z.crowdDensity}%, Incident Probability ${z.incidentProbability}%`,
      )
      .join("\n");
    sections.push(`## Zone Statistics\n${zoneText}`);
  } else {
    sections.push(`## Telemetry Summary\nTelemetry data is currently unavailable.`);
  }

  // Module 5: Output Schema Instructions
  sections.push(`## Output Requirements
You must respond with a structured JSON object matching the provided schema.
- "overallStatus": Choose NORMAL, WARNING, or CRITICAL.
- "priorityLevel": Choose LOW, MEDIUM, HIGH, or CRITICAL.
- "recommendedActions": Provide actionable advice based on the data.
- "reasoning": Explain why you recommend these actions.
- "confidenceScore": 0-100. Lower if data is conflicting or missing.
- "affectedZones": List relevant Zone names (e.g., North Concourse, VIP Lounge).`);

  return sections.join("\n\n");
}
