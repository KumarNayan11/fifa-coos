import { PrismaTelemetryProvider } from "../providers/prisma-telemetry.provider";
import { TelemetryProvider, TelemetryDashboardDto } from "../types";

export class TelemetryService {
  private static provider: TelemetryProvider = new PrismaTelemetryProvider();

  /**
   * Retrieves the latest telemetry dashboard summary.
   * Handles errors gracefully according to the Developer Guide.
   */
  static async getDashboardTelemetry(): Promise<TelemetryDashboardDto | null> {
    try {
      return await this.provider.getLatestTelemetry();
    } catch (error) {
      console.error("[TelemetryService] Error fetching telemetry:", error);
      // In a real app we might distinguish between DB errors, Provider errors, etc.
      // We log it and return null, which the UI will handle as "No telemetry available"
      // or "Service unavailable".
      throw new Error("Failed to retrieve dashboard telemetry");
    }
  }
}
