import { useState, useEffect } from "react";
import { MapPin, Accessibility, Info, Compass } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getZoneById, STADIUM } from "../data/stadium";
import type { POI } from "../types/fan.types";
import { WaitTimeBadge } from "./wait-time-badge";
import { cn } from "@/lib/utils";

export interface POICardProps {
  poi: POI;
  /** Optional wait time to display */
  waitTimeMinutes?: number;
}

export function POICard({ poi, waitTimeMinutes }: POICardProps) {
  const zone = getZoneById(poi.zoneId);
  const [fetchedWaitTime, setFetchedWaitTime] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (waitTimeMinutes !== undefined) return;
    let active = true;
    import("../services/wait-time.service").then(({ getWaitTime }) => {
      getWaitTime(poi.id).then((res) => {
        if (active && res) {
          setFetchedWaitTime(res.minutes);
        }
      });
    });
    return () => {
      active = false;
    };
  }, [poi.id, waitTimeMinutes]);

  const waitTime = waitTimeMinutes !== undefined ? waitTimeMinutes : fetchedWaitTime;

  // Haversine-approximated distance calculation from stadium center
  const calculateDistance = () => {
    const origin = STADIUM.centerCoordinates;
    const dest = poi.coordinates;
    const R = 6371000; // Radius of the earth in m
    const dLat = ((dest.lat - origin.lat) * Math.PI) / 180;
    const dLng = ((dest.lng - origin.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.lat * Math.PI) / 180) *
        Math.cos((dest.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in meters

    if (d < 300) {
      return `≈ ${Math.round(d / 10) * 10} m`;
    }
    return `≈ ${(d / 1000).toFixed(1)} km`;
  };

  const distanceText = calculateDistance();

  const getCategoryStyles = (type: string) => {
    switch (type) {
      case "gate":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/50";
      case "food":
        return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "restroom":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "medical":
      case "first_aid":
        return "bg-red-50 text-red-700 border-red-200/50";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200/50";
    }
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden text-left border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="bg-gray-50/50 pb-3 pt-4 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <Badge
              variant="outline"
              className={cn(
                "capitalize font-semibold text-[10px] tracking-wider px-2 py-0.5",
                getCategoryStyles(poi.type),
              )}
            >
              {poi.type.replace("_", " ")}
            </Badge>
            <CardTitle className="text-base font-bold text-gray-900 leading-snug">
              {poi.name}
            </CardTitle>
          </div>
          {poi.isAccessible && (
            <Badge
              variant="outline"
              className="bg-blue-50/50 border-blue-200/50 text-blue-700 flex items-center justify-center p-1.5 rounded-full select-none"
              title="Accessible Facility"
              aria-label="Accessible Facility"
            >
              <Accessibility className="h-4 w-4" />
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-2 font-medium">
          <div className="flex items-center">
            <MapPin className="mr-1 h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
            <span>{zone?.name ?? poi.zoneId}</span>
          </div>
          <div className="flex items-center">
            <Compass className="mr-1 h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
            <span>{distanceText}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3.5 pb-4 space-y-3.5">
        {waitTime !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider select-none">
              Wait Time:
            </span>
            <WaitTimeBadge minutes={waitTime} />
          </div>
        )}
        <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
          <p className="leading-relaxed">{poi.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
