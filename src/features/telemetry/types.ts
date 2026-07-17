export enum TelemetryMetricType {
  CROWD_DENSITY = "CROWD_DENSITY",
  WAIT_TIME = "WAIT_TIME",
  THROUGHPUT = "THROUGHPUT",
  INCIDENT_PROBABILITY = "INCIDENT_PROBABILITY",
}

export interface TelemetryTrendDto {
  value: number;
  label: string;
  isPositive: boolean;
}

export interface ZoneTelemetryDto {
  zoneId: string;
  zoneName: string;
  crowdDensity: number;
  incidentProbability: number;
  trend?: TelemetryTrendDto;
}

export interface PoiTelemetryDto {
  poiId: string;
  poiName: string;
  zoneId: string;
  type: string;
  waitTime: number;
  throughput: number;
}

export interface TelemetryDashboardDto {
  globalCrowdDensity: number;
  globalDensityTrend: TelemetryTrendDto;
  averageWaitTime: number;
  waitTimeTrend: TelemetryTrendDto;
  gateThroughput: number;
  throughputTrend: TelemetryTrendDto;
  zones: ZoneTelemetryDto[];
  pois: PoiTelemetryDto[];
}

export interface TelemetryProvider {
  getLatestTelemetry(): Promise<TelemetryDashboardDto | null>;
}
