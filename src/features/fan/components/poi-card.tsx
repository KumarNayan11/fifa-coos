/**
 * FIFACoOS — POI Card Component
 *
 * Displays Point of Interest information (name, type, zone, accessibility).
 * Reusable in chat responses or standalone directories.
 */

import { MapPin, Accessibility, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getZoneById } from "../data/stadium";
import type { POI } from "../types/fan.types";
import { WaitTimeBadge } from "./wait-time-badge";

export interface POICardProps {
  poi: POI;
  /** Optional wait time to display */
  waitTimeMinutes?: number;
}

export function POICard({ poi, waitTimeMinutes }: POICardProps) {
  const zone = getZoneById(poi.zoneId);

  return (
    <Card className="w-full max-w-sm overflow-hidden text-left">
      <CardHeader className="bg-muted/30 pb-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{poi.name}</CardTitle>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" aria-hidden="true" />
              {zone?.name ?? poi.zoneId}
            </div>
          </div>
          {poi.isAccessible && (
            <div
              className="rounded-full bg-primary/10 p-1.5 text-primary"
              title="Accessible Facility"
              aria-label="Accessible Facility"
            >
              <Accessibility className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-3 pb-4">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {poi.type.replace("_", " ")}
          </Badge>
          {waitTimeMinutes !== undefined && <WaitTimeBadge minutes={waitTimeMinutes} />}
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{poi.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
